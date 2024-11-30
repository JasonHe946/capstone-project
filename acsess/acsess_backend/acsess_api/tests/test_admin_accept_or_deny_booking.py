from django.test import TestCase, Client
from django.urls import reverse
from django.contrib.auth.models import User
from django.contrib.contenttypes.models import ContentType
from acsess_api.models import booking, pending_booking, room
import json, logging
from datetime import datetime, timedelta
from django.utils import timezone
from unittest.mock import patch

class AdminAcceptOrDenyBookingTestCase(TestCase):
    @patch('acsess_api.tasks.send_reminder_email.apply_async')
    def setUp(self, mock_send_reminder_email):
        # Suppress logging during tests
        logging.disable(logging.CRITICAL)
        
        self.client = Client()
        self.accept_or_deny_booking_url = reverse('admin_accept_or_deny_booking')
        
        self.user = User.objects.create_user(username='testuser', password='12345')
        self.room = room.objects.create(
            room_number='101',
            room_location='Building A',
            room_capacity=10,
            room_utilities='Projector, Whiteboard',
            room_description='A small conference room'
        )

        # Get the content type for the room model
        room_content_type = ContentType.objects.get_for_model(room)

        self.booking = booking.objects.create(
            content_type=room_content_type,
            object_id=self.room.room_id,
            user=self.user,
            start_time=timezone.now() + timedelta(days=1),
            end_time=timezone.now() + timedelta(days=1, hours=2),
            state='pending'
        )
        self.pending_booking = pending_booking.objects.create(
            content_type=room_content_type,
            object_id=self.room.room_id,
            user=self.user,
            start_time=timezone.now() + timedelta(days=1),
            end_time=timezone.now() + timedelta(days=1, hours=2),
            booking=self.booking
        )

    @patch('acsess_api.tasks.send_check_in_reminder.apply_async')
    @patch('acsess_api.tasks.send_reminder_email.apply_async')
    def test_accept_booking(self, mock_schedule_reminder_email, mock_schedule_check_in_reminder):
        data = {
            'booking_id': self.booking.booking_id,
            'is_accepted': True
        }
        response = self.client.post(self.accept_or_deny_booking_url, json.dumps(data), content_type='application/json')
        
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json(), {
            'success': True,
            'message': 'Booking accepted successfully',
            'booking_id': self.booking.booking_id
        })

        self.booking.refresh_from_db()
        self.assertEqual(self.booking.state, 'approved')

    @patch('acsess_api.tasks.send_reminder_email.apply_async')
    def test_deny_booking(self, mock_send_reminder_email):
        data = {
            'booking_id': self.booking.booking_id,
            'is_accepted': False
        }
        response = self.client.post(self.accept_or_deny_booking_url, json.dumps(data), content_type='application/json')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json(), {
            'success': True,
            'message': 'Booking denied successfully'
        })
        self.booking.refresh_from_db()
        self.assertEqual(self.booking.state, 'denied')

    @patch('acsess_api.tasks.send_reminder_email.apply_async')
    def test_missing_fields(self, mock_send_reminder_email):
        data = {
            'booking_id': self.booking.booking_id
            # 'is_accepted' is missing
        }
        response = self.client.post(self.accept_or_deny_booking_url, json.dumps(data), content_type='application/json')
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.json(), {'error': 'Missing required fields'})

    @patch('acsess_api.tasks.send_reminder_email.apply_async')
    def test_invalid_booking_id(self, mock_send_reminder_email):
        data = {
            'booking_id': 9999,  # Non-existent booking ID
            'is_accepted': True
        }
        response = self.client.post(self.accept_or_deny_booking_url, json.dumps(data), content_type='application/json')
        self.assertEqual(response.status_code, 500)
        self.assertIn('error', response.json())

    @patch('acsess_api.tasks.send_reminder_email.apply_async')
    def test_invalid_json(self, mock_send_reminder_email):
        data = 'invalid json'
        response = self.client.post(self.accept_or_deny_booking_url, data, content_type='application/json')
        self.assertEqual(response.status_code, 500)