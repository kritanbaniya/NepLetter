### to get backend running
#### --- cd /Users/kritan/Desktop/NepLetter/backend
###venv---- source tf_venv/bin/activate
###api----- uvicorn main:app --reload
###  --- http://127.0.0.1:8000/docs


from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from PIL import Image
import io
import numpy as np
import tensorflow as tf

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

@app.get("/")
def read_root():
    return {"message": "Hello, World! testing"}



# Define request model
class NameRequest(BaseModel):
    name: str  # Enforce "name" must be a string

@app.post("/predict")
async def predict_letter(request: NameRequest):
    return {"message": f"Hello {request.name}"}