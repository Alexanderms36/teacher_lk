from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient
from rest_framework.authtoken.models import Token
from django.contrib.auth import get_user_model
from .models import Student, Classes


class ViewsTests(TestCase):
    def setUp(self):
        self.User = get_user_model()
        self.user = self.User.objects.create_user(username='testuser', password='testpass')
        self.token = Token.objects.create(user=self.user)
        self.client = APIClient()

    def test_main_page_redirects_to_login(self):
        response = self.client.get(reverse('main_page'))
        self.assertEqual(response.status_code, status.HTTP_302_FOUND)
        self.assertEqual(response.headers['Location'], reverse('login'))

    def test_user_login_view_get(self):
        response = self.client.get(reverse('login'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['status'], 'ok')
    
    def test_user_login_view_post_invalid(self):
        response = self.client.post(reverse('login'), {'username': 'testuser', 'password': 'wrongpass'})
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertEqual(response.data['error'], 'Invalid data')

    def test_user_account_view_authenticated(self):
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.token.key)
        response = self.client.get(reverse('user_account'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
    
    def test_user_account_view_unauthenticated(self):
        response = self.client.get(reverse('user_account'))
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_user_account_view_logout(self):
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.token.key)
        response = self.client.post(reverse('user_account'), {'logout': True})
        self.assertEqual(response.status_code, status.HTTP_302_FOUND)
        self.assertEqual(response.headers['Location'], reverse('login'))

    def test_pupils_view_get(self):
        class_instance = Classes.objects.create(name='Class 1', main_teacher=self.user)
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.token.key)
        response = self.client.get(reverse('pupils', args=[class_instance.id]))
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_student_page_view_get(self):
        student = Student.objects.create(name='Student1', age=20)
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.token.key)
        response = self.client.get(reverse('student_page', args=[1, student.id]))
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_pupils_view_post_chosen_student(self):
        class_instance = Classes.objects.create(name='Class 1', main_teacher=self.user)
        student = Student.objects.create(name='Student1', age=20, classes=class_instance)
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.token.key)
        response = self.client.post(reverse('pupils', args=[class_instance.id]), {'chosen_student': student.id})
        self.assertEqual(response.status_code, status.HTTP_302_FOUND)
        self.assertEqual(response.headers['Location'], reverse('student_page', args=[class_instance.id, student.id]))

    def test_pupils_view_post_invalid_data(self):
        class_instance = Classes.objects.create(name='Class 1', main_teacher=self.user)
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.token.key)
        response = self.client.post(reverse('pupils', args=[class_instance.id]))
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data['detail'], 'something went wrong')
#python manage.py test --verbosity 2