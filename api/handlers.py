from .serializers import UserSerializer


def jwt_response_payload_handler(token, user=None, request=None):
    """
    Создаем респонс с нформацией о пользователе
    """
    return {
        'token': token,
        'user': UserSerializer(user, context={'request': request}).data,
    }
