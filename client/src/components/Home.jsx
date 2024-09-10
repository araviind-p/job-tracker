import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();
  const { currentUser } = useSelector(store => store.appSlice);
  const dispatch = useDispatch();

  // useEffect(() => {
  //   dispatch(setLoading(true))
  //   if (currentUser) {
  //     navigate('/profile')
  //   }
  //   dispatch(setLoading(false))
  // }, [])

  const handleLogin = () => {
    navigate('/login'); // Navigate to the Login page
  };

  const handleRegister = () => {
    navigate('/register'); // Navigate to the Register page
  };

  // if (currentUser) {
  //   return null
  // }


  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 p-4">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6">Welcome to Job Tracker</h1>

      <div className="space-x-4">
        <button
          onClick={handleLogin}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          Login
        </button>
        <button
          onClick={handleRegister}
          className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400"
        >
          Register
        </button>
      </div>
    </div>
  );
}

export default Home;
