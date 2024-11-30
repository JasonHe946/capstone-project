from django.http import JsonResponse
from django.contrib.auth.models import User
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from acsess_api.models import booking, room, hotdesk, pending_booking, booking_history
from django.utils import timezone
from django.utils.timezone import now, timedelta
from datetime import datetime, timedelta
from .email import emailAfterHoursBooking, emailBookingAcceptOrDeny, emailCancelBooking
from ..tasks import schedule_reminder_email, schedule_check_in_reminder
import json

def create_room_booking(request):
    try:
        # Parse the JSON data from the request body
        data = request.data

        # Extract the required fields from the data
        user_id = data.get('user_id')
        room_id = data.get('room_id')
        start_time = data.get('start_time')
        end_time = data.get('end_time')

        # Validate the required fields
        if not all([user_id, room_id, start_time, end_time]):
            return JsonResponse({'error': 'Missing required fields'}, status=400)

        # Get the user and room objects
        try:
            user = User.objects.get(id=user_id)
            room_obj = room.objects.get(room_id=room_id)
        except User.DoesNotExist:
            return JsonResponse({'error': 'User not found'}, status=404)
        except room.DoesNotExist:
            return JsonResponse({'error': 'Room not found'}, status=404)

        # Convert string datetime to Python datetime objects
        start_time = datetime.strptime(start_time, "%Y-%m-%d %H:%M:%S")
        end_time = datetime.strptime(end_time, "%Y-%m-%d %H:%M:%S")
        
        start_time = timezone.make_aware(start_time, timezone.get_default_timezone())
        end_time = timezone.make_aware(end_time, timezone.get_default_timezone())

        # Create a new booking
        booking_obj = booking.objects.create(
            room_or_hotdesk=room_obj,
            user=user,
            start_time=start_time,
            end_time=end_time,
            state='pending'
        )

        # Create a new pending booking
        new_pending_booking = pending_booking.objects.create(
            room_or_hotdesk=room_obj,
            user=user,
            start_time=start_time,
            end_time=end_time,
            booking=booking_obj
        )

        # Check if the start time is between 5 PM and 7 AM
        start_hour = start_time.hour
        end_hour = end_time.hour
        if (start_hour >= 17 or end_hour < 7):
            emailAfterHoursBooking(booking_obj)

        return JsonResponse({
            'success': True,
            'message': 'Booking request created successfully',
            'booking_id': new_pending_booking.booking_id
        }, status=201)

    except json.JSONDecodeError:
        return JsonResponse({'error': 'Invalid JSON data'}, status=400)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)
    
def create_hotdesk_booking(request):
    try:
        # Parse the JSON data from the request body
        data = request.data

        # Extract the required fields from the data
        user_id = data.get('user_id')
        hotdesk_id = data.get('hotdesk_id')
        start_time = data.get('start_time')
        end_time = data.get('end_time')

        # Validate the required fields
        if not all([user_id, hotdesk_id, start_time, end_time]):
            return JsonResponse({'error': 'Missing required fields'}, status=400)

        # Get the user and hotdesk objects
        try:
            user = User.objects.get(id=user_id)
            hotdesk_obj = hotdesk.objects.get(hotdesk_id=hotdesk_id)
        except User.DoesNotExist:
            return JsonResponse({'error': 'User not found'}, status=404)
        except hotdesk.DoesNotExist:
            return JsonResponse({'error': 'Hotdesk not found'}, status=404)

        # Convert string datetime to Python datetime objects
        start_time = datetime.strptime(start_time, "%Y-%m-%d %H:%M:%S")
        end_time = datetime.strptime(end_time, "%Y-%m-%d %H:%M:%S")
        
        start_time = timezone.make_aware(start_time, timezone.get_default_timezone())
        end_time = timezone.make_aware(end_time, timezone.get_default_timezone())

        # Create a new booking
        booking_obj = booking.objects.create(
            room_or_hotdesk=hotdesk_obj,
            user=user,
            start_time=start_time,
            end_time=end_time,
            state='approved'
        )

        return JsonResponse({
            'success': True,
            'message': 'Booking request created successfully',
            'booking_id': booking_obj.booking_id
        }, status=201)

    except json.JSONDecodeError:
        return JsonResponse({'error': 'Invalid JSON data'}, status=400)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)

