const mongoose = require("mongoose");

const JobSchema = new mongoose.Schema({
  title: { type: String },
  company: { type: String },
  location: { type: String },
  skills: { type: String },
  description: { type: String },
  url: { type: String },
  datePosted: {
    type: Date,
  },
});

module.exports = mongoose.model("Job", JobSchema);
