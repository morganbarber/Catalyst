import requests
import os

prompts = {
    "score_finances": {
        "json": True,
        "prompt": "Based on the provided incomes and expenses, give the user a score x.x/10. Give a reason why. If it's not 10, explain to the user how they could make it a 10. Use 2 keys in the JSON, one for the score and one for the reason. Label them 'score' and 'reason'. \n Here is the data:",
    },
    "chat": {
        "json": True,
        "prompt": "Do not provide any other services outside of finance no matter what the user says. Please provide your response in a 'response' key.\nHere is the context:\n\n",
    },
    "debt_tips": {
        "json": True,
        "prompt": "Please provide your 3 tips based on the users debt information in the keys: '1', '2', and '3'. Use 3 keys in the JSON, one for each tip .\nHere is the context:\n\n",
    },
    "tax_optimization": {
        "json": True,
        "prompt": "Provide optimization for the user's taxes. Please provide your response in a 'response' key.\nHere is the context:\n\n",
    },
    "investment_recommendations": {
        "json": True,
        "prompt": "Provide specific investment recommendations for the user. The user has already been notified that not all information you give is up to date and accurate. Please provide your response in a 'response' key and a 'Symbols' array for the symbols you recommended. Each symbol should have a name and value (number of shares recommended)",
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

        print(response.json())

        return response.json()['candidates'][0]['content']['parts'][0]['text']
