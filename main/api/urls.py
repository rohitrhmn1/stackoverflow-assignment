from django.urls import path, include

urlpatterns = [
    path('accounts/', include('accounts.urls'), name='accounts'),
    path('search/', include('search.urls'), name='search'),
]
