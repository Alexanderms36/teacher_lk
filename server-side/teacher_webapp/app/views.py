from django.contrib.auth import authenticate, login, logout
from .models import Student, Classes
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.reverse import reverse
from rest_framework.authtoken.models import Token
from rest_framework.permissions import IsAuthenticated
from rest_framework.renderers import TemplateHTMLRenderer, JSONRenderer
from .serializers import UserSerializer, StudentSerializer, ClassesSerializer


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
        print(serializer.data)
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
