from django.contrib import admin
from .models import Student
from django.contrib.auth.models import User

admin.site.register(Student)


# user = User.objects.create_user('testuser', 'myemail@mail.com', 'password')
# user.first_name = 'Ivan'
# user.last_name = 'Ivanov'
# user.save()