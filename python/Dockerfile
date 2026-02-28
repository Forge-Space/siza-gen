FROM python:3.12-slim AS builder

WORKDIR /app

COPY pyproject.toml .
RUN pip install --no-cache-dir --target=/deps .

FROM python:3.12-slim

WORKDIR /app

COPY --from=builder /deps /usr/local/lib/python3.12/site-packages
COPY siza_ml/ siza_ml/

ENV PYTHONUNBUFFERED=1
ENV SIZA_ML_HOST=0.0.0.0
ENV SIZA_ML_PORT=8100

EXPOSE 8100

HEALTHCHECK --interval=30s --timeout=5s --start-period=60s --retries=3 \
    CMD python -c "import urllib.request; urllib.request.urlopen('http://localhost:8100/health')" || exit 1

CMD ["python", "-m", "uvicorn", "siza_ml.app:app", "--host", "0.0.0.0", "--port", "8100"]
