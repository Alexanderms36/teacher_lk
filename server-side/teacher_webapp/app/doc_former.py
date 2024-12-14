from docx import Document
from docx.shared import Inches
from .models import Classes, Student
from .serializers import (
    UserSerializer, 
    StudentSerializer, 
    ClassesSerializer, 
    OlympiadsSerializer,
    TutorsSerializer,
    AfterschoolsSerializer
)


class FormDocument:
    def __init__(self, chosen_class, doc_conf):
        self.chosen_class = chosen_class
        self.persons = doc_conf['persons']
        self.selected_activities = [activity for activity in doc_conf['activities']]

    def get_from_db(self):
        group = Classes.objects.get(id=self.chosen_class)

        if (self.persons == 'all'):
            students = Student.objects.filter(classes_id=self.chosen_class)
        else:
            students = students.objects.get(id=self.persons)

        return group, students

    def add_student_data_into_doc(self, document, student):
        document.add_paragraph("h")

    def create_document(self):

        group, students = self.get_from_db()

        document = Document()
        document.add_heading('Отчёт')
        document.add_paragraph(f'Класс: {group.name}')

        # p = document.add_paragraph(f'Класс: {group.name}')
        # p.add_run('bold').bold = True
        # p.add_run(' and some ')
        # p.add_run('italic.').italic = True


        for student in students:
            self.add_student_data_into_doc(document, student)

        document.add_heading('Heading, level 1', level=1)
        document.add_paragraph('Intense quote', style='Intense Quote')



        document.save('demo.docx')
        return document
    