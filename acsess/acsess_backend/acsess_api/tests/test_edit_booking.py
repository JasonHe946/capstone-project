from django.test import TestCase, Client
from django.urls import reverse
from django.contrib.auth.models import User
from django.utils import timezone
import json, logging
from datetime import timedelta
from django.contrib.contenttypes.models import ContentType
from acsess_api.models import room, hotdesk, booking, pending_booking
import pytz

class EditBookingTestCase(TestCase):
    def setUp(self):
        # Suppress logging during tests
        logging.disable(logging.CRITICAL)

        self.client = Client()
        self.edit_booking_url = reverse('edit_booking')

        # Create test user, room, and initial booking
        self.user = User.objects.create_user(username='testuser', password='password123')
        self.room = room.objects.create(
            room_number='testroom',
            room_location='Test Location',
            room_capacity=10,
            room_utilities='Projector, Whiteboard',
            room_description='Test Room Description'
        )
        
        self.hotdesk = hotdesk.objects.create(
            hotdesk_number='testdesk',
            hotdesk_location='Test Location',
            hotdesk_floor=1,  # Providing a value for the required field
            hotdesk_description='Test Hotdesk Description'
        )

        self.start_time = timezone.now() + timedelta(hours=1)
        self.end_time = self.start_time + timedelta(hours=2)

        room_content_type = ContentType.objects.get_for_model(room)
        hotdesk_content_type = ContentType.objects.get_for_model(hotdesk)

        self.booking = booking.objects.create(
            content_type=room_content_type,
            object_id=self.room.room_id,
            room_or_hotdesk=self.room,
            user=self.user,
            start_time=self.start_time,
            end_time=self.end_time,
            state='pending'
        )

        self.hotdesk_booking = booking.objects.create(
            content_type=hotdesk_content_type,
            object_id=self.hotdesk.hotdesk_id,
            room_or_hotdesk=self.hotdesk,
            user=self.user,
            start_time=self.start_time,
            end_time=self.end_time,
            state='hotdesk'
        )

    def test_edit_booking_valid(self):
        sydney_tz = pytz.timezone('Australia/Sydney')
        new_start_time = (self.start_time + timedelta(days=1)).astimezone(sydney_tz)
        new_end_time = (new_start_time + timedelta(hours=2)).astimezone(sydney_tz)
        data = {
            'booking_id': self.booking.booking_id,
            'start_time': new_start_time.strftime('%Y-%m-%d %H:%M:%S'),
            'end_time': new_end_time.strftime('%Y-%m-%d %H:%M:%S'),
            'room_or_hotdesk_id': self.room.room_id
        }
        response = self.client.post(self.edit_booking_url, json.dumps(data), content_type='application/json')
        self.assertEqual(response.status_code, 200)
        self.booking.refresh_from_db()

        booking_start_utc = self.booking.start_time.astimezone(pytz.utc)
        booking_end_utc = self.booking.end_time.astimezone(pytz.utc)

        self.assertEqual(booking_start_utc.replace(microsecond=0), new_start_time.replace(microsecond=0))
        self.assertEqual(booking_end_utc.replace(microsecond=0), new_end_time.replace(microsecond=0))

    def test_edit_hotdesk_booking_valid(self):
        sydney_tz = pytz.timezone('Australia/Sydney')
        new_start_time = (self.start_time + timedelta(days=1)).astimezone(sydney_tz)
        new_end_time = (new_start_time + timedelta(hours=2)).astimezone(sydney_tz)
        data = {
            'booking_id': self.hotdesk_booking.booking_id,
            'start_time': new_start_time.strftime('%Y-%m-%d %H:%M:%S'),
            'end_time': new_end_time.strftime('%Y-%m-%d %H:%M:%S'),
            'room_or_hotdesk_id': self.hotdesk.hotdesk_id
        }
        response = self.client.post(self.edit_booking_url, json.dumps(data), content_type='application/json')
        self.assertEqual(response.status_code, 200)
        self.hotdesk_booking.refresh_from_db()

        hotdesk_booking_start_utc = self.hotdesk_booking.start_time.astimezone(pytz.utc)
        hotdesk_booking_end_utc = self.hotdesk_booking.end_time.astimezone(pytz.utc)

        self.assertEqual(hotdesk_booking_start_utc.replace(microsecond=0), new_start_time.replace(microsecond=0))
        self.assertEqual(hotdesk_booking_end_utc.replace(microsecond=0), new_end_time.replace(microsecond=0))

    def test_edit_booking_missing_fields_start(self):
        new_start_time = self.start_time + timedelta(days=1)
        new_end_time = new_start_time + timedelta(hours=2)
        data = {
            'booking_id': self.booking.booking_id,
            'end_time': new_end_time.strftime('%Y-%m-%d %H:%M:%S'),
            'room_or_hotdesk_id': self.room.room_id
        }
        response = self.client.post(self.edit_booking_url, json.dumps(data), content_type='application/json')
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.json()['error'], 'Missing required fields')

    def test_edit_booking_missing_fields_end(self):
        new_start_time = self.start_time + timedelta(days=1)
        data = {
            'booking_id': self.booking.booking_id,
            'start_time': new_start_time.strftime('%Y-%m-%d %H:%M:%S'),
            'room_or_hotdesk_id': self.room.room_id
        }
        response = self.client.post(self.edit_booking_url, json.dumps(data), content_type='application/json')
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.json()['error'], 'Missing required fields')

    def test_edit_booking_invalid_booking_id(self):
        new_start_time = self.start_time + timedelta(days=1)
        new_end_time = new_start_time + timedelta(hours=2)
        data = {
            'booking_id': 9999,  # Assuming this ID does not exist
            'start_time': new_start_time.strftime('%Y-%m-%d %H:%M:%S'),
            'end_time': new_end_time.strftime('%Y-%m-%d %H:%M:%S'),
            'room_or_hotdesk_id': self.room.room_id
        }
        response = self.client.post(self.edit_booking_url, json.dumps(data), content_type='application/json')
        self.assertEqual(response.status_code, 500)

    def test_edit_booking_invalid_json(self):
        response = self.client.post(self.edit_booking_url, "invalid_json", content_type='application/json')
        self.assertEqual(response.status_code, 500)

def test_edit_booking_creates_pending(self):
    # Ensure a pending booking is created if not exists
    new_start_time = self.start_time + timedelta(days=1)
    new_end_time = new_start_time + timedelta(hours=2)
    data = {
        'booking_id': self.booking.booking_id,
        'start_time': new_start_time.strftime('%Y-%m-%d %H:%M:%S'),
        'end_time': new_end_time.strftime('%Y-%m-%d %H:%M:%S'),
        'room_or_hotdesk_id': self.room.room_id
    }
    response = self.client.post(self.edit_booking_url, json.dumps(data), content_type='application/json')
    self.assertEqual(response.status_code, 200)
    
    pending = pending_booking.objects.filter(booking=self.booking).first()
    self.assertIsNotNone(pending)
    
    # Convert pending start and end times to UTC
    pending_start_utc = timezone.make_aware(pending.start_time, timezone.utc)
    pending_end_utc = timezone.make_aware(pending.end_time, timezone.utc)
    
    self.assertEqual(pending_start_utc.replace(microsecond=0), new_start_time.replace(microsecond=0))
    self.assertEqual(pending_end_utc.replace(microsecond=0), new_end_time.replace(microsecond=0))