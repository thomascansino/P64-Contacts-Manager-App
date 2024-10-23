import { useState, useEffect } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import axios from 'axios'

function PrivateRoute() {
    const [isAuthenticated, setIsAuthenticated] = useState(null);
    const [userData, setUserData] = useState(null);
    const token = localStorage.getItem('token');

    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };

    const verifyToken = async () => {
        try {
            const response = await axios.get('http://localhost:5001/api/users/current', config);
            setIsAuthenticated(true);
            setUserData(response.data);
        } catch (err) {
            setIsAuthenticated(false);
            alert(err.response?.data?.message || err.message || err);
        };
    };

    useEffect(() => {
        verifyToken();
    }, [token]);

    if ( isAuthenticated ) {
        console.log(`Login successful. Welcome, ${userData.username}!`);
        return <Outlet />
    } else if ( isAuthenticated === null ) {
        return <div>Loading...Please wait.</div>
    } else {
        return <Navigate to='/login' />
    };

};

export default PrivateRoute;