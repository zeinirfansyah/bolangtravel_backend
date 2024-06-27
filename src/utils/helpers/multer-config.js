const multer = require('multer');
const path = require('path');

const configureMulter = (uploadPath) => {
  const storage = multer.diskStorage({
    destination: path.join(__dirname, `../../../public/uploads/${uploadPath}`),
    filename: (req, file, cb) => {
      cb(null, file.fieldname + '_' + Date.now() + path.extname(file.originalname));
    },
  });

  const upload = multer({
    storage: storage,
    limits: { fileSize: 3000000 },
    fileFilter: (req, file, cb) => {
      checkFileType(file, cb);
    },
  });

  return upload;
};

function checkFileType(file, cb) {
  const filetypes = /jpeg|jpg|png/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb('Error: Images Only!');
  }
}

module.exports = configureMulter;
