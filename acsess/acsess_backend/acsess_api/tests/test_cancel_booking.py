from django.test import TestCase, Client
from django.urls import reverse
from django.contrib.auth.models import User
from acsess_api.models import booking, room, pending_booking
from django.utils import timezone
import json, logging
from datetime import datetime

class CancelBookingTestCase(TestCase):
    def setUp(self):
        # Suppress logging during tests
        logging.disable(logging.CRITICAL)

        self.client = Client()
        self.cancel_booking_url = reverse('cancel_booking')
        self.create_booking_url = reverse('create_room_booking')

        # Create test user and room
        self.user = User.objects.create_user(username='testuser', password='password123')
        
        # Create a test room with the correct fields
        self.room = room.objects.create(
            room_number='testroom', 
            room_location='Test Location', 
            room_capacity=10, 
            room_utilities='WiFi, Projector', 
            room_description='Test Room Description'
        )

    def create_booking(self):
        start_time = timezone.now() + timezone.timedelta(hours=1)
        end_time = start_time + timezone.timedelta(hours=2)
        booking_instance = booking.objects.create(
            room_or_hotdesk=self.room,
            user=self.user,
            start_time=start_time,
            end_time=end_time,
            state='pending'
        )
        pending_booking_instance = pending_booking.objects.create(
            room_or_hotdesk=self.room,
            user=self.user,
            start_time=start_time,
            end_time=end_time,
            booking=booking_instance
        )
        return booking_instance, pending_booking_instance
    
    def tearDown(self):
        # Re-enable logging after tests
        logging.disable(logging.NOTSET)

    def test_cancel_booking_valid(self):
        booking_instance, _ = self.create_booking()
        data = {
            'booking_id': booking_instance.booking_id,
            'message': "Cancel Booking",
            'user_id': self.user.id
        }
        response = self.client.post(self.cancel_booking_url, json.dumps(data), content_type='application/json')
        self.assertEqual(response.status_code, 200)
        self.assertFalse(booking.objects.filter(booking_id=booking_instance.booking_id).exists())

    def test_cancel_booking_invalid_booking_id(self):
        _, _ = self.create_booking()
        data = {
            'booking_id': 'invalid_booking_id',
            'message': "Cancel Booking",
            'user_id': self.user.id
        }
        response = self.client.post(self.cancel_booking_url, json.dumps(data), content_type='application/json')
        self.assertEqual(response.status_code, 500)

    def test_cancel_booking_missing_booking_id(self):
        _, _ = self.create_booking()
        data = {
            'message': "Cancel Booking",
            'user_id': self.user.id
        }
        response = self.client.post(self.cancel_booking_url, json.dumps(data), content_type='application/json')
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.json()['error'], 'Missing required fields')

    def test_cancel_booking_id_not_found(self):
        _, _ = self.create_booking()
        data = {
            'booking_id': 9999,  # Assuming this ID does not exist
            'message': "Cancel Booking",
            'user_id': self.user.id
        }
        response = self.client.post(self.cancel_booking_url, json.dumps(data), content_type='application/json')
        self.assertEqual(response.status_code, 500)