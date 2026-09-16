from openai import OpenAI
import os

# Utilise la même configuration client que dans ton chatbot
client = OpenAI(
    base_url="https://openai.generative.engine.capgemini.com/v1", 
    api_key= os.getenv("CAPGEMINI_API_KEY")
)

try:
    response = client.chat.completions.create(
        model="openai.gpt-4o", # Celui que tu utilises
        messages=[{"role": "user", "content": "Bonjour, test."}]
    )
    print("Succès :", response.choices[0].message.content)
except Exception as e:
    print("Erreur :", e)