# Generated by Django 5.0.4 on 2024-07-28 05:15

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('acsess_api', '0015_alter_booking_history_booking'),
    ]

    operations = [
        migrations.AddField(
            model_name='cse_staff',
            name='otp',
            field=models.CharField(blank=True, max_length=6, null=True),
        ),
        migrations.AddField(
            model_name='hdr_student',
            name='otp',
            field=models.CharField(blank=True, max_length=6, null=True),
        ),
    ]