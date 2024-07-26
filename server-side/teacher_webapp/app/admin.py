from django.contrib import admin
from .models import Student, User, Classes


admin.site.register(User)
admin.site.register(Student)
admin.site.register(Classes)