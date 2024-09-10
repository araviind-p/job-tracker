import mongoose from 'mongoose'

const UserSchema = new mongoose.Schema({
  googleId: {
    type: String,
  },
  name:{
    type:String,
  },
  password:{
    type:String,
  },
  displayName: {
    type: String,
    // required: true,
  },
  image: {
    type: String,
  },
  email: {
    type: String,
    required: true,
  },
  jobs: [{
    companyName: {
      type: String,
      required: true,
    },
    jobRole: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: false,
    },
    notes: {
      type: String,
      required: false,
    },
    jobStatus: {
      type: String,
      enum: ['applied', 'interviewing', 'offered', 'rejected'], // Define allowed values
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model('User', UserSchema);
