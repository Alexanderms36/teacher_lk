from rest_framework import serializers
from .models import User, Classes, Student


class UserSerializer(serializers.ModelSerializer):
    classes = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ["id", "first_name", "last_name", "patronymic", "classes"]

    def get_classes(self, obj):
        classes = obj.classes_set.all()
        return [c.name for c in classes]
    
class StudentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Student
        fields = ['id', 'name', 'surname', 'patronymic', 'classes_id']

class ClassesSerializer(serializers.ModelSerializer):
    students = StudentSerializer(many=True, read_only=True, source='student_set')
    
    class Meta:
        model = Classes
        fields = ['id', 'name', 'main_teacher_id', 'students']

    def get_students_id(self, obj):
        students = Student.objects.filter(classes_id=obj)
        return [student.id for student in students]
    