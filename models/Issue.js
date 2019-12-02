const mongoose = require('mongoose');
const { Schema } = mongoose;

const issueSchema = new Schema({
  issue_title: {
    type: String,
    required: true,
  },
  issue_text: {
    type: String,
    required: true,
  },
  created_by: {
    type: String,
    required: true,
  },
  created_on: {
    type: Date,
    default: Date.Now,
    required: true,
  },
  updated_on: {
    type: Date,
  },
  open: {
    type: Boolean,
    default: true,
  },
  status_text: {
    type: String,
  },
  assigned_to: String,
});

// module.exports = issueSchema;
mongoose.model('issue', issueSchema);
