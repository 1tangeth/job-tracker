
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
        <div className="page">
            <div className="brand">AI Job Tracker</div>
            <h2 className="section-title">Welcome back</h2>
            <div className="card">
                <LoginForm email={loginEmail} setEmail={setLoginEmail} password={loginPassword} handleLogin={handleLogin} setPassword={setLoginPassword} error={loginError} />
            </div>
            <p className="muted">Don't have an account? <Link className="link" to="/signup">Sign up</Link></p>
        </div>
    )
}


export default SigninPage;
