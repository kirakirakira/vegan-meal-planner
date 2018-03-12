function updateMeal(id) {
  console.log("I am printing ", id);

  const mealData = {
    timeOfDay: $('select[name=timeOfDay]').val(),
    mealName: $('input[name=mealName]').val(),
    notes: $('textarea[name=notes]').val(),
    // categories:
    // days:
  };

  let categories = $('input:checkbox[name="categories"]:checked').map(() => {
    return $(this).val();
  }).get();
  console.log(categories);

  // $.ajax({
  //   type: 'PUT',
  //   url: '/meal/' + id,
  //   data: JSON.stringify(mealData),
  //   dataType: 'json',
  //   contentType: 'application/json'
  // })
  //   .done(function(response) {
  //     console.log("We have posted the data");
  //   })
  //   .fail(function(error) {
  //     console.log("Failed to post");
  //   })

    console.log("Your meal data", mealData);
};
