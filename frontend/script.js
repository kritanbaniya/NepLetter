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
}

// Convert Canvas to Image & Send to Backend
function predictLetter() {
    let image = canvas.toDataURL("image/png"); // Convert drawing to image
    fetch("http://127.0.0.1:8000/predict", { // Send image to FastAPI backend
        method: "POST",
        body: dataURItoBlob(image),
        headers: { "Content-Type": "application/octet-stream" }
    })
    .then(response => response.json()) // Get the prediction
    .then(data => {
        document.getElementById("result").innerText = "Prediction: " + data.prediction;
    })
    .catch(error => console.error("Error:", error));
}

// Convert Base64 image to Blob (needed for FastAPI)
function dataURItoBlob(dataURI) {
    let byteString = atob(dataURI.split(",")[1]);
    let arrayBuffer = new ArrayBuffer(byteString.length);
    let uint8Array = new Uint8Array(arrayBuffer);
    for (let i = 0; i < byteString.length; i++) {
        uint8Array[i] = dataURI.charCodeAt(i);
    }
    return new Blob([uint8Array], { type: "image/png" });
}
