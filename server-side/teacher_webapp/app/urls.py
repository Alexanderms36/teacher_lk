from django.urls import path
from . import views


urlpatterns = [
    path('', views),
    path("user/", views.user_account, name='user_account')
]
