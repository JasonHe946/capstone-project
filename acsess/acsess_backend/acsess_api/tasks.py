from celery import shared_task
from django.core.mail import send_mail
from django.apps import apps
from django.utils import timezone

@shared_task
def send_reminder_email(booking_id):
    Booking = apps.get_model('acsess_api', 'booking')
    try:
        bookingInfo = Booking.objects.get(booking_id=booking_id)
        subject = f'Reminder for your booking at {bookingInfo.start_time}'
        message = 'This is a reminder that your booking starts in one hour.'
        from_email = 'webmaster@localhost'
        recipient_list = [bookingInfo.user.email]
        send_mail(subject, message, from_email, recipient_list)
    except Booking.DoesNotExist:
        pass

def schedule_reminder_email(booking_id, send_time):
    send_reminder_email.apply_async((booking_id,), eta=send_time)
    

@shared_task
def delete_expired_bookings():
    from .models import booking
    now = timezone.now()
    expired_bookings = booking.objects.filter(end_time__lt=now)
        
    # Update the state of each expired booking
    for expired_booking in expired_bookings:
        expired_booking.state = 'finished'
        expired_booking.save()

    # Delete the expired bookings
    expired_bookings.delete()

@shared_task
def send_check_in_reminder(booking_id):
    Booking = apps.get_model('acsess_api', 'booking')
    try:
        booking = Booking.objects.get(booking_id=booking_id)
        subject = f'Check-in Reminder for your booking at {booking.start_time}'
        message = 'This is a reminder to check-in for your booking in 15 minutes.'
        from_email = 'webmaster@localhost'
        recipient_list = [booking.user.email]
        send_mail(subject, message, from_email, recipient_list)
    except Booking.DoesNotExist:
        pass

def schedule_check_in_reminder(booking_id, send_time):
    send_check_in_reminder.apply_async((booking_id,), eta=send_time)
