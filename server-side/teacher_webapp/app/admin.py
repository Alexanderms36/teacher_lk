from django.contrib import admin
from .models import Student, User, Classes


class UserAdmin(admin.ModelAdmin):
    def save_model(self, request, obj, form, change):
        if obj.password:
            obj.set_password(obj.password)
        obj.save()

admin.site.register(User, UserAdmin)
admin.site.register(Student)
admin.site.register(Classes)
