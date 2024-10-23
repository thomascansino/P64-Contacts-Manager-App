import { useState } from 'react'
import axios from 'axios'
import defaultPictureURL from '../assets/defaultpicture.jpg'
import '../App.css'

function AddModal({ config, closeAddModal, getContacts, setSelectedContact }) {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [contact, setContact] = useState('');
    const [description, setDescription] = useState('');
    const [location, setLocation] = useState('');
    const [selectedImage, setSelectedImage] = useState(null);

    const createContact = async () => {
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

        if ( selectedImage ) {
            formData.append('image', selectedImage);
        } else {
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
            const response = await axios.post('http://localhost:5001/api/contacts', formData, config);
            console.log('Added contact info:', response.data);
            closeAddModal();
            getContacts();
            setSelectedContact(response.data._id);
        } catch (err) {
            console.error('Failed to create contact:', err.response?.data?.message || err.message || err);
        };
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        createContact();
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        setSelectedImage(file);
        console.log(file);
    };

    return (
        <div className='modal'>
            <div className='overlay' onClick={closeAddModal}></div>
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
                        <button type='submit'>Add Contact</button>
                    </div>
                </form>

            </div>
        </div>
    );
};

export default AddModal;