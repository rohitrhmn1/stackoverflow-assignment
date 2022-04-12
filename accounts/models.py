import uuid

from django.contrib.auth.hashers import make_password
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.db import models
from django.utils.translation import gettext_lazy as _

from main.utils import UsernameValidator
from rest_framework_simplejwt.tokens import RefreshToken


class UserManager(BaseUserManager):
    def get_by_natural_key(self, username):
        """
        By default, Django does a case-sensitive check on usernames. This is wrong.
        Overriding this method fixes it.
        """
        return self.get(**{self.model.USERNAME_FIELD + '__iexact': username})

    def _create_user(self, email, password, **extra_fields):
        """
        Create and save a user with the given email, and password.
        """
        if not email:
            raise ValueError('The given email must be set.')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.password = make_password(password)
        user.save(using=self._db)
        return user

    def create_user(self, email=None, password=None, **extra_fields):
        extra_fields.setdefault("is_staff", False)
        extra_fields.setdefault("is_superuser", False)
        return self._create_user(email, password, **extra_fields)

    def create_superuser(self, email=None, password=None, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        if extra_fields.get("is_staff") is not True:
            raise ValueError("Superuser must have is_staff=True.")
        if extra_fields.get("is_superuser") is not True:
            raise ValueError("Superuser must have is_superuser=True.")
        return self._create_user(email, password, **extra_fields)

    def get_active(self, *args, **kwargs):
        return super().get(is_active=True, *args, **kwargs)


class User(AbstractBaseUser, PermissionsMixin):
    GENDER_CHOICES = (
        ('M', 'Male'),
        ('F', "Female"),
    )
    username_validator = UsernameValidator()
    unique_id = models.UUIDField(default=uuid.uuid4, unique=True, editable=False, primary_key=True)
    name = models.CharField(_("full name"), max_length=100, null=True, blank=True)
    email = models.EmailField(_("email address"), unique=True, error_messages={
        "unique": _("A user with that email already exists."),
    })
    username = models.CharField(
        _("username"), max_length=150, blank=True, null=True, unique=True, validators=[username_validator],
        help_text=_("150 characters or fewer. Letters, digits and ./+/-/_ only."),
        error_messages={"unique": _("A user with that username already exists."), }
    )
    phone = models.CharField(
        _("phone number"), max_length=14, blank=True, null=True, unique=True,
        error_messages={"unique": _("A user with that username already exists."), }
    )
    date_of_birth = models.DateField(blank=True, null=True)
    gender = models.CharField(choices=GENDER_CHOICES, blank=True, max_length=1)

    is_staff = models.BooleanField(
        _("staff status"), default=False, help_text=_("Designates whether the user can log into this admin site."),
    )
    is_active = models.BooleanField(
        _('active'), default=True, help_text=_(
            'Designates whether this user should be treated as active. '
            'Unselect this instead of deleting accounts.'
        ),
    )

    date_joined = models.DateTimeField(auto_now_add=True, editable=False)
    updated_at = models.DateTimeField(auto_now=True, editable=True)

    EMAIL_FIELD = "email"
    USERNAME_FIELD = 'email'

    objects = UserManager()

    @property
    def get_tokens(self):
        refresh = RefreshToken.for_user(self)
        tokens = {"refresh": str(refresh), "access": str(refresh.access_token)}
        return tokens
