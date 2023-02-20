FROM python:3.8.16-alpine3.17

RUN adduser -D temp
USER temp

WORKDIR /app

COPY requirements.txt /app

RUN pip install -r requirements.txt --no-warn-script-location --disable-pip-version-check

COPY . /app

EXPOSE 8080

CMD ["python3", "app.py"]