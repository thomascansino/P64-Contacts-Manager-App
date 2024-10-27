import { useState } from 'react'
import axios from 'axios'
import defaultPictureURL from '../assets/defaultpicture.jpg'
import '../App.css'

function EditModal({ closeEditModal, contactInfo, config, selectedContact, getContacts, getContact }) {
    const [firstName, setFirstName] = useState(contactInfo.firstName);
    const [lastName, setLastName] = useState(contactInfo.lastName);
    const [email, setEmail] = useState(contactInfo.email);
    const [contact, setContact] = useState(contactInfo.contact);
    const [description, setDescription] = useState(contactInfo.description);
    const [location, setLocation] = useState(contactInfo.location);
    const [selectedImage, setSelectedImage] = useState(null);
    const [isChecked, setIsChecked] = useState(false);
    
    const editContact = async () => {
        if ( !firstName || !lastName || !email || !contact ) {
            alert('Fill up all the fields required');
            return;
        };

        const formData = new FormData();

        formData.append('firstName', firstName);
        formData.append('lastName', lastName);
        formData.append('email', email);
        formData.append('contact', contact);
        formData.append('description', description);
        formData.append('location', location);

        if ( selectedImage && !isChecked ) {
            formData.append('image', selectedImage);
        };

        if ( isChecked ) {
            const response = await fetch(defaultPictureURL); // access image resource from the provided image URL
            const blob = await response.blob(); // convert image resource to binary data
            // new File to create a file object from file's binary data
            // [blob] = array that represents file's binary data
            // defaultpicture.jpg = name of file
            // { type: 'image/jpeg' } = optional object specifying file type
            const defaultImage = new File([blob], 'defaultpicture.jpg', { type: 'image/jpeg' })
            formData.append('image', defaultImage);
        }; 

        try {
            const response = await axios.put(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/contacts/${selectedContact}`, formData, config);
            console.log('Edited contact info:', response.data);
            closeEditModal();
            getContacts();
            getContact();
        } catch (err) {
            console.error('Failed editing contact info:', err.response?.data?.message || err.message || err);
        };
        
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        editContact();
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        setSelectedImage(file);
        setIsChecked(false);
        console.log(file);
    };
    
    return (
        <div className='modal'>
            <div className='overlay' onClick={closeEditModal}></div>
            <div className='modal-form'>

                <form onSubmit={handleSubmit}>
                    <div>
                        <input 
                        type='text' 
                        placeholder='First Name' 
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        />
                    </div>

                    <div>
                        <input 
                        type='text'
                        placeholder='Last Name'
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        />
                    </div>

                    <div>
                        <input 
                        type='email' 
                        placeholder='Email' 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div>
                        <input 
                        type='tel' 
                        placeholder='Contact No.(123-456-7890)' 
                        pattern='[0-9]{3}-[0-9]{3}-[0-9]{4}'
                        value={contact}
                        onChange={(e) => setContact(e.target.value)}
                        />
                    </div>
                    
                    <div>
                        <input 
                        type='text' 
                        placeholder='Description(optional)' 
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>

                    <div>
                        <input 
                        type='text' 
                        placeholder='Location(optional)' 
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        />
                    </div>

                    <div>
                        <input
                        type='file'
                        accept='image/*'
                        onChange={handleImageUpload}
                        />
                    </div>

                    <div>
                        <input
                        type='checkbox' 
                        id='defaultCheckbox'
                        checked={isChecked}
                        onChange={() => {
                            setIsChecked(!isChecked);             
                        }}
                        />
                        <label htmlFor='defaultCheckbox'>Default Picture</label>
                    </div>

                    <div>
                        <button type='submit'>Edit Contact</button>
                    </div>
                </form>

            </div>
        </div>
    );
};

export default EditModal;