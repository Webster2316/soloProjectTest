const multer = require("multer");
const path = require("path");
const { BlobServiceClient } = require("@azure/storage-blob");

const upload = multer({ storage: multer.memoryStorage() });
const containerName = process.env.AZURE_STORAGE_CONTAINER || "uploads";

let blobServiceClient = null;

function getBlobServiceClient() {
  if (blobServiceClient) return blobServiceClient;

  const conn =
    process.env.CUSTOMCONNSTR_AZURE_STORAGE_CONNECTION_STRING ||
    process.env.AZURE_STORAGE_CONNECTION_STRING;

  if (!conn) return null;

  blobServiceClient = BlobServiceClient.fromConnectionString(conn);
  return blobServiceClient;
}


async function ensureContainer() {
  const client = getBlobServiceClient();
  if (!client) return null;

  const containerClient = client.getContainerClient(containerName);
  await containerClient.createIfNotExists();
  return containerClient;
}

function safeName(original) {
  const base = path.basename(original).replace(/[^\w.\-]/g, "_");
  return `${Date.now()}_${base}`;
}

async function uploadToBlob(req, res, next) {
  try {
    if (!req.file) return next();

    const containerClient = await ensureContainer();

    if (!containerClient) {
      // In tests, skip uploads so CI doesn't die.
      if (process.env.NODE_ENV === "test") return next();

      // In real environments, fail loudly so you notice misconfig.
      return res.status(500).json({ error: "Azure Blob Storage not configured" });
    }

    const blobName = safeName(req.file.originalname);
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);

    await blockBlobClient.uploadData(req.file.buffer, {
      blobHTTPHeaders: { blobContentType: req.file.mimetype },
    });

    req.uploadedBlob = {
      name: blobName,
      url: blockBlobClient.url,
      contentType: req.file.mimetype,
      size: req.file.size,
    };

    next();
  } catch (err) {
    next(err);
  }
}

module.exports = { upload, uploadToBlob };
