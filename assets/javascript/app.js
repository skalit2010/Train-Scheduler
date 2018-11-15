 // Initialize Firebase
  var config = {
    apiKey: "AIzaSyDKxHWpmHIJYxZdq5Pt7RluygiQa0nwDqA",
    authDomain: "train-scheduler-15d0d.firebaseapp.com",
    databaseURL: "https://train-scheduler-15d0d.firebaseio.com",
    projectId: "train-scheduler-15d0d",
    storageBucket: "train-scheduler-15d0d.appspot.com",
    messagingSenderId: "43518062779"
  };
  firebase.initializeApp(config);

var database = firebase.database();

// display current time
var currentTime = null;

function updateTime() {
	currentTime = moment().format("HH:mm:ss");
	$("#currentTime").html(currentTime);
}

$(document).ready(function() {
	updateTime();
	setInterval(updateTime, 1000);
});

// button for adding trains
$("#add-train-btn").on("click", function(event) {
	event.preventDefault();

	// grabs user input
	var trainName = $("#train-name-input").val().trim();
	var trainDestination = $("#destination-input").val().trim();
	var trainTime = $("#train-time-input").val().trim();
	var trainFrequency = parseInt($("#frequency-input").val().trim());

	// local temporary object for storing train data
	var newTrain = {
		name: trainName,
		destination: trainDestination,
		time: trainTime,
		frequency: trainFrequency
	};

	// uploads the train data to the firebase database
	database.ref().push(newTrain);

	console.log(newTrain.name);
	console.log(newTrain.destination);
	console.log(newTrain.time);
	console.log(newTrain.frequency);

	alert("Train successfully added!");

	// clears all of the text boxes
	$("#train-name-input").val("");
	$("#destination-input").val("");
	$("#train-time-input").val("");
	$("#frequency-input").val("");

	// prevents loading a new page
	return false;
});

// creates firebase event for adding train to database and adds a row to the html
database.ref().on("child_added", function(childSnapshot) {
	console.log(childSnapshot.val());

	var trainName = childSnapshot.val().name;
	var trainDestination = childSnapshot.val().destination;
	var trainTime = childSnapshot.val().time;
	var trainFrequency = childSnapshot.val().frequency;

	console.log(trainName);
	console.log(trainDestination);
	console.log(trainTime);
	console.log(trainFrequency);

	// converts the train time
	var timeConverted = moment(trainTime, "HH:mm");
	console.log("Time converted: " + timeConverted);

	// calculate the difference between first train time and now
	var timeDiff = moment().diff(moment(timeConverted), "minutes");
	console.log("Difference in time: " + timeDiff);

	// calculate minutes until next train 
	var remainder = timeDiff % trainFrequency;
	console.log("Remainder: " + remainder);
	var minutesAway = trainFrequency - remainder;
	console.log("Minutes away: " + minutesAway);

	// calculate next train
	var nextTrain = moment().add(minutesAway, "minutes");

	// arrival time
	var nextArrival = moment(nextTrain).format("HH:mm");
	console.log("Next arrival: " + nextArrival);

	// add each train's data into the table
	$("#new-train").append("<tr><td>" + trainName + "</td><td>" + trainDestination + "</td><td>" + "Every " + trainFrequency + " min" + "</td><td>" + nextArrival + "</td><td>" + minutesAway + " min" + "</td></tr>");
}, function(errorObject) {
	console.log("Errors handled: " + errorObject.code);
});

// updates the schedule every minute (i didn't have time to figure out how to do this without a simple page reload because i also want to spend time on project #1)
setInterval(function() {
	location.reload(true);
}, 60000);
