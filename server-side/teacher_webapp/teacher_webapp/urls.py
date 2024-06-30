from django.contrib import admin
from django.urls import path, include
from django.views.generic import RedirectView
from django.conf import settings
from django.conf.urls.static import static
from app import views


urlpatterns = [
    path("", include("app.urls")),
]


# urlpatterns += [
#     path('', RedirectView.as_view(url='/login/', permanent=True)),
# ]
