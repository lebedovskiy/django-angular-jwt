from .managers import UserManager

import jwt

from datetime import datetime, timedelta

from django.db import models

from django.conf import settings
from django.contrib.auth.base_user import AbstractBaseUser
from django.contrib.auth.models import PermissionsMixin

from django.utils.translation import ugettext_lazy as _


def user_directory_path(instance, filename):
    """
    Получаем путь загрузки для ускорени поиска изображений
    """
    return 'user_{0}/{1}'.format(instance.pk, filename)


class User(AbstractBaseUser, PermissionsMixin):
    """
    Создаем пользователя для аутентификации по  e-mail
    """
    email = models.EmailField(_('email address'), unique=True)
    first_name = models.CharField(_('first name'), max_length=30, blank=True)
    last_name = models.CharField(_('last name'), max_length=30, blank=True)
    middle_name = models.CharField(_('Отчество'), max_length=30, blank=True)
    avatar = models.ImageField(upload_to=user_directory_path, verbose_name='Аватар', null=True, blank=True)
    phone = models.CharField(max_length=12, verbose_name='Телефон', blank=True)
    is_superuser = models.BooleanField(
        verbose_name='Администратор', default=False)
    is_active = models.BooleanField(default=True)

    objects = UserManager()

    USERNAME_FIELD = 'email'

    class Meta:
        verbose_name = u'user'
        verbose_name_plural = u'users'

    def get_full_name(self):
        """
        Возвращает ФИО пользователя (нужно для работы с пользователями в админке)
        """
        full_name = '%s %s %s' % (self.first_name, self.middle_name, self.last_name)
        return full_name.strip()

    def get_short_name(self):
        """
        Возвращает имя пользователя (нужно для работы с пользователями в админке)
        """
        return self.first_name
    
    def _generate_jwt_token(self):
        """
        Создаем токен
        """
        dt = datetime.now() + timedelta(days=60)

        token = jwt.encode({
            'id': self.pk,
            'exp': int(dt.strftime('%s'))
        }, settings.SECRET_KEY, algorithm='HS256')

        return token.decode('utf-8')

    @property
    def is_staff(self):
        """
        Проверяет флаг персонала (нужно для работы суперпользователем в админке)
        """
        return self.is_superuser
    
    @property
    def token(self):
        return self._generate_jwt_token()
