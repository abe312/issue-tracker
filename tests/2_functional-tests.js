/*
 *
 *
 *       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
 *       -----[Keep the tests in the same order!]-----
 *       (if additional are added, keep them at the very end!)
 */

var chaiHttp = require('chai-http');
var chai = require('chai');
var assert = chai.assert;
var server = require('../server');

chai.use(chaiHttp);

let _id;
suite('Functional Tests', function() {
  suite('POST /api/issues/{project} => object with issue data', function() {
    test('Every field filled in', function(done) {
      chai
        .request(server)
        .post('/api/issues/test')
        .send({
          issue_title: 'Title',
          issue_text: 'text sample',
          created_by: 'Functional Test - Every field filled in',
          assigned_to: 'Chai and Mocha',
          status_text: 'In QA',
        })
        .end(function(err, res) {
          // console.log(res.body);
          let {
            issue_title,
            issue_text,
            created_by,
            assigned_to,
            status_text,
            open,
            created_on,
            updated_on,
          } = res.body;

          _id = res.body._id;
          assert.equal(res.status, 200);

          //fill me in too!
          assert.equal(issue_title, 'Title');
          assert.equal(issue_text, 'text sample');
          assert.equal(created_by, 'Functional Test - Every field filled in');
          assert.equal(assigned_to, 'Chai and Mocha');
          assert.equal(status_text, 'In QA');
          assert.equal(open, true);

          assert.property(res.body, 'created_on');
          assert.property(res.body, 'updated_on');
          assert.property(res.body, '_id');

          done();
        });
    });
    test('Required fields filled in', function(done) {
      chai
        .request(server)
        .post('/api/issues/test')
        .send({
          issue_title: 'Title',
          issue_text: 'text',
          created_by: 'Functional Test - Required fields filled in',
        })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.issue_title, 'Title');
          assert.equal(
            res.body.created_by,
            'Functional Test - Required fields filled in'
          );
          assert.equal(res.body.assigned_to, '');
          assert.equal(res.body.status_text, '');
          assert.property(res.body, 'created_on');
          assert.property(res.body, 'updated_on');
          assert.equal(res.body.open, true);
          assert.property(res.body, '_id');
          done();
        });
    });

    test('Missing required fields', function(done) {
      chai
        .request(server)
        .post('/api/issues/test')
        .send({
          issue_title: 'Title',
          created_by: 'Functional Test - Missing required fields',
        })
        .end(function(err, res) {
          assert.equal(res.status, 400);
          assert.equal(res.text, 'Required fields not sent');
          done();
        });
    });
  });

  suite('PUT /api/issues/{project} => text', function() {
    test('No body', function(done) {
      chai
        .request(server)
        .put('/api/issues/test')
        .send({})
        .end(function(err, res) {
          assert.equal(res.status, 400);
          assert.equal(res.text, 'no updated fields sent');
          done();
        });
    });

    test('One field to update', function(done) {
      chai
        .request(server)
        .put('/api/issues/test')
        .send({
          _id,
          created_by: 'Functional Test - One field to update',
        })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.text, `successfully updated ${_id}`);
          done();
        });
    });

    test('Multiple fields to update', function(done) {
      chai
        .request(server)
        .put('/api/issues/test')
        .send({
          _id,
          created_by: 'Functional Test - Multiple fields to update',
          issue_title: 'Issue Title',
          open: false,
        })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.text, `successfully updated ${_id}`);
          done();
        });
    });
  });

  suite(
    'GET /api/issues/{project} => Array of objects with issue data',
    function() {
      test('No filter', function(done) {
        chai
          .request(server)
          .get('/api/issues/test')
          .query({})
          .end(function(err, res) {
            // console.log(res.body);
            assert.equal(res.status, 200);
            assert.isArray(res.body);
            assert.property(res.body[0], 'issue_title');
            assert.property(res.body[0], 'issue_text');
            assert.property(res.body[0], 'created_on');
            assert.property(res.body[0], 'updated_on');
            assert.property(res.body[0], 'created_by');
            assert.property(res.body[0], 'assigned_to');
            assert.property(res.body[0], 'open');
            assert.property(res.body[0], 'status_text');
            assert.property(res.body[0], '_id');
            done();
          });
      });

      test('One filter', function(done) {
        chai
          .request(server)
          .get('/api/issues/test')
          .query({
            issue_title: 'Title',
          })
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.isArray(res.body);
            // it's definitely more than one as it ramps up every time we run the test
            // assert.equal(res.body.length, 1);
            assert.property(res.body[0], 'issue_title');
            assert.property(res.body[0], 'issue_text');
            assert.property(res.body[0], 'created_on');
            assert.property(res.body[0], 'updated_on');
            assert.property(res.body[0], 'created_by');
            assert.property(res.body[0], 'assigned_to');
            assert.property(res.body[0], 'open');
            assert.property(res.body[0], 'status_text');
            assert.property(res.body[0], '_id');
            done();
          });
      });

      test('Multiple filters (test for multiple fields you know will be in the db for a return)', function(done) {
        chai
          .request(server)
          .get('/api/issues/test')
          .query({
            issue_title: 'Issue Title',
            open: true,
          })
          .end(function(err, res) {
            console.log('res.body', res.body[0]);
            assert.equal(res.status, 200);
            // assert.isArray(res.body);
            // assert.equal(res.body.length, 0);
            assert.property(res.body[0], 'issue_title');
            assert.property(res.body[0], 'issue_text');
            assert.property(res.body[0], 'created_on');
            assert.property(res.body[0], 'updated_on');
            assert.property(res.body[0], 'created_by');
            assert.property(res.body[0], 'assigned_to');
            assert.property(res.body[0], 'open');
            assert.property(res.body[0], 'status_text');
            assert.property(res.body[0], '_id');
            done();
          });
      });
    }
  );

  suite('DELETE /api/issues/{project} => text', function() {
    test('No _id', function(done) {
      chai
        .request(server)
        .delete('/api/issues/test')
        .send({})
        .end(function(err, res) {
          assert.equal(res.status, 400);
          assert.equal(res.text, '_id error');
          done();
        });
    });

    test('Valid _id', function(done) {
      chai
        .request(server)
        .delete('/api/issues/test')
        .send({ _id })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.success, `deleted ${_id}`);
          done();
        });
    });
  });
});