def admin_accept_or_deny_booking(request):
    try:
        # Parse the JSON data from the request body
        data = request.data

        # Extract the required fields from the data
        booking_id = data.get('booking_id')
        is_accepted = data.get('is_accepted')
        
        # Validate the required fields
        if booking_id is None or is_accepted is None:
            return JsonResponse({'error': 'Missing required fields'}, status=400)
        
        # Get the booking and pending booking objects
        booking_obj = booking.objects.get(booking_id=booking_id)
        pending_booking_obj = pending_booking.objects.get(booking=booking_obj)

        # Email the user
        emailBookingAcceptOrDeny(booking_obj, is_accepted)
        
        # Accept or deny the booking
        if is_accepted:
            # Edit the booking state to 'accepted'
            
            booking_obj.state = 'approved'
            booking_obj.save()

            # Schedule a booking reminder and check in reminder
            send_time = booking_obj.start_time - timedelta(hours=1)
            check_in_reminder_time = booking_obj.start_time - timedelta(minutes=15)

            if send_time > now():
                schedule_reminder_email(booking_id, send_time)

            schedule_check_in_reminder(booking_id, check_in_reminder_time)

            # Delete the pending booking
            pending_booking_obj.delete()

            return JsonResponse({
                'success': True,
                'message': 'Booking accepted successfully',
                'booking_id': booking_obj.booking_id
            }, status=200)
        else:
            booking_obj.state = 'denied'
            booking_obj.save()
            # Delete the pending booking
            pending_booking_obj.delete()

            return JsonResponse({'success': True, 'message': 'Booking denied successfully'}, status=200)

    except json.JSONDecodeError:
        return JsonResponse({'error': 'Invalid JSON data'}, status=400)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)
    
def cancel_booking(request):
    try:
        # Parse the JSON data from the request body
        data = request.data

        # Extract the required fields from the data
        booking_id = data.get('booking_id')
        message = data.get('message')
        user_id = data.get('user_id')

        # Validate the required fields
        if not booking_id:
            return JsonResponse({'error': 'Missing required fields'}, status=400)

        # Get the booking object
        booking_obj = booking.objects.get(booking_id=booking_id)
        
        booking_obj.state = 'cancelled'
        
        booking_obj.save()
        
        # Delete the booking
        emailCancelBooking(booking_obj, message, user_id)
        booking_obj.delete()

        return JsonResponse({'success': True, 'message': 'Booking cancelled successfully'}, status=200)

    except json.JSONDecodeError:
        return JsonResponse({'error': 'Invalid JSON data'}, status=400)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)
    
def edit_booking(request):
    try:
        # Parse the JSON data from the request body
        data = request.data

        # Extract the required fields from the data
        booking_id = data.get('booking_id')
        start_time = data.get('start_time')
        end_time = data.get('end_time')
        room_or_hotdesk = data.get('room_or_hotdesk_id')

        # Validate the required fields
        if not all([booking_id, start_time, end_time]):
            return JsonResponse({'error': 'Missing required fields'}, status=400)

        # Get the booking object
        booking_obj = booking.objects.get(booking_id=booking_id)

        # Convert string datetime to Python datetime objects
        start_time = datetime.strptime(start_time, "%Y-%m-%d %H:%M:%S")
        end_time = datetime.strptime(end_time, "%Y-%m-%d %H:%M:%S")
        
        start_time = timezone.make_aware(start_time, timezone.get_default_timezone())
        end_time = timezone.make_aware(end_time, timezone.get_default_timezone())

        
        # Update the booking
        booking_obj.start_time = start_time
        booking_obj.end_time = end_time
    
        
        if isinstance(booking_obj.room_or_hotdesk, hotdesk):
            if room_or_hotdesk is not None:
                booking_obj.room_or_hotdesk = hotdesk.objects.get(hotdesk_id=room_or_hotdesk)
            booking_obj.save()
            return JsonResponse({'success': True, 'message': 'Booking updated successfully'}, status=200)
        
        if room_or_hotdesk is not None:
            booking_obj.room_or_hotdesk = room.objects.get(room_id=room_or_hotdesk)
        booking_obj.state = 'pending'
        booking_obj.save()
        
        # Check if the booking is in the pending_booking table
        try:
            pending_booking_obj = pending_booking.objects.filter(booking=booking_obj).first()
        except pending_booking.DoesNotExist:
            pending_booking_obj = None  # Set to None if no pending booking is found
        
        if pending_booking_obj:
            # Update the existing pending booking
            pending_booking_obj.start_time = start_time
            pending_booking_obj.end_time = end_time
            pending_booking_obj.save()
        else:
            # Create a new pending booking
            pending_booking.objects.create(
                room_or_hotdesk=booking_obj.room_or_hotdesk,
                user=booking_obj.user,
                start_time=start_time,
                end_time=end_time,
                booking=booking_obj
            )

        return JsonResponse({'success': True, 'message': 'Booking updated successfully'}, status=200)

    except json.JSONDecodeError:
        return JsonResponse({'error': 'Invalid JSON data'}, status=400)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)

def checkIntoBooking(request):
    # Parse the input data
    try:
        data = json.loads(request.body)
    except:
        return JsonResponse({'error': 'Unknown error occured'}, status=400)

    try: 
        # Get the corresponding booking object
        booking_id = data.get('booking_id')
        booking_obj = booking.objects.get(booking_id=booking_id)

        # Update the check-in status and check-in times
        booking_obj.check_in_status = "checked-in"
        booking_obj.checked_in_at = timezone.now()
        booking_obj.state = "active"
        booking_obj.save()

        return JsonResponse({'success': True, 'message': 'User has checked in'}, status=200)
    except json.JSONDecodeError:
        return JsonResponse({'error': 'Invalid JSON data'}, status=400)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)
