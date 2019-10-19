/*
 *
 *
 *       Complete the API routing below
 *
 *
 */

'use strict';

const expect = require('chai').expect;
const mongoose = require('mongoose');
const Project = mongoose.model('project');

module.exports = function(app) {
  app
    .route('/api/issues/:project')

    .get(async function(req, res) {
      const project = req.params.project;
    })

    .post(function(req, res) {
      const project = req.params.project;
    })

    .put(function(req, res) {
      const project = req.params.project;
    })

    .delete(function(req, res) {
      const project = req.params.project;
    });
};
