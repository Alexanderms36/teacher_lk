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
    path('user/<str:link>/', views.pupils, name='pupils'),
    path('user_json/', views.user_json, name='user_json'),
    path('user/<str:link>/get_classes/', views.classes_json_get, name='classes_json'),
    path('user/<str:link>/<int:student>/', views.student_page, name='student_page')
]


# urlpatterns += [
#     path('', RedirectView.as_view(url='/login/', permanent=True)),
# ]
