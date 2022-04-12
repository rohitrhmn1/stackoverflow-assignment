from rest_framework import views, status
from rest_framework.response import Response

from main.throttles import UserDayThrottle, UserMinThrottle
from main.utils import response_format
from search.serializers import SearchSerializer


class SearchView(views.APIView):
    serializer_class = SearchSerializer
    throttle_classes = [UserMinThrottle, UserDayThrottle]

    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)

        context = response_format(
            detail="Search submitted successfully", success=True, data=serializer.validated_data['items'],
            total=serializer.validated_data['total']
        )
        return Response(context, status=status.HTTP_200_OK)
