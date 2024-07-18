from django.contrib.auth import authenticate, login, logout
from .models import Student, Olympiads, Tutors, Afterschools
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.reverse import reverse
from rest_framework.authtoken.models import Token
from rest_framework.permissions import IsAuthenticated
from rest_framework.renderers import TemplateHTMLRenderer, JSONRenderer
from .serializers import (
    UserSerializer, 
    StudentSerializer, 
    ClassesSerializer, 
    OlympiadsSerializer,
    TutorsSerializer,
    AfterschoolsSerializer
)
import os
from django.shortcuts import get_object_or_404
from django.core.files.base import ContentFile
from django.core.files.storage import default_storage
from .schema import ImageSchema, TextSchema
from marshmallow import ValidationError
import random


class UserLoginView(APIView):
    renderer_classes = [TemplateHTMLRenderer]
    template_name = 'index.html'

    def get(self, request):
        queryset = Student.objects.all()
        return Response({'students': queryset})

    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            token, _ = Token.objects.get_or_create(user=user)
            return Response({'token': token.key, 'detail': 'Redirecting to user account'},
                                status=status.HTTP_302_FOUND,
                                headers={'Location': reverse('user_account')})
        else:
            return Response({'error': 'Invalid data'}, status=401)
        
class UserAccountView(APIView):
    permission_classes = [IsAuthenticated]
    renderer_classes = [JSONRenderer, TemplateHTMLRenderer]
    template_name = 'user_account.html'
    
    def get(self, request):    
        user = request.user
        serializer = UserSerializer(user)
        return Response(serializer.data)
    
    def post(self, request):
        if request.FILES.get('image'):
            try:
                image = request.FILES['image']
                schema = ImageSchema()
                data = schema.load({'image': image})

                file_path = os.path.join('app/profile_images', f'{request.user.id}_{image.name}')
                file_name = default_storage.save(file_path, ContentFile(image.read()))
                file_url = default_storage.url(file_name)

                request.user.image = file_url
                request.user.save()
                return Response({'file_url': file_url, 'success': True}, status=status.HTTP_200_OK)
            
            except ValidationError as err:
                return Response({'success': False, 'detail': err.messages}, status=status.HTTP_400_BAD_REQUEST)
            
        elif 'logout' in request.data:
            logout(request)
            return Response({'detail': 'logged out successfully'},
                                status=status.HTTP_302_FOUND,
                                headers={'Location': reverse('login')})
        else:
            chosen_class = request.data.get('chosen_button')
            if chosen_class:
                return Response({'detail': 'redirected successfully'},
                                    status=status.HTTP_302_FOUND,
                                    headers={'Location': reverse('pupils', args=[chosen_class])})
            else:
                return Response({'detail': 'something went wrong'})
        
class PupilsView(APIView):
    permission_classes = [IsAuthenticated]
    renderer_classes = [JSONRenderer, TemplateHTMLRenderer]
    template_name = 'pupils_page.html'

    def get(self, request, chosen_class):
        user = request.user
        classes = user.classes_set.filter(id=chosen_class)
        serializer = ClassesSerializer(classes, many=True)
        return Response({'data': serializer.data})
    
    def post(self, request, chosen_class):
        if 'logout' in request.data:
            logout(request)
            return Response({'detail': 'logged out successfully'},
                                status=status.HTTP_302_FOUND,
                                headers={'Location': reverse('login')})
        elif 'return' in request.data:
            return Response({'detail': 'redirected successfully'},
                                status=status.HTTP_302_FOUND,
                                headers={'Location': reverse('user_account')})
        else:
            chosen_student = request.data.get('chosen_student')
            if chosen_student:
                return Response({'detail': 'redirected successfully'},
                                status=status.HTTP_302_FOUND,
                                headers={'Location': reverse('student_page', args=[chosen_class, chosen_student])}) 
            else:
                return Response({'detail': 'something went wrong'})

class StudentPageView(APIView):
    permission_classes = [IsAuthenticated]
    renderer_classes = [JSONRenderer, TemplateHTMLRenderer]
    template_name = 'student_page.html'

    def get(self, request, chosen_class, chosen_student):
        student = Student.objects.get(id=chosen_student)
        serializer = StudentSerializer(student, many=False)
        return Response({'data': serializer.data})
    
    def post(self, request, chosen_class, chosen_student):
        if 'logout' in request.data:
            logout(request)
            return Response({'detail': 'logged out successfully'},
                                status=status.HTTP_302_FOUND,
                                headers={'Location': reverse('login')})
        elif 'return' in request.data:
            return Response({'detail': 'redirected successfully'},
                                status=status.HTTP_302_FOUND,
                                headers={'Location': reverse('pupils', args=[chosen_class])})
        else:
            chosen_activity = request.data.get('chosen_activity')
            return Response({'detail': 'redirected successfully'},
                            status=status.HTTP_302_FOUND,
                            headers={'Location': reverse('activities', args=[chosen_class, chosen_student, chosen_activity])}) 
            
