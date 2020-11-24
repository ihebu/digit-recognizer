const button = document.querySelector("button");

const label = document.querySelector(".label");
const confidence = document.querySelector(".confidence");

const canvas = document.querySelector("canvas");
const ctx = canvas.getContext('2d');

size = 300;

canvas.width = size;
canvas.height = size;

// drawing style
ctx.lineWidth = 20;
ctx.lineCap = "round";
ctx.strokeStyle = "black";
ctx.fillStyle = "white";

// the current position of the mouse cursor
let cur = { x: 0, y: 0 };

// the previous position of the mouse cursor
let prev = { x: 0, y: 0 };

// this turns on / off drawing on canvas 
let paint;

// fill the canvas with white
clear = () => { ctx.fillRect(0, 0, size, size); }

// clear the drawing canvas and output
reset = () => {
    clear(ctx);
    label.innerText = "";
    confidence.innerText = "";
}

// make sure to reset before starting
reset();

// update the current and previous positons of the mouse cursor
update = (x, y) => {
    prev.x = cur.x;
    prev.y = cur.y;
    cur.x = x;
    cur.y = y;
}

// draw stroke lines on the canvas
draw = (event) => {
    let rect = event.target.getBoundingClientRect();
    let x = event.clientX - rect.left;
    let y = event.clientY - rect.top;
    // get current x and y
    update(x, y);
    if (!paint) return;
    ctx.beginPath();
    ctx.moveTo(prev.x, prev.y);
    ctx.lineTo(cur.x, cur.y);
    ctx.stroke();
}

predict = () => {

    // stop painting on the canvas
    paint = false;

    // get the image from the canvas
    const data = { image: canvas.toDataURL() };

    // send post request to server
    fetch("predict", {
        method: "POST",
        mode: "cors",
        body: JSON.stringify(data)
    })
        .then(res => res.json())
        .then(data => {
            label.innerText = data.label;
            confidence.innerText = `confidence : ${data.confidence}`;
        });
}

button.addEventListener("click", reset);

canvas.addEventListener("mousemove", draw);
canvas.addEventListener("mousedown", () => { paint = true; });
canvas.addEventListener("mouseup", predict);

