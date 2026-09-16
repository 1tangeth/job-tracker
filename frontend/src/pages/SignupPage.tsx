
import { useState } from 'react';
import SignupForm from '../components/SignupForm';
import {useNavigate } from 'react-router-dom';


function SignupPage() {
    const [signupEmail, setSignupEmail] = useState("");
    const [signupPassword, setSignupPassword] = useState("");
    const [signupError, setSignupError] = useState("");
    const navigate = useNavigate();

    async function handleSignup() {
    const response = await fetch("http://localhost:3000/signup", {
      method : "POST",
      headers : {"Content-Type": "application/json"},
      body : JSON.stringify({email: signupEmail, password: signupPassword}),
    });

    const data = await response.json();
    if (!response.ok) {
      setSignupError(data.error || "Something went wrong");
      return;
    }
    console.log(data);
    navigate("/signin");

  }

    return (
        <> 
            <SignupForm email={signupEmail} setEmail={setSignupEmail} password ={signupPassword} handleSignup={handleSignup} setPassword={setSignupPassword} error = {signupError}/>
        </>
    )
}


export default SignupPage;