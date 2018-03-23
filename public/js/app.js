$('.carousel').carousel({
  interval: 1000
})

function handleDeleteMealClickDay(id, day) {
  if (confirm("Are you sure?")) {
    deleteMealDay(id, day);
  }
}

function handleDeleteMealClickWeek(id) {
  if (confirm("Are you sure?")) {
    deleteMealWeek(id);
  }
}

function deleteMealDay(id, day) {
  $.ajax({
    type: 'DELETE',
    url: '/meal/delete/' + id,
    dataType: 'json',
    contentType : 'application/json',
  })
    .done(function(response) {
      console.log("Meal", id, "is deleted.");
      $("#dayOfWeek").text(day);
      location.reload(true);
    })
    .fail(function(error) {
      console.log("Failed to delete", error);
    })
}

function deleteMealWeek(id) {
  $.ajax({
    type: 'DELETE',
    url: '/meal/delete/' + id,
    dataType: 'json',
    contentType : 'application/json',
  })
    .done(function(response) {
      console.log("Meal", id, "is deleted.");
      location.reload(true);
    })
    .fail(function(error) {
      console.log("Failed to delete", error);
    })
}
