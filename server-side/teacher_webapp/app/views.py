from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login, logout
from .models import Student
from django.http import JsonResponse
import json
# def index(request):
#     template = 'index.html'
#     context = {
#         'students': Student.objects.all()
#     }
#     return render(
#         request,
#         template,
#     )

def user_login(request):
    if request.method == 'POST':
        username = request.POST['username']
        password = request.POST['password']
        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request=request, user=user)
            return redirect('user_account')
    return render(request, 'index.html')

def user_account(request):
    if request.user.is_authenticated:
        if request.method == 'POST':
            logout(request)
            return redirect('login')
        elif request.method == 'GET':
            template = 'user_account.html'
            user = request.user
            user_data = {
                'username': user.username,
                'lastname': user.last_name
            }
            # json_data = json.dumps(user_data)
            # print({'user_data': json_data})
            return render(
                request, 
                template, 
                context={'user_data': user_data}
                )
    else:
        return redirect('login')