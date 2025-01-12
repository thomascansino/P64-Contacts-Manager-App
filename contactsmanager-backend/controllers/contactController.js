const asyncHandler = require('express-async-handler');
const Contact = require('../models/contactModel');

//@desc Create new contact of the logged in user
//@route POST /api/contacts
//@access private
const createContact = asyncHandler(async (req, res) => {
    const { firstName, lastName, email, contact, description, location } = req.body;

    if ( !firstName || !lastName || !email || !contact ) {
        res.status(400);
        throw new Error('Fill up all the fields required');
    };

    const existingContact = await Contact.findOne({ user_id: req.user.id, email });
    if ( existingContact ) {
        res.status(400);
        throw new Error('This contact already exists');
    };

    console.log(req.file)
    
    const newContact = await Contact.create({
        user_id: req.user.id,
        firstName,
        lastName,
        email,
        contact,
        image: req.file.buffer,
        description,
        location,
    });

    res.status(201).json(newContact);

});

//@desc Get all contacts of the logged in user
//@route GET /api/contacts
//@access private
const getContacts = asyncHandler(async (req, res) => {
    const contacts = await Contact.find({ user_id: req.user.id });
    
    res.status(200).json(contacts);

});

//@desc Get complete info of the selected contact of the logged in user
//@route GET /api/contacts/:id
//@access private
const getContact = asyncHandler(async (req, res) => {
    const contact = await Contact.findById(req.params.id);

    if ( !contact ) {
        res.status(404);
        throw new Error(`This contact doesn't exist!`);
    };
    
    if ( contact.user_id.toString() !== req.user.id ) {
        res.status(403);
        throw new Error(`You don't have permission to access other user contacts`);
    };

    res.status(200).json(contact);

});

//@desc Edit info of the selected contact of the logged in user
//@route PUT /api/contacts/:id
//@access private
const editContact = asyncHandler(async (req, res) => {
    const { firstName, lastName, contact } = req.body;
    
    const prevContact = await Contact.findById(req.params.id);

    if ( !prevContact ) {
        res.status(404);
        throw new Error(`This contact doesn't exist!`);
    };

    if ( prevContact.user_id.toString() !== req.user.id ) {
        res.status(403);
        throw new Error(`You don't have permission to access other user contacts`);
    };

    if ( !firstName || !lastName || !contact ) {
        res.status(400);
        throw new Error(`Fill up all the fields required`);
    };

    console.log(req.file)

    const updateData = { ...req.body };

    if ( req.file ) {
        updateData.image = req.file.buffer;
    };

    const updatedContact = await Contact.findByIdAndUpdate(
        req.params.id,
        updateData,
        { new: true },
    );
    
    res.status(200).json(updatedContact);
});

//@desc Update last contacted field of the selected contact of the logged in user
//@route PUT /api/contacts/:id/lastContacted
//@access private
const updateLastContacted = asyncHandler(async (req, res) => {
    const prevContact = await Contact.findById(req.params.id);

    if ( !prevContact ) {
        res.status(404);
        throw new Error(`This contact doesn't exist!`);
    };

    if ( prevContact.user_id.toString() !== req.user.id ) {
        res.status(403);
        throw new Error(`You don't have permission to access other user contacts`);
    };

    const updatedContact = await Contact.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true },
    );

    res.status(200).json(updatedContact);
});

//@desc Update starred/archived field of the selected contact of the logged in user
//@route PUT /api/contacts/:id/toggleFields
//@access private
const toggleFields = asyncHandler(async (req, res) => {
    const { fieldToToggle } = req.body;
    
    const prevContact = await Contact.findById(req.params.id);

    if ( !prevContact ) {
        res.status(404);
        throw new Error(`This contact doesn't exist!`);
    };

    if ( prevContact.user_id.toString() !== req.user.id ) {
        res.status(403);
        throw new Error(`You don't have permission to access other user contacts`);
    };

    const newValues = {};

    switch ( fieldToToggle ) {
        case 'starred':
            newValues.starred = !prevContact.starred;
            newValues.archived = false;
            break;
        case 'archived':
            newValues.archived = !prevContact.archived;
            newValues.starred = false;
            break;
        case 'falseArchived':
            newValues.archived = false;
            break;
        default:
            res.status(400);
            throw new Error(`Invalid field to toggle`);
    };

    const updatedContact = await Contact.findByIdAndUpdate(
        req.params.id,
        { $set: newValues }, // toggle archived & starred fields inversely
        { new: true },
    );
    
    res.status(200).json(updatedContact);
});

//@desc Update last starred field of the selected contact of the logged in user
//@route PUT /api/contacts/:id/lastStarred
//@access private
const updateLastStarred = asyncHandler(async (req, res) => {
    const prevContact = await Contact.findById(req.params.id);

    if ( !prevContact ) {
        res.status(404);
        throw new Error(`This contact doesn't exist!`);
    };

    if ( prevContact.user_id.toString() !== req.user.id ) {
        res.status(403);
        throw new Error(`You don't have permission to access other user contacts`);
    };
    
    const updatedContact = await Contact.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true },
    );

    res.status(200).json(updatedContact);
});

//@desc Update last archived field of the selected contact of the logged in user
//@route PUT /api/contacts/:id/lastArchived
//@access private
const updateLastArchived = asyncHandler(async (req, res) => {
    const prevContact = await Contact.findById(req.params.id);

    if ( !prevContact ) {
        res.status(404);
        throw new Error(`This contact doesn't exist!`);
    };

    if ( prevContact.user_id.toString() !== req.user.id ) {
        res.status(403);
        throw new Error(`You don't have permission to access other user contacts`);
    };

    const updatedContact = await Contact.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true },
    );
    
    res.status(200).json(updatedContact);
});

//@desc Delete selected contact of the logged in user
//@route DELETE /api/contacts/:id
//@access private
const deleteContact = async (req, res) => {
    const contact = await Contact.findById(req.params.id);

    if ( !contact ) {
        res.status(404);
        throw new Error('This contact does not exist');
    };
    
    if ( contact.user_id.toString() !== req.user.id ) {
        res.status(403);
        throw new Error('You have no permission to delete other user contacts');
    };

    const deletedContact = await Contact.findByIdAndDelete(req.params.id);

    res.status(200).json(deletedContact);
};

module.exports = {
    createContact,
    getContacts,
    getContact,
    editContact,
    deleteContact,
    updateLastContacted,
    updateLastStarred,
    updateLastArchived,
    toggleFields,
}