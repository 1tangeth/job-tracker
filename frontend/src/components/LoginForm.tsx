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
            <FormField id="email-input" label="Enter email:" value={email}
                onChange={setEmail} placeholder='type email' />
            <FormField id="password-input" label="Enter password:" type= "password" value={password}
                onChange={setPassword} placeholder='type password' />
            <button onClick={handleLogin}>
                Sign-in
            </button>
            <p>{error}</p>
        </>

    )
}