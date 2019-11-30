/*
 *
 *
 *       Complete the API routing below
 *
 *
 */

'use strict';

const expect = require('chai').expect;

const {
  getController,
  postController,
  putController,
  deleteController,
} = require('./projectControllers');
const { catchErrors } = require('../hoc/catchErrors.js');

module.exports = function(app) {
  app
    .route('/api/issues/:project')

    .get(catchErrors(getController))

    .post(catchErrors(postController))

    .put(catchErrors(putController))

    .delete(catchErrors(deleteController));
};
