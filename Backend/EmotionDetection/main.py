from fastapi import FastAPI
from pydantic import BaseModel
import random

app = FastAPI()

# 🎭 Emotion-to-Genre Mapping
MOOD_TO_GENRE = {
    "joy": "pop",
    "sadness": "acoustic",
    "anger": "rock",
    "calm": "chill",
    "energetic": "edm",
    "love": "romance",
    "fear": "ambient",
    "surprise": "indie",
    "neutral": "classical"
}

class TextRequest(BaseModel):
    responses: list[str]

@app.post("/detect")
async def detect_genre(request: TextRequest):
    print("📩 Received text for emotion detection:", request.responses)

    if not request.responses:
        return {"error": "No text provided"}

    # 🔥 Simulated Emotion Detection (Replace with actual model)
    detected_emotions = [random.choice(list(MOOD_TO_GENRE.keys())) for _ in request.responses]
    print("🎭 Detected Emotions:", detected_emotions)

    # 🔥 Pick a final genre based on detected emotions
    final_emotion = random.choice(detected_emotions)
    final_genre = MOOD_TO_GENRE.get(final_emotion, "pop")

    print("🎶 Selected Genre:", final_genre)
    return {"genre": final_genre}
