import { useEffect } from 'react'
import axios from 'axios'
import '../App.css'

function DeleteModal({ closeDeleteModal, config, selectedContact, setSelectedContact, getContacts, getContact, contactsList }) {

    const deleteContact = async () => {
        try {
            const response = await axios.delete(`http://localhost:5001/api/contacts/${selectedContact}`, config);
            console.log('Deleted contact info:', response.data);
            closeDeleteModal();
            getContacts();
            setSelectedContact('');
        } catch (err) {
            console.error('Failed to delete contact:', err.response?.data?.message || err.message || err);
        };
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        deleteContact();
    };

    return (
        <div className='modal'>
            <div className='overlay' onClick={closeDeleteModal}></div>
            <div className='modal-form'>

                <form onSubmit={handleSubmit}>
                    <div>
                        Are you sure you want to delete this contact?
                    </div>

                    <div>
                        <button type='submit'>Confirm Deletion</button>
                    </div>
                </form>

            </div>
        </div>
    );
};

export default DeleteModal;