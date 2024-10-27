import { useState } from 'react'
import axios from 'axios'
import Contacts from './Contacts.jsx'
import Info from './Info.jsx'

function Dashboard() {
    const [selectedContact, setSelectedContact] = useState('');
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [contactsList, setContactsList] = useState([]);
    const token = localStorage.getItem('token');

    // function to detect image type of a buffer
    const detectImageType = (buffer) => {
        const uint8Array = new Uint8Array(buffer); // converts binary data (raw image) to an array of small numbers (bytes)
        if (uint8Array[0] === 0xFF) return 'jpeg';
        return 'unknown'; // default if no match for type
    };

    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };

    const getContacts = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/contacts`, config);
            console.log('Get all contacts of user:', response.data);  
            setContactsList(response.data);
        } catch (err) {
            console.error('Failed to get contacts:', err.response?.data?.message || err.message || err);
        };
    };

    const updateLastStarred = async (id) => {
        try {
            const response = await axios.put(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/contacts/${id}/lastStarred`, { lastStarred: new Date() }, config);
            console.log('Last starred:', response.data.lastStarred);
        } catch (err) {
            console.error('Failed updating last starred field:', err.response?.data?.message || err.message || err);
        };
    };

    const updateLastArchived = async (id) => {
        try {
            const response = await axios.put(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/contacts/${id}/lastArchived`, { lastArchived: new Date() }, config);
            console.log('Last archived:', response.data.lastArchived);
        } catch (err) {
            console.error('Failed updating last archived field:', err.response?.data?.message || err.message || err);
        };
    };

    const toggleFields = async (id, fieldToToggle) => {
        try {
            const response = await axios.put(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/contacts/${id}/toggleFields`, { fieldToToggle }, config);
            
            if ( fieldToToggle === 'starred' && response.data.starred) {
                updateLastStarred(id);
            } else if ( fieldToToggle === 'archived' && response.data.archived) {
                updateLastArchived(id);
            };

            getContacts();
            console.log(`${response.data.firstName} ${response.data.lastName} starred: ${response.data.starred} archived: ${response.data.archived}`);
        } catch (err) {
            console.error('Failed toggling the fields:', err.response?.data?.message || err.message || err);
        };
    };

    return (
        <div className='dashboard'>
            <div className='contacts'>
                <Contacts 
                token={token}
                config={config}
                selectedContact={selectedContact}
                setSelectedContact={setSelectedContact}
                contactsList={contactsList}
                getContacts={getContacts}
                toggleFields={toggleFields}
                detectImageType={detectImageType}
                />
            </div>
            <div className='info'>
                <Info 
                token={token}
                config={config}
                selectedContact={selectedContact}
                setSelectedContact={setSelectedContact}
                isEditModalOpen={isEditModalOpen}
                setIsEditModalOpen={setIsEditModalOpen}
                isDeleteModalOpen={isDeleteModalOpen}
                setIsDeleteModalOpen={setIsDeleteModalOpen}
                contactsList={contactsList}
                getContacts={getContacts}
                toggleFields={toggleFields}
                detectImageType={detectImageType}
                />
            </div>
        </div>
    )
};

export default Dashboard;