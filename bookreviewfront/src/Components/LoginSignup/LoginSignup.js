import React, { useState } from 'react';
import './LoginSignup.css';
import { useNavigate } from 'react-router-dom';

import user_icon from '../Assets/person.png';
import email_icon from '../Assets/email.png';
import password_icon from '../Assets/password.png';


const LoginSignup = () => {
    const [action, setAction] = useState("Login");
    

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const navigate = useNavigate(); // initializare navigate
    console.log("Navigate function:", navigate); // Verifică dacă navigate este o funcție validă

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'name') setName(value);
        if (name === 'email') setEmail(value);
        if (name === 'password') setPassword(value);
    };

    // trimitere date in backend
    const handleSubmit = async () => {
        console.log("Submit button clicked");
        const url = action === "Login"
            ? 'http://localhost:5122/api/auth/login'
            : 'http://localhost:5122/api/auth/register';

        const data = { email, password };
        if (action === "Sign Up") {
            data.name = name;
        }

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            const result = await response.json();
            console.log('Server response:', result);
            
            if (response.ok) {
                if (action === "Login" && result.Token) {
                    localStorage.setItem('authToken', result.Token);
                    console.log("Token saved:", result.Token);
                    console.log("Navigating to /home");
                    navigate('/home'); 
                }
                setTimeout(() => {
                    console.log("Attempting navigation after delay");
                    navigate('/home');
                }, 100);
            }

            setName("");  
            setEmail(""); 
            setPassword(""); 
        } catch (error) {
            console.error('Error sending request:', error);
            // window.location.href = '/home';
        }
    };

    return (
        <div className='container'>
            <div className="header">
                <div className="text">{action}</div>
            </div>

            <div className='inputs'>
                {action === "Login" ? <div></div> : (
                    <div className='input'>
                        <img src={user_icon} alt="" />
                        <input 
                            type="text" 
                            name="name"
                            placeholder='Name' 
                            value={name} 
                            onChange={handleChange}
                        />
                    </div>
                )}
                
                <div className='input'>
                    <img src={email_icon} alt="" />
                    <input 
                        type="email" 
                        name="email"
                        placeholder='Email ID' 
                        value={email} 
                        onChange={handleChange}
                    />
                </div>

                <div className='input'>
                    <img src={password_icon} alt="" />
                    <input 
                        type="password" 
                        name="password"
                        placeholder='Password' 
                        value={password} 
                        onChange={handleChange}
                    />
                </div>
            </div>

            {action === "Sign Up" ? <div></div> : (
                <div className='forgot-password'>Lost Password? <span>Click Here</span></div>
            )}

            <div className='submit-container'>
                <div 
                    className={action === "Login" ? "submit gray" : "submit"} 
                    onClick={() => setAction("Sign Up")}
                >
                    SignUp
                </div>

                <div 
                    className={action === "Sign Up" ? "submit gray" : "submit"} 
                    onClick={() => setAction("Login")}
                >
                    Login
                </div>
            </div>

            <button className="submit-button" onClick={handleSubmit}>
                {action}
            </button>
        </div>
    );
};

export default LoginSignup;
