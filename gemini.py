import requests
import json

url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyD7miafKV3wGGX8EFz8b8EkNnLPRYDjxy0"

headers = {"Content-Type": "application/json"}

data = {"contents": [{"parts": [{"text": "Explain how AI works in a few words"}]}]}

response = requests.post(url, headers=headers, data=json.dumps(data))

if response.status_code == 200:
    result = response.json()
    print("✅ Success!\n")
    print(result["candidates"][0]["content"]["parts"][0]["text"])
else:
    print(f"❌ Error {response.status_code}: {response.text}")
