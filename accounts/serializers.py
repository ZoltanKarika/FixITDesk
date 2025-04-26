from rest_framework import serializers
from .models import User
from django.contrib.auth.password_validation import validate_password
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate 

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, validators=[validate_password])

    class Meta:
        model = User
        fields = ('username', 'email', 'password', 'department', 'is_support_staff')

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email'),
            password=validated_data['password'],
            department=validated_data.get('department', ''),
            is_support_staff=validated_data.get('is_support_staff', False),
        )
        return user


class UserSerializer(serializers.ModelSerializer):
    # Avoid exposing sensitive fields like password
    class Meta:
        model = User
        exclude = ('password', )  # Exclude the password field from serialization


from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

class LoginSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        # Optional: add custom claims here
        return token