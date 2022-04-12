from django import forms
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.contrib.auth.forms import ReadOnlyPasswordHashField
from django.contrib.auth.password_validation import validate_password, password_validators_help_text_html
from django.core.exceptions import ValidationError
from django.utils.translation import gettext_lazy as _

from accounts.models import User


class UserCreationForm(forms.ModelForm):
    email = forms.EmailField(label='Email', widget=forms.EmailInput)
    password1 = forms.CharField(
        label=_("Password"),
        strip=False,
        widget=forms.PasswordInput(attrs={'autocomplete': 'new-password'}),
        help_text=password_validators_help_text_html(),
    )
    password2 = forms.CharField(
        label=_("Password confirmation"),
        widget=forms.PasswordInput(attrs={'autocomplete': 'new-password'}),
        strip=False,
        help_text=_("Enter the same password as before, for verification."),
    )

    class Meta:
        model = User
        fields = ('email',)

    def clean_password2(self):
        password1 = self.cleaned_data.get("password1")
        password2 = self.cleaned_data.get("password2")
        if password1 and password2 and password1 != password2:
            raise ValidationError(_("Passwords do not match."))
        return password2

    def clean_email(self):
        data = self.cleaned_data.get('email')
        return data.lower()

    def _post_clean(self):
        super()._post_clean()
        password = self.cleaned_data.get('password2')
        if password:
            try:
                validate_password(password, self.instance)
            except ValidationError as error:
                self.add_error('password2', error)

    def save(self, commit=True):
        user = super().save(commit=False)
        user.set_password(self.cleaned_data["password1"])
        if commit:
            user.save()
        return user


class UserChangeForm(forms.ModelForm):
    password = ReadOnlyPasswordHashField(
        label="Password",
        help_text=(
            "Raw passwords are not stored, so there is no way to see "
            "this user's password, but you can change the password "
            "using <a href=\"../password/\">this form</a>."
        ))

    class Meta:
        model = User
        fields = ('email', 'password',)

    def clean_email(self):
        data = self.cleaned_data.get('email')
        return data.lower()

    def save(self, commit=True):
        user = super().save(commit=False)
        if commit:
            user.save()
        return user


class UserAdmin(BaseUserAdmin):
    form = UserChangeForm
    add_form = UserCreationForm
    list_display = ("email", 'phone', 'is_staff', 'date_joined',)
    fieldsets = (
        ('Contact Details', {'fields': ("email", 'username', 'phone')}),
        ('Password', {'fields': ('password',)}),
        ('Personal info', {'fields': ('name', 'gender', 'date_of_birth',)}),
        ('Permissions', {'fields': ('groups', 'user_permissions',)}),
        ('Access Level', {'fields': ('is_active', 'is_staff', 'is_superuser',)}),
        ('System Data', {'fields': ('unique_id', 'date_joined', 'last_login', 'updated_at')}),
    )
    add_fieldsets = ((None, {'classes': ('wide',), 'fields': ('email', 'password1', 'password2'), }),)
    ordering = ("email",)
    list_filter = ('is_staff', 'is_active',)
    search_fields = ('unique_id', 'username', 'email', 'phone',)
    readonly_fields = ('unique_id', 'date_joined', 'last_login', 'updated_at')
    filter_horizontal = ('groups', 'user_permissions',)
    list_per_page = 25


admin.site.register(User, UserAdmin)
