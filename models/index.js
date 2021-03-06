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
  },
  deleted: {
    type: Boolean,
    default: false
  }
});

var Meal = mongoose.model('Meal', mealSchema);
module.exports = Meal;

Meal.count({}, function(err, count) {

  if (err) {
    throw err;
  }

  if (count > 0) return ;

  const mealSeed = require('./seed.json');
  Meal.create(mealSeed, function(err, newMeals) {
    if (err) {
      throw err;
    }
    console.log("DB seeded");
  });
});
