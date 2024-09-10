import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import NoteModal from './NoteModal';
import JobCard from './JobCard'; // Import the JobCard component
import { useDispatch, useSelector } from 'react-redux';
import { setJobs, setLoading, setCurrentUser } from '../redux/appSlice';
import Spinner from './Spinner';
import { toast } from 'react-toastify';


const Profile = () => {
  // const [user, setUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sortField, setSortField] = useState('createdAt'); // Default sort field
  const navigate = useNavigate();

  const { jobs, loading, currentUser } = useSelector(store => store.appSlice);
  const dispatch = useDispatch();

  axios.defaults.withCredentials = true;

  const handleNewJob = (newJob) => {
    setJobs((prevJobs) => [...prevJobs, newJob]);
    console.log('Job added:', newJob);
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        dispatch(setLoading(true));
        const response = await axios.get('https://job-tracker-uwoi.onrender.com/api/v1/profile');
        console.log('In profile page', response);
        // setUser(response.data.user);
        dispatch(setJobs(response.data.user.jobs || []));
        dispatch(setCurrentUser(response.data.user))
        // toast.success("User data fetched")
      } catch (error) {
        console.log('Failed to fetch user data:', error);
        toast.error('User logged out');
        dispatch(setCurrentUser(null))
        localStorage.removeItem('currentUser')
        navigate('/'); // Redirect to login if there's an error (e.g., token expired)
      } finally {
        dispatch(setLoading(false));
      }
    };

    fetchUserData();
  }, [navigate]);

  // Sort jobs based on the selected field
  const sortedJobs = [...jobs].sort((a, b) => {
    if (sortField === 'createdAt') {
      return new Date(b.createdAt) - new Date(a.createdAt); // Date comparison
    }
    if (a[sortField] < b[sortField]) return -1;
    if (a[sortField] > b[sortField]) return 1;
    return 0;
  });

  const handleLogout = async () => {
    try {
      dispatch(setLoading(true))
      const response = await axios.post('https://job-tracker-uwoi.onrender.com/api/auth/logout');
      // localStorage.removeItem('accessToken');
      // dispatch(setAccessToken(""))
      dispatch(setCurrentUser(null))
      dispatch(setJobs([]))
      localStorage.removeItem('currentUser')
      toast.success('Logout success');
      navigate('/');
    } catch (error) {
      console.log('Logout failed:', error);
      toast.error(error.message);
    } finally {
      dispatch(setLoading(false))
    }
  };


  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900">
      {/* Navigation Bar */}
      <nav className="w-full bg-gray-900 shadow-lg p-4 flex justify-between items-center fixed top-0 left-0 z-50">
        <h1 className="text-2xl font-bold text-gray-100">Job Tracker</h1>
        <div className="flex space-x-4">
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50"
          >
            Add Job
          </button>
          <button
            onClick={handleLogout}
            className="px-4 py-2 text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-50"
          >
            Logout
          </button>
        </div>
      </nav>

      {loading ? (
        <Spinner />
      ) : (
        <>
          <div className="w-full pt-20 p-6 bg-gray-800 shadow-lg rounded-lg max-w-5xl mt-6">
            {currentUser && (
              <>
                <div className="mt-4 text-center">
                  <h2 className="text-2xl font-semibold mt-2 text-gray-100">{currentUser.name}</h2>
                  <p className="text-gray-300">{currentUser.email}</p>
                </div>

                <div className="mt-6">
                  {jobs.length > 0 && (
                    <div className="flex justify-center mb-4">
                      <h2 className="text-2xl font-semibold text-green-500">YOUR JOBS</h2>
                    </div>
                  )}

                  {/* Sort Dropdown */}
                  {jobs.length > 0 && (
                    <div className="flex justify-end mb-4">
                      <select
                        value={sortField}
                        onChange={(e) => setSortField(e.target.value)}
                        className="px-4 py-2 bg-gray-700 text-gray-100 border border-gray-600 rounded-md"
                      >
                        <option value="companyName">Company Name</option>
                        <option value="jobRole">Job Role</option>
                        <option value="jobStatus">Job Status</option>
                        <option value="notes">Notes</option>
                        <option value="createdAt">Created At</option>
                      </select>
                    </div>
                  )}

                  {jobs.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
                      {sortedJobs.map((job, index) => (
                        <JobCard key={index} job={job} />
                      ))}
                    </div>
                  ) : (
                    <div className="flex justify-center">

                      <p
                        className="mt-4 cursor-pointer text-gray-100 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50 bg-blue-700 flex justify-center p-4 rounded-md"
                        onClick={() => setIsModalOpen(true)}
                      >
                        Add some jobs
                      </p>
                    </div>
                  )}
                </div>
              </>
            )}

            {isModalOpen && <NoteModal setIsModalOpen={setIsModalOpen} />}
          </div>

        </>
      )}
    </div>
  );
};

export default Profile;
