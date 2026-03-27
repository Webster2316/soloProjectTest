
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const express = require("express");
const multer = require("multer");
const { createClient } = require("@supabase/supabase-js");

const router = express.Router();
const upload = multer();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

router.post("/upload-pfp", upload.single("file"), async (req, res) => {
  try {
    const user = req.user; 
    // unlock condition
    if (user.messagesSentCount < 3) {
      return res.status(403).json({ error: "Send 3 messages first" });
    }

    const file = req.file;
    const filePath = `pfp/${user.id}-${Date.now()}`;

    // upload to supabase
    const { error } = await supabase.storage
      .from("chat-images")
      .upload(filePath, file.buffer, {
        contentType: file.mimetype,
      });

    if (error) throw error;

    // get public URL
    const { data } = supabase.storage
      .from("chat-images")
      .getPublicUrl(filePath);

    const imageUrl = data.publicUrl;

    // save to DB (Prisma)
    await prisma.user.update({
      where: { id: user.id },
      data: { profilePicUrl: imageUrl },
    });

    res.json({ imageUrl });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Upload failed" });
  }
});

module.exports = router;