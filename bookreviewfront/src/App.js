// App.js
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginSignup from './Components/LoginSignup/LoginSignup';
import Home from './Components/Home/Home';
// import logo from './Components/assets/IconSite.png';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* <img src={logo} className="App-logo" alt="Booksy logo" /> */}
        <Route path="/" element={<LoginSignup />} />
        <Route path="/home" element={<Home />} />
        {/* Alte rute, de exemplu */}
      </Routes>
    </BrowserRouter>
  );
}
export default App;