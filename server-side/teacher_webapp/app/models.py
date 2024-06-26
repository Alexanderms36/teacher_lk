from django.db import models
from django.urls import reverse
from django.contrib.auth.models import AbstractUser


class User(AbstractUser):
    patronymic = models.CharField(max_length=160, blank=True)
    
class Student(models.Model):
    name = models.CharField(max_length=255)
    surname = models.CharField(max_length=255)
    patronymic = models.CharField(max_length=255)
    age = models.IntegerField()
    classes = models.CharField(max_length=255)

    def __str__(self):
        return f"{self.name} {self.surname}"
    
class ClassYear(models.Model):
    classYear = models.ManyToManyField(Student, help_text="введите название класса")

    def __str__(self):
        return self.classYear
    
class Classes(models.Model):
    name = models.CharField(max_length=255)
    main_teacher = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
