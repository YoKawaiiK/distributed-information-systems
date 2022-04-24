
const socket = io();
let click = false;
let moving_mouse = false;
let x_position = 0;
let y_position = 0;
let previous_position = null;
let color = "#000000";

const colorPicker = document.querySelector("#colorPicker");
const btnDelete = document.querySelector("#btnDelete");
const users = document.getElementById("users");
const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");
const width = window.innerWidth;
const height = window.innerHeight;
canvas.width = width;
canvas.height = height;
colorPicker.addEventListener("input", colorPickerHandler, false);
colorPicker.addEventListener("change", colorPickerHandler, false);
btnDelete.addEventListener("click", deleteAll, false);

// Update color for everyone
function colorPickerHandler(event) {
  changeColorGlobal(event.target.value);
}

// set color on client in browser
function setColorOnClient(c) {
  color = c;
  context.strokeStyle = color;
  context.stroke();
  colorPicker.value = color;
}

// drawing
canvas.addEventListener("mousedown", () => {
  click = true;
});
canvas.addEventListener("mouseup", () => {
  click = false;
});
canvas.addEventListener("mousemove", (e) => {
  x_position = e.clientX;
  y_position = e.clientY;
  moving_mouse = true;
});


// handler for updating color for everyone
function changeColorGlobal(c) {
  setColorOnClient(c);
  socket.emit("everyone/server/set-color", { color: color });
}

// clear canvas for everyone
function deleteAll() {
  socket.emit("everyone/server/delete");
}

// drawing and update data for everyone user
function createDrawing() {
  if (click && moving_mouse && previous_position != null) {
    let drawing = {
      x_position: x_position,
      y_position: y_position,
      color: color,
      previous_position: previous_position,
    };
    socket.emit("everyone/server/drawing", drawing);
  }
  previous_position = { x_position: x_position, y_position: y_position };
  setTimeout(createDrawing, 25);
}

// set color handler for some user will change color
socket.on("everyone/client/set-color", (data) => {
  setColorOnClient(data.color);
});

// some user drawing
socket.on("everyone/client/show-drawing", (drawing) => {
  if (drawing != null) {
    context.beginPath();
    context.lineWidth = 3;
    context.strokeStyle = drawing.color;
    context.moveTo(drawing.x_position, drawing.y_position);
    context.lineTo(
      drawing.previous_position.x_position,
      drawing.previous_position.y_position
    );
    context.stroke();
  } else {
    context.clearRect(0, 0, canvas.width, canvas.height);
  }
});

// update user counter
socket.on("everyone/client/users", (number) => {
  users.innerHTML = number;
});

createDrawing();
