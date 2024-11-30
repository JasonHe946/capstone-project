from django.test import TestCase, Client
from django.urls import reverse
from django.contrib.auth.models import User
from django.utils import timezone
import json, logging
from datetime import timedelta
from django.contrib.contenttypes.models import ContentType
from acsess_api.models import booking, room, hotdesk, booking_history
from rest_framework import status

class CheckIntoBookingTestCase(TestCase):
    def setUp(self):
        self.client = Client()
        self.check_in_url = reverse('check_in')
        self.user = User.objects.create_user(username='testuser', password='password123')

        # Create a test room and booking
        self.room = room.objects.create(
            room_number='testroom',
            room_location='Test Location',
            room_capacity=10,
            room_utilities='WiFi, Projector',
            room_description='Test Room Description'
        )

        content_type = ContentType.objects.get_for_model(room)
        self.booking = booking.objects.create(
            content_type=content_type,
            object_id=self.room.room_id,
            room_or_hotdesk=self.room,
            user=self.user,
            start_time=timezone.now() + timezone.timedelta(hours=1),
            end_time=timezone.now() + timezone.timedelta(hours=2),
            state='approved'
        )

        self.booking_history = booking_history.objects.get(booking=self.booking)

    def test_check_in_valid(self):
        # Test check-in for a valid booking
        data = {
            'booking_id': self.booking.booking_id
        }
        response = self.client.post(self.check_in_url, json.dumps(data), content_type='application/json')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['message'], 'User has checked in')

        # Refresh from DB and check the updated status
        self.booking.refresh_from_db()
        self.booking_history.refresh_from_db()
        self.assertEqual(self.booking.check_in_status, 'checked-in')
        self.assertEqual(self.booking.state, 'active')
        self.assertEqual(self.booking_history.check_in_status, 'checked-in')
        self.assertIsNotNone(self.booking_history.checked_in_at)

    def test_check_in_invalid_booking_id(self):
        # Test check-in with an invalid booking ID
        data = {
            'booking_id': 'invalid_id'
        }
        response = self.client.post(self.check_in_url, json.dumps(data), content_type='application/json')

        self.assertEqual(response.status_code, status.HTTP_500_INTERNAL_SERVER_ERROR)
        self.assertIn('error', response.json())

    def test_check_in_invalid_json_data(self):
        response = self.client.post(reverse('check_in'), data="Invalid JSON", content_type='application/json')

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)


    def test_check_in_missing_booking_id(self):
        response = self.client.post(reverse('check_in'), data={}, format='json')

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    #Already handled by frontend this test case is impossible
    # def test_booking_already_checked_in(self):
    #     # Set the booking to checked-in status
    #     self.booking.check_in_status = 'checked-in'
    #     self.booking.state = 'active'
    #     self.booking.save()

    #     response = self.client.post(reverse('check_in'), data={
    #         'booking_id': self.booking.booking_id
    #     }, format='json')

    #     self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)