import os
import requests

HF_SPACE_URL = os.getenv('HF_SPACE_URL')

class HFClient:
    @staticmethod
    def audio(file_bytes):
        r = requests.post(f"{HF_SPACE_URL}/predict/audio", files={"file": file_bytes})
        return r.json()

    @staticmethod
    def image(file_bytes):
        r = requests.post(f"{HF_SPACE_URL}/predict/image", files={"file": file_bytes})
        return r.json()

    @staticmethod
    def video(file_bytes):
        r = requests.post(f"{HF_SPACE_URL}/predict/video", files={"file": file_bytes})
        return r.json()
