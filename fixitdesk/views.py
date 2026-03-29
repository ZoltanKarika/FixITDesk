import requests
import json
import os
from django.http import JsonResponse
from django.conf import settings
from requests.exceptions import ConnectionError, Timeout, RequestException

def aichat(request):
    try:
        data = json.loads(request.body)
        user_message = data.get('message', '')
        
        if not settings.MISTRAL_API_KEY:
            return JsonResponse({
                "error": "API OR .env FILE IS MISSING - MR.FIXER IS DOWN ☹️"
            }, status=503)

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
            "temperature": 0.7 
        }

        try:
            response = requests.post(API_URL, json=payload, headers=headers, timeout=30)
            res_data = response.json()
        except ConnectionError:
            return JsonResponse({
                "error": "Mr.Fixer is offline - no internet connection. 📡"
            }, status=503)
        except Timeout:
            return JsonResponse({
                "error": "Mr.Fixer is not responding - request timed out. ⏱️"
            }, status=503)
        except RequestException as e:
            return JsonResponse({
                "error": f"Network error: {str(e)}"
            }, status=503)

        if "error" in res_data:
            return JsonResponse({"error": res_data["error"]["message"]}, status=400)

        ai_text = res_data['choices'][0]['message']['content']
        return JsonResponse({"reply": ai_text})

    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)