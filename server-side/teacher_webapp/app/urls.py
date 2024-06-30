from django.urls import path, include
from . import views
from django.contrib import admin


urlpatterns = [
    path('admin/', admin.site.urls),
    path('login/', views.UserLoginView.as_view(), name='login'),
    path("user/", views.UserAccountView.as_view(), name='user_account'),
    path('user/<int:chosen_class>/', views.PupilsView.as_view(), name='pupils'),
    path('user/<int:chosen_class>/<int:chosen_student>/', views.StudentPageView.as_view(), name='student_page'),
]
