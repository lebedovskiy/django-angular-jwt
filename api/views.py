from django.contrib.auth import authenticate
from test_task.settings import SECRET_KEY

from rest_framework.views import APIView
from rest_framework import status
from rest_framework.generics import RetrieveUpdateDestroyAPIView, ListCreateAPIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework_jwt.settings import api_settings
from rest_framework.parsers import FileUploadParser, JSONParser

import jwt

from .serializers import UserSerializer
from .models import User
from.permissions import AllowOptionsAuthentication


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
    permission_classes = (AllowAny,)
    
    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')
        user = authenticate(email=email, password=password)
        if user:
            payload = jwt_payload_handler(user)
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
    permission_classes = [
                          AllowAny,
                          ]
    queryset = User.objects.all()
    serializer_class = UserSerializer
    parser_classes = (FileUploadParser, JSONParser)


class UserList(ListCreateAPIView):
    permission_classes = [
                          AllowAny,
                          ]
    queryset = User.objects.all()
    serializer_class = UserSerializer
