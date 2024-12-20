# Generated by Django 5.0.6 on 2024-06-22 06:32

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='cse_staff',
            fields=[
                ('staff_no', models.AutoField(primary_key=True, serialize=False)),
                ('staff_zid', models.CharField(max_length=50)),
                ('staff_name', models.CharField(max_length=50)),
                ('staff_faculty', models.CharField(max_length=50)),
                ('staff_school', models.CharField(max_length=50)),
                ('staff_title', models.CharField(max_length=50)),
                ('staff_role', models.CharField(max_length=50)),
                ('staff_password', models.CharField(max_length=50)),
            ],
        ),
        migrations.CreateModel(
            name='hdr_student',
            fields=[
                ('student_no', models.AutoField(primary_key=True, serialize=False)),
                ('student_zid', models.CharField(max_length=50)),
                ('student_name', models.CharField(max_length=50)),
                ('student_faculty', models.CharField(max_length=50)),
                ('student_school', models.CharField(max_length=50)),
                ('student_degree', models.CharField(max_length=50)),
                ('student_role', models.CharField(max_length=50)),
                ('student_password', models.CharField(max_length=50)),
            ],
        ),
    ]
