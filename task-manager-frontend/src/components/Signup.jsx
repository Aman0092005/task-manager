


import './signup.css'
import { useState } from 'react';




function Signup({authentication})
{
    const[isSignup, setIsSignup] = useState(true);
    const[firstName, setFirstName] = useState('');
    const[lastName, setLastName] = useState('');
    const[email, setEmail] = useState('');
    const[password, setPassword] = useState('');


    function handleAuthentication()
    {
        authentication(isSignup, firstName, lastName, email, password);
    }

    return (
        <div className="signup-section">
            <div className="signup-container">
                <div className="signup-login-btn-container">
                    <button className={isSignup?'bg-cl-2':'bg-cl-1'} onClick={() => setIsSignup(true)}>Sign up</button>
                    <button className={!isSignup?'bg-cl-2':'bg-cl-1'} onClick={() => setIsSignup(false)} >Sign in</button>
                </div>
                <div className="form-heading"><h2>{isSignup?"Create an account":"Welcome back"}</h2></div>
                <div className="form-container">
                    {isSignup &&(
                    <div className="name-container">
                        <div><input type="text" name="firstName" id="name" placeholder="First name" value={firstName} onChange={(e) => setFirstName(e.target.value)} /></div>
                        <div><input type="text" name="lastName" id="last" placeholder="Last name" value={lastName} onChange={(e) => setLastName(e.target.value)} /></div>
                    </div>)
                    } 
                    <div className="email-field"><input type="email" name="email" id="emailId" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} /></div>
                    <div className="password-field"><input type="password" name="password" id="pass" placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} /></div>
                    <div className="submit-btn"><button onClick={() => handleAuthentication() }>{isSignup?"Create an account":"Login"}</button></div>
                </div>
            </div>
        </div>
    );

}






export default Signup;