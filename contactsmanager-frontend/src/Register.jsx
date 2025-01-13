import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import ClipLoader from 'react-spinners/ClipLoader'
import background from './assets/background.jpg'
import './App.css'

function Register() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
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
            setIsLoading(true);
            const response = await axios.post(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/users/register`, { username, email, password, confirmPassword });
            console.log('Registered successfully:', response.data);
            alert('Registered successfully');
            setIsLoading(false);
            navigate('/login');
        } catch (err) {
            console.error('Failed to register:', err.response?.data?.message || err.message || err);
            setIsLoading(false);
            alert(err.response?.data?.message || err.message || err);
        };

    };

    return (
        <div className='document-container'>
            
            <div className='parent-container'>

                <div className='slogan-container'>
                    <div className='first-line'>Manage Your Connections</div>
                    <div className='second-line'>With Ease.</div>
                </div>
            
                <form onSubmit={handleRegister} className='container'>
                    <div className='auth-bg-container'>
                        <img className='auth-bg' src={background} alt='cool backdrop' />
                    </div>
                    
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
                        { isLoading ?
                        <ClipLoader 
                        color='#d1d5db'
                        loading={isLoading}
                        size={25}
                        /> :
                        <button type='submit' className='auth-button'>Register</button>}
                    </div>

                    <div>
                        <Link to='/login'><span className='lighter-bold small-font'>Go back to login page</span></Link>
                    </div>

                    </div>
                </form>

            </div>
        </div>
    );
};

export default Register;