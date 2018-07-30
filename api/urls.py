from django.urls import path
from . import views

urlpatterns = [
    path('api-register-user/', views.CreateUserView.as_view()),
    path('api-login-user/', views.LoginUserView.as_view()),
    path('user/<int:pk>', views.UserDetail.as_view()),
]
