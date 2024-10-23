const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');

const validateToken = asyncHandler(async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if ( authHeader && authHeader.startsWith('Bearer') ) {
        const token = authHeader.split(' ')[1];
        
        if ( !token ) {
            res.status(401);
            throw new Error('Token is missing');
        };

        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
            if ( err ) {
                res.status(401);
                throw new Error('User is not authorized');
            };
            req.user = decoded.user;
            next();
        });
        
    } else {
        res.status(401);
        throw new Error('Authorization header is missing');
    };

});

module.exports = validateToken;