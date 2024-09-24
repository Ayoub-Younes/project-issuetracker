const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');
chai.use(chaiHttp);

let issue_1;

suite('Functional Tests', function() {
  this.timeout(20000);
  // #1
  test('Create an issue with every field: POST request to /api/issues/{project}',(done) => {
    chai
    .request(server)
    .keepOpen()
    .post('/api/issues/apitest')  
    .send({
        issue_title: 'HI',
        issue_text: 'HI',
        created_by: 'HI',
        assigned_to: 'HI',
        status_text: 'HI',
        project: 'apitest'
      })
    .end((err,res) => {
        assert.equal(res.status, 200);
        issue_1=res.body;
        assert.equal(res.type, 'application/json');
        assert.equal(res.body.issue_title, 'HI');
        assert.equal(res.body.issue_text, 'HI');
        assert.equal(res.body.created_by, 'HI');
        assert.equal(res.body.assigned_to, 'HI');
        assert.equal(res.body.status_text, 'HI');
        done();
    })  
  }).timeout(10000)
  // #2
  test('Create an issue with only required fields: POST request to /api/issues/{project}',(done) => {
    chai
    .request(server)
    .keepOpen()
    .post('/api/issues/apitest')  
    .send({
        issue_title: 'HI',
        issue_text: 'HI',
        created_by: 'HI',
        project: 'apitest'
      })
    .end((err,res) => {
      issue_2=res.body;
        assert.equal(res.status, 200);
        assert.equal(res.type, 'application/json');
        assert.equal(res.body.issue_title, 'HI');
        assert.equal(res.body.issue_text, 'HI');
        assert.equal(res.body.created_by, 'HI');
        done();
    })  
  }).timeout(10000)
  // #3
  test('Create an issue with missing required fields: POST request to /api/issues/{project}',(done) => {
    chai
    .request(server)
    .keepOpen()
    .post('/api/issues/apitest')  
    .send({
        issue_text: 'HI',
        created_by: 'HI',
        assigned_to: 'HI',
        status_text: 'HI',
        project: 'apitest'
      })
    .end((err,res) => {
        assert.equal(res.status, 200);
        assert.equal(res.type, 'application/json');
        assert.deepEqual(JSON.parse(res.text), { error: 'required field(s) missing' });
        done();
    })  
  }).timeout(10000)
  // #4
  test('View issues on a project: GET request to /api/issues/{project}',(done) => {
    chai
    .request(server)
    .keepOpen()
    .get('/api/issues/apitest')
    .end((err,res) => {
        assert.equal(res.status, 200);
        assert.equal(res.type, 'application/json');
        done();
    })  
  }).timeout(10000)
  // #5
  test('View issues on a project with one filter: GET request to /api/issues/{project}',(done) => {
    chai
    .request(server)
    .keepOpen()
    .get('/api/issues/apitest?status_text=HI')
    .end((err,res) => {
        assert.equal(res.status, 200);
        assert.equal(res.type, 'application/json');
        assert.isOk(JSON.parse(res.text).every(obj => obj.status_text === "HI"));
        done();
    })  
  }).timeout(10000)
  // #6
  test('View issues on a project with multiple filters: GET request to /api/issues/{project}',(done) => {
    chai
    .request(server)
    .keepOpen()
    .get('/api/issues/apitest?status_text=HI&open=true')
    .end((err,res) => {
        assert.equal(res.status, 200);
        assert.equal(res.type, 'application/json');
        assert.isOk(JSON.parse(res.text).every(obj => obj.status_text === "HI"));
        assert.isOk(JSON.parse(res.text).every(obj => obj.open === true));
        done();
    })  
  }).timeout(10000)
  
  // #7
  test('Update one field on an issue: PUT request to /api/issues/{project}',(done) => {
    chai
    .request(server)
    .keepOpen()
    .put('/api/issues/apitest')
    .send({
      _id: issue_1._id,
      issue_title: 'HELLO',
    })
    .end((err,res) => {
      assert.equal(res.status, 200);
      assert.equal(res.type, 'application/json');
      assert.deepEqual(JSON.parse(res.text), { result: "successfully updated", '_id': res.body._id });
      done();
    }) 
    }).timeout(10000)
  // #8
  test('Update multiple fields on an issue: PUT request to /api/issues/{project}',(done) => {
    chai
    .request(server)
    .keepOpen()
    .put('/api/issues/apitest')  
    .send({
        _id: issue_2._id,
        issue_title: 'HEY',
        issue_text: 'HI',
        created_by: 'HI',
        assigned_to: 'HI',
        status_text: 'HI',
      })
    .end((err,res) => {
        assert.equal(res.status, 200);
        assert.equal(res.type, 'application/json');
        assert.deepEqual(JSON.parse(res.text), { result: "successfully updated", '_id': res.body._id });
        done();
    })  
  }).timeout(10000)
  // #9
  test('Update an issue with missing _id: PUT request to /api/issues/{project}',(done) => {
    chai
    .request(server)
    .keepOpen()
    .put('/api/issues/apitest')  
    .end((err,res) => {
        assert.equal(res.status, 200);
        assert.equal(res.type, 'application/json');
        assert.deepEqual(JSON.parse(res.text), { error: 'missing _id' });
        done();
    })  
  }).timeout(10000)
  // #10
  test('Update an issue with no fields to update: PUT request to /api/issues/{project}',(done) => {
    chai
    .request(server)
    .keepOpen()
    .put('/api/issues/apitest')  
    .send({
        _id: issue_2._id
      })
    .end((err,res) => {
        assert.equal(res.status, 200);
        assert.equal(res.type, 'application/json');
        assert.deepEqual(JSON.parse(res.text), { error: 'no update field(s) sent', '_id': res.body._id });
        done();
    })  
  }).timeout(10000)
  // #11
  test('Update an issue with an invalid _id: PUT request to /api/issues/{project}',(done) => {
    chai
    .request(server)
    .keepOpen()
    .put('/api/issues/apitest')
    .send({
      _id: '1111111',
      issue_title: 'HELLO',
    })
    .end((err,res) => {
      assert.equal(res.status, 200);
      assert.equal(res.type, 'application/json');
      assert.deepEqual(JSON.parse(res.text), { error: 'could not update', '_id': res.body._id });
      done();
    }) 
    }).timeout(10000)
    // #12
  test('Delete an issue: DELETE request to /api/issues/{project}',(done) => {
    chai
    .request(server)
    .keepOpen()
    .delete('/api/issues/apitest')
    .send({
      _id: issue_2._id
    })
    .end((err,res) => {
      assert.equal(res.status, 200);
      assert.equal(res.type, 'application/json');
      assert.deepEqual(JSON.parse(res.text), { result: 'successfully deleted', '_id': res.body._id });
      done();
    }) 
    }).timeout(10000)
    // #13
  test('Delete an issue with an invalid _id: DELETE request to /api/issues/{project}',(done) => {
    chai
    .request(server)
    .keepOpen()
    .delete('/api/issues/apitest')
    .send({
      _id: '11111111'
    })
    .end((err,res) => {
      assert.equal(res.status, 200);
      assert.equal(res.type, 'application/json');
      assert.deepEqual(JSON.parse(res.text), { error: 'could not delete', '_id': res.body._id });
      done();
    }) 
    }).timeout(10000)
    // #13
  test('Delete an issue with missing _id: DELETE request to /api/issues/{project}',(done) => {
    chai
    .request(server)
    .keepOpen()
    .delete('/api/issues/apitest')
    .end((err,res) => {
      assert.equal(res.status, 200);
      assert.equal(res.type, 'application/json');
      assert.deepEqual(JSON.parse(res.text), { error: 'missing _id'});
      done();
    }) 
    }).timeout(10000)
})
