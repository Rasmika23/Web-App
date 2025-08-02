import React, { useState, useContext } from 'react'
import './ResetPassword.css'
import { useParams, useNavigate } from 'react-router-dom'
import {StoreContext} from '../../context/StoreContex'
import axios from 'axios'



const ResetPassword = () => {
    const { token } = useParams();
    const navigate = useNavigate();
    const { url } = useContext(StoreContext);
    
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (newPassword !== confirmPassword) {
            setMessage("Passwords don't match");
            return;
        }
        
        if (newPassword.length < 8) {
            setMessage("Password must be at least 8 characters");
            return;
        }
        
        setIsLoading(true);
        
        try {
            const response = await axios.post(`${url}/api/user/reset-password`, {
                token,
                newPassword
            });
            
            if (response.data.success) {
                setMessage("Password reset successfully! Redirecting to login...");
                setTimeout(() => navigate('/'), 2000);
            } else {
                setMessage(response.data.message);
            }
        } catch (error) {
            setMessage("Error resetting password. Please try again.");
        }
        
        setIsLoading(false);
    };

    return (
        <div className='reset-password-page'>
            <div className='reset-password-container'>
                <h2>Reset Your Password</h2>
                
                <form onSubmit={handleSubmit}>
                    <input 
                        type="password" 
                        placeholder="New Password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required 
                    />
                    
                    <input 
                        type="password" 
                        placeholder="Confirm New Password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required 
                    />
                    
                    {message && <p className="message">{message}</p>}
                    
                    <button type="submit" disabled={isLoading}>
                        {isLoading ? "Resetting..." : "Reset Password"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ResetPassword;
