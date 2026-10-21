import FormField from "./FormField"

type LoginProps = {
    email : string,
    setEmail: (email : string) => void,
    setPassword: (password : string) => void;
    handleLogin: () => void;
    password: string,
    error : string,
}


export default function LoginForm({email, setEmail, password, setPassword, handleLogin, error} : LoginProps) {
    return (
        <>
            <FormField id="email-input" label="Email" value={email}
                onChange={setEmail} placeholder='you@example.com' />
            <FormField id="password-input" label="Password" type="password" value={password}
                onChange={setPassword} placeholder='••••••••' />
            <div className="btn-row">
                <button className="btn" onClick={handleLogin}>
                    Sign in
                </button>
            </div>
            {error && <p className="error-text">{error}</p>}
        </>

    )
}
