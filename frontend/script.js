const canvas = document.getElementById("drawingCanvas");
const ctx = canvas.getContext("2d"); // ctx is the context used to draw on the canvas (2D drawing).
let drawing = false;
// Initialize canvas settings
ctx.fillStyle = "black"; // Set background color to black
ctx.fillRect(0, 0, canvas.width, canvas.height); // Fill entire canvas with white
ctx.lineWidth = 20; // Set pen thickness to 10 pixels
ctx.lineCap = "round"; // Makes strokes rounded for smoother drawing
ctx.strokeStyle = "white"; // Set pen color to white

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
    renderTable()
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
        renderTable(result)
        console.log("Server response:", result);
    } catch (error) {
        console.error("Upload failed:", error);
    }
}, "image/png");
}




// Sample dictionary
const sampleData = {
    'predicted_class': ' ',
    '0': [0.0, '०'], '1': [0.0, '१'], '10': [0.0, 'क'], '11': [0.0, 'ख'],
    '12': [0.0, 'ग'], '13': [0.0, 'घ'], '14': [0.0, 'ङ'], '15': [0.0, 'च'],
    '16': [0.0, 'छ'], '17': [0.0, 'ज'], '18': [0.0, 'झ'],
    '19': [0.0, 'ञ'], '2': [0.0, '२'], '20': [0.0, 'ट'], '21': [0.0, 'ठ'], '22': [0.0, 'ड'],
    '23': [0.0, 'ढ'], '24': [0.0, 'ण'], '25': [0.0, 'त'], '26': [0.0, 'थ'],
    '27': [0.0, 'द'], '28': [0.0, 'ध'], '29': [0.0, 'न'], '3': [0.0, '३'],
    '30': [0.0, 'प'], '31': [0.0, 'फ'], '32': [0.0, 'ब'], '33': [0.0, 'भ'],
    '34': [0.0, 'म'], '35': [0.0, 'य'], '36': [0.0, 'र'], '37': [0.0, 'ल'], '38': [0.0, 'व'],
    '39': [0.0, 'श'], '4': [0.0, '४'], '40': [0.0, 'ष'], '41': [0.0, 'स'], '42': [0.0, 'ह'],
    '43': [0.0, 'क्ष'], '44': [0.0, 'त्र'], '45': [0.0, 'ज्ञ'], '5': [0.0, '५'], '6': [0.0, '६'],
    '7': [0.0, '७'], '8': [0.0, '८'], '9': [0.0, '९']
};

function renderTable(data = sampleData) {
    // Convert to array, sorting by index
    const entries = Object.entries(data)
        .filter(([key]) => key !== 'predicted_class')
        .map(([key, value]) => ({ index: parseInt(key), probability: value[0] * 100, class: value[1] }))
        .sort((a, b) => a.index - b.index);

    // Find the max probability for scaling
    const maxProbability = Math.max(...entries.map(e => e.probability));

    // Populate table
    const tbody = document.getElementById("table-body");
    tbody.innerHTML = ""; // Clear existing rows before adding new ones

    entries.forEach(entry => {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${entry.index}</td>
            <td>${entry.class}</td>
            <td>${entry.probability.toFixed(3)}%</td>
            <td>
                <div class="bar-container">
                    <div class="bar" style="width: ${entry.probability / maxProbability * 100}%">
                        ${entry.probability > 1 ? entry.probability.toFixed(2) + "%" : ""}
                    </div>
                </div>
            </td>
        `;

        tbody.appendChild(row);
    });
}


renderTable()