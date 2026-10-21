import FormField from "./FormField"

type SignupProps = {
    email : string,
    setEmail: (email : string) => void,
    setPassword: (password : string) => void;
    handleSignup: () => void;
    password: string,
    error : string,
}


export default function SignupForm({email, setEmail, password, setPassword, handleSignup, error} : SignupProps) {
    return (
        <>
            <FormField id="signup-email-input" label="Email" value={email}
                onChange={setEmail} placeholder='you@example.com' />
            <FormField id="signup-password-input" label="Password" type="password" value={password}
                onChange={setPassword} placeholder='••••••••' />
            <div className="btn-row">
                <button className="btn" onClick={handleSignup}>
                    Sign up
                </button>
            </div>
            {error && <p className="error-text">{error}</p>}
        </>
    )
}
