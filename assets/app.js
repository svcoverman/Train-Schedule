var trainName = "";
var trainDestination = "";
var trainTime = "";
var trainFrequency = "";
var nextArrival = "";
var minutesAway = "";

// jQuery global variables
var Train = $("#train-name");
var TrainDestination = $("#train-destination");
// form validation for Time using jQuery Mask plugin
var TrainTime = $("#train-time").mask("00:00");
var TimeFreq = $("#time-freq").mask("00");


// Initialize Firebase
let config = {
    apiKey: "AIzaSyCL3A1A1tf-KmqQPPwJFuMpOvNlkFykIJA",
    authDomain: "train-scheduler-287d7.firebaseapp.com",
    databaseURL: "https://train-scheduler-287d7.firebaseio.com",
    projectId: "train-scheduler-287d7",
    storageBucket: "train-scheduler-287d7.appspot.com",
    messagingSenderId: "578654115037",
    appId: "1:578654115037:web:4efe0d00011758cc70b734",
    measurementId: "G-BYHEJLFJRZ"
  };

  firebase.initializeApp(config);
  console.log(config)

// Assign the reference to the database to a variable named 'database'
let database = firebase.database();

database.ref("/trains").on("child_added", function(snapshot) {

    //  create local variables to store the data from firebase
    var trainDiff = 0;
    var trainRemainder = 0;
    var minutesTillArrival = "";
    var nextTrainTime = "";
    var frequency = snapshot.val().frequency;

    trainDiff = moment().diff(moment.unix(snapshot.val().time), "minutes");
    trainRemainder = trainDiff % frequency;

    minutesTillArrival = frequency - trainRemainder;
    nextTrainTime = moment().add(minutesTillArrival, "m").format("hh:mm A");

    $("#table-data").append(
        "<tr><td>" + snapshot.val().name + "</td>" +
        "<td>" + snapshot.val().destination + "</td>" +
        "<td>" + frequency + "</td>" +
        "<td>" + minutesTillArrival + "</td>" +
        "<td>" + nextTrainTime + "  " + "<a><span class='glyphicon glyphicon-remove icon-hidden' aria-hidden='true'></span></a>" + "</td></tr>"
    );

    $("span").hide();
});

let storeInputs = function(event) {
    // prevent
    event.preventDefault();

    trainName = Train.val().trim();
    trainDestination = TrainDestination.val().trim();
    trainTime = moment(TrainTime.val().trim(), "HH:mm").subtract(1, "years").format("X");
    trainFrequency = TimeFreq.val().trim();

    // add more firebase databse
    database.ref("/trains").push({
        name: trainName,
        destination: trainDestination,
        time: trainTime,
        frequency: trainFrequency,
        nextArrival: nextArrival,
        minutesAway: minutesAway,
        date_added: firebase.database.ServerValue.TIMESTAMP
    });
    alert("Train added!");

    //  empty form
    Train.val("");
    TrainDestination.val("");
    TrainTime.val("");
    TimeFreq.val("");
};

// Calls storeInputs function if submit button clicked
$("#btn-add").on("click", function(event) {
    // form validation - if empty - alert
    if (Train.val().length === 0 || TrainDestination.val().length === 0 || TrainTime.val().length === 0 || TimeFreq === 0) {
        alert("Please Fill All Required Fields");
    } else {
        // if form is filled out, run function
        storeInputs(event);
    }
});

// Calls storeInputs function if enter key is clicked
$('form').on("keypress", function(event) {
    if (event.which === 13) {
        // form validation - if empty - alert
        if (Train.val().length === 0 || TrainDestination.val().length === 0 || TrainTime.val().length === 0 || TimeFreq === 0) {
            alert("Please Fill All Required Fields");
        } else {
            // if form is filled out, run function
            storeInputs(event);
        }
    }
});