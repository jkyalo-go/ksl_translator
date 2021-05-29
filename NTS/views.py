from django import views
from django.shortcuts import render


class IndexView(views.View):
    def get(self, *args, **kwargs):
        return render(self.request, "index.html")

    def post(self, *args, **kwargs):
        return None
