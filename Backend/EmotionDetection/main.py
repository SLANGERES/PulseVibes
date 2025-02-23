from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from transformers import pipeline
import asyncio
from fastapi.middleware.cors import CORSMiddleware



app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Adjust to your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load model on startup
@app.on_event("startup")
def load_model():
    global emotion_classifier
    emotion_classifier = pipeline("sentiment-analysis", model="michellejieli/emotion_text_classifier")

class InputText(BaseModel):
    text: str

@app.post("/detect")
async def detect_emotion(input_text: InputText):
    """Detects emotion from the input text."""
    
    if not input_text.text.strip():
        raise HTTPException(status_code=400, detail="Text input cannot be empty")

    # Run model inference in a separate thread to avoid blocking FastAPI
    result = await asyncio.to_thread(emotion_classifier, input_text.text)
    emotion = result[0]["label"].lower()

    return {"emotion": emotion}  # Only return detected emotion


