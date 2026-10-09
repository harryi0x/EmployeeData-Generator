const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  salary: {
    type: Number,
    required: true
  },
  language: {
    type: String,
    required: true
  },
  city: {
    type: String,
    required: true
  },
  isManager: {
    type: Boolean,
    required: true
  }
});

const Employee = mongoose.model("Employee", employeeSchema);

module.exports = Employee;
