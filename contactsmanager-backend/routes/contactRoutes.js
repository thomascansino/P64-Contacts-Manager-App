const express = require('express');
const router = express.Router();
const { createContact,
    getContacts,
    getContact,
    editContact,
    deleteContact,
    updateLastContacted,
    updateLastStarred,
    updateLastArchived,
    toggleFields,
 } = require('../controllers/contactController');
const validateToken = require('../middleware/validateTokenHandler');
const upload = require('../middleware/upload');
const compressImage = require('../middleware/compressImage');

router.use(validateToken);
router.route('/').post(upload.single('image'), compressImage, createContact);
router.route('/').get(getContacts);
router.route('/:id').get(getContact).put(upload.single('image'), compressImage, editContact).delete(deleteContact);
router.route('/:id/lastContacted').put(updateLastContacted);
router.route('/:id/toggleFields').put(toggleFields);
router.route('/:id/lastStarred').put(updateLastStarred);
router.route('/:id/lastArchived').put(updateLastArchived);


module.exports = router;