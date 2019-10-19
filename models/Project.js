const mongoose = require('mongoose');
const { Schema } = mongoose;

const issueSchema = require('./Issue');

const ProjectSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  issues: [issueSchema],
});

mongoose.model('project', ProjectSchema);
