from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import RegisterView, CookieTokenObtainPairView, LogoutView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='user-register'),
    path('login/', CookieTokenObtainPairView.as_view(), name='token_obtain_pair'),  # <- Fixed here
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('logout/', LogoutView.as_view(), name='logout'),
]
