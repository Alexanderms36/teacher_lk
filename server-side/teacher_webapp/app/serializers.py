from rest_framework import serializers
from .models import User, Classes, Student, Olympiads

    
class StudentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Student
        fields = ['id', 'name', 'surname', 'patronymic', 'classes_id', "health_group"]

class ClassesSerializer(serializers.ModelSerializer):
    students = StudentSerializer(many=True, read_only=True, source='student_set')
    
    class Meta:
        model = Classes
        fields = ['id', 'name', 'main_teacher_id', 'students']

    def get_students_id(self, obj):
        students = Student.objects.filter(classes_id=obj)
        return [student.id for student in students]
    
class UserSerializer(serializers.ModelSerializer):
    classes = ClassesSerializer(many=True, read_only=True, source='classes_set')

    class Meta:
        model = User
        fields = ["id", "first_name", "last_name", "patronymic", "classes"]

    def get_classes_id(self, obj):
        classes = obj.classes_set.all()
        return [c.id for c in classes]
    
class OlympiadsSerializer(serializers.ModelSerializer):
    student = StudentSerializer(many=False, read_only=True, source='student_set')

    class Meta:
        model = Olympiads
        fields = ["id", "name", "place", "info", "student"]
