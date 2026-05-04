#!/usr/bin/env python3
"""
Minimal Flask MJPEG streamer that runs the YOLOv8 detection loop in a background
thread and exposes a /video_feed endpoint usable as an <img src=> target.

Run in the dashboard host with:
    python track3.py

Requirements: flask, flask_cors, opencv-python, ultralytics

This file is standalone and does not modify your existing AI Model files.
"""
from flask import Flask, Response, jsonify
from flask_cors import CORS
import threading
import time
import cv2
import sys
import traceback

# Prefer user's existing GreenAI virtualenv site-packages if present
from pathlib import Path
VENV_SITE = Path(r"D:\Project\IOT Dashboard\AI Model\GreenAI\Lib\site-packages")
VENV_SCRIPTS = Path(r"D:\Project\IOT Dashboard\AI Model\GreenAI\Scripts")
if VENV_SITE.exists():
    # Prepend to sys.path so imports use the venv packages
    sp = str(VENV_SITE)
    if sp not in sys.path:
        sys.path.insert(0, sp)
    # Also add Scripts to PATH so subprocesses use that environment when needed
    import os
    os.environ['PATH'] = str(VENV_SCRIPTS) + os.pathsep + os.environ.get('PATH', '')
    print(f"Using existing GreenAI venv packages from: {VENV_SITE}")

try:
    from ultralytics import YOLO
except Exception:
    YOLO = None

app = Flask(__name__)
CORS(app)

# Configuration
MODEL_PATH = r"D:\Project\IOT Dashboard\AI Model\Data\Detecting diseases.v1-geenai-2026-04-05-3-59pm.yolov8-obb\runs\obb\train2\weights\best.pt"
SOURCE = 1  # camera index (0 = built-in)
CONFIDENCE = 0.25
IMGSZ = 224

# Shared state
frame_lock = threading.Lock()
latest_frame = None
running = False
thread_obj = None

def detection_loop():
    global latest_frame, running
    if YOLO is None:
        print("ultralytics not installed. Exiting detection loop.")
        return

    try:
        model = YOLO(MODEL_PATH)
        cap = cv2.VideoCapture(SOURCE, cv2.CAP_DSHOW)
        if not cap.isOpened():
            # Try alternate indices
            for i in range(1, 4):
                cap = cv2.VideoCapture(i, cv2.CAP_DSHOW)
                if cap.isOpened():
                    break

        if not cap.isOpened():
            print("Could not open any camera. Exiting.")
            running = False
            return

        running = True
        while running and cap.isOpened():
            ok, frame = cap.read()
            if not ok:
                time.sleep(0.01)
                continue

            results = model.track(
                frame,
                persist=True,
                conf=CONFIDENCE,
                imgsz=IMGSZ,
                task="obb",
                verbose=False,
            )

            annotated = results[0].plot()

            # Encode as JPEG
            ret, jpeg = cv2.imencode('.jpg', annotated)
            if not ret:
                continue

            with frame_lock:
                latest_frame = jpeg.tobytes()

        cap.release()
    except Exception as e:
        print('Exception in detection loop:', e)
        traceback.print_exc()
    finally:
        running = False

def generate_mjpeg():
    boundary = b'--frame'
    while True:
        if not running:
            time.sleep(0.1)
            continue

        with frame_lock:
            f = latest_frame

        if f is None:
            time.sleep(0.01)
            continue

        yield boundary + b"\r\nContent-Type: image/jpeg\r\nContent-Length: " + str(len(f)).encode() + b"\r\n\r\n" + f + b"\r\n"

@app.route('/start', methods=['POST', 'GET'])
def start():
    global thread_obj, running
    if running:
        return jsonify({'status': 'already_running'})

    thread_obj = threading.Thread(target=detection_loop, daemon=True)
    thread_obj.start()
    # Give thread a moment to start
    time.sleep(0.2)
    return jsonify({'status': 'started'})

@app.route('/stop', methods=['POST'])
def stop():
    global running
    running = False
    return jsonify({'status': 'stopped'})

@app.route('/video_feed')
def video_feed():
    return Response(generate_mjpeg(), mimetype='multipart/x-mixed-replace; boundary=frame')

@app.route('/status')
def status():
    return jsonify({'running': running})

if __name__ == '__main__':
    print('Starting Flask MJPEG server on http://127.0.0.1:5001')
    print('If packages are missing, run using the GreenAI python:')
    print(r"D:\Project\IOT Dashboard\AI Model\GreenAI\Scripts\python.exe track3.py")
    # The server exposes /start and /stop to control the detection loop.
    # Detection is NOT started automatically; call /start to begin producing
    # frames. This ensures the dashboard button can start/stop the model.
    print('Use GET http://127.0.0.1:5001/start to begin detection')
    app.run(host='127.0.0.1', port=5001, threaded=True)
