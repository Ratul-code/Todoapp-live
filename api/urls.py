from django.urls import path
from . import views

urlpatterns = [
    path('', views.apishow, name="apishow"),
    path('todo-list/', views.todoList, name="todoList"),
    path('todo-details/<str:pk>/', views.tododetails, name="tododetails"),
    path('todo-create/', views.todocreate, name="todocreate"),
    path('todo-update/<str:pk>/', views.todoupdate, name="todoupdate"),
    path('todo-delete/<str:pk>/', views.tododelete, name="tododelete"),

]
