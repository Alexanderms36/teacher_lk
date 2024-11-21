from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from rest_framework.authtoken.models import Token
from django.contrib.auth import get_user_model
from .models import Student


class ViewsTests(APITestCase):
    def setUp(self):
        self.User = get_user_model()
        self.user = self.User.objects.create_user(username='testuser', password='testpass')
        # self.token = Token.objects.create(user=self.user)
        # self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.token.key)

    def test_main_page_redirects_to_login(self):
        response = self.client.get(reverse('main_page'))
        self.assertEqual(response.status_code, status.HTTP_302_FOUND)

    def test_user_login_view_get(self):
        response = self.client.get(reverse('login'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
    
    def test_user_login_view_post_successful(self):
        response = self.client.post(reverse('login'), {'username': 'testuser', 'password': 'testpass'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('token', response.data)
    
    def test_user_login_view_post_invalid(self):
        response = self.client.post(reverse('login'), {'username': 'testuser', 'password': 'wrongpass'})
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_user_account_view_authenticated(self):
        self.client.login(username='testuser', password='testpass')
        response = self.client.get(reverse('user_account'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
    
    def test_user_account_view_unauthenticated(self):
        response = self.client.get(reverse('user_account'))
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        # self.assertEqual(response.status_code, status.HTTP_302_FOUND)


        # self.assertRedirects(response, reverse('login'))

    def test_pupils_view_get(self):
        response = self.client.get(reverse('pupils', args=[1]))
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_student_page_view_get(self):
        student = Student.objects.create(name='Student1', age=20)
        response = self.client.get(reverse('student_page', args=[1, student.id]))
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_activities_page_view_get_invalid_activity(self):
        response = self.client.get(reverse('activities', args=[1, 1, 'invalid_activity']))
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_logout_from_user_account(self):
        self.client.login(username='testuser', password='testpass')
        response = self.client.post(reverse('user_account'), {'logout': True})
        self.assertEqual(response.status_code, status.HTTP_302_FOUND)
        self.assertEqual(response.headers['Location'], reverse('login'))
        