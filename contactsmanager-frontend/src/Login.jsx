import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import background from './assets/background.jpg'
import './App.css'

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        localStorage.removeItem('token');
    }, []);

    const handleEmail = (e) => {
        setEmail(e.target.value);
    };

    const handlePassword = (e) => {
        setPassword(e.target.value);
    };

    const handleLogin = async (e) => {
        e.preventDefault();

        if ( !email || !password ) {
            alert('Email and password are required');
            return;
        };

        try {
            const response = await axios.post(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/users/login`, { email, password });
            localStorage.setItem('token', response.data.accessToken);
            navigate('/dashboard');
        } catch (err) {
            console.error('Login failed:', err.response?.data?.message || err.message || err);
            alert(err.response?.data?.message || err.message || err);
        };

    };

    return (
        <>
            <img className='auth-bg' src={background} alt='cool backdrop' />
            
            <form onSubmit={handleLogin}>
                <div className='main-container'>

                    <div className='title-container'>
                        <span className='bold'>Login</span>
                    </div>
                    
                    <div className='input-container'>
                        <input type='email' placeholder='Email ID' value={email} onChange={handleEmail} className='auth-input' />
                        <i className="ri-mail-line"></i>
                    </div>

                    <div className='input-container'>
                        <input type='password' placeholder='Password' value={password} onChange={handlePassword} className='auth-input' />
                        <i className="ri-lock-2-line"></i>
                    </div>

                    <div>
                        <Link to='/forgot-password'><span className='lighter-bold hover-pointer small-font'>Forgot Password?</span></Link>
                    </div>

                    <div>
                        <button type='submit' className='auth-button'>Login</button>
                    </div>

                    <div>
                        <span className='small-font'>Don't have an account? <Link to='/register'><span className='lighter-bold small-font'>Register</span></Link></span>
                    </div>

                </div>
            </form>
        </>
    )
};

export default Login;