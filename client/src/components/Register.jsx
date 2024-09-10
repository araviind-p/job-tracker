import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { setLoading } from '../redux/appSlice';
import Spinner from './Spinner';

function Register() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState(''); // New state for confirm password

  const { loading, currentUser } = useSelector(store => store.appSlice);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setLoading(true));
    if (currentUser) {
      navigate('/profile');
    }
    dispatch(setLoading(false));
  }, []);

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevent default form submission
    dispatch(setLoading(true));

    // Password validation
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters long");
      dispatch(setLoading(false));
      return;
    }

    // Confirm password validation
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      dispatch(setLoading(false));
      return;
    }

    try {
      const response = await axios.post('https://job-tracker-uwoi.onrender.com/api/auth/register', {
        name,
        email,
        password,
      });
      console.log("res.data...", response.data);

      // Check if registration was successful
      if (response.data) {
        toast.success("Registration success");
        navigate('/login');
      }
    } catch (err) {
      toast.error(err.response?.data?.message);
      console.log(err);
      setEmail("");
      setName("");
      setPassword("");
      setConfirmPassword("");
    } finally {
      dispatch(setLoading(false));
    }
  };

  // Redirect to Sign In page
  const handleSignInRedirect = () => {
    navigate('/login');
  };

  return (
    <div className="bg-gray-900 min-h-screen flex justify-center items-center pb-14">
      {loading ? (
        <Spinner />
      ) : (
        <form className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-sm sm:max-w-md" onSubmit={handleSubmit}>
          <h1 className="text-4xl mb-8 font-medium text-blue-200 flex justify-center">Register</h1>

          <div className="mb-5">
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-gray-700 border border-gray-600 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:placeholder-gray-400"
              placeholder="Name"
              required
            />
          </div>
          <div className="mb-5">
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-gray-700 border border-gray-600 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:placeholder-gray-400"
              placeholder="Email"
              required
            />
          </div>
          <div className="mb-5">
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-gray-700 border border-gray-600 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:placeholder-gray-400"
              placeholder="Password (6 characters minimum)"
              required
            />
          </div>
          <div className="mb-5">
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="bg-gray-700 border border-gray-600 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:placeholder-gray-400"
              placeholder="Confirm Password"
              required
            />
          </div>
          <div className="w-full flex justify-center">
            <button
              type="submit"
              className="text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-2/4 px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 mb-4"
            >
              Register
            </button>
          </div>
          <div className="text-center">
            <span className="text-gray-300">Already have an account?</span>
            <button
              type="button"
              onClick={handleSignInRedirect}
              className="ml-2 text-blue-500 hover:underline focus:outline-none"
            >
              Sign In
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

export default Register;
