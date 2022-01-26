const multer = require('multer');

const storage = multer.diskStorage({
  destination: (_req, _file, callback) => { callback(null, 'src/uploads'); },
  filename: (req, file, callback) => {
     const { id } = req.params;
     callback(null, `${id}.jpeg`);
  },
});

module.exports = multer({ storage });