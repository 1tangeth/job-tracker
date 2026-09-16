
import { useState } from 'react';
import LoginForm from '../components/LoginForm';
import { Link, useNavigate } from 'react-router-dom';

function SigninPage() {

    const [loginEmail, setLoginEmail] = useState("");
    const [loginPassword, setLoginPassword] = useState("");
    const [loginError, setLoginError] = useState("");
    const navigate = useNavigate();

    async function handleLogin() {
        const response = await fetch("http://localhost:3000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: loginEmail, password: loginPassword }),
        });
        const data = await response.json();
        if (!response.ok) {
            setLoginError(data.error || "Something went wrong");
            return;
        }
        localStorage.setItem("token", data.token);
        navigate("/app");
    }

    return (
        <>
            <LoginForm email={loginEmail} setEmail={setLoginEmail} password ={loginPassword} handleLogin={handleLogin} setPassword={setLoginPassword}  error = {loginError}/>
            
            <span>Don't have an account? </span>
            <Link to="/signup">Sign Up</Link>
        </>
    )
}


export default SigninPage;