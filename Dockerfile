# Start with the base image
FROM python:3.11-slim

# Set the working directory inside the container
WORKDIR /app

# Install openssl
RUN apt-get update && apt-get install -y openssl

# Create the SSL certificates inside /app/ssl directory
RUN mkdir -p /app/ssl && \
    openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
    -keyout /app/ssl/localhost.key \
    -out /app/ssl/localhost.crt \
    -subj "/C=US/ST=State/L=City/O=Organization/CN=localhost" && \
    ls -l /app/ssl  # List contents of /app/ssl to confirm certificates are generated

# Install dependencies for the Django app
COPY requirements.txt .
RUN pip install -r requirements.txt

# Copy the application files
COPY . /app

# Expose the port for Gunicorn
EXPOSE 8000

# Set the command to run the Django app with Gunicorn
CMD ["gunicorn", "fixitdesk.wsgi:application", "--bind", "0.0.0.0:8000", "--certfile", "/app/ssl/localhost.crt", "--keyfile", "/app/ssl/localhost.key"]
