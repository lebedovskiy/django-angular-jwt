from .models import User
from rest_framework import serializers


class UserSerializer(serializers.HyperlinkedModelSerializer):
    password = serializers.CharField(write_only=True, required=True)
    avatar = serializers.ImageField(allow_empty_file=True, required=False)
    
    class Meta:
        model = User
        fields = ('email', 'password', 'id', 'first_name', 'middle_name', 'last_name', 'phone', 'avatar')

    def create(self, validated_data):
        return User.objects.create_user(**validated_data)

    def update(self, instance, validated_data):
        instance.email = validated_data.get('email', instance.email)
        instance.first_name = validated_data.get('first_name',
                                                 instance.first_name)
        instance.middle_name = validated_data.get('middle_name',
                                                  instance.middle_name)
        instance.last_name = validated_data.get('last_name',
                                                instance.last_name)
        instance.phone = validated_data.get('phone',
                                            instance.phone),
        instance.avatar = validated_data.get('avatar',
                                             instance.avatar)
    
        password = validated_data.get('password', None)
        confirm_password = validated_data.get('confirm_password', None)
    
        if password and password == confirm_password:
            instance.set_password(password)
    
        instance.save()
        return instance
