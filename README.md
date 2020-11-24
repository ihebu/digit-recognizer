# Handwritten digits recognition

This a **Flask** web app to predict handwritten digits using a deep convolutional neural network built with **Keras** and trained on the **MNIST** dataset.

Live demo : https://handwritten-digits.herokuapp.com/

![demo gif](assets/demo.gif)



### Train the model

To re-train a different model or see the existing model, check the [training notebook](training.ipynb)

### Test the app locally

```
cd app/

pip install -r requirements.txt

python app.py
```

### Deploy the app to heroku

First of all make sure you have a heroku account and heroku CLI installed

Then just use the following commands from the root of the repository

```
heroku login

heroku create <your-app-name-here>

git subtree push --prefix app/ heroku master
```

And That's pretty much it ! Our app is now running on the cloud and available for anyone to check

For more additional information about deploying apps to heroku, you can check their [guide](https://devcenter.heroku.com/articles/getting-started-with-python)