import { useState } from 'react';

import FirebaseAuthService from '../FirebaseAuthService';

const LoginForm = (existingUser) => {

    //console.log(existingUser.existingUser);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    async function handleSubmit(event) {
        event.preventDefault();
        try {
             await FirebaseAuthService.loginUser(email, password);
             setEmail("");
             setPassword("");
         }
         catch (error) {
             alert(error.message);
         }
    }

    function handleLogout () {
        FirebaseAuthService.logoutUser();
    }

    async function handleResetPassword () {
        if (!email) {
            alert('Missing email');
            return;
        }

        try {
            await FirebaseAuthService.passwordResetMail(email)
            alert("Sent the password reset email!")
        }
        catch (error) {
            alert(error.message);
        }
        
    }

    async function handleGoogleAuth () {
        try {
            await FirebaseAuthService.loginGoogle()
        }
        catch (error) {
            alert(error.message);
        }
    }

    return (
        <div className="login-form-container">
            {
                existingUser.existingUser ? (<div className="row">
                    <h3>Welcome {existingUser.existingUser.email}</h3>
                    <button type="button" className ="primary-button" onClick={handleLogout}>Logout</button></div>) 
                    : (<form onSubmit={handleSubmit} className="login-form">
                    <label className="input-label login-label">
                        Email:
                        <input 
                        type="email" 
                        required 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        className="input-text"/>
                    </label>
                    <label className="input-label login-label">
                        Password:
                        <input 
                        type="password" 
                        required 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        className="input-text"/>
                    </label>

                    <div className="button-box">
                        <button className="primary-button">Login</button>
                        <button type="button" className="primary-button" onClick={handleResetPassword}>Reset Password</button>
                        <button type="button" className="primary-button" onClick={handleGoogleAuth}>Login with Google</button>
                    </div>
                    
                    
                </form>)
            }
        </div>
    );
}

export default LoginForm;