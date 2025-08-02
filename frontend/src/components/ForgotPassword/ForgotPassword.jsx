import React, { useState, useContext } from 'react'
import './ForgotPassword.css'
import {StoreContext} from '../../context/StoreContex'
import axios from 'axios'

const ForgotPassword = ({ setShowForgotPassword }) => {
    const { url } = useContext(StoreContext);
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        
        try {
            const response = await axios.post(`${url}/api/user/forgot-password`, { email });
            
            if (response.data.success) {
                setMessage("Reset email sent! Check your inbox.");
            } else {
                setMessage(response.data.message);
            }
        } catch (error) {
            setMessage("Error sending reset email. Please try again.");
        }
        
        setIsLoading(false);
    };

    return (
        <div className='forgot-password-popup'>
            <form onSubmit={handleSubmit} className='forgot-password-container'>
                <div className='forgot-password-title'>
                    <h2>Reset Password</h2>
                    <button type="button" onClick={() => setShowForgotPassword(false)}>×</button>
                </div>
                
                <div className='forgot-password-input'>
                    <input 
                        type="email" 
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required 
                    />
                </div>
                
                {message && <p className="message">{message}</p>}
                
                <button type="submit" disabled={isLoading}>
                    {isLoading ? "Sending..." : "Send Reset Email"}
                </button>
            </form>
        </div>
    );
};

export default ForgotPassword;

