from django.http import JsonResponse
from django.contrib.auth.models import User
from acsess_api.models import booking, room, hotdesk, pending_booking, cse_staff, hdr_student, booking_history
from django.http import JsonResponse
from django.apps import apps
from django.core.exceptions import ObjectDoesNotExist
from django.db.models import Q
import json
import csv
from django.http import HttpResponse
from django.contrib.contenttypes.models import ContentType

import logging

def get_table_data(request):
    try:
        # Parse the JSON data from the request body
        data = request.data

        # Extract the table and sort information
        table_name = data.get('table')
        sort_type = data.get('sort_type')
        sort_criteria = data.get('sort')

        # Validate the required fields
        if not all([table_name, sort_type is not None]):
            return JsonResponse({'error': 'Missing required fields'}, status=400)

        # Get the model class dynamically
        model = None
        try:
            if table_name == 'auth_user':
                model = User
            else:
                model = apps.get_model('acsess_api', table_name)
        except LookupError:
            return JsonResponse({'error': 'Invalid table name'}, status=404)
        
        # Construct the query
        if sort_type == 1:  # AND condition
            query = Q()
            for key, value in sort_criteria.items():
                query &= Q(**{key: value})
        else:  # OR condition
            query = Q()
            for key, value in sort_criteria.items():
                query |= Q(**{key: value})

        # Execute the query
        results = model.objects.filter(query).values()
        
        logging.info(f"Results: {results}")

        # Return the results
        return JsonResponse(list(results), safe=False, status=200)

    except json.JSONDecodeError:
        return JsonResponse({'error': 'Invalid JSON data'}, status=400)
    except ObjectDoesNotExist as e:
        return JsonResponse({'error': str(e)}, status=404)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)

def download_booking_history(request):
    response = HttpResponse(content_type='text/csv')
    response['Content-Disposition'] = 'attachment; filename="booking_history.csv"'

    writer = csv.writer(response)
    writer.writerow([
        'Booking ID', 'Booking History ID', 'User ID', 'User Name', 'User Email', 'User Faculty', 
        'User School', 'User Role', 'Room/Hotdesk ID', 'Room/Hotdesk Number', 'Room/Hotdesk Location',
        'Room/Hotdesk Description', 'Start Time', 'End Time', 'State', 'Created At', 'Updated At'
    ])

    bookings = booking_history.objects.select_related('user').all()

    for booking in bookings:
        user_info = None
        if hasattr(booking.user, 'hdr_student'):
            user_info = booking.user.hdr_student
        elif hasattr(booking.user, 'cse_staff'):
            user_info = booking.user.cse_staff

        room_hotdesk_info = booking.room_or_hotdesk

        writer.writerow([
            booking.booking.booking_id if booking.booking else None,
            booking.booking_history_id,
            booking.user.id,
            user_info.student_name if user_info and isinstance(user_info, hdr_student) else user_info.staff_name if user_info else None,
            user_info.student_email if user_info and isinstance(user_info, hdr_student) else user_info.staff_email if user_info else None,
            user_info.student_faculty if user_info and isinstance(user_info, hdr_student) else user_info.staff_faculty if user_info else None,
            user_info.student_school if user_info and isinstance(user_info, hdr_student) else user_info.staff_school if user_info else None,
            user_info.student_role if user_info and isinstance(user_info, hdr_student) else user_info.staff_role if user_info else None,
            room_hotdesk_info.room_id if isinstance(room_hotdesk_info, room) else room_hotdesk_info.hotdesk_id if isinstance(room_hotdesk_info, hotdesk) else None,
            room_hotdesk_info.room_number if isinstance(room_hotdesk_info, room) else room_hotdesk_info.hotdesk_number if isinstance(room_hotdesk_info, hotdesk) else None,
            room_hotdesk_info.room_location if isinstance(room_hotdesk_info, room) else room_hotdesk_info.hotdesk_location if isinstance(room_hotdesk_info, hotdesk) else None,
            room_hotdesk_info.room_description if isinstance(room_hotdesk_info, room) else room_hotdesk_info.hotdesk_description if isinstance(room_hotdesk_info, hotdesk) else None,
            booking.start_time,
            booking.end_time,
            booking.state,
            booking.created_at,
            booking.updated_at,
            booking.check_in_status,
            booking.checked_in_at
        ])

    return response
