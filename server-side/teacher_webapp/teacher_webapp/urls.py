from django.contrib import admin
from django.urls import path
from django.urls import include
from django.urls import path
from django.views.generic import RedirectView
from django.conf import settings
from django.conf.urls.static import static
from app import views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', views.index, name="index")
]


urlpatterns += [
     path('login/', include('app.urls')),
]

urlpatterns += [
    path('', RedirectView.as_view(url='/login/', permanent=True)),
]
