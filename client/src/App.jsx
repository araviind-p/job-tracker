import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Home from './components/Home';
import Login from './components/Login';
import Register from './components/Register';
import Profile from './components/Profile';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { setCurrentUser } from './redux/appSlice';

function App() {
  const { currentUser } = useSelector(store => store.appSlice);
  const dispatch = useDispatch();

  useEffect(() => {
    // Load currentUser from localStorage on app startup
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      dispatch(setCurrentUser(JSON.parse(storedUser)));
    }
  }, [dispatch]);

  return (
    <BrowserRouter>
      <Routes>
        {/* Redirect to profile if user is logged in */}
        <Route path='/' element={!currentUser ? <Home /> : <Navigate to="/profile" />} />
        <Route path='/register' element={currentUser ? <Navigate to="/profile" /> : <Register />} />
        <Route path='/login' element={currentUser ? <Navigate to="/profile" /> : <Login />} />
        <Route path='/profile' element={currentUser ? <Profile /> : <Navigate to="/login" />} />
      </Routes>
      <ToastContainer pauseOnHover={false} autoClose={1500} />
    </BrowserRouter>
  );
}

export default App;
