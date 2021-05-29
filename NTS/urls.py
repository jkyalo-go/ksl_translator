from django.urls import path

from NTS import views

urlpatterns = [
    path('', views.IndexView.as_view(), name='index'),
]
