import numpy as np
import tensorflow as tf
import tensorflow_hub as hub
import scipy.signal
import soundfile as sf
import io
from fastapi import FastAPI, WebSocket, WebSocketDisconnect

app = FastAPI()


# Load YAMNet model and class names
# model = hub.load('https://tfhub.dev/google/yamnet/1')

model = hub.load("https://tfhub.dev/google/yamnet/1?tf-version=2")

def class_names_from_csv(class_map_csv_text):
    import csv
    class_names = []
    with tf.io.gfile.GFile(class_map_csv_text) as csvfile:
        reader = csv.DictReader(csvfile)
        for row in reader:
            class_names.append(row['display_name'])
    return class_names

class_map_path = model.class_map_path().numpy()
class_names = class_names_from_csv(class_map_path)

def ensure_sample_rate(original_sample_rate, waveform, desired_sample_rate=16000):
    if original_sample_rate != desired_sample_rate:
        desired_length = int(round(float(len(waveform)) / original_sample_rate * desired_sample_rate))
        waveform = scipy.signal.resample(waveform, desired_length)
    return desired_sample_rate, waveform

@app.websocket("/ws/audio")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    
    buffer = b''
    sample_rate = 16000  # YAMNet expects 16kHz mono
    bytes_per_sample = 2  # int16
    seconds_per_chunk = 5
    chunk_size = sample_rate * seconds_per_chunk * bytes_per_sample

    try:
        while True:
            data = await websocket.receive_bytes()
            buffer += data

            # Process every full 5-second chunk
            while len(buffer) >= chunk_size:
                chunk = buffer[:chunk_size]
                buffer = buffer[chunk_size:]

                # Convert bytes to waveform
                wav_data = np.frombuffer(chunk, dtype=np.int16)
                wav_data = wav_data.astype(np.float32) / np.iinfo(np.int16).max  # Normalize to [-1.0, 1.0]

                # Run through YAMNet
                scores, embeddings, spectrogram = model(wav_data)
                scores_np = scores.numpy()
                inferred_class = class_names[scores_np.mean(axis=0).argmax()]

                # Send result
                await websocket.send_text(f"Detected: {inferred_class}")

    except WebSocketDisconnect:
        print("WebSocket disconnected")
    except Exception as e:
        print(f"Error: {e}")
        await websocket.close()
