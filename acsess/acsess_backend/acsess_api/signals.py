from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from django.contrib.auth.models import User
from .models import hdr_student, cse_staff, booking, booking_history


@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        if hasattr(instance, 'hdr_student'):
            hdr_student.objects.create(user=instance)
        elif hasattr(instance, 'cse_staff'):
            cse_staff.objects.create(user=instance)

@receiver(post_save, sender=User)
def save_user_profile(sender, instance, **kwargs):
    if hasattr(instance, 'hdr_student'):
        instance.hdr_student.save()
    elif hasattr(instance, 'cse_staff'):
        instance.cse_staff.save()
        
        
@receiver(post_save, sender=booking)
def create_or_update_booking_history(sender, instance, **kwargs):
    history, created = booking_history.objects.update_or_create(
        booking=instance,
        defaults={
            'room_or_hotdesk': instance.room_or_hotdesk,
            'user': instance.user,
            'start_time': instance.start_time,
            'end_time': instance.end_time,
            'state': instance.state,
            'check_in_status': instance.check_in_status,
            'checked_in_at': instance.checked_in_at,
        }
    )