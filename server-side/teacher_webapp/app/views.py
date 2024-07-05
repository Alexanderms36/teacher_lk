from django.contrib.auth import authenticate, login, logout
from .models import Student, Classes, Olympiads
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
    OlympiadsSerializer

)
from django.shortcuts import get_object_or_404
from django.core.files.base import ContentFile
from django.core.files.storage import default_storage
from django.views.decorators.csrf import csrf_exempt

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
        # if request.method == 'POST' and request.FILES.get('image'):
        #     image = request.FILES['image']
        #     file_name = default_storage.save(image.name, ContentFile(image.read()))
        #     file_url = default_storage.url(file_name)
        #     print(file_name)
        #     return Response({'file_url': file_url})
        
        if 'logout' in request.data:
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
        user = request.user
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
            if (chosen_activity == "olympiads"):
                return Response({'detail': 'redirected successfully'},
                                status=status.HTTP_302_FOUND,
                                headers={'Location': reverse('olympiads', args=[chosen_class, chosen_student, chosen_activity])}) 
            else:
                return Response({'detail': 'something went wrong'})
            
class OlympiadsPageView(APIView):
    permission_classes = [IsAuthenticated]
    renderer_classes = [JSONRenderer, TemplateHTMLRenderer]
    template_name = 'olympiads.html'

    def get(self, request, chosen_class, chosen_student, chosen_activity):
        olympiads = Olympiads.objects.filter(student_id=chosen_student)
        serializer = OlympiadsSerializer(olympiads, many=True)
        return Response({'data': serializer.data})
    
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
        
        elif 'added_olympiad_name' in request.data:
            added_olympiad = request.data.get('added_olympiad_name')
            #ну тут чо-то придумать надо
            serializer = OlympiadsSerializer(data={'name': added_olympiad, 'place': 1, 'info': 'nu vashe zbs', 'student': chosen_student})
            if serializer.is_valid():
                serializer.save()
                return Response({'message': f"Saved: {serializer.data['name']}", 'success': True, 'ID': serializer.data['id']}, status=status.HTTP_201_CREATED)
            return Response({'success': False})
        
        elif 'deleted_olympiad_id' in request.data:
            ans = request.data.get('deleted_olympiad_id')
            try:
                olympiad = get_object_or_404(Olympiads, id=ans)
                olympiad.delete()
                return Response({'message': f"Deleted: {olympiad.id}", 'success': True}, status=status.HTTP_201_CREATED)
            except:
                return Response({'error': 'Olympiad not found', 'success': False}, status=status.HTTP_404_NOT_FOUND)
            