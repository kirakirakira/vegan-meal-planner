// routes/index.js

const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Meal = require('../models/index');

// GET the entire week's meal plan
router.get('/', (req, res) => {

  let daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  let weekPlan = {};

  let promises = [];
  for (i = 0; i < daysOfWeek.length; i++) {
    let day = daysOfWeek[i];
    let promise = Meal.find({days: {$in: [day]}, deleted: {$ne: true}}, function(err, meals) {
          if(err) return handleError(err);

          weekPlan[day] = {"Breakfast": [], "Lunch": [], "Dinner": [], "Snack": [], "Beverage": []};
          for (i = 0; i < meals.length; i++) {
            if (meals[i].timeOfDay === "Breakfast") {
              // dayPlan[day]["Breakfast"].push(meals[i].mealName);
              weekPlan[day]["Breakfast"].push({
                "mealName": meals[i]["mealName"],
                "id": meals[i]["id"]
              });
            } else if (meals[i].timeOfDay === "Lunch") {
              weekPlan[day]["Lunch"].push({
                "mealName": meals[i]["mealName"],
                "id": meals[i]["id"]
              });
            } else if (meals[i].timeOfDay === "Dinner") {
              weekPlan[day]["Dinner"].push({
                "mealName": meals[i]["mealName"],
                "id": meals[i]["id"]
              });
            } else if (meals[i].timeOfDay === "Snack") {
              weekPlan[day]["Snack"].push({
                "mealName": meals[i]["mealName"],
                "id": meals[i]["id"]
              });
            } else if (meals[i].timeOfDay === "Beverage") {
              weekPlan[day]["Beverage"].push({
                "mealName": meals[i]["mealName"],
                "id": meals[i]["id"]
              });
            }
          }
        });
    promises.push(promise);
  }
  Promise.all(promises)
    .then(() => {
      // console.log(dayPlan);
      res.render('display-week', weekPlan);
    })
    .catch((error) => {
      return handleError(error);
    });
});

// GET the new meal form
router.get('/add', (req, res) => {
  res.render('create-meal');
});

// POST the new meal to the database
router.post('/add', (req, res, next) => {
  if (req.body.timeOfDay && req.body.mealName) {
    // create object with form input
    const mealData = {
      timeOfDay: req.body.timeOfDay,
      mealName: req.body.mealName,
      notes: req.body.notes,
      categories: req.body.categories,
      days: req.body.days
    };

    // use schema's 'create' method to insert doc into mongo
    Meal.create(mealData, (error, meal) => {
      if (error) {
        return next(error);
      } else {
        return res.redirect('/');
      }
    });
  } else {
    const err = new Error('Need at least time of day and meal name');
    err.status = 400;
    return next(err);
  }
});

// GET update form for an existing meal
router.get('/meal/update/:mealId', function(req, res, next) {
  const Meal = mongoose.model('Meal');
  const mealId = req.params.mealId;

  Meal.findById(mealId, function(err, meal) {
    if (err) {
      const err = new Error('Server error');
      err.status = 500;
      return next(err);
    }
    if (!meal) {
      const err = new Error('Meal not found');
      err.status = 404;
      return next(err);
    }
    res.render('update-meal', meal);
  })
});

// Post "put" (update) an existing meal
router.post('/meal/update', function(req, res, next) {
  console.log("hit it");
  const Meal = mongoose.model('Meal');
  console.log(req.body);
  const mealId = req.body.mealId;

  Meal.findById(mealId, function(err, meal) {
    console.log("meal? ?? ", meal);
    if (err) {
      const err = new Error('Server error');
      err.status = 500;
      return next(err);
    }
    if (!meal) {
      const err = new Error('Meal not found');
      err.status = 404;
      return next(err);
    }
    if (req.body.timeOfDay && req.body.mealName) {
      // update object with form input
      const mealData = {
        timeOfDay: req.body.timeOfDay || meal.timeOfDay,
        mealName: req.body.mealName || meal.mealName,
        notes: req.body.notes || meal.notes,
        categories: req.body.categories || meal.categories,
        days: req.body.days || meal.days
      };

      // use schema's 'update' method to update doc into mongo
      meal.update(mealData, (error, meal) => {
        if (error) {
          return next(error);
        } else {
          return res.redirect('/');
        }
      });
    } else {
      const err = new Error('Need at least time of day and meal name');
      err.status = 400;
      return next(err);
    }
    console.log(meal);
  })
});

// DELETE a specific meal

router.delete('/meal/delete/:mealId', function(req, res, next) {
  console.log("connected to router delete method");
  const Meal = mongoose.model('Meal');
  const mealId = req.params.mealId;

  Meal.findById(mealId, function(err, meal) {
    console.log("meal? ?? ", meal);
    if (err) {
      const err = new Error('Server error');
      err.status = 500;
      return next(err);
    }
    if (!meal) {
      const err = new Error('Meal not found');
      err.status = 404;
      return next(err);
    }

    meal.deleted = true;

    meal.save(function(err, doomedMeal) {
      res.json(doomedMeal);
    })
  })
});

// GET a specific day's meal plan
router.get('/:day', (req, res) => {
  const { day } = req.params;

  Meal.find({days: {$in: [day]}, deleted: {$ne: true}}, function(err, meals) {
    if(!meals) {
      let dayPlan = {"Day": day};
    }

    if(err) return handleError(err);

    let dayPlan = {"Day": day, "Breakfast": [], "Lunch": [], "Dinner": [], "Snack": [], "Beverage": []};
    let categoryTotal = {"Beans":0, "Berries":0, "Other Fruits":0, "Flaxseeds":0, "Nuts":0, "Spices":0, "Cruciferous Vegetables":0, "Leafy Greens":0, "Other Vegetables":0, "Whole Grains":0, "Beverages":0};

    function updateCategoryCounts(mealCategoryData) {
      for (j = 0; j < mealCategoryData.length; j++) {
          categoryTotal[mealCategoryData[j]] += 1;
      }
    }

    for (i = 0; i < meals.length; i++) {
      if (meals[i].timeOfDay === "Breakfast") {
        dayPlan["Breakfast"].push({
          "id": meals[i]._id,
          "mealName": meals[i].mealName,
          "notes": meals[i].notes,
          "categories": meals[i].categories
        });
        updateCategoryCounts(meals[i].categories);

      } else if (meals[i].timeOfDay === "Lunch") {
        dayPlan["Lunch"].push({
          "id": meals[i]._id,
          "mealName": meals[i].mealName,
          "notes": meals[i].notes,
          "categories": meals[i].categories
        });
        updateCategoryCounts(meals[i].categories);

      } else if (meals[i].timeOfDay === "Dinner") {
        dayPlan["Dinner"].push({
          "id": meals[i]._id,
          "mealName": meals[i].mealName,
          "notes": meals[i].notes,
          "categories": meals[i].categories
        });
        updateCategoryCounts(meals[i].categories);

      } else if (meals[i].timeOfDay === "Snack") {
        dayPlan["Snack"].push({
          "id": meals[i]._id,
          "mealName": meals[i].mealName,
          "notes": meals[i].notes,
          "categories": meals[i].categories
        });
        updateCategoryCounts(meals[i].categories);

      } else if (meals[i].timeOfDay === "Beverage") {
        dayPlan["Beverage"].push({
          "id": meals[i]._id,
          "mealName": meals[i].mealName,
          "notes": meals[i].notes,
          "categories": meals[i].categories
        });
        updateCategoryCounts(meals[i].categories);

      }
    }

    dayPlan = Object.assign({}, dayPlan, {'categoryTotal': categoryTotal}, {'dayIs': day});

    res.render('display-day', dayPlan);
  })
});

module.exports = router;
