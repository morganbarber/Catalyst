import requests
import os

prompts = {
    "score_finances": {
        "json": True,
        "prompt": "Based on the provided incomes and expenses, give the user a score x.x/10. Give a reason why. If it's not 10, explain to the user how they could make it a 10. Use 2 keys in the JSON, one for the score and one for the reason. Label them 'score' and 'reason'. \n Here is the data:",
    },
}

class client:
    def __init__(self):
        self.api_key = os.getenv("LLM_API_KEY")

    def inference(self, **kwargs):
        context = kwargs.get("context")
        prompt = prompts[kwargs.get("prompt")]

        url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent"
        headers = {"Content-Type": "application/json"}
        payload = {
            "contents": [{"parts": [{"text": prompt["prompt"] + "\n\n" + context}]}],
            "generationConfig": {
                "response_mime_type": "application/json" if prompt["json"] else "text/plain",
            },
        }
        response = requests.post(url, headers=headers, json=payload, params={"key": self.api_key})

        return response.json()["canidates"][0]["parts"][0]["text"]