from django.contrib.auth import authenticate
from rest_framework import generics, permissions
from rest_framework_simplejwt.tokens import RefreshToken 
from rest_framework.response import Response
from rest_framework import status
from .models import User
from .serializers import RegisterSerializer, UserSerializer, LoginSerializer
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
# Register View
class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = [permissions.AllowAny]
    serializer_class = RegisterSerializer

# Token Obtain view (Login)
class LoginView(generics.GenericAPIView):
    serializer_class = LoginSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            # Get the user object from validated data
            user = serializer.validated_data['user']
            
            # Create tokens using Simple JWT
            refresh = RefreshToken.for_user(user)
            access_token = refresh.access_token

            # Return the tokens
            return Response({
                'refresh': str(refresh),
                'access': str(access_token),
            }, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# Token Refresh view
class TokenRefreshView(TokenRefreshView):
    pass
