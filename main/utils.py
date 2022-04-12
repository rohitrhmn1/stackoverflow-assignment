import html
from django.core.cache import cache
from collections import OrderedDict
from urllib.parse import urlencode

import requests
from django.contrib.auth.validators import UnicodeUsernameValidator
from django.db import models
from django.utils import timezone
from django.utils.translation import gettext_lazy as _
from rest_framework.pagination import LimitOffsetPagination as BaseLimitOffsetPagination
from rest_framework.response import Response


class ModelManager(models.Manager):
    def filter_active(self, *args, **kwargs):
        return super().filter(is_active=False, *args, **kwargs)


def get_expiry():
    return timezone.now() + timezone.timedelta(days=14)


class UsernameValidator(UnicodeUsernameValidator):
    regex = r"^[\w.+-]+\Z"
    message = _(
        "Enter a valid username. This value may contain only letters, "
        "numbers, and ./+/-/_ characters."
    )
    flags = 0


def response_format(detail, data=None, success=False, **kwargs):
    response_data = OrderedDict([
        ('success', success),
        ('detail', detail),
        ('data', data),
    ])
    if kwargs.get('total'):
        response_data['count'] = kwargs.get('total')
    return response_data


class LimitOffsetPagination(BaseLimitOffsetPagination):

    def get_paginated_response(self, data, detail="No data provided.", success=False):
        return Response(OrderedDict([
            ('count', self.count),
            ('next', self.get_next_link()),
            ('previous', self.get_previous_link()),
            ("success", success),
            ("detail", detail),
            ("data", data),
        ]))


def get_stackoverflow_response(**kwargs):
    data = {}
    q = kwargs.get('q', None)
    answers = kwargs.get('answers', None)
    views = kwargs.get('views', None)
    title = kwargs.get('title', None)
    user = kwargs.get('user', None)
    url = kwargs.get('url', None)
    body = kwargs.get('body', None)
    from_date = kwargs.get('from_date', None)
    to_date = kwargs.get('to_date', None)
    tagged = kwargs.get('tagged', None)
    nottagged = kwargs.get('nottagged', None)
    closed = kwargs.get('closed', None)
    migrated = kwargs.get('migrated', None)
    notice = kwargs.get('notice', None)
    wiki = kwargs.get('wiki', None)
    order_by = kwargs.get('order_by', None)
    sort_by = kwargs.get('sort_by', None)
    page = kwargs.get('page', 1)

    if q:
        data['q'] = q
    if answers:
        data['answers'] = answers
    if views:
        data['views'] = views
    if title:
        data['title'] = title
    if user:
        data['user'] = user
    if url:
        data['url'] = url
    if body:
        data['body'] = body
    if from_date:
        data['from_date'] = int(from_date.timestamp())
    if to_date:
        data['to_date'] = int(to_date.timestamp())
    if tagged:
        data['tagged'] = tagged
    if nottagged:
        data['nottagged'] = nottagged
    if closed:
        data['closed'] = closed
    if migrated:
        data['migrated'] = migrated
    if notice:
        data['notice'] = notice
    if wiki:
        data['wiki'] = wiki
    if order_by:
        data['order_by'] = order_by
    if sort_by:
        data['sort_by'] = sort_by
    if page:
        data['page'] = page
    url = "https://api.stackexchange.com/2.3/search/advanced?site=stackoverflow&filter=!nKzQUR693x&" + urlencode(data)
    print("URL=====>", url)
    cached_resp = cache.get(url)
    if not cached_resp:
        print("<==== RESULT NOT IN CACHE =====>")
        response = requests.get(url)
        resp = response.json()
        cache.set(url, resp)
        return resp
    print("<==== RESULT IN CACHE =====>")
    return cached_resp
