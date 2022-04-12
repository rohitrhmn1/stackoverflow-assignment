from django.contrib.auth import authenticate
from django.contrib.auth.models import update_last_login
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError as DjangoValidationError
from rest_framework import serializers
from rest_framework.exceptions import AuthenticationFailed, ValidationError
from rest_framework_simplejwt.settings import api_settings as jwt_settings

from accounts.models import User


class UserRegisterSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(required=True)
    password1 = serializers.CharField(max_length=50, min_length=8, required=True, write_only=True)
    password2 = serializers.CharField(max_length=50, min_length=8, required=True, write_only=True)

    class Meta:
        model = User
        fields = ('email', 'password1', 'password2')

    def validate(self, attrs):
        email = attrs.get('email').lower()
        password1 = attrs.get('password1')
        password2 = attrs.get('password2')
        email_check = self.Meta.model.objects.filter(email__iexact=email).first()
        if email_check:
            raise AuthenticationFailed(detail="User with this email already exists.")
        if password2 != password1:
            raise ValidationError(detail="Passwords do not match.")
        try:
            validate_password(password1)
        except DjangoValidationError as error:
            raise ValidationError(detail=error.messages)
        user = self.Meta.model.objects.create_user(password=password2, email=email)
        data = user.get_tokens
        return data


class UserLoginSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(min_length=3, required=True)
    password = serializers.CharField(max_length=50, min_length=5, write_only=True)

    class Meta:
        model = User
        fields = ('email', 'password')

    def get_user_by_email(self, email):
        try:
            return self.Meta.model.objects.get(email__iexact=email)
        except self.Meta.model.DoesNotExist:
            raise AuthenticationFailed("User does not exist.")

    def validate(self, attrs):
        email = attrs.get('email', None)
        password = attrs.get('password', None)
        self.get_user_by_email(email=email)
        user = authenticate(email=email, password=password)
        if not user:
            raise AuthenticationFailed('Invalid credentials.')
        data = user.get_tokens
        if jwt_settings.UPDATE_LAST_LOGIN:
            update_last_login(None, user)
        return data

