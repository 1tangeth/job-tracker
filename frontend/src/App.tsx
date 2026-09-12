import './App.css'
import { useState } from 'react';
// component a function that returns UI

/** never define a component inside another component's function body. 
 * Always declare components at the top level of the file (or in their own file), 
 * so they're created once, not on every render. */
type FormFieldProps = {
  id : string,
  label: string;
  value: string;
  onChange: (value : string) => void;
  type? : string;
  placeholder?: string;
}

function FormField({id, label, value, onChange, type = "text", placeholder} : FormFieldProps) {
  return (
    <>
      <label htmlFor = {id} style = {{display : 'block', marginBottom: '8px'}}>
      {label}
      </label>

    <input id = {id} type = {type} value = {value} onChange = {(event) => onChange(event.target.value)}
    placeholder = {placeholder}>
    </input>
    
    
    </>
  );
}


function App() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState("");

  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [status, setStatus] = useState("");
  const [notes , setNotes] = useState("");

  type Application = {
    id : string, 
    company : string,
    role : string, 
    status : string,
    notes : string
  }
  const [applications, setApplications] = useState<Application[]>([]);

  async function handleLogin() {
    const response = await fetch ("http://localhost:3000/login", {
      method : "POST",
      headers : {"Content-Type" : "application/json"},
      body : JSON.stringify({email, password}),
    });
    const data = await response.json();
    console.log(data);
    setToken(data.token);
  }

  async function submitApp() {
    const response = await fetch("http://localhost:3000/applications", {
      method : "POST",
      headers : {"Content-Type" : "application/json", Authorization : `Bearer ${token}`},
      body : JSON.stringify({company, role, status, notes}),
    });
    const app = await response.json();// TODO: what is the value i return here app  }
    getApp();
  }

  async function getApp() {
    const response = await fetch("http://localhost:3000/applications", {
      method : "GET",
      headers : {Authorization : `Bearer ${token}`},
    });

    const {data} = await response.json();
    setApplications(data);

  }

  async function deleteApp(id : string) { 
    const response = await fetch(`http://localhost:3000/applications/${id}`, { 
      method : "DELETE", 
      headers : {
        "Content-Type": "application/json", // Added quotes here
        "Authorization" : `Bearer ${token}`
      } 
    }); 
    await getApp();
  }

  async function patchApp (id : string, newStat : string) {
      const response = await fetch(`http://localhost:3000/applications/${id}`, { 
      method : "PATCH", 
      headers : {
        "Content-Type": "application/json", // Added quotes here
        "Authorization" : `Bearer ${token}`,
      } ,
      body : 
        JSON.stringify(
          {
            status : newStat,
          }
        ),
      });
    await getApp();
  }






  // JFX looks like HTML but is javascript
  return (
    <div>
      <FormField id = "email-input" label = "Enter email:" value = {email}
      onChange = {setEmail} placeholder='type email'/>
      <FormField id = "password-input" label = "Enter password:" value = {password}
      onChange = {setPassword} placeholder='type password'/>
      <button onClick={handleLogin}>
        Sign-in
      </button>

      <FormField id="company-input" label="Enter company name:" value={company} onChange={setCompany} placeholder="type company name" />
      <FormField id="role-input" label="Enter role name:" value={role} onChange={setRole} placeholder="type role name" />
      <FormField id="status-input" label="Enter status:" value={status} onChange={setStatus} placeholder="type status" />
      <FormField id="notes-input" label="Enter notes:" value={notes} onChange={setNotes} placeholder="type notes" />

      <button onClick={submitApp}>
        submit
      </button>

      <button onClick={getApp}>
        get Applicaitons
      </button>

      <ul>
      {applications.map((app) => (
        <li key={app.id}>
          {app.company} — {app.role} — {app.status} — <button onClick={() => deleteApp(app.id)}>delete</button> — <button onClick={() => patchApp(app.id, "test")}>patch</button>
        </li>
      ))}
      </ul>


          
      
      
    </div>

    
  )
}

export default App
