import React, { useState } from 'react';
import axios from 'axios';
import { FaTrash } from 'react-icons/fa'; // Import the delete icon
import EditJobModal from './EditJobModal';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { removeJob, setLoading } from '../redux/appSlice';

const JobCard = ({ job }) => {
  const [isEditing, setIsEditing] = useState(false);
  const dispatch = useDispatch()

  const getStatusClasses = (status) => {
    switch (status) {
      case 'applied':
        return 'bg-blue-100 text-blue-800';
      case 'interviewing':
        return 'bg-yellow-100 text-yellow-800';
      case 'offered':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleDelete = async () => {
    try {
      dispatch(setLoading(true))
      await axios.delete(`https://job-tracker-uwoi.onrender.com/api/v1/deleteJob/${job._id}`);
      toast.success("Job deleted")
      dispatch(removeJob(job._id))

    } catch (error) {
      console.error('Failed to delete job:', error);
      toast.error('Failed to delete job');
    } finally {
      dispatch(setLoading(false))
    }
  };

  // Format the createdAt date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="p-4 bg-white dark:bg-gray-900 rounded-lg shadow-md relative">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
        {job.companyName}
      </h3>
      <p className="text-gray-700 dark:text-gray-300">Role: {job.jobRole}</p>
      <p className="text-gray-700 dark:text-gray-300">
        URL: <a href={job.url.startsWith('http') ? job.url : `https://${job.url}`} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">{job.url}</a>
      </p>
      <p className="text-gray-700 dark:text-gray-300">Notes: {job.notes}</p>
      <p className="px-2 py-1 my-2 w-fit rounded-md text-sm font-medium text-gray-700 dark:text-gray-300">
        Status: <span className={`p-2 rounded-md ${getStatusClasses(job.jobStatus)}`}>{job.jobStatus}</span>
      </p>
      <p className="text-gray-700 dark:text-gray-300">Created At: {formatDate(job.createdAt)}</p>

      <div className="flex gap-2 mt-2">
        <button
          onClick={() => setIsEditing(true)}
          className="px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          Edit
        </button>
        <button
          onClick={handleDelete}
          className="px-4 py-2 text-white bg-red-500 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400"
        >
          <FaTrash size={20} />
        </button>
      </div>

      {isEditing && (
        <EditJobModal job={job} setIsEditing={setIsEditing} />
      )}
    </div>
  );
};

export default JobCard;
