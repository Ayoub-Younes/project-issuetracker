const Project = require('../models/issues');

module.exports = function (app) {

  app.route('/api/issues/:project')
  
    .get(async function (req, res) {
      try {
        let project = req.params.project;
        let obj = {
          assigned_to: req.query.assigned_to,
          status_text: req.query.status_text,
          open: req.query.open,
          _id: req.query._id,
          issue_title: req.query.issue_title,
          issue_text: req.query.issue_text,
          created_by: req.query.created_by,
          created_on: req.query.created_on,
          updated_on: req.query.updated_on
        };
        obj.project = project;
        Object.keys(obj).forEach(key => obj[key] === undefined ? delete obj[key] : {});

        let data = await Project.find(obj).select('-__v -project').exec();
        res.json(data);
      } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error fetching issues' });
      }
    })
    
    .post(async function (req, res) {
      try {
        let project_name = req.params.project;
        let issue = req.body;
        issue.project = project_name ? project_name : 'apitest';
        
        if (!req.body.issue_title || !req.body.created_by || !req.body.issue_text) {
          return res.json({ error: 'required field(s) missing' });
        }

        let project = new Project(issue);
        let result = await project.save();
        res.json(result);
      } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error saving issue' });
      }
    })
    
    .put(async function (req, res) {
      try {
        let project = req.params.project;
        if (!req.body._id) {
          return res.json({ error: 'missing _id' });
        }

        if (!req.body.open && !req.body.issue_title && !req.body.created_by && !req.body.issue_text && !req.body.status_text && !req.body.assigned_to) {
          return res.json({ error: 'no update field(s) sent', '_id': req.body._id });
        }

        let obj = {
          assigned_to: req.body.assigned_to,
          status_text: req.body.status_text,
          open: req.body.open,
          issue_title: req.body.issue_title,
          issue_text: req.body.issue_text,
          created_by: req.body.created_by,
          updated_on: new Date()
        };
        if (req.body.open === undefined) {
          delete obj.open;
        }

        let issue = await Project.findByIdAndUpdate(req.body._id, obj, { new: true });
        if (issue) {
          res.json({ result: 'successfully updated', '_id': req.body._id });
        } else {
          res.json({ error: 'could not update', '_id': req.body._id });
        }
      } catch (err) {
        console.error(err);
        res.json({ error: 'could not update', '_id': req.body._id });
      }
    })
    
    .delete(async function (req, res) {
      try {
        let project = req.params.project;
        if (!req.body._id) {
          return res.json({ error: 'missing _id' });
        }

        let issue = await Project.findByIdAndDelete(req.body._id);
        if (issue) {
          res.json({ result: 'successfully deleted', '_id': req.body._id });
        } else {
          res.json({ error: 'could not delete', '_id': req.body._id });
        }
      } catch (err) {
        console.error(err);
        res.json({ error: 'could not delete', '_id': req.body._id });
      }
    });
};
