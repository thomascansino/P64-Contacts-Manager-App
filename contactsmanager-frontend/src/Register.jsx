import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import background from './assets/background.jpg'
import './App.css'

function Register() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const navigate = useNavigate();
    
    useEffect(() => {
        localStorage.removeItem('token');
    }, []);

    const handleUsername = (e) => {
        setUsername(e.target.value);
    };

    const handleEmail = (e) => {
        setEmail(e.target.value);
    };

    const handlePassword = (e) => {
        setPassword(e.target.value);
    };

    const handleConfirmPassword = (e) => {
        setConfirmPassword(e.target.value);
    };

    const handleRegister = async (e) => {
        e.preventDefault();

        if ( !username || !email || !password || !confirmPassword ) {
            alert('All fields are mandatory');
            return;
        }

        if ( password !== confirmPassword ) {
            alert('Passwords do not match');
            return;
        };

        try {
            const response = await axios.post(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/users/register`, { username, email, password, confirmPassword });
            console.log('Registered successfully:', response.data);
            alert('Registered successfully');
            navigate('/login');
        } catch (err) {
            console.error('Failed to register:', err.response?.data?.message || err.message || err);
            alert(err.response?.data?.message || err.message || err);
        };

    };

    return (
        <>
            <img className='auth-bg' src={background} alt='cool backdrop' />
            
            <form onSubmit={handleRegister} className='container'>
                <div className='main-container'>
                
                <div className='title-container'><span className='bold'>Register</span></div>
                
                <div className='input-container'>
                    <input type='text' placeholder='Username' value={username} onChange={handleUsername} className='auth-input' />
                    <i className='ri-user-line'></i>
                </div>

                <div className='input-container'>
                    <input type='email' placeholder='Email ID' value={email} onChange={handleEmail} className='auth-input' />
                    <i className="ri-mail-line"></i>
                </div>

                <div className='input-container'>
                    <input type='password' placeholder='Password' value={password} onChange={handlePassword} className='auth-input' />
                    <i className="ri-lock-2-line"></i>
                </div>

                <div className='input-container'>
                    <input type='password' placeholder='Confirm Password' value={confirmPassword} onChange={handleConfirmPassword} className='auth-input' />
                    <i className="ri-lock-2-line"></i>
                </div>

                <div>
                    <button type='submit' className='auth-button'>Register</button>
                </div>

                <div>
                    <Link to='/login'><span className='lighter-bold small-font'>Go back to login page</span></Link>
                </div>

                </div>
            </form>
        </>
    );
};

export default Register;