# import requests

# API_URL = "https://api-inference.huggingface.co/models/google/flan-t5-large"

# headers = {
#     "Authorization": "Bearer hf_..."
# }

# def get_ai_reply(message):
#     try:
#         prompt = f"""
# You are SmartBite food ordering assistant.

# Answer naturally and briefly.

# User: {message}
# """

#         response = requests.post(
#             API_URL,
#             headers=headers,
#             json={
#                 "inputs": prompt
#             }
#         )

#         data = response.json()

#         print(data)

#         if isinstance(data, list):
#             return data[0]["generated_text"]

#         return "AI assistant unavailable."

#     except Exception as e:
#         print("HF ERROR:", e)
#         return "Something went wrong."