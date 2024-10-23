import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import background from './assets/background.jpg'
import './App.css'

function ForgotPass() {
    
    useEffect(() => {
        localStorage.removeItem('token');
    }, []);
    
    return (
        <>
            <img className='auth-bg' src={background} alt='cool backdrop' />
            
            <form>
                <div className='main-container'>

                    <div className='title-container'>
                        <span className='bold'>Forgot Password?</span>
                    </div>
                    
                    <div className='input-container'>
                        <input type='email' placeholder='Email ID' className='auth-input' />
                        <i className="ri-mail-line"></i>
                    </div>

                    <div>
                        <button type='submit' className='auth-button'>Next</button>
                    </div>

                    <div>
                        <span className='small-font'>Don't have an account? <Link to='/register'><span className='lighter-bold small-font'>Register</span></Link></span>
                    </div>

                    <div>
                        <Link to='/login'><span className='lighter-bold small-font'>Go back to login page</span></Link>
                    </div>

                </div>
            </form>
        </>
    );
};

export default ForgotPass;