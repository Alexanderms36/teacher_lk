from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login, logout
from .models import Student

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

def user_logout(request):
    pass

def user_account(request):
    template = 'user_account.html'
    return render(request, template)