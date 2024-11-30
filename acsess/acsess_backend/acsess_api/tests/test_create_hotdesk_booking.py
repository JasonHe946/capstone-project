from django.test import TestCase, Client
from django.urls import reverse
from django.contrib.auth.models import User
from acsess_api.models import hotdesk, booking
from django.utils import timezone
import json, logging
from datetime import datetime
from django.contrib.contenttypes.models import ContentType

class CreateHotdeskBookingTestCase(TestCase):
    def setUp(self):
        # Suppress logging during tests
        logging.disable(logging.CRITICAL)
        self.client = Client()
        self.create_hotdesk_booking_url = reverse('create_hotdesk_booking')

        # Create test user and hotdesk
        self.user = User.objects.create_user(username='testuser', password='password123')
        self.hotdesk = hotdesk.objects.create(
            hotdesk_number='testhotdesk',
            hotdesk_location='Test Location',
            hotdesk_floor=1,
            hotdesk_description='Test Hotdesk Description'
        )

    def test_create_hotdesk_booking_valid(self):
        start_time = timezone.now() + timezone.timedelta(hours=1)
        end_time = start_time + timezone.timedelta(hours=2)
        data = {
            'user_id': self.user.id,
            'hotdesk_id': self.hotdesk.hotdesk_id,
            'start_time': start_time.strftime('%Y-%m-%d %H:%M:%S'),
            'end_time': end_time.strftime('%Y-%m-%d %H:%M:%S')
        }
        response = self.client.post(self.create_hotdesk_booking_url, json.dumps(data), content_type='application/json')
        self.assertEqual(response.status_code, 201)

        # Retrieve the content type for hotdesk
        hotdesk_content_type = ContentType.objects.get_for_model(hotdesk)
        self.assertTrue(booking.objects.filter(
            user=self.user,
            object_id=self.hotdesk.hotdesk_id,
            content_type=hotdesk_content_type
        ).exists())

    def test_create_hotdesk_booking_missing_fields(self):
        data = {
            'user_id': self.user.id,
            'hotdesk_id': self.hotdesk.hotdesk_id,
        }
        response = self.client.post(self.create_hotdesk_booking_url, json.dumps(data), content_type='application/json')
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.json()['error'], 'Missing required fields')

    def test_create_hotdesk_booking_invalid_hotdesk_id(self):
        start_time = timezone.now() + timezone.timedelta(hours=1)
        end_time = start_time + timezone.timedelta(hours=2)
        data = {
            'user_id': self.user.id,
            'hotdesk_id': 9999,  # Assuming this ID does not exist
            'start_time': start_time.strftime('%Y-%m-%d %H:%M:%S'),
            'end_time': end_time.strftime('%Y-%m-%d %H:%M:%S')
        }
        response = self.client.post(self.create_hotdesk_booking_url, json.dumps(data), content_type='application/json')
        self.assertEqual(response.status_code, 404)
        self.assertEqual(response.json()['error'], 'Hotdesk not found')

    def test_create_hotdesk_booking_invalid_user_id(self):
        start_time = timezone.now() + timezone.timedelta(hours=1)
        end_time = start_time + timezone.timedelta(hours=2)
        data = {
            'user_id': 9999,  # Assuming this ID does not exist
            'hotdesk_id': self.hotdesk.hotdesk_id,
            'start_time': start_time.strftime('%Y-%m-%d %H:%M:%S'),
            'end_time': end_time.strftime('%Y-%m-%d %H:%M:%S')
        }
        response = self.client.post(self.create_hotdesk_booking_url, json.dumps(data), content_type='application/json')
        self.assertEqual(response.status_code, 404)
        self.assertEqual(response.json()['error'], 'User not found')

    def test_create_hotdesk_booking_invalid_json(self):
        response = self.client.post(self.create_hotdesk_booking_url, "invalid_json", content_type='application/json')
        self.assertEqual(response.status_code, 500)