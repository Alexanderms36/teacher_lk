from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from .models import Student, Classes
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
                print(request.POST)
                link = request.POST['chosen_button']
                return redirect('pupils', link=link)
        elif request.method == 'GET':
            template = 'user_account.html'
            user_json(request)
            return render(
                request, 
                template
                )
    else:
        return redirect('login')
    
def pupils(request, link):
    if request.user.is_authenticated:
        if request.method == 'POST':
            if 'logout' in request.POST:
                logout(request)
                return redirect('login')
            elif 'return' in request.POST:
                return redirect('user_account')
        else:
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
    user_classes = user.classes_set.all()
    classes_string = " ".join(user_classes[i].name for i in range(len(user_classes)))
    user_data = {
        'firstname': user.first_name,
        'lastname': user.last_name,
        'patronymic': user.patronymic,
        'classes': classes_string
    }
    return JsonResponse(user_data)

# def classes_json_get(request):
#     user = request.user
#     user_classes = user.classes_set.all()
#     us = user.classes_set.filter(name__startwith="iPhone")
#     classes_data = {
#         'name': 
#     }
#     return JsonResponse(classes_data)
