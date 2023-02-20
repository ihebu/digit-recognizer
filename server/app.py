import base64
import io
import json
import os
import re

from flask import Flask, render_template, request
from PIL import Image
import requests
from werkzeug.middleware.proxy_fix import ProxyFix


MODEL_URL = os.getenv("MODEL_URL")

def parse_image(data):
    encoded_image = re.search(r"base64,(.*)", data["image"]).group(1)
    image_bytes = base64.b64decode(encoded_image)
    image = Image.open(io.BytesIO(image_bytes))

    return image

def transform_image(image):
    # convert image to gray scale 
    image = image.convert("L")
    image = image.resize((28, 28))

    result = []

    for i in range(28):
        row = []
        for j in range(28):
            pixel = image.getpixel((j, i))
            # invert the color and normalize the values to be between 0 and 1
            pixel = (255 - pixel) / 255
            row.append([pixel])
        
        result.append(row)

    return result

def get_prediction(image):
    # this is the data format the tensorflow serving model expects
    data = json.dumps({"instances": [image]})
    response = requests.post(MODEL_URL, data=data)
    
    output = json.loads(response.text)
    # the output will contain one prediction list, since we have sent one image
    predictions = output["predictions"][0]
    
    return find_best_prediction(predictions)

def find_best_prediction(predictions):
    # find the label with maximum confidence
    label = predictions.index(max(predictions))
    # get the confidence level in the form of a percentage
    confidence = predictions[label]
    confidence = f"{confidence * 100:.2f} %"

    return (label, confidence)

app = Flask(__name__)

app.wsgi_app = ProxyFix(
    app.wsgi_app, x_for=1, x_proto=1, x_host=1, x_prefix=1
)

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/predict", methods=["POST"])
def predict():
    data = request.get_json(force=True)
    
    image = parse_image(data)

    # transform the image to match the data the model was trained on    
    image = transform_image(image)

    # send the image to the model to get the prediction
    label, confidence = get_prediction(image)

    return {"label": label, "confidence": confidence}


if __name__ == "__main__":
    app.run()