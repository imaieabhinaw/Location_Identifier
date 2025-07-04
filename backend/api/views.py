from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import ImageSerializer
from tensorflow.keras.models import load_model # type: ignore
import numpy as np
import cv2

class ImagePredictor(APIView):
    model = load_model('location_identifier_model.h5')
    label_mapping = {  # Update with your actual label mapping
        'eiffel_tower': 0,
        'grand_canyon': 1,
        # Add other mappings here
    }

    def post(self, request):
        serializer = ImageSerializer(data=request.data)
        if serializer.is_valid():
            file = request.FILES['image']
            img = cv2.imdecode(np.frombuffer(file.read(), np.uint8), cv2.IMREAD_COLOR)
            img = cv2.resize(img, (224, 224)) / 255.0
            img = np.expand_dims(img, axis=0)  # Add batch dimension
            prediction = self.model.predict(img)
            location_index = np.argmax(prediction)
            location = list(self.label_mapping.keys())[location_index]  # Get the location label
            return Response({'location': location}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
