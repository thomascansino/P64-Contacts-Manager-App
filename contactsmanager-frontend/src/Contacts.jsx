import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import AddModal from './modals/AddModal.jsx'
import TimeAgo from './utility/TimeAgo.jsx'
import './App.css'

function Contacts({ config, token, selectedContact, setSelectedContact, contactsList, getContacts, toggleFields, detectImageType }) {
    const [selectedNav, setSelectedNav] = useState('recent');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [searchContacts, setSearchContacts] = useState('');
    
    const navigate = useNavigate();

    useEffect(() => {
        if ( !token ) {
            alert('You need to login first');
            return;
        };

        getContacts();
    }, [selectedNav, token]);


    const handleNavClick = (nav) => {
        setSelectedNav(nav);
    };

    const handleSearchContact = (e) => {
        setSearchContacts(e.target.value);
    };

    const openAddModal = () => {
        setIsAddModalOpen(true);
        document.body.classList.add('blocked');
    };

    const closeAddModal = () => {
        setIsAddModalOpen(false);
        document.body.classList.remove('blocked');
    };

    const lastInteracted = (lastContacted, lastStarred, lastArchived) => {
        switch ( selectedNav ) {
            case 'recent':
                return lastContacted;
            case 'starred':
                return lastStarred;
            case 'archived':
                return lastArchived;
        };
    };

    const createContactComponent = (contact) => {
        // btoa() = built-in js function that converts string of special characters (for images) to a base64
        // String.fromCharCode(...new Uint8Array(buffer)) = converts array of small numbers (bytes) to string of special characters (for images)
        // new Uint8Array(buffer) = converts binary data (raw image) to an array of small numbers (bytes)
        const base64String = btoa(String.fromCharCode(...new Uint8Array(contact.image.data)));
        const imageType = detectImageType(contact.image.data);

        return (
            <div key={contact._id}
            className='contacts-people-person'>
                
                <div 
                className={selectedContact === contact._id ? 'contacts-people-card highlight-contact' : 'contacts-people-card'} 
                onClick={() => setSelectedContact(contact._id)}
                >
                    <div className='contacts-profile-pic'>
                        <img src={`data:image/${imageType};base64,${base64String}`} alt='picture' />
                    </div>
                    <div className='center-vertical'>
                        <div>{`${contact.firstName} ${contact.lastName}`}</div>
                        <TimeAgo 
                        selectedNav={selectedNav}
                        lastInteracted={lastInteracted(contact.lastContacted, contact.lastStarred, contact.lastArchived)}
                        />
                    </div>
                </div>
                
                <div className='contacts-people-person-classify'>
                    <i className={contact.starred ? "ri-star-fill" : "ri-star-line"} onClick={() => toggleFields(contact._id, 'starred')}></i>
                    <i className={contact.archived ? "ri-inbox-archive-fill" : "ri-inbox-archive-line"} onClick={() => toggleFields(contact._id, 'archived')}></i>
                </div>

            </div>
        )
    };

    const sortAndFilterContacts = (filterCondition, sortField) => (
        contactsList // <--- this is an array from getContacts()
            .filter(filterCondition)
            .sort((a, b) => new Date(b[sortField]) - new Date(a[sortField]))
            .map(contact => createContactComponent(contact))
    );

    // handle navs w/ search function
    const recent = sortAndFilterContacts(searchContacts ? 
        (contact) => {
            const fullName = `${contact.firstName} ${contact.lastName}`.toLowerCase();

            return fullName.includes(searchContacts.toLowerCase());
        } :
        () => true, 'lastContacted');

    const starred = sortAndFilterContacts(searchContacts ?
        (contact) => {
            const fullName = `${contact.firstName} ${contact.lastName}`.toLowerCase();

            return fullName.includes(searchContacts.toLowerCase()) && contact.starred;
        } :
        (contact) => contact.starred, 'lastStarred');

    const archived = sortAndFilterContacts(searchContacts ?
        (contact) => {
            const fullName = `${contact.firstName} ${contact.lastName}`.toLowerCase();

            return fullName.includes(searchContacts.toLowerCase()) && contact.archived;
        } :
        contact => contact.archived, 'lastArchived');
    

    let contacts;

    switch ( selectedNav ) {
        case 'recent':
            contacts = recent;
            break;
        case 'starred':
            contacts = starred;
            break;
        case 'archived':
            contacts = archived;
            break;
    };

    return (
        <>
            <div className='contacts-nav'>
                <div className={selectedNav === 'recent' ? 'highlight-nav' : ''} 
                onClick={() => handleNavClick('recent')}>
                    Recent
                </div>
                <div className={selectedNav === 'starred' ? 'highlight-nav' : ''} 
                onClick={() => handleNavClick('starred')}>
                    Starred
                </div>
                <div className={selectedNav === 'archived' ? 'highlight-nav' : ''} 
                onClick={() => handleNavClick('archived')}>
                    Archived
                </div>
                <div onClick={() => navigate('/login')} className='contacts-nav-logout'>Logout</div>
            </div>
            
            <div className='contacts-search'>
                <div className='contacts-search-input'>
                    <i className="ri-search-line"></i>
                    <input 
                    onChange={handleSearchContact} 
                    value={searchContacts} 
                    type='text' 
                    placeholder='Search contacts...'/>
                </div>
                <div className='contacts-search-add' onClick={openAddModal}>
                    <i className="ri-user-add-line"></i>
                </div>
            </div>
            
            <div className='contacts-people'>
                {contacts}
            </div>

            {isAddModalOpen && 
            <AddModal 
            config={config}
            closeAddModal={closeAddModal}
            getContacts={getContacts}
            setSelectedContact={setSelectedContact}
            /> }
        </>
    )
};

export default Contacts;