# Generated by Django 5.0.4 on 2024-07-14 10:04

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('acsess_api', '0010_pending_booking_booking_id'),
    ]

    operations = [
        migrations.RenameField(
            model_name='pending_booking',
            old_name='booking_id',
            new_name='booking',
        ),
    ]