FROM python:3.10
WORKDIR /teacher_webapp
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY teacher_webapp .
RUN python manage.py collectstatic --no-input
RUN chown -R www-data:www-data static
VOLUME static
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]