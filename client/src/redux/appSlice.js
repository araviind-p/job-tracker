import { createSlice } from "@reduxjs/toolkit";

const appSlice = createSlice({
  name: "appSlice",
  initialState: {
    accessToken: "",
    jobs: [], // jobs is now an array
    loading: false,
    currentUser: null
  },
  reducers: {
    setAccessToken: (state, action) => {
      state.accessToken = action.payload;
    },
    setJobs: (state, action) => {
      // Replace or update the jobs array with the new array
      state.jobs = action.payload; // payload is an array of jobs
    },
    addJob: (state, action) => {
      // Add a new job to the jobs array
      state.jobs.push(action.payload); // payload is a single job object
    },
    removeJob: (state, action) => {
      // Remove a job from the jobs array based on the ID
      const jobId = action.payload;
      state.jobs = state.jobs.filter((job) => job._id !== jobId);
    },
    setLoading: (state, action) => {
      state.loading = action.payload
    },
    setCurrentUser: (state, action) => {
      state.currentUser = action.payload
    }
  },
});

export const { setAccessToken, setJobs, addJob, removeJob,
  setLoading, setCurrentUser
} = appSlice.actions;

export default appSlice.reducer;
