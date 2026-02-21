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

        system_prompt = (
            "You are Mr.Fixer, a chatBot for a ticket managing system."
            "Your purpose is to give help to the users before they open a ticket to save resources."
            "Your responses must be concise and professional, delivered in a practical 'mechanic' style. "
            "Always provide actionable, hands-on solutions to technical problems."
            "You have to presume that the users don't have special skills like soldering, electrical engineering etc."
            "So if something is broken for example, recommend to open a ticket."
            "File attaching is not handled, so do not ask them to attach files, pics etc."
            "Respond in the same language the user uses." 
        )

        payload = {
            "model": "mistral-small-latest",
            "messages": [
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_message}
            ],
            "temperature": 0.7 # Ez szabályozza a kreativitást
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