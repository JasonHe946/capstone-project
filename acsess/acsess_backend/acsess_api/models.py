import random
import string
from django.db import models
from django.contrib.auth.models import User
from django.contrib.contenttypes.models import ContentType
from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.postgres.fields import ArrayField
from django.utils.timezone import now, timedelta
from .tasks import schedule_reminder_email, schedule_check_in_reminder

# Create your models here.

def get_default_user():
    return User.objects.get(username='acsess').id

class hdr_student(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    student_no = models.AutoField(primary_key=True)
    student_zid = models.CharField(max_length=50, unique=True)
    student_name = models.CharField(max_length=100)
    student_email = models.CharField(max_length=254, unique=True)
    student_faculty = models.CharField(max_length=100)
    student_school = models.CharField(max_length=100)
    student_degree = models.CharField(max_length=100)
    student_role = models.CharField(max_length=100)
    otp = models.CharField(max_length=6, blank=True, null=True)

    def __str__(self):
        return self.student_name
    
    def generate_otp(self, length=6):
        return ''.join(random.choices(string.ascii_uppercase, k=length))

    def update_otp(self):
        self.otp = self.generate_otp()
        self.save()

class cse_staff(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    staff_no = models.AutoField(primary_key=True)
    staff_zid = models.CharField(max_length=50, unique=True)
    staff_name = models.CharField(max_length=100)
    staff_email = models.CharField(max_length=254, unique=True)
    staff_faculty = models.CharField(max_length=100)
    staff_school = models.CharField(max_length=100)
    staff_title = models.CharField(max_length=100)
    staff_role = models.CharField(max_length=100)
    otp = models.CharField(max_length=6, blank=True, null=True)

    def __str__(self):
        return self.staff_name

    def generate_otp(self, length=6):
        return ''.join(random.choices(string.ascii_uppercase, k=length))

    def update_otp(self):
        self.otp = self.generate_otp()
        self.save()

class room(models.Model):
    room_id = models.AutoField(primary_key=True)
    room_number = models.CharField(max_length=100)
    room_location = models.CharField(max_length=200)
    room_capacity = models.IntegerField()
    room_utilities = models.CharField(max_length=255, blank=True, null=True)
    room_description = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.room_number

class hotdesk(models.Model):
    hotdesk_id = models.AutoField(primary_key=True)
    hotdesk_number = models.CharField(max_length=100)
    hotdesk_location = models.CharField(max_length=200)
    hotdesk_floor = models.IntegerField()
    hotdesk_utilities = models.CharField(max_length=255, blank=True, null=True)
    hotdesk_description = models.TextField(blank=True, null=True)
    hotdesk_coordinates = ArrayField(models.FloatField(), blank=True, null=True)

    def __str__(self):
        return self.hotdesk_number


class booking(models.Model):
    booking_id = models.AutoField(primary_key=True)
    
    content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE)
    object_id = models.PositiveIntegerField()
    room_or_hotdesk = GenericForeignKey('content_type', 'object_id')
    
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    start_time = models.DateTimeField()
    end_time = models.DateTimeField()
    state = models.CharField(max_length=100)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    check_in_status = models.CharField(max_length=20, default='pending')
    checked_in_at = models.DateTimeField(null=True, blank=True)

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.room_or_hotdesk} - {self.user} - {self.start_time} - {self.end_time} - {self.state}"

class pending_booking(models.Model):
    pending_booking_id = models.AutoField(primary_key=True)
    
    content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE)
    object_id = models.PositiveIntegerField()
    room_or_hotdesk = GenericForeignKey('content_type', 'object_id')
    
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    start_time = models.DateTimeField()
    end_time = models.DateTimeField()
    booking = models.ForeignKey(booking, on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.room_or_hotdesk} - {self.user} - {self.start_time} - {self.end_time}"
    
class booking_history(models.Model):
    booking = models.ForeignKey(booking, on_delete=models.SET_NULL, null=True, related_name='history')
    booking_history_id = models.AutoField(primary_key=True)
    
    content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE)
    object_id = models.PositiveIntegerField()
    room_or_hotdesk = GenericForeignKey('content_type', 'object_id')
    
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    start_time = models.DateTimeField()
    end_time = models.DateTimeField()
    state = models.CharField(max_length=100)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    check_in_status = models.CharField(max_length=20, default='pending')
    checked_in_at = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f"{self.room_or_hotdesk} - {self.user} - {self.start_time} - {self.end_time} - {self.state}"

