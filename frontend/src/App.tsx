import './App.css'
import { useState } from 'react';
// component a function that returns UI
function App() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState("");

  async function handleLogin() {
    const response = await fetch ("http://localhost:3000/login", {
      method : "POST",
      headers : {"Content-Type" : "application/json"},
      body : JSON.stringify({email, password}),
    });
    const data = await response.json();
    setToken(data);
  }


  // JFX looks like HTML but is javascript
  return (
    <div>
      <label htmlFor = "email-input" style = {{display: 'block' , marginBottom: '8px'}}>
        Enter email:
      </label>
      <input id = "email-input" type = "text" value = {email} 
        onChange = {(event) => setEmail(event.target.value)}
        placeholder = "type something here...">
      </input>
      <label htmlFor = "password-input" style = {{display: 'block' , marginBottom: '8px'}}>
        Enter password:
      </label>
      <input id = "password-input" type = "password" value = {password} 
        onChange = {(event) => setPassword(event.target.value)}
        placeholder = "type something here...">
      </input>
      <button onClick={handleLogin}>
        Sign-in
      </button>
      
      
      
    </div>

    
  )
}

export default App
