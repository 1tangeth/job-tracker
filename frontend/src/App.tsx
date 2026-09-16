import './App.css'
import { Routes, Route } from 'react-router-dom';
import SignupPage from './pages/SignupPage';
import SigninPage from './pages/SigninPage';
import ApplicationPage from './pages/ApplicationPage'; 

function App() {

  // JFX looks like HTML but is javascript
  return (
    <Routes>
      <Route path = "/signin" element = {<SigninPage/>} />
      <Route path = "/signup" element = {<SignupPage/>} />
      <Route path = "/app" element = {<ApplicationPage/>} />
    </Routes>

  )
}

export default App