class ActivitiesPageView(APIView):
    permission_classes = [IsAuthenticated]
    renderer_classes = [JSONRenderer, TemplateHTMLRenderer]
    template_name = 'activity.html'

    def get(self, request, chosen_class, chosen_student, chosen_activity):
        num = random.randrange(1, 4)
        pic_path = f"http://localhost:8001/static/images/activity_backgrounds/{num}.jpg"

        match chosen_activity:
            case 'olympiads':
                olympiads = Olympiads.objects.filter(student_id=chosen_student)
                serializer = OlympiadsSerializer(olympiads, many=True)
                return Response({'activity': chosen_activity, 'data': serializer.data, 'pic': pic_path})
            
            case 'tutors':
                tutors = Tutors.objects.filter(student_id=chosen_student)
                serializer = TutorsSerializer(tutors, many=True)
                return Response({'activity': chosen_activity, 'data': serializer.data, 'pic': pic_path})
            
            case 'afterschools':
                afterschools = Afterschools.objects.filter(student_id=chosen_student)
                serializer = AfterschoolsSerializer(afterschools, many=True)
                return Response({'activity': chosen_activity, 'data': serializer.data, 'pic': pic_path})

            case _:
                return Response(status=status.HTTP_400_BAD_REQUEST)
    
    def post(self, request, chosen_class, chosen_student, chosen_activity):
        if 'logout' in request.data:
            logout(request)
            return Response({'detail': 'logged out successfully'},
                                status=status.HTTP_302_FOUND,
                                headers={'Location': reverse('login')})
        
        elif 'return' in request.data:
            return Response({'detail': 'redirected successfully'},
                                status=status.HTTP_302_FOUND,
                                headers={'Location': reverse('student_page', args=[chosen_class, chosen_student])})
        
        elif 'added_activity' in request.data:
            try:
                added_activity = request.data.get('added_activity')
                data = added_activity['name']
                TextSchema().load({'schema_text': data})
                match added_activity['type']:
                    case 'olympiads':
                        serializer = OlympiadsSerializer(data=
                            {
                            'name': added_activity['name'],
                            'place': added_activity['subinfo'],
                            'info': added_activity['info'],
                            'student': chosen_student
                            })
                        
                        if serializer.is_valid():
                            serializer.save()
                            return Response(
                                {
                                    'message': f"Saved: {serializer.data['name']}",
                                    'success': True,
                                    'ID': serializer.data['id']
                                },
                                status=status.HTTP_201_CREATED)
                        
                        return Response({'success': False})
                    
                    case 'tutors':
                        serializer = TutorsSerializer(data=
                            {
                            'subject': added_activity['name'],
                            'name': added_activity['subinfo']['name'],
                            'surname': added_activity['subinfo']['surname'],
                            'patronymic': added_activity['subinfo']['patronymic'],
                            'info': added_activity['info'],
                            'student': chosen_student
                            })
                        
                        if serializer.is_valid():
                            serializer.save()
                            return Response(
                                {
                                    'message': f"Saved: {serializer.data['name']}",
                                    'success': True,
                                    'ID': serializer.data['id']
                                },
                                status=status.HTTP_201_CREATED)
                        
                        return Response({'success': False})
                        
                    case 'afterschools':
                        serializer = AfterschoolsSerializer(data=
                            {
                            'subject': added_activity['name'],
                            'name': 'none',
                            'info': added_activity['info'],
                            'student': chosen_student
                            })
                        
                        if serializer.is_valid():
                            serializer.save()
                            return Response(
                                {
                                    'message': f"Saved: {serializer.data['name']}",
                                    'success': True,
                                    'ID': serializer.data['id']
                                },
                                status=status.HTTP_201_CREATED
                                )
                        
                        return Response({'success': False})
                        
                    case _:
                        return Response({'success': False}, status=status.HTTP_400_BAD_REQUEST)
                    
            except ValidationError as err:
                return Response({'message': err.messages, 'success': False})
        
        elif 'deleted_activity' in request.data:
            deleted = request.data.get('deleted_activity')
            try:
                match deleted['activity_type']:
                    case 'olympiads':
                        olympiad = get_object_or_404(Olympiads, id=deleted['deleted_activity_id'])
                        olympiad.delete()
                        return Response({'message': f"Deleted: {olympiad.id}", 'success': True}, status=status.HTTP_201_CREATED)
                        
                    case 'tutors':
                        tutor = get_object_or_404(Tutors, id=deleted['deleted_activity_id'])
                        tutor.delete()
                        return Response({'message': f"Deleted: {tutor.id}", 'success': True}, status=status.HTTP_201_CREATED)
                    
                    case 'afterschools':
                        afterschool = get_object_or_404(Afterschools, id=deleted['deleted_activity_id'])
                        afterschool.delete()
                        return Response({'message': f"Deleted: {afterschool.id}", 'success': True}, status=status.HTTP_201_CREATED)
                    
                    case _:
                        return Response({'success': False}, status=status.HTTP_400_BAD_REQUEST)
            except:
                return Response({'success': False}, status=status.HTTP_400_BAD_REQUEST)
