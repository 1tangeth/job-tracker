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
            <FormField id="signup-email-input" label="Enter email:" value={email}
                onChange={setEmail} placeholder='type email' />
            <FormField id="signup-password-input" label="Enter password:" type= "password" value={password}
                onChange={setPassword} placeholder='type password' />
            <button onClick={handleSignup} >
                SignUp
            </button>
            <p>{error}</p>
        </>


    )

}