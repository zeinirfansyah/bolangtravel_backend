const fs = require("fs");
const path = require("path");

async function uploadFile(file, destinationPath, allowedExtensions) {
  if (!file) {
    throw new Error("upload-file error: No file provided for upload.");
  }

  const ext = path.extname(file.name).toLowerCase();
  const fileName = `thumbnail_${Date.now()}${ext}`;
  const fullPath = path.join(destinationPath, fileName);

  if (!allowedExtensions.includes(ext)) {
    throw new Error(
      `upload-file error:  Invalid file type. Only ${allowedExtensions.join(
        ", "
      )} files are allowed.`
    );
  }

  if (!fs.existsSync(fullPath)) {
    console.log("upload-file error: Destination path does not exist.");
  } else {
    fs.unlinkSync(fullPath);
    console.log("upload-file error: File deleted.");
  }

  try {
    await file.mv(fullPath);
    return fullPath;
  } catch (err) {
    throw new Error(`Error while uploading file: ${err.message}`);
  }
}

module.exports = { uploadFile };
