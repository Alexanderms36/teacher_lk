from django.db import models
from django.urls import reverse
from django.contrib.auth.models import AbstractUser


class User(AbstractUser):
    patronymic = models.CharField(max_length=160, blank=True)
    image = models.ImageField(upload_to='profile_images', blank=True)
    
class Classes(models.Model):
    name = models.CharField(max_length=255)
    main_teacher = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)

class Student(models.Model):
    name = models.CharField(max_length=255)
    surname = models.CharField(max_length=255)
    patronymic = models.CharField(max_length=255)
    age = models.IntegerField()
    health_group = models.CharField(max_length=255, blank=True, null=True)
    classes = models.ForeignKey(Classes, on_delete=models.SET_NULL, null=True, blank=True)
    def __str__(self):
        return f"{self.name} {self.surname}"
    
class Olympiads(models.Model):
    name = models.CharField(max_length=512)
    place = models.CharField(max_length=512, blank=True)
    info = models.CharField(max_length=512, blank=True)
    student = models.ForeignKey(Student, on_delete=models.SET_NULL, null=True, blank=True)
    image = models.CharField(max_length=512, blank=True, null=True)

class Tutors(models.Model):
    name = models.CharField(max_length=255)
    surname = models.CharField(max_length=255)
    patronymic = models.CharField(max_length=255, null=True, blank=True)
    subject = models.CharField(max_length=255)
    info = models.CharField(max_length=512, null=True, blank=True)
    student = models.ForeignKey(Student, on_delete=models.SET_NULL, null=True, blank=True)
    image = models.CharField(max_length=512, blank=True, null=True)

class Afterschools(models.Model):
    name = models.CharField(max_length=255)
    subject = models.CharField(max_length=255)
    info = models.CharField(max_length=512, null=True, blank=True)
    student = models.ForeignKey(Student, on_delete=models.SET_NULL, null=True, blank=True)
    image = models.CharField(max_length=512, blank=True, null=True)
