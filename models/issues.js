
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
mongoose.connect(process.env.MONGO_URI)


const projectSchema = new Schema({
  project: {
  type: String,
  required: true
},
  issue_title: {
  type: String,
  required: true,
},
  issue_text: {
  type: String,
  required: true,
},
  created_by: {
  type: String,
  required: true
},
  assigned_to: {
  type: String,
  default: ""
},
  status_text: {
  type: String,
  default: ""
},
  created_on: {
  type: Date,
  default: new Date()
},
  updated_on: {
  type: Date,
  default: new Date()
},
  open: {
  type: Boolean,
  default: true
}
  
});

const Project = mongoose.model('Project', projectSchema);
module.exports = Project;
