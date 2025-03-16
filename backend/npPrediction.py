from pydantic import BaseModel
from PIL import Image
import io
import numpy as np
import pandas as pd
import tensorflow as tf

df = pd.read_csv('labels.csv')

# Load the trained model
model = tf.keras.models.load_model("devanagari_model2.keras")

predictionMap = {
    '0': 0, '1': 1, '10': 2, '11': 3, '12': 4, '13': 5, '14': 6, '15': 7, '16': 8, '17': 9, '18': 10, '19': 11,
    '2': 12, '20': 13, '21': 14, '22': 15, '23': 16, '24': 17, '25': 18, '26': 19, '27': 20, '28': 21, '29': 22,
    '3': 23, '30': 24, '31': 25, '32': 26, '33': 27, '34': 28, '35': 29, '36': 30, '37': 31, '38': 32, '39': 33,
    '4': 34, '40': 35, '41': 36, '42': 37, '43': 38, '44': 39, '45': 40, '5': 41, '6': 42, '7': 43, '8': 44, '9': 45
}  ## model returns the % by index of the class, the class was ordered as such above. the dict is {class: index}, model returns the index, we need to return the class

class_labels = {v: int(k) for k, v in predictionMap.items()}  ## flipping the key and value because of the way the model formated the output, this way we can quicky return class given index

# Image preprocessing function
def preprocess_image(image: Image.Image):
    img = image.convert("L")  # Convert to grayscale
    #img = img.resize((32, 32))  # Resize to 32x32
    img = np.array(img) / 255.0  # Normalize
    img = np.expand_dims(img, axis=0)  # Add batch dimension
    img = np.expand_dims(img, axis=-1)  # Add channel dimension (grayscale)
    return img


def nepPrediction (image):
    
    processed_image = preprocess_image(image)  ## process the image so it is in a format that the model needs it to be in
    prediction = model.predict(processed_image) ## getting prediction from the model
    predicted_class_idx = int(np.argmax(prediction))  # get the index of the prediction with highest %
    prediction_class = df.loc[class_labels[predicted_class_idx],"Devanagari label"] # find the letter from the df
    # print("prediction_class_idx: ", predicted_class_idx, " prediction_clss: ", prediction_class, " class label: ", class_labels[predicted_class_idx])
    prediction_dict = {"predicted_class": prediction_class}  ## creating a dictionary mapping the % of every letter that the model returend
    for i in range(len(prediction[0])):  ## key: [% , class],, key has to be string for json,,, key reflects cass on labels.csv/pd dataframe
        prediction_dict[str(class_labels[i])] = [float(prediction[0][i]), df.loc[class_labels[i], "Devanagari label"]]
    # print("dictionary: ")
    # for k , l in prediction_dict.items():
    #     print("key: ", k, " value: ", l)        
    # print(type(prediction[0][i]))
    return prediction_dict
    