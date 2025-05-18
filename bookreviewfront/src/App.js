import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginSignup from './Components/LoginSignup/LoginSignup';
import Home from './Components/Home/Home';
import Contact from './Components/Contact/Contact'
import AddBook from './Components/AddBook/AddBook';
import { AuthProvider } from './Components/Context/AuthContext';
import AcceptBook from './Components/AcceptBooks/AcceptBooks';
import AllBooks from './Components/AllBooks/AllBooks';
import Navbar from './Components/Layout/Navbar';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          {/* <img src={logo} className="App-logo" alt="Booksy logo" /> */}
          <Route path="/" element={<LoginSignup />} />
          <Route path="/home" element={<Home />} />
          <Route path='/contact' element={<Contact/>}/>
          <Route path="/addBook" element={<AddBook />} /> 
          <Route path='/acceptBook' element={<AcceptBook />} />
          <Route path='/books' element={<AllBooks />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
export default App;