import React, { useState } from 'react';
import './LoginSignup.css';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext';

import user_icon from '../Assets/person.png';
import email_icon from '../Assets/email.png';
import password_icon from '../Assets/password.png';

// Function to decode JWT token
const decodeJwtToken = (token) => {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));

        return JSON.parse(jsonPayload);
    } catch (e) {
        console.error('Error decoding token:', e);
        return null;
    }
};

const LoginSignup = () => {
    const [action, setAction] = useState("Login");
    

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const navigate = useNavigate(); // initializare navigate
    const { login, isAdmin } = useAuth();
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
            console.log('Full server response:', JSON.stringify(result, null, 2));

            if (response.ok) {
                // Decode the token to get user information
                const decodedToken = decodeJwtToken(result.token);
                console.log('Decoded token:', decodedToken);

                // Create user object with all information
                const userData = {
                    token: result.token,
                    id: decodedToken?.id,
                    name: decodedToken?.['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'],
                    email: decodedToken?.['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'],
                    role: decodedToken?.['http://schemas.microsoft.com/ws/2008/06/identity/claims/role']
                };

                console.log('User data:', userData);
                login(userData);
                navigate('/home');
            } else {
                console.error('Login/Signup failed:', result.message);
            }

            setName("");
            setEmail("");
            setPassword("");
        } catch (error) {
            console.error('Error:', error);
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

            {isAdmin() && (
                <div>This is only visible to admins</div>
            )}
        </div>
    );
};

export default LoginSignup;
