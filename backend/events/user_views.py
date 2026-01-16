from django.contrib.auth import get_user_model
from rest_framework import generics, permissions
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView

from .serializers import UserSerializer, RegisterSerializer
from .tokens import EventHubTokenObtainPairSerializer
from .permissions import IsSelf


User = get_user_model()


class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer


class LoginView(TokenObtainPairView):
    serializer_class = EventHubTokenObtainPairSerializer
    
    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        if response.status_code == 200:
            # Get user from username in request
            username = request.data.get('username')
            if username:
                try:
                    user = User.objects.get(username=username)
                    response.data['is_staff'] = user.is_staff
                except User.DoesNotExist:
                    pass
        return response


class ProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated, IsSelf]

    def get_object(self):
        return self.request.user


