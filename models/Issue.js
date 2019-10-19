const mongoose = require('mongoose');
const { Schema } = mongoose;

const issueSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  text: {
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
});

moddule.exports = issueSchema;
