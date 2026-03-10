# accounts/views.py
from django.contrib.auth import authenticate
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView
from .models import User
from rest_framework.views import APIView
from .serializers import RegisterSerializer, LoginSerializer, AdminUserUpdateSerializer, AdminUserListSerializer

from rest_framework_simplejwt.views import TokenRefreshView
from django.http import JsonResponse
from django.middleware.csrf import get_token
from rest_framework.permissions import IsAuthenticated

from django.http import JsonResponse

def csrf_token_view(request):
    return JsonResponse({'csrf_token': get_token(request)})
# User Registration
class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = [permissions.AllowAny]
    serializer_class = RegisterSerializer







from django.contrib.auth import authenticate, login
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny 
from rest_framework.exceptions import PermissionDenied
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter

class AdminUserListView(generics.ListAPIView):
    serializer_class = AdminUserListSerializer
    filter_backends = [DjangoFilterBackend, SearchFilter]
    filterset_fields = ["department", "is_support_staff"]
    search_fields = ["username", "email"]
    permission_classes = [IsAuthenticated]  # login kell

    def get_queryset(self):
        user = self.request.user
        if not user.is_staff and not user.is_support_staff:
            raise PermissionDenied("You do not have permission to view this page.")
        return User.objects.all().order_by("id")

class AdminUserUpdateView(generics.RetrieveUpdateAPIView):

    queryset = User.objects.all()
    serializer_class = AdminUserUpdateSerializer
    permission_classes = []

    def get_object(self):
        user = super().get_object()

        # Prevent modifying your own account
        if user == self.request.user:
            raise PermissionDenied("You cannot modify your own account.")

        return user

class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        username = request.data.get("username")
        password = request.data.get("password")
        user = authenticate(username=username, password=password)
        if user:
            #login(request, user)  # Log the user in by creating a session
            return Response({"message": "Login successful"}, status=200)
        return Response({"message": "Invalid credentials"}, status=400)



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

        cookie_max_age = 3600 # 
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

class CustomLoginView(TokenObtainPairView):
    permission_classes = [AllowAny]
    serializer_class = LoginSerializer  # Your JWT serializer

    def post(self, request, *args, **kwargs):
        username = request.data.get('username')
        password = request.data.get('password')

        # First authenticate the user
        user = authenticate(username=username, password=password)
        if user is None:
            return Response({'message': 'Invalid credentials'}, status=400)

        # Log the user in (Django session login)
        #login(request, user)

        # Now generate tokens using the parent class
        response = super().post(request, *args, **kwargs)
        tokens = response.data

        access_token = tokens.get('access')
        refresh_token = tokens.get('refresh')

        if not access_token or not refresh_token:
            return Response({'detail': 'Login failed. No tokens returned.'}, status=400)

        cookie_max_age = 3600  # 1 hour (adjust if you want)

        # Set access_token cookie
        response.set_cookie(
            key='access_token',
            value=access_token,
            httponly=True,
            secure=False,  # Should be True in production!
            samesite='Lax',  # or 'Lax' depending on your frontend
            max_age=cookie_max_age,
        )

        # Set refresh_token cookie
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
        response.delete_cookie('sessionid')
        response.delete_cookie('csrftoken')

        return response
    
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView

class WhoAmIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response({''
        'username': request.user.username,
        'is_support_staff' :request.user.is_support_staff})


class CookieTokenRefreshView(TokenRefreshView):
    def post(self, request, *args, **kwargs):
        # cookie-ból kiveszi a refresh tokent
        request.data['refresh'] = request.COOKIES.get('refresh_token')
        response = super().post(request, *args, **kwargs)
        
        # új access tokent visszarakja cookie-ba
        response.set_cookie(
            key='access_token',
            value=response.data['access'],
            httponly=True,
            secure=False,
            samesite='Lax',
            max_age=3600,
        )
        response.data = {'message': 'Token refreshed'}
        return response











