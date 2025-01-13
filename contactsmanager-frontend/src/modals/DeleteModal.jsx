import { useState } from 'react'
import axios from 'axios'
import ClipLoader from 'react-spinners/ClipLoader'
import '../App.css'

function DeleteModal({ closeDeleteModal, config, selectedContact, setSelectedContact, getContacts }) {
    const [isLoading, setIsLoading] = useState(false);

    const deleteContact = async () => {
        try {
            setIsLoading(true);
            const response = await axios.delete(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/contacts/${selectedContact}`, config);
            console.log('Deleted contact info:', response.data);
            closeDeleteModal();
            getContacts();
            setSelectedContact('');
            setIsLoading(false);
        } catch (err) {
            console.error('Failed to delete contact:', err.response?.data?.message || err.message || err);
            setIsLoading(false);
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

                <form onSubmit={handleSubmit} className='modal-form-container'>
                    <div>
                        Are you sure you want to delete this contact?
                    </div>

                    <div>
                        { isLoading ? 
                        <ClipLoader 
                        color='#4b5563'
                        loading={isLoading}
                        size={20}
                        /> :
                        <button type='submit'>Confirm Deletion</button>}
                    </div>
                </form>

            </div>
        </div>
    );
};

export default DeleteModal;