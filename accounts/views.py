from django.shortcuts import render

# accounts/views.py
from .models import User
from rest_framework import generics, permissions
from .serializers import RegisterSerializer

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = [permissions.AllowAny]
    serializer_class = RegisterSerializer

