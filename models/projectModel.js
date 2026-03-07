
const mongoose = require("mongoose")
const ObjectId = mongoose.Schema.Types.ObjectId;

const projectSchema = new mongoose.Schema({

  name: {
     type: String,
      required: true 
    },

  description: {
     type: String 
    },

  createdBy: {
     type: ObjectId,
     ref: 'User',
     required: true 
    },

  assignedUsers: [{ 
    type: ObjectId, 
    ref: 'User' 
}],
  
},{timestamps: true});

const Project = mongoose.model('Project', projectSchema);

module.exports = Project