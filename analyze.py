import sys
import json
import cv2

def analyze_video(video_path):
    cap = cv2.VideoCapture(video_path)
    if not cap.isOpened():
        return {"error": "Unable to open video"}

    frame_count = 0
    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            break
        frame_count += 1
        # Process the frame: extract facial features, gestures, etc.

    cap.release()

    # Example: Making "Gestures" depend on frame count
    analysis = {
        "Eye Contact": min(100, frame_count // 10),  # Dummy logic
        "Enthusiasm": min(100, frame_count // 20),
        "Empathy": min(100, frame_count // 30),
        "Facial Expression": min(100, frame_count // 15),
        "Filler Words": max(0, 100 - frame_count // 10),
        "Gestures": min(100, frame_count // 25),
        "Logical Transitions": min(100, frame_count // 18),
        "Pacing": min(100, frame_count // 12),
        "Persuasiveness": min(100, frame_count // 22),
        "Sentiment": min(100, frame_count // 17)
    }

    return analysis

if __name__ == "__main__":
    video_file = sys.argv[1]
    result = analyze_video(video_file)
    print(json.dumps(result))
