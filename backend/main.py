from fastapi import FastAPI
from pydantic import BaseModel
from PIL import Image
import io
import numpy as np
import tensorflow as tf

# Initialize FastAPI app
app = FastAPI()

@app.get("/")
def read_root():
    return {"message": "Hello, World! testing"}

# # Load your trained TensorFlow model (replace with actual model path)
# model = tf.keras.models.load_model('path_to_your_model.h5')  # Update this path

# # Pydantic model to handle incoming image data
# class ImageData(BaseModel):
#     image: bytes

# # Route to handle predictions
# @app.post("/predict")
# async def predict(data: ImageData):
#     try:
#         # Convert the incoming bytes into an image
#         image = Image.open(io.BytesIO(data.image))
        
#         # Pre-process the image (resize, normalize, etc.)
#         image = image.convert('L')  # Convert to grayscale
#         image = image.resize((28, 28))  # Resize to the size expected by the model
#         image = np.array(image) / 255.0  # Normalize the pixel values
#         image = np.expand_dims(image, axis=-1)  # Add the channel dimension if needed
#         image = np.expand_dims(image, axis=0)  # Add the batch dimension

#         # Get model prediction
#         prediction = model.predict(image)
#         predicted_class = np.argmax(prediction, axis=1)[0]

#         return {"prediction": predicted_class}
    
#     except Exception as e:
#         return {"error": str(e)}
