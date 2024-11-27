from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient
from rest_framework.authtoken.models import Token
from django.contrib.auth import get_user_model
from .models import User, Classes, Student, Olympiads, Tutors, Afterschools
import time


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

class LoadTest(TestCase):
    def test_bulk_insert_students(self):
        num_records = 5000
        class_instance = Classes.objects.create(name="Class A")
        students = [
            Student(
                name=f"Name {i}",
                surname=f"Surname {i}",
                patronymic=f"Patronymic {i}",
                age=15 + i % 5,
                health_group="A",
                classes=class_instance,
            )
            for i in range(num_records)
        ]
        start_time = time.time()
        Student.objects.bulk_create(students)
        elapsed_time = time.time() - start_time
        print(f"Inserted {num_records} students in {elapsed_time:.2f} seconds")
        self.assertEqual(Student.objects.count(), num_records)

    def test_bulk_select_students(self):
        num_records = 10000
        class_instance = Classes.objects.create(name="Class A")
        
        students = [
            Student(
                name=f"Student {i}",
                surname="Doe",
                patronymic="Ivanovich",
                age=15 + (i % 5),
                health_group="A",
                classes=class_instance,
            )
            for i in range(num_records)
        ]
        Student.objects.bulk_create(students)

        start_time = time.time()
        all_students = Student.objects.all()
        elapsed_time = time.time() - start_time

        print(f"Selected {all_students.count()} Student records in {elapsed_time:.2f} seconds")
        self.assertEqual(all_students.count(), num_records)

    def test_bulk_update_students(self):
        num_records = 10000
        class_instance = Classes.objects.create(name="Class A")

        students = [
            Student(
                name=f"Student {i}",
                surname="Doe",
                patronymic="Ivanovich",
                age=15,
                health_group="A",
                classes=class_instance,
            )
            for i in range(num_records)
        ]
        Student.objects.bulk_create(students)

        start_time = time.time()
        Student.objects.all().update(age=16)
        elapsed_time = time.time() - start_time

        print(f"Updated {num_records} Student records in {elapsed_time:.2f} seconds")
        self.assertTrue(
            all(student.age == 16 for student in Student.objects.all())
        )

    def test_bulk_insert_olympiads(self):
        num_records = 3000
        student = Student.objects.create(
            name="John", surname="Doe", patronymic="Ivanovich", age=17
        )
        
        olympiads = [
            Olympiads(
                name=f"Olympiad {i}",
                place="City",
                info="Info",
                student=student,
            )
            for i in range(num_records)
        ]

        start_time = time.time()
        Olympiads.objects.bulk_create(olympiads)
        elapsed_time = time.time() - start_time

        print(f"Inserted {num_records} Olympiads in {elapsed_time:.2f} seconds")
        self.assertEqual(Olympiads.objects.count(), num_records)
