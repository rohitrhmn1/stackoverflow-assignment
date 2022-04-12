from rest_framework import views, status
from rest_framework.exceptions import ParseError
from rest_framework.response import Response
from rest_framework_simplejwt.exceptions import InvalidToken, TokenError
from rest_framework_simplejwt.views import TokenRefreshView

from accounts.serializers import UserRegisterSerializer, UserLoginSerializer
from main.utils import response_format


class UserTokenRefreshView(TokenRefreshView):

    def post(self, request, *args, **kwargs):
        refresh = request.data.get('refresh')
        if not refresh:
            raise ParseError(detail="Refresh token is required.")
        try:
            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)
        except TokenError as e:
            raise InvalidToken(detail=e.args[0])
        context = response_format(detail="Token refreshed.", data=serializer.validated_data, success=True)
        return Response(context, status=status.HTTP_200_OK)


class UserRegisterView(views.APIView):
    serializer_class = UserRegisterSerializer

    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        context = response_format(detail="User registered.", data=serializer.validated_data, success=True)
        return Response(context, status=status.HTTP_200_OK)


class UserLoginView(views.APIView):
    serializer_class = UserLoginSerializer

    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        context = response_format(detail="User logged in.", data=serializer.validated_data, success=True)
        return Response(context, status=status.HTTP_200_OK)
