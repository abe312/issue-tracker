const mongoose = require('mongoose');
const Validator = require('validator');
const Project = mongoose.model('project');

// const Issue = mongoose.model('issue');

exports.getController = async (req, res) => {
  if ((res.body = {})) res.status(400).send('no updated field sent');
  let projectName = req.params.project;

  let issueId = req.query._id;
  console.log(projectName, issueId);
  if (Validator.isEmpty(issueId))
    return res.status(400).send('issue id not specified');

  let project = await Project.find({
    name: projectName,
    'issues._id': issueId,
  });

  res.json(project);
};

exports.postController = async (req, res) => {
  if ((res.body = {})) res.status(400).send('no updated field sent');
  let projectName = req.params.project;

  let project = await Project.findOneAndUpdate({ name: projectName });
  const {
    issue_title,
    issue_text,
    created_by,
    assigned_to,
    status_text,
  } = req.body;
  if (
    Validator.isEmpty(issue_title) ||
    Validator.isEmpty(issue_text) ||
    Validator.isEmpty(created_by)
  )
    return res.status(400).send('Required fields not filled');

  let issue = {
    issue_title,
    issue_text,
    created_by,
    assigned_to,
    status_text,
    created_on: Date.now(),
  };

  if (project) {
    console.log('if');
    if (!project.issues) project.issues = [];
    project.issues.unshift(issue);
    await project.save();
    res.json(project);
  } else {
    console.log('else');
    project = new Project({
      name: projectName,
      issues: [],
    });
    project.issues.unshift(issue);
    await project.save();
    res.json(project);
  }
};

exports.putController = async (req, res, next) => {
  if ((res.body = {})) res.status(400).send('no updated field sent');
  // console.log(req.params, req.body, req.query);
  let projectName = req.params.project;

  const {
    _id,
    issue_title,
    issue_text,
    created_by,
    assigned_to,
    status_text,
    open,
  } = req.body;
  let fields = {};
  if (issue_title) fields['issues.$.issue_title'] = issue_title;
  if (issue_text) fields['issues.$.issue_text'] = issue_text;
  if (created_by) fields['issues.$.created_by'] = created_by;
  if (assigned_to) fields['issues.$.assigned_to'] = assigned_to;
  if (status_text) fields['issues.$.status_text'] = status_text;
  if (open) fields['issues.$.open'] = open;

  let project = await Project.findOneAndUpdate(
    { name: projectName, 'issues._id': _id },
    { $set: fields },
    { new: true },
    function(err) {
      console.log(err);
    }
  );

  res.json(project);
};

exports.deleteController = async (req, res) => {
  if ((res.body = {})) res.status(400).send('no updated field sent');
  let projectName = req.params.project;

  let _id = req.body._id;
  // console.log(req.body, req.params, req.query);
  if (Validator.isEmpty(_id))
    return res.status(400).send('project id not specified');

  const issue = await Project.findOneAndUpdate(
    {
      name: projectName,
      'issues._id': _id,
    },
    { $pull: { issues: { _id } } },
    { new: true }
  );
  res.json(issue);
};
