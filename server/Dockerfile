FROM python:3.8.16-alpine3.17

RUN adduser -D temp
USER temp

ENV PATH="/home/temp/.local/bin:${PATH}"

WORKDIR /app

COPY requirements.txt /app

RUN pip install -r requirements.txt --disable-pip-version-check

COPY . /app