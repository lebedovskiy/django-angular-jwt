import jwt

from django.contrib.auth import authenticate
from rest_framework import status

from rest_framework.generics import RetrieveUpdateDestroyAPIView
from rest_framework.parsers import MultiPartParser, JSONParser
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_jwt.settings import api_settings

from test_task.settings import SECRET_KEY

from .models import User
from .serializers import UserSerializer

# указываем хендлеры для создания токена
jwt_payload_handler = api_settings.JWT_PAYLOAD_HANDLER
jwt_encode_handler = api_settings.JWT_ENCODE_HANDLER


class CreateUserView(APIView):
    serializer_class = UserSerializer
    permission_classes = (AllowAny,)
    
    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LoginUserView(APIView):
    """
    Аутентификация пользователя

    """
    permission_classes = (AllowAny,)
    
    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')
        user = authenticate(email=email, password=password)
        if user:
            payload = jwt_payload_handler()
            token = {
                'token': jwt.encode(payload, SECRET_KEY),
                'status': 'success',
                }
            return Response(token)
        else:
            return Response(
              {'error': 'Invalid credentials',
               'status': 'failed'},
            )


class UserDetail(RetrieveUpdateDestroyAPIView):
    """
    Контроллер пользователя, можно обратиться только после входа
    """
    permission_classes = [
        IsAuthenticated,
    ]
    queryset = User.objects.all()
    serializer_class = UserSerializer
    parser_classes = [MultiPartParser, JSONParser]
