FROM python:3.10
WORKDIR /teacher_webapp
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY teacher_webapp .
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]