FROM python:3.10-slim

WORKDIR /app
COPY ia_backend/requirements_render.txt .
RUN pip install --no-cache-dir -r requirements_render.txt
COPY ia_backend/app.py .
COPY latest_model.pkl . 
CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "10000"]