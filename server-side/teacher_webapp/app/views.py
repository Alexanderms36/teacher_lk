from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from .models import Student
from django.http import JsonResponse
import json


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
            if 'logout' in request.POST:
                logout(request)
                return redirect('login')
            else:
                return redirect('pupils', "aboba")
        elif request.method == 'GET':
            template = 'user_account.html'
            user_json(request)
            return render(
                request, 
                template
                )
    else:
        return redirect('login')
    
def pupils(request, text):
    if request.user.is_authenticated:
        print(text)
        template = 'pupils_page.html'
        user_json(request)
        return render(
            request,
            template
        )
    else:
        return redirect('login')
def user_json(request):
    user = request.user
    user_data = {
        'firstname': user.first_name,
        'lastname': user.last_name,
        'patronymic': user.patronymic,
        'classes': user.groupsofclasses
    }
    return JsonResponse(user_data)
