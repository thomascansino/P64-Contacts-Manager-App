const mongoose = require('mongoose');

const contactSchema = mongoose.Schema({
        user_id: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
        firstName: {
            type: String,
            required: [true, 'Please add a first name'],
            trim: true,
        },
        lastName: {
            type: String,
            required: [true, 'Please add a last name'],
            trim: true,
        },
        email: {
            type: String,
            required: [true, 'Please add an email'],
        },
        contact: {
            type: String,
            required: [true, 'Please add a contact number'],
        },
        image: {
            type: Buffer,
        },
        description: {
            type: String,
        },
        location: {
            type: String,
        },
        lastContacted: {
            type: Date,
            default: null,
        },
        starred: {
            type: Boolean,
            default: false,
        },
        lastStarred: {
            type: Date,
            default: null,
        },
        archived: {
            type: Boolean,
            default: false,
        },
        lastArchived: {
            type: Date,
            default: null,
        },
    },
    {
        timestamps: true,
    },
);

// middleware for mongoDB works like this: CRUD --> middleware --> database

contactSchema.pre('save', function (next) {

    this.firstName = this.firstName.charAt(0).toUpperCase() + this.firstName.slice(1);
    this.lastName = this.lastName.charAt(0).toUpperCase() + this.lastName.slice(1);
    
    next();
});

contactSchema.pre(['findByIdAndUpdate', 'updateOne', 'findOneAndUpdate'], function (next) {
    const update = this.getUpdate(); // get the updated document before storing into the database

    if ( update.firstName ) {
        update.firstName = update.firstName.charAt(0).toUpperCase() + update.firstName.slice(1);
    };

    if ( update.lastName ) {
        update.lastName = update.lastName.charAt(0).toUpperCase() + update.lastName.slice(1);
    };

    next();
});

module.exports = mongoose.model('Contact', contactSchema);