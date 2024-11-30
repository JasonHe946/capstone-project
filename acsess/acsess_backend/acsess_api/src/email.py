from django.http import JsonResponse
from rest_framework import status
from django.core.mail import send_mail
from django.conf import settings
from django.shortcuts import get_object_or_404
from django.contrib.auth.models import User
from ..models import room
import json

def contactAdmin(request):
    try:
        data = json.loads(request.body)
    except json.JSONDecodeError:
        return JsonResponse({'error': 'Invalid JSON'}, status=400)

    # extract data fiels from json
    email = data.get('email')
    zid = data.get('zid')
    name = data.get('name')
    role = data.get('role')
    message = data.get('message')

    if not email or not zid or not name or not message:
        raise ValueError("'Missing fields'")

    subject = f"Contact form submission from {name} (ZID: {zid})"
    full_message = f"The following user has requested a new Acsess account\n\nName: {name}\nZID: {zid}\nEmail: {email}\n\n{name} is requesting a {role} account\n\nMessage:\n{message}"
    admin_emails = [admin[1] for admin in settings.ADMINS]

    send_mail(
        subject,
        full_message,
        settings.DEFAULT_FROM_EMAIL,
        admin_emails,
        fail_silently=False,
    )

def emailDefaultPassword(data, name):
    username = data.get('user').get('username')
    email = [data.get('user').get('email')]
    password = data.get('user').get('password')

    if not email or not password or not username or not name:
        raise ValueError("'Missing fields'")

    subject = f"A CSE Admin has create a new Acsess account for you"
    full_message = f"Hi {name}\n\nA CSE Admin has created a new Acsess account for you. Please use the following details to login:\n\nUsername: {username}\nPassword: {password}\n\nFeel free to change your password when you log in"

    send_mail(
        subject,
        full_message,
        settings.DEFAULT_FROM_EMAIL,
        email,
        fail_silently=False,
    )

def emailBookingAcceptOrDeny(booking, is_accepted):

    status = "accepted" if is_accepted else "denied"
    email = [booking.user.email]
    name = booking.user.username
    location = get_object_or_404(room, room_id=booking.object_id).room_number

    subject = f"Update to booking request for room {location}"
    full_message = f"Hi {name}\n\nYour booking request for the room {location} has been {status} by CSE admins."

    send_mail(
        subject,
        full_message,
        settings.DEFAULT_FROM_EMAIL,
        email,
        fail_silently=False,
    )

def emailCancelBooking(booking, message, user_id):

    if user_id == booking.user.id:
        return
    if not message:
        return

    email = [booking.user.email]
    name = booking.user.username
    location = get_object_or_404(room, room_id=booking.object_id).room_number

    subject = f"Update to booking request for {location}"
    full_message = f"Hi {name},\n\nYour booking for {location} from {booking.start_time} to {booking.end_time} has been cancelled by an admin. For the following reason:\n\n{message}"

    send_mail(
        subject,
        full_message,
        settings.DEFAULT_FROM_EMAIL,
        email,
        fail_silently=False,
    )

def emailAfterHoursBooking(booking):

    name = booking.user.username
    location = get_object_or_404(room, room_id=booking.object_id).room_number
    admin_emails = [admin[1] for admin in settings.ADMINS]

    subject = f"Request by {name} to book {location} outside of working hours"
    full_message = f"A request to book {location} by {name} has been received. The request is for {booking.start_time} - {booking.end_time}"

    send_mail(
        subject,
        full_message,
        settings.DEFAULT_FROM_EMAIL,
        admin_emails,
        fail_silently=False,
    )

def emailOTP(user, profile):
    email = [user.email]
    otp = profile.otp
    name = user.username

    subject = f"Your password reset code"
    full_message = f"Hi {name},\n\nYour password reset code is {otp}. Please enter this code into the prompt to reset the password to your Acsess account.\n\nIf you did not make this request please contact an Acsess admin immediately."

    try:
        send_mail(
            subject,
            full_message,
            settings.DEFAULT_FROM_EMAIL,
            email,
            fail_silently=False,
        )
        return JsonResponse({'success': True, 'message': 'OTP has been successfully emailed to the user'}, status=200)
    except:
        return JsonResponse({'error': 'Unable to send email to user'}, status=400)

def adminHelp(request):
    try:
        data = json.loads(request.body)
        message = data.get('message')
        uid = data.get('uid')
        user = get_object_or_404(User, id=uid)
        name = user.username
    except:
        return JsonResponse({'error': 'Unknown error occured'}, status=400)

    admin_emails = [admin[1] for admin in settings.ADMINS]

    subject = f"A user has requested assistance"
    full_message = f"The following request has been received from {name}.\n\n{message}"

    try:
        send_mail(
            subject,
            full_message,
            settings.DEFAULT_FROM_EMAIL,
            admin_emails,
            fail_silently=False,
        )
        return JsonResponse({'success': True, 'message': 'Request has been sent to admins'}, status=200)
    except:
        return JsonResponse({'error': 'Unable to send request to admins'}, status=400)