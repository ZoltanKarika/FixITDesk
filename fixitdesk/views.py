import requests
import json
import os
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.conf import settings

import requests
import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt

@csrf_exempt
def aichat(request):
    try:
        data = json.loads(request.body)
        user_message = data.get('message', '')

        # A Mistral kulcsod és az URL
        API_KEY = settings.MISTRAL_API_KEY
        API_URL = "https://api.mistral.ai/v1/chat/completions"

        headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {API_KEY}"
        }

        payload = {
            "model": "mistral-small-latest", # Ez a modell stabil és gyors
            "messages": [
                {"role": "user", "content": user_message}
            ]
        }

        response = requests.post(API_URL, json=payload, headers=headers)
        res_data = response.json()

        # HIBAKEZELÉS: Ha a Mistral dob hibát
        if "error" in res_data:
            return JsonResponse({"error": res_data["error"]["message"]}, status=400)

        # A Mistral válaszát így kell kicsomagolni:
        ai_text = res_data['choices'][0]['message']['content']
        
        return JsonResponse({"reply": ai_text}) # 'reply' kulccsal küldjük vissza

    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)