
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

function getTheDay(day) {
  console.log("I got the day ", day);
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


// how to refresh the data in the Pug template after deleting?

// function getFiles(day) {
//   return $.ajax('/' + day)
//     .then(res => {
//       console.log("Results from getFiles() for " + day, res);
//       return res;
//     })
//     .fail(err => {
//       console.error("Error in getFiles() for " + day, err);
//       throw err;
//     });
// }
//
// function refreshFileList() {
//   const template = $('#list-template').html();
//   console.log(template);
//   const compiledTemplate = pug.compileFile('display-day.pug');
//
//   getFiles()
//     .then(files => {
//
//       window.fileList = files;
//
//       const data = {files: files};
//       const html = compiledTemplate(data);
//       $('#list-container').html(html);
//     })
// }
//
// refreshFileList();
