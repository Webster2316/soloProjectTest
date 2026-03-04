const {
  BlobServiceClient,
  generateBlobSASQueryParameters,
  BlobSASPermissions
} = require("@azure/storage-blob");

function generateSasUrl(blobName) {
  const conn =
    process.env.CUSTOMCONNSTR_AZURE_STORAGE_CONNECTION_STRING ||
    process.env.AZURE_STORAGE_CONNECTION_STRING;

  const containerName = process.env.AZURE_STORAGE_CONTAINER || "uploads";

  if (!conn) {
    throw new Error("Missing AZURE_STORAGE_CONNECTION_STRING");
  }

  const blobServiceClient = BlobServiceClient.fromConnectionString(conn);
  const credential = blobServiceClient.credential; // ✅ uses shared key from conn string

  const sasToken = generateBlobSASQueryParameters(
    {
      containerName,
      blobName,
      permissions: BlobSASPermissions.parse("r"),
      expiresOn: new Date(Date.now() + 10 * 60 * 1000),
    },
    credential
  ).toString();

  const accountName = blobServiceClient.accountName;

  return `https://${accountName}.blob.core.windows.net/${containerName}/${blobName}?${sasToken}`;
}

module.exports = { generateSasUrl };
