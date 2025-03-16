### to get backend running
#### --- cd /Users/kritan/Desktop/NepLetter/backend
###venv---- source tf_venv/bin/activate
###api----- uvicorn main:app --reload
###  --- http://127.0.0.1:8000/docs


from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi import HTTPException
from pydantic import BaseModel
from PIL import Image
import io
import numpy as np
import tensorflow as tf
from npPrediction import nepPrediction

# Initialize FastAPI app
app = FastAPI()


# Enable CORS for frontend requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://127.0.0.1:5500"],  # Specific frontend
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods
    allow_headers=["*"],  # Allow all headers
)


@app.post("/predict/")
async def predict_image(file: UploadFile = File(...)):
    try:
        image = Image.open(io.BytesIO(await file.read()))
        predicted_class = nepPrediction(image)
        return JSONResponse(content={"predicted_class": predicted_class})
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))