from django.urls import path

from STN import views

urlpatterns = [
    path('image/', views.handle_pic),
]
