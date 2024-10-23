const sharp = require('sharp');

const compressImage = (req, res, next) => {
    
    // Check if there's a file
    if ( req.file ) {
        
        const maxSize = 200 * 1024; // Maximum file size of 200 kb

        console.log('Before File:', req.file.originalname);
        console.log('Before Size:', req.file.size);
        console.log('Before Mimetype:', req.file.mimetype);
        console.log('Before Buffer:', req.file.buffer);

        // Compress JPEG image to 80% quality
        sharp(req.file.buffer)  // Access sharp package
            .resize(300, 300, { // Resize image to 300x300 dimensions
                fit: 'cover',   // Fit image to cover the whole frame
                position: 'north', // Position image to north to view faces
            })
            .jpeg() // Convert PNG to JPEG (skip if image is already JPEG)
            .toBuffer() // Convert the compressed image to a raw binary data
            .then(data => {
                req.file.buffer = data; // Replace the original image with the compressed image (raw binary data) in req.file.buffer
                req.file.size = data.length; // Replace the original size with the compressed size in req.file.size

                console.log('After Size:', data.length);
                console.log('After Buffer:', data);

                if ( data.length <= maxSize ) {
                    next(); // if file size of the converted compressed image (raw binary data) is less than the max size, send to database
                } else {
                    return res.status(400).json({ error: 'Image size exceeds limit after compression' });
                };
            })
            .catch(err => {
                return res.status(400).json({ error: `Image compression failed: ${err.message}` });
            });

    } else { 
        next(); // if there's no file
    };

};

module.exports = compressImage;
