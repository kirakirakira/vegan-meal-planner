// models/index.js
const mongoose = require('mongoose');

const mealSchema = new mongoose.Schema({
  timeOfDay: {
    type: String,
    required: true,
    trim: true
  },
  mealName: {
    type: String,
    required: true,
    trim: true
  },
  notes: {
    type: String,
    required: false,
    trim: true
  },
  categories: {
    type: [{type: String}]
  },
  days: {
    type: [{type: String}]
  }
});

var Meal = mongoose.model('Meal', mealSchema);
module.exports = Meal;
