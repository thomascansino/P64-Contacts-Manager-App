const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');

//@desc Register the user
//@route POST /api/users/register
//@access public
const registerUser = asyncHandler(async (req, res) => {
    const { username, email, password, confirmPassword } = req.body;
    
    if ( !username || !email || !password || !confirmPassword ) {
        res.status(400);
        throw new Error('All fields are mandatory!');
    };

    if ( password !== confirmPassword ) {
        res.status(400);
        throw new Error('Passwords do not match');
    };

    const availableUser = await User.findOne({ email });
    if ( availableUser ) {
        res.status(400);
        throw new Error('Email is already registered');
    };

    const hashedPassword = await bcrypt.hash(password, 10);
    console.log('Hashed Password:', hashedPassword);
    const user = await User.create({
        username,
        email,
        password: hashedPassword,
    });

    console.log(`User successfully created ${user}`);
    if ( user ) {
        res.status(201).json({ _id: user.id, email: user.email });
    } else {
        res.status(400);
        throw new Error('User data is not valid');
    };

});

//@desc Login the user
//@route POST /api/users/login
//@access public
const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    
    if ( !email || !password ) {
        res.status(400);
        throw new Error('Email and password are required');
    };

    const user = await User.findOne({ email });
    if ( user && (await bcrypt.compare(password, user.password)) ) {
        const accessToken = jwt.sign({
                user: {
                    username: user.username,
                    email: user.email,
                    id: user.id,
                },
            },
                process.env.ACCESS_TOKEN_SECRET,
        );
        res.status(201).json({ accessToken });
    } else {
        res.status(401);
        throw new Error('email or password is not valid');
    };

});


//@desc Current user info
//@route GET /api/users/current
//@access private
const currentUser = (req, res) => {
    res.status(200).json(req.user);
};


module.exports = {
    registerUser,
    loginUser,
    currentUser
}