from django.test import TestCase, Client
from django.urls import reverse
from django.contrib.auth.models import User
from acsess_api.models import room, booking
from django.utils import timezone
import json,logging
from datetime import datetime
from django.contrib.contenttypes.models import ContentType

class CreateRoomBookingTestCase(TestCase):
    def setUp(self):
        # Suppress logging during tests
        logging.disable(logging.CRITICAL)

        self.client = Client()
        self.create_room_booking_url = reverse('create_room_booking')

        # Create test user and room
        self.user = User.objects.create_user(username='testuser', password='password123')
        self.room = room.objects.create(
            room_number='testroom',
            room_location='Test Location',
            room_capacity=10,
            room_utilities='Projector, Whiteboard',
            room_description='Test Room Description'
        )

    def test_create_room_booking_valid(self):
        start_time = timezone.now() + timezone.timedelta(hours=1)
        end_time = start_time + timezone.timedelta(hours=2)
        data = {
            'user_id': self.user.id,
            'room_id': self.room.room_id,
            'start_time': start_time.strftime('%Y-%m-%d %H:%M:%S'),
            'end_time': end_time.strftime('%Y-%m-%d %H:%M:%S')
        }
        response = self.client.post(self.create_room_booking_url, json.dumps(data), content_type='application/json')
        self.assertEqual(response.status_code, 201)

        # Retrieve the content type for room
        room_content_type = ContentType.objects.get_for_model(room)
        self.assertTrue(booking.objects.filter(
            user=self.user,
            object_id=self.room.room_id,
            content_type=room_content_type
        ).exists())

    def test_create_room_booking_missing_fields(self):
        data = {
            'user_id': self.user.id,
            'room_id': self.room.room_id,
        }
        response = self.client.post(self.create_room_booking_url, json.dumps(data), content_type='application/json')
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.json()['error'], 'Missing required fields')

    def test_create_room_booking_invalid_room_id(self):
        start_time = timezone.now() + timezone.timedelta(hours=1)
        end_time = start_time + timezone.timedelta(hours=2)
        data = {
            'user_id': self.user.id,
            'room_id': 9999,  # Assuming this ID does not exist
            'start_time': start_time.strftime('%Y-%m-%d %H:%M:%S'),
            'end_time': end_time.strftime('%Y-%m-%d %H:%M:%S')
        }
        response = self.client.post(self.create_room_booking_url, json.dumps(data), content_type='application/json')
        self.assertEqual(response.status_code, 404)
        self.assertEqual(response.json()['error'], 'Room not found')

    def test_create_room_booking_invalid_user_id(self):
        start_time = timezone.now() + timezone.timedelta(hours=1)
        end_time = start_time + timezone.timedelta(hours=2)
        data = {
            'user_id': 9999,  # Assuming this ID does not exist
            'room_id': self.room.room_id,
            'start_time': start_time.strftime('%Y-%m-%d %H:%M:%S'),
            'end_time': end_time.strftime('%Y-%m-%d %H:%M:%S')
        }
        response = self.client.post(self.create_room_booking_url, json.dumps(data), content_type='application/json')
        self.assertEqual(response.status_code, 404)
        self.assertEqual(response.json()['error'], 'User not found')

    def test_create_room_booking_invalid_json(self):
        response = self.client.post(self.create_room_booking_url, "invalid_json", content_type='application/json')
        self.assertEqual(response.status_code, 500)