const multer = require('multer');
const path = require('path');

const storage = multer.memoryStorage(); // choose disk storage or memory storage

const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => { // filter the file, you can access the file using file.property
        
        const filetypes = /jpeg|jpg|png/;
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = filetypes.test(file.mimetype);

        if ( extname && mimetype ) {
            return cb(null, true); // pass the file through the filter using true
        } else {
            cb(new Error('Only image files are allowed!'), false); // reject the file through the filter using false
        };

    },
});

module.exports = upload;