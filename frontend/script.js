const canvas = document.getElementById("drawingCanvas");
const ctx = canvas.getContext("2d"); // ctx is the context used to draw on the canvas (2D drawing).
let drawing = false;

// Initialize canvas settings
ctx.fillStyle = "white"; // Set background color to white
ctx.fillRect(0, 0, canvas.width, canvas.height); // Fill entire canvas with white
ctx.lineWidth = 10; // Set pen thickness to 10 pixels
ctx.lineCap = "round"; // Makes strokes rounded for smoother drawing
ctx.strokeStyle = "black"; // Set pen color to black

// Mouse Events
canvas.addEventListener("mousedown", (e) => { drawing = true; draw(e); });
canvas.addEventListener("mousemove", (e) => { if (drawing) draw(e); });
canvas.addEventListener("mouseup", () => { drawing = false; ctx.beginPath(); });
//  The e is the event object passed by the browser when the event occurs.
//  (e) gives the function access to information about the event (like mouse position, which mouse button was pressed, etc.).

// Touch Events (for mobile)
canvas.addEventListener("touchstart", (e) => { drawing = true; draw(e.touches[0]); e.preventDefault(); });
canvas.addEventListener("touchmove", (e) => { if (drawing) draw(e.touches[0]); e.preventDefault(); });
canvas.addEventListener("touchend", () => { drawing = false; ctx.beginPath(); });

function draw(e) {
    let rect = canvas.getBoundingClientRect(); // Get canvas position
    let x = e.clientX - rect.left; // Get X-coordinate relative to canvas
    let y = e.clientY - rect.top; // Get Y-coordinate relative to canvas

    ctx.lineTo(x, y); // Draw line to (x, y)
    ctx.stroke(); // Apply stroke (make it visible)
    ctx.beginPath(); // Start a new path
    ctx.moveTo(x, y); // Move to the new position
}

// Clear Canvas
function clearCanvas() {
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    document.getElementById("result").innerText = "Prediction: ";
}

// Convert Canvas to Image & Send to Backend
function predictLetter() {


    let canvas = document.getElementById("drawingCanvas");

    // Create a temporary 32x32 canvas
    let tempCanvas = document.createElement("canvas");
    tempCanvas.width = 32;
    tempCanvas.height = 32;
    let tempCtx = tempCanvas.getContext("2d");

    // Resize the image to 32x32
    tempCtx.drawImage(canvas, 0, 0, 32, 32);

    // // commented out code: Open a new window and show the resized image (for testing)
    // let newWindow = window.open("", "_blank");
    // let img = new Image();
    // img.src = tempCanvas.toDataURL("image/png"); // Convert canvas to image
    // newWindow.document.write("<p>Resized Image (32x32):</p>");
    // newWindow.document.body.appendChild(img);

    fetch("http://127.0.0.1:8000/predict", {
        method: "POST",
        headers: {
            "Content-Type": "application/json" // Specify JSON format
        },
        body: JSON.stringify({ name: "Kritan" }) // Send { name: "Kritan" }
    })
    .then(response => response.json()) // Parse JSON response
    .then(data => {
        document.getElementById("result").innerText = data.message; // Display response
    })
    .catch(error => console.error("Error:", error));
}

