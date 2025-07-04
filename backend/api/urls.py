from django.urls import path
from .views import ImagePredictor

urlpatterns = [
    path('predict/', ImagePredictor.as_view(), name='image-predictor'),
]
