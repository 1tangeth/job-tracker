import './App.css'
import { useState } from 'react';
// component a function that returns UI
import FormField from './components/FormField';
import LoginForm from './components/LoginForm';
import SignupForm from './components/SignupForm';

function App() {

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [token, setToken] = useState("");

  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [status, setStatus] = useState("");
  const [notes, setNotes] = useState("");

  const [loginError, setLoginError] = useState("");
  const [signupError, setSignupError] = useState("");
  const [appError, setAppError] = useState("");

  type Application = {
    id: string,
    company: string,
    role: string,
    status: string,
    notes: string
  }
  const [applications, setApplications] = useState<Application[]>([]);

  const [signupAppear, setSignupAppear] = useState(false);

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
    setToken(data.token);
  }

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

  }


  async function submitApp() {
    const response = await fetch("http://localhost:3000/applications", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ company, role, status, notes }),
    });
    const data = await response.json();// TODO: what is the value i return here app  }
    if (!response.ok) {
      setAppError(data.error || "Something went wrong");
      return;
    }
    getApp();
  }

  async function getApp() {
    const response = await fetch("http://localhost:3000/applications", {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });

    const body = await response.json();
    if (!response.ok) {
      setAppError(body.error || "Something went wrong");
      return;
    }
    setApplications(body.data);

  }

  async function deleteApp(id: string) {
    const response = await fetch(`http://localhost:3000/applications/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json", // Added quotes here
        "Authorization": `Bearer ${token}`
      }
    });
    const data = await response.json();
    if (!response.ok) {
      setAppError(data.error || "Something went wrong");
      return;
    }
    await getApp();
  }

  async function patchApp(id: string, newStat: string) {
    const response = await fetch(`http://localhost:3000/applications/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json", // Added quotes here
        "Authorization": `Bearer ${token}`,
      },
      body:
        JSON.stringify(
          {
            status: newStat,
          }
        ),
    });
    const data = await response.json();
    if (!response.ok) {
      setAppError(data.error || "Something went wrong");
      return;
    }
    await getApp();
  }







  // JFX looks like HTML but is javascript
  return (
    <div>

      {/** if no token */}
      {!token && (
        <>
        <LoginForm email={loginEmail} setEmail={setLoginEmail} password ={loginPassword} handleLogin={handleLogin} setPassword={setLoginPassword}  error = {loginError}/>
        <span>Don't have an account? </span>

        <button onClick={() => setSignupAppear(true)}>Sign Up</button>
        {signupAppear && (
          <>
            <SignupForm email={signupEmail} setEmail={setSignupEmail} password ={signupPassword} handleSignup={handleSignup} setPassword={setSignupPassword} error = {signupError}/>
            
          </>
        )}
        </>
      )}

      {/**  if there is token */}
      {token && (
        <>
          <FormField id="company-input" label="Enter company name:" value={company} onChange={setCompany} placeholder="type company name" />
          <FormField id="role-input" label="Enter role name:" value={role} onChange={setRole} placeholder="type role name" />
          <FormField id="status-input" label="Enter status:" value={status} onChange={setStatus} placeholder="type status" />
          <FormField id="notes-input" label="Enter notes:" value={notes} onChange={setNotes} placeholder="type notes" />

          <button onClick={submitApp}>
            submit
          </button>
          <p> {appError}</p>

          <button onClick={getApp}>
            get Applicaitons
          </button>

          <ul>
            {applications.map((app) => (
              <li key={app.id}>
                {app.company} — {app.role} — {app.status} — <button onClick={() => deleteApp(app.id)}>delete</button>
                — <select value={app.status} onChange={(e) => patchApp(app.id, e.target.value)}>
                  <option value="applied">applied</option>
                  <option value="interviewing">interviewing</option>
                  <option value="offer">offer</option>
                  <option value="rejected">rejected</option>
                </select>
              </li>

            ))}
          </ul>
        </>
      )}







    </div>


  )
}

export default App
