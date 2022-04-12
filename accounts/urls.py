from django.urls import path
from accounts import views

urlpatterns = [
    path('refresh/', views.UserTokenRefreshView.as_view(), name="refresh"),

    path('register/', views.UserRegisterView.as_view(), name="register"),
    path('login/', views.UserLoginView.as_view(), name="login"),
]
