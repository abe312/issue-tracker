const mongoose = require('mongoose');
const Validator = require('validator');
const Project = mongoose.model('project');

const Issue = mongoose.model('issue');

exports.getController = async (req, res) => {
  let name = req.params.project;
  let project;
  console.log(req.query);
  if (Object.keys(req.query).length > 0 && req.query.constructor === Object) {
    project = await Project.find({ name });
    if (project) {
      issue = await Issue.find(req.query);
      return res.json(issue);
    }
  } else {
    project = await Project.findOne({
      name,
    });
    console.log('here');
  }
  // console.log(project);
  if (project)
    if (project.issues && project.issues.length > 0) res.json(project.issues);
    else res.status(400).send('No issues in this project');
  else res.status(400).send('No project found');
};

exports.postController = async (req, res) => {
  if (Object.keys(req.body).length === 0 && req.body.constructor === Object)
    return res.status(400).send('no fields sent');

  let name = req.params.project;

  const {
    issue_title,
    issue_text,
    created_by,
    assigned_to,
    status_text,
    open,
  } = req.body;

  if (
    !name ||
    !issue_title ||
    !issue_text ||
    !created_by ||
    Validator.isEmpty(issue_title) ||
    Validator.isEmpty(issue_text) ||
    Validator.isEmpty(created_by)
  )
    return res.status(400).send('Required fields not sent');

  let issueData = {
    issue_title,
    issue_text,
    created_by,
    assigned_to,
    status_text,
    open,
    created_on: Date.now(),
    updated_on: Date.now(),
  };
  if (!assigned_to) issueData.assigned_to = '';
  if (!status_text) issueData.status_text = '';
  if (!open) issueData.open = true;

  let project = await Project.findOne({ name });
  if (!project) project = new Project({ name });
  let issue = await new Issue(issueData).save();
  project.issues.unshift(issue);
  await project.save();
  // console.log(issue);
  res.status(200).json(issue);
};

exports.putController = async (req, res, next) => {
  if (Object.keys(req.body).length === 0 && req.body.constructor === Object)
    return res.status(400).send('no updated fields sent');

  let name = req.params.project;

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
  if (issue_title) fields['issue_title'] = issue_title;
  if (issue_text) fields['issue_text'] = issue_text;
  if (created_by) fields['created_by'] = created_by;
  if (assigned_to) fields['assigned_to'] = assigned_to;
  if (status_text) fields['status_text'] = status_text;
  if (open) fields['open'] = open;
  fields['updated_on'] = Date.now();

  let project = await Project.find({ name })
    .populate({
      path: 'issues',
      match: { _id },
    })
    .exec();
  // console.log(project);
  if (project.length > 0) {
    let issue = await Issue.findOneAndUpdate(
      { _id },
      fields,
      { new: true },
      function(err) {
        console.log(err);
        if (err) return res.send('could not update ' + _id);
        res.send('successfully updated ' + _id);
      }
    );
  } else {
    res.status(400).send('no project/issue found');
  }
};

exports.deleteController = async (req, res) => {
  let name = req.params.project;

  let _id = req.body._id;
  if (!_id || Validator.isEmpty(_id)) return res.status(400).send('_id error');

  let project = await Project.find({ name })
    .populate({
      path: 'issues',
      match: { _id },
    })
    .exec();
  if (project.length > 0) {
    await Issue.deleteOne({ _id }).exec(function(err) {
      if (err) return res.status(400).send(`could not delete ${_id}`);
      res.send({ success: `deleted ${_id}` });
    });
  } else res.status(400).send('project/issue not found');
};
