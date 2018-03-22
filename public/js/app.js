
function handleDeleteFileClick(id, day) {
  if (confirm("Are you sure?")) {
    deleteFile(id, day);
  }
}

function handleDeleteMealClickWeek(id) {
  if (confirm("Are you sure?")) {
    deleteMealWeek(id);
  }
}

function deleteFile(id, day) {
  $.ajax({
    type: 'DELETE',
    url: '/meal/delete/' + id,
    dataType: 'json',
    contentType : 'application/json',
  })
    .done(function(response) {
      console.log("Meal", id, "is deleted.");
      $("#dayOfWeek").text(day);
      $("#tableData").load('/' + day);
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
      $("#tableDataWeek").load('/');
    })
    .fail(function(error) {
      console.log("Failed to delete", error);
    })
}
