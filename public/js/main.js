let numberInput = $("#number");
let textInput = $("#msg");
let scheduleSelect = $("#schedule");
let button = $("#button");
let response = $(".response");

button.click(function (e) {
  e.preventDefault();
  const number = numberInput.val().replace(/^\D+/g, "");
  const text = textInput.val();

  fetch("/", {
    method: "post",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify({ number: number, text: text }),
  })
    .then(function (res) {
      console.log(res);
    })
    .catch(function (err) {
      console.log(err);
    });
});

const socket = io();
socket.on("smsStatus", function (data) {
  response.html("<h5> Text message sent to " + data.number + "</h5>");
});
