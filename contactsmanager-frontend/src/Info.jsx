import { useState, useEffect } from 'react'
import axios from 'axios'
import EditModal from './modals/EditModal.jsx'
import DeleteModal from './modals/DeleteModal.jsx'
import './App.css'

function Info({ token, config, selectedContact, setSelectedContact, isEditModalOpen, setIsEditModalOpen, isDeleteModalOpen, setIsDeleteModalOpen, contactsList, getContacts, toggleFields, detectImageType }) {
    const [contactInfo, setContactInfo] = useState(null);

    useEffect(() => {
        if ( !token ) {
            alert('You need to login first');
            return;
        };
        
        getContact();
    }, [selectedContact, token]);

    const getContact = async () => {
        try {
            if ( selectedContact ) {
                const response = await axios.get(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/contacts/${selectedContact}`, config);
                setContactInfo(response.data);
                console.log('Get info of selected contact:', response.data);
            };
        } catch (err) {
            console.error('Failed to get contact:', err.response?.data?.message || err.message || err);
        };
    };

    const updateLastContacted = async () => {
        try {
            const response = await axios.put(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/contacts/${selectedContact}/lastContacted`, { lastContacted: new Date() }, config);
            getContacts();
            console.log('Last contacted:', response.data.lastContacted);
        } catch (err) {
            console.error('Failed updating recent contact:', err.response?.data?.message || err.message || err);
        };
    };

    const handleEmailClick = () => {
        console.log('send email to link');
    };

    const handleContactClick = () => {
        toggleFields(selectedContact, 'falseArchived');
        updateLastContacted();
    };

    const openEditModal = () => {
        setIsEditModalOpen(true);
        document.body.classList.add('blocked');
    };

    const closeEditModal = () => {
        setIsEditModalOpen(false);
        document.body.classList.remove('blocked');
    };

    const openDeleteModal = () => {
        setIsDeleteModalOpen(true);
        document.body.classList.add('blocked');
    };

    const closeDeleteModal = () => {
        setIsDeleteModalOpen(false);
        document.body.classList.remove('blocked');
    };

    const placeholder = 'WORK';

    // btoa() = built-in js function that converts string of special characters (for images) to a base64
    // String.fromCharCode(...new Uint8Array(buffer)) = converts array of small numbers (bytes) to string of special characters (for images)
    // new Uint8Array(buffer) = converts binary data (raw image) to an array of small numbers (bytes)
    const base64String = btoa(String.fromCharCode(...new Uint8Array(contactInfo?.image?.data)));
    const imageType = detectImageType(contactInfo?.image?.data);

    const infoCard = (
        <>
            <div className='info-person'>
                <div className='info-modify'>
                    <i className="ri-edit-2-line" onClick={openEditModal}></i>
                    <i className="ri-delete-bin-line" onClick={openDeleteModal}></i>
                </div>
                <div className='info-profile-pic'>
                    <img src={`data:image/${imageType};base64,${base64String}`} alt='profile picture'/>
                </div>
                <div>
                    <span>{`${contactInfo?.firstName} ${contactInfo?.lastName}`}</span>
                </div>
                <div>
                    <span>{contactInfo?.description ? contactInfo.description : '—'}</span>
                </div>
                <div className='curved-line'></div>
            </div>

            <div className='info-read'>
                <div className='info-container'>
                    <div className='left-container clickable' onClick={handleContactClick}>
                        <i className="ri-phone-line"></i>
                    </div>
                    <div className='right-container'>
                        <div className='description'>
                            {contactInfo?.contact}
                        </div>
                        <div className='placeholder'>
                            {placeholder}
                        </div>
                    </div>
                </div>

                <div className='info-container'>
                   <div className='left-container'>
                        <i className="ri-map-pin-line"></i>
                    </div>
                    <div className='right-container'>
                        <div className='description'>
                            {contactInfo?.location ? contactInfo.location : '—' }
                        </div>
                        <div className='placeholder'>
                            {placeholder}
                        </div>
                    </div>
                </div>
                
                <div className='info-container'>
                    <div className='left-container clickable' onClick={handleEmailClick}>
                        <i className="ri-mail-line"></i>
                    </div>
                    <div className='right-container'>
                        <div className='description'>
                            {contactInfo?.email}
                        </div>
                        <div className='placeholder'>
                            {placeholder}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );

    return (
        <>
            {selectedContact &&
            infoCard}

            {isEditModalOpen && 
            <EditModal 
            closeEditModal={closeEditModal}
            contactInfo={contactInfo}
            config={config}
            selectedContact={selectedContact}
            getContacts={getContacts}
            getContact={getContact}
            />
            }

            {isDeleteModalOpen &&
            <DeleteModal 
            closeDeleteModal={closeDeleteModal}
            config={config}
            selectedContact={selectedContact}
            setSelectedContact={setSelectedContact}
            getContacts={getContacts}
            getContact={getContact}
            contactsList={contactsList}
            />}
        </>
    )
};

export default Info;