const canvas = document.getElementById("drawingCanvas");
const ctx = canvas.getContext("2d"); // ctx is the context used to draw on the canvas (2D drawing).
let drawing = false;

// Initialize canvas settings
ctx.fillStyle = "black"; // Set background color to white
ctx.fillRect(0, 0, canvas.width, canvas.height); // Fill entire canvas with white
ctx.lineWidth = 20; // Set pen thickness to 10 pixels
ctx.lineCap = "square"; // Makes strokes rounded for smoother drawing
ctx.strokeStyle = "white"; // Set pen color to black

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

   // Convert canvas to Blob
    tempCanvas.toBlob(async (blob) => {
    const formData = new FormData();
    formData.append("file", blob, "canvas_image.png");

    try {
        const response = await fetch("http://127.0.0.1:8000/predict/", {
            method: "POST",
            body: formData,
        });

        const result = await response.json();
        document.getElementById("result").innerText = "Prediction: " + result.predicted_class;
        console.log("Server response:", result);
    } catch (error) {
        console.error("Upload failed:", error);
    }
}, "image/png");
}