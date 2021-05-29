from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt

# Create your views here.
from imageio.plugins._bsdf import Blob


@csrf_exempt
def handle_pic(request):
    response = {}
    if request.method == "POST":
        image_file = request.FILES['image']
        from STN.ml.executeinception import predict
        prediction = predict(image_file)
        response["response"] = prediction
    return JsonResponse(response)
