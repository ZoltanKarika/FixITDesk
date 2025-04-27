# accounts/views.py
from django.contrib.auth import authenticate
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView
from .models import User
from rest_framework.views import APIView
from .serializers import RegisterSerializer, LoginSerializer
from rest_framework_simplejwt.views import TokenRefreshView as BaseTokenRefreshView

from django.http import JsonResponse


# User Registration
class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = [permissions.AllowAny]
    serializer_class = RegisterSerializer

# Custom Login View that sets cookies
class CookieTokenObtainPairView(TokenObtainPairView):
    serializer_class = LoginSerializer

    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        tokens = response.data

        access_token = tokens.get('access')
        refresh_token = tokens.get('refresh')

        if not access_token or not refresh_token:
            return Response({'detail': 'Login failed. No tokens returned.'}, status=400)

        cookie_max_age = 3600  # 
        response.set_cookie(
            key='access_token',
            value=access_token,
            httponly=True,
            secure=True,  # Use True in production
            samesite='None',
            max_age=cookie_max_age,
        )

        response.set_cookie(
            key='refresh_token',
            value=refresh_token,
            httponly=True,
            secure=True,
            samesite='None',
            max_age=cookie_max_age * 24,
        )

        response.data = {'message': 'Login successful'}
        return response

from rest_framework.permissions import IsAuthenticated 

class LogoutView(APIView):
    permission_classes = [IsAuthenticated]  # Ensure the user is authenticated

    def post(self, request):
        response = Response({"message": "Logged out successfully!"}, status=status.HTTP_200_OK)

        # Clear the access and refresh tokens
        response.delete_cookie('access_token')
        response.delete_cookie('refresh_token')

        return response
    
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView

class WhoAmIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response({'username': request.user.username})