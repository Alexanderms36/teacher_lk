from django.contrib import admin
from django.urls import path, include
from django.views.generic import RedirectView
from django.conf import settings
from django.conf.urls.static import static
from app import views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('login/', views.user_login, name='login'),
    path("user/", views.user_account, name='user_account'),
    path('user_json/', views.user_json, name='user_json'),
]


# urlpatterns += [
#      path('login/', include('app.urls')),
# ]

# urlpatterns += [
#     path('', RedirectView.as_view(url='/login/', permanent=True)),
# ]
