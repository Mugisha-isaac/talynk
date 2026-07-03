FROM python:3.11-slim

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /code

RUN apt-get update && apt-get install -y --no-install-recommends  \
    curl \
    libgomp1 \
    && rm -rf /var/lib/apt/lists/*

COPY ./requirements.txt /code/requirements.txt

# torch's CPU-only wheels must be installed as their own command with
# --index-url as a real CLI flag — putting --index-url inline after the
# package name inside requirements.txt is not valid pip syntax and silently
# falls back to the default index, pulling the full GPU/CUDA build (several
# GB of unused nvidia-* packages) instead.
RUN pip install --no-cache-dir \
    torch>=2.5.1 torchvision>=0.20.1 torchaudio>=2.5.1 \
    --index-url https://download.pytorch.org/whl/cpu

RUN pip install --no-cache-dir --upgrade -r /code/requirements.txt

COPY ./app /code/app
COPY ./init.sql /code/init.sql

EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]