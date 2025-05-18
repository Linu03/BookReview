import './App.css';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import LoginSignup from './Components/LoginSignup/LoginSignup';
import Home from './Components/Home/Home';
import Contact from './Components/Contact/Contact'
import AddBook from './Components/AddBook/AddBook';
import { AuthProvider } from './Components/Context/AuthContext';
import AcceptBook from './Components/AcceptBooks/AcceptBooks';
import AllBooks from './Components/AllBooks/AllBooks';
import Navbar from './Components/Layout/Navbar';
import ProtectedRoute from './Components/Layout/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </AuthProvider>
  );
}

function AppContent() {
  const location = useLocation();
  const showNavbar = location.pathname !== '/';

  return (
    <>
      {showNavbar && <Navbar />}
      <Routes>
        {/* <img src={logo} className="App-logo" alt="Booksy logo" /> */}
        <Route path="/" element={<LoginSignup />} />
        <Route path="/home" element={<ProtectedRoute element={Home} />} />
        <Route path='/contact' element={<ProtectedRoute element={Contact}/>}/>
        <Route path="/addBook" element={<ProtectedRoute element={AddBook} />} /> 
        <Route path='/acceptBook' element={<ProtectedRoute element={AcceptBook} />} />
        <Route path='/books' element={<ProtectedRoute element={AllBooks} />} />
      </Routes>
    </>
  );
}

export default App;