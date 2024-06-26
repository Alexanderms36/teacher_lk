# Generated by Django 5.0.4 on 2024-07-01 11:30

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0006_alter_student_health_group'),
    ]

    operations = [
        migrations.CreateModel(
            name='Olympiads',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=512)),
                ('place', models.IntegerField(blank=True)),
                ('info', models.CharField(blank=True, max_length=1024)),
                ('student', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='app.student')),
            ],
        ),
    ]
