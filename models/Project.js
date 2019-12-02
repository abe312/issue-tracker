const mongoose = require('mongoose');
const { Schema } = mongoose;

// const issueSchema = require('./Issue');

const ProjectSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  // issues: [issueSchema],
  issues: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'issue',
    },
  ],
});

function autopopulate(next) {
  this.populate({
    path: 'issues',
    populate: { path: 'issues' },
  });
  next();
}
ProjectSchema.pre('findOne', autopopulate);
// ProjectSchema.pre('find', autopopulate);

mongoose.model('project', ProjectSchema);
