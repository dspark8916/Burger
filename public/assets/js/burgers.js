// Make sure we wait to attach our handlers until the DOM is fully loaded.
$(function() {
  $.ajax("/burgers", {
    type: "GET"
  }).then(function(data) {
    console.log(data);

    var devouredElem = $("#devouredBurgers");
    var notdevouredElem = $("#notDevouredBurgers");

    var burgers = data.burgers;

    for (var i = 0; i < burgers.length; i++) {
      var new_elem =
        "<li class='bg-dark' style='font-size: 25px;'>" +
        burgers[i].burger_name + " " +
        "<button class='change-devour btn btn-success' data-id='" +
        burgers[i].id +
        "' data-newdevour='" +
        !burgers[i].devoured +
        "'>";

      if (burgers[i].devoured) {
        new_elem += "Munching Time!";
      } else {
        new_elem += "Have Another!";
      }

      new_elem += "</button> ";

      new_elem +=
        "<button class='delete-burger btn btn-danger' data-id='" +
        burgers[i].id +
        "'>DELETE! </button></li>";

      if (burgers[i].devoured) {
        devouredElem.append(new_elem);
      } else {
        notdevouredElem.append(new_elem);
      }
    }
  });

  $(document).on("click", ".change-devour", function(event) {
    var id = $(this).data("id");
    var newDevour = $(this).data("newdevour")===true;

    var newDevourState = {
      devoured: newDevour,
    };

    // Send the PUT request.
    $.ajax("/burgers/" + id, {
      type: "PUT",
      data: JSON.stringify(newDevourState),
      dataType:'json',
      contentType: 'application/json'
    }).then(function() {
      console.log("changed devour to", newDevour);
      // Reload the page to get the updated list
      location.reload();
    });
  });

  $(".create-form").on("submit", function(event) {
    // Make sure to preventDefault on a submit event.
    event.preventDefault();

    var newBurger = {
      burger_name: $("#burger_name").val().trim(),
      devoured: $("[name=devoured]:checked").val().trim()
    };

    // Send the POST request.
    $.ajax("/burgers", {
      type: "POST",
      data: JSON.stringify(newBurger),
      dataType:'json',
      contentType: 'application/json'
    }).then(function() {
      console.log("created new burger");
      // Reload the page to get the updated list
      location.reload();
    });
  });

  $(document).on("click", ".delete-burger", function(event) {
    var id = $(this).data("id");

    // Send the DELETE request.
    $.ajax("/burgers/" + id, {
      type: "DELETE"
    }).then(function() {
      console.log("deleted burger", id);
      // Reload the page to get the updated list
      location.reload();
    });
  });
});
