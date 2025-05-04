import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginSignup from './Components/LoginSignup/LoginSignup';
import Home from './Components/Home/Home';
import Contact from './Components/Contact/Contact'
import AddBook from './Components/AddBook/AddBook';
import { AuthProvider } from './Components/Context/AuthContext';
import AcceptBook from './Components/AcceptBooks/AcceptBooks';



function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* <img src={logo} className="App-logo" alt="Booksy logo" /> */}
          <Route path="/" element={<LoginSignup />} />
          <Route path="/home" element={<Home />} />
          <Route path='/contact' element={<Contact/>}/>
          <Route path="/addBook" element={<AddBook />} /> 
          <Route path='/acceptBook' element={<AcceptBook />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
export default App;