# AI Service

FastAPI microservice for pothole detection using YOLOv8 and OpenCV.

## Setup

```bash
cd ai-service
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
uvicorn app:app --reload --port 8000
```

macOS:

```bash
cd ai-service
python3.11 -m venv .venv
source .venv/bin/activate
python -m pip install --upgrade pip
python -m pip install -r requirements.txt
python -m uvicorn app:app --reload --port 8000
```

If `python3.11` is missing:

```bash
brew install python@3.11
```

## Model

Place your trained YOLOv8 pothole model here:

```txt
ai-service/model/pothole_detector.pt
```

If the custom model is missing, the service still works using an OpenCV fallback detector so your demo does not break.