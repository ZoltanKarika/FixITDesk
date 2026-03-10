from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import RegisterView, CookieTokenObtainPairView, LogoutView, WhoAmIView, CustomLoginView, CookieTokenRefreshView, AdminUserUpdateView, AdminUserListView


urlpatterns = [
    path('accounts/register/', RegisterView.as_view(), name='user-register'),
    path('accounts/login/', CustomLoginView.as_view(), name='token_obtain_pair'),  # <- Fixed here
    path('token/refresh/', CookieTokenRefreshView.as_view(), name='token_refresh'),
    path('token/obtainpair/', CookieTokenObtainPairView.as_view(), name='token_obtain_pair'), 
    path('accounts/logout/', LogoutView.as_view(), name='logout'),
    path('accounts/whoami/', WhoAmIView.as_view(), name='whoami'),
    path('accounts/admin/users/<int:pk>/', AdminUserUpdateView.as_view()),
    path('accounts/admin/users/', AdminUserListView.as_view()),
]
