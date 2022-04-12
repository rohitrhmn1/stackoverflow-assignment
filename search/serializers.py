from rest_framework import serializers

from main.utils import get_stackoverflow_response


class SearchSerializer(serializers.Serializer):
    q = serializers.CharField(required=False, allow_blank=True)
    answers = serializers.CharField(required=False, allow_blank=True)
    views = serializers.CharField(required=False, allow_blank=True)
    title = serializers.CharField(required=False, allow_blank=True)
    user = serializers.CharField(required=False, allow_blank=True)
    url = serializers.CharField(required=False, allow_blank=True)
    body = serializers.CharField(required=False, allow_blank=True)
    from_date = serializers.DateTimeField(required=False)
    to_date = serializers.DateTimeField(required=False)

    tagged = serializers.CharField(required=False, allow_blank=True)
    nottagged = serializers.CharField(required=False, allow_blank=True)

    closed = serializers.CharField(required=False, allow_blank=True)
    migrated = serializers.CharField(required=False, allow_blank=True)
    notice = serializers.CharField(required=False, allow_blank=True)
    wiki = serializers.CharField(required=False, allow_blank=True)
    order_by = serializers.CharField(required=False, allow_blank=True)
    sort_by = serializers.CharField(required=False, allow_blank=True)
    page = serializers.IntegerField(required=False, default=1)

    def create(self, validated_data):
        pass

    def update(self, instance, validated_data):
        pass

    def validate(self, attrs):
        resp = get_stackoverflow_response(**attrs)
        return resp
