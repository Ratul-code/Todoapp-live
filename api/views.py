from django.shortcuts import render, redirect
from .models import Todo
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .serializers import Todoserializer as TS


# Create your views here.

@api_view(["GET"])
def apishow(req):
    api_urls = {
        'List': '/todo-list/',
        'Detail View': '/todo-details/<str:pk>/',
        'Create': '/todo-create/',
        'Update': '/todo-update/<str:pk>/',
        'Delete': '/todo-delete/<str:pk>/',
    }
    return Response(api_urls)


@api_view(["GET"])
def todoList(req):
    Todos = Todo.objects.all()
    serializer = TS(Todos, many=True)
    return Response(serializer.data)


@api_view(["GET"])
def tododetails(req, pk):
    todo = Todo.objects.get(id=pk)
    serializer = TS(todo, many=True)
    return Response(serializer.data)


@api_view(["POST"])
def todocreate(req):
    serializer = TS(data=req.data)
    if serializer.is_valid():
        serializer.save()

    return Response(serializer.data)


@api_view(["POST"])
def todoupdate(req, pk):
    todo = Todo.objects.get(id=pk)
    serializer = TS(instance=todo, data=req.data)
    if serializer.is_valid():
        serializer.save()

    return Response(serializer.data)


@api_view(["DELETE"])
def tododelete(req, pk):
    Todo.objects.get(id=pk).delete()
    return Response('Item Successfully Deleted')
