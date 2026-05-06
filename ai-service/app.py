from pathlib import Path
from uuid import uuid4

import cv2
import numpy as np
from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles

try:
    from ultralytics import YOLO
except Exception:
    YOLO = None


BASE_DIR = Path(__file__).resolve().parent
UPLOAD_DIR = BASE_DIR / "uploads"
OUTPUT_DIR = BASE_DIR / "outputs"
MODEL_PATH = BASE_DIR / "model" / "pothole_detector.pt"

UPLOAD_DIR.mkdir(exist_ok=True)
OUTPUT_DIR.mkdir(exist_ok=True)

app = FastAPI(title="RoadIQ AI Service", version="1.0.0")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)
app.mount("/outputs", StaticFiles(directory=OUTPUT_DIR), name="outputs")

model = None
if YOLO and MODEL_PATH.exists():
    model = YOLO(str(MODEL_PATH))


@app.get("/health")
def health():
    return {
        "ok": True,
        "modelLoaded": model is not None,
        "modelPath": str(MODEL_PATH),
    }


@app.post("/detect")
async def detect(image: UploadFile = File(...)):
    suffix = Path(image.filename or "road.jpg").suffix or ".jpg"
    image_name = f"{uuid4()}{suffix}"
    image_path = UPLOAD_DIR / image_name
    image_path.write_bytes(await image.read())

    frame = cv2.imread(str(image_path))
    if frame is None:
        return JSONResponse(status_code=400, content={"message": "Invalid image file"})

    if model is not None:
        result = detect_with_yolo(frame)
    else:
        result = detect_with_opencv(frame)

    output_name = f"annotated-{image_name}"
    output_path = OUTPUT_DIR / output_name
    cv2.imwrite(str(output_path), result["annotated"])

    return {
        "detected": result["potholeCount"] > 0,
        "confidence": round(float(result["confidence"]), 3),
        "potholeCount": int(result["potholeCount"]),
        "annotatedImageUrl": f"/outputs/{output_name}",
        "source": result["source"],
        "model": "YOLOv8 + OpenCV",
    }


def detect_with_yolo(frame):
    results = model.predict(frame, conf=0.25, verbose=False)
    annotated = frame.copy()
    pothole_count = 0
    confidences = []

    for result in results:
        names = result.names
        for box in result.boxes:
            class_id = int(box.cls[0])
            label = names.get(class_id, "").lower()
            confidence = float(box.conf[0])

            if "pothole" not in label and "hole" not in label and "damage" not in label:
                continue

            x1, y1, x2, y2 = map(int, box.xyxy[0])
            pothole_count += 1
            confidences.append(confidence)
            cv2.rectangle(annotated, (x1, y1), (x2, y2), (0, 80, 255), 3)
            cv2.putText(
                annotated,
                f"pothole {confidence:.2f}",
                (x1, max(28, y1 - 8)),
                cv2.FONT_HERSHEY_SIMPLEX,
                0.75,
                (0, 80, 255),
                2,
            )

    if pothole_count == 0:
        fallback = detect_with_opencv(frame)
        fallback["source"] = "opencv-fallback-after-yolo"
        return fallback

    return {
        "annotated": annotated,
        "potholeCount": pothole_count,
        "confidence": max(confidences) if confidences else 0,
        "source": "yolov8",
    }


def detect_with_opencv(frame):
    resized = resize_for_detection(frame)
    gray = cv2.cvtColor(resized, cv2.COLOR_BGR2GRAY)
    blur = cv2.GaussianBlur(gray, (7, 7), 0)

    # Potholes are usually dark irregular regions on road surfaces.
    threshold = cv2.adaptiveThreshold(
        blur,
        255,
        cv2.ADAPTIVE_THRESH_GAUSSIAN_C,
        cv2.THRESH_BINARY_INV,
        41,
        8,
    )
    kernel = np.ones((5, 5), np.uint8)
    cleaned = cv2.morphologyEx(threshold, cv2.MORPH_OPEN, kernel)
    cleaned = cv2.morphologyEx(cleaned, cv2.MORPH_CLOSE, kernel)
    contours, _ = cv2.findContours(cleaned, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

    annotated = resized.copy()
    candidates = []
    image_area = resized.shape[0] * resized.shape[1]

    for contour in contours:
        area = cv2.contourArea(contour)
        if area < image_area * 0.003 or area > image_area * 0.22:
            continue

        x, y, w, h = cv2.boundingRect(contour)
        aspect_ratio = w / max(h, 1)
        if aspect_ratio < 0.35 or aspect_ratio > 3.8:
            continue

        perimeter = cv2.arcLength(contour, True)
        circularity = 4 * np.pi * area / max(perimeter * perimeter, 1)
        if circularity > 0.82:
            continue

        candidates.append((x, y, w, h, area))

    candidates = sorted(candidates, key=lambda item: item[4], reverse=True)[:4]
    for x, y, w, h, _area in candidates:
        cv2.rectangle(annotated, (x, y), (x + w, y + h), (0, 80, 255), 3)
        cv2.putText(
            annotated,
            "possible pothole",
            (x, max(28, y - 8)),
            cv2.FONT_HERSHEY_SIMPLEX,
            0.7,
            (0, 80, 255),
            2,
        )

    confidence = min(0.88, 0.42 + len(candidates) * 0.14) if candidates else 0.18
    return {
        "annotated": annotated,
        "potholeCount": len(candidates),
        "confidence": confidence,
        "source": "opencv-fallback",
    }


def resize_for_detection(frame):
    height, width = frame.shape[:2]
    max_width = 1100
    if width <= max_width:
        return frame

    scale = max_width / width
    return cv2.resize(frame, (max_width, int(height * scale)))
