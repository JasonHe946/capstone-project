from django.test import TestCase, Client
from django.urls import reverse
from django.contrib.auth.models import User
from django.core import mail
from django.conf import settings
import json

class AdminHelpTestCase(TestCase):
    def setUp(self):
        self.client = Client()
        self.admin_help_url = reverse('admin_help')
        self.user = User.objects.create_user(username='testuser', password='password123', email='testuser@example.com')
        self.admin_user = User.objects.create_superuser(username='adminuser', password='adminpassword', email='admin@example.com')
        settings.ADMINS = [('Admin', 'admin@example.com')]

    def test_admin_help_success(self):
        # Log in the user
        self.client.login(username='testuser', password='password123')

        # Send a POST request to the admin_help_url
        data = {
            'message': 'Need help with my account',
            'uid': self.user.id
        }
        response = self.client.post(self.admin_help_url, json.dumps(data), content_type='application/json')

        # Check that the response status code is 200
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['success'], True)
        self.assertEqual(response.json()['message'], 'Request has been sent to admins')

        # Check that an email was sent
        self.assertEqual(len(mail.outbox), 1)
        self.assertIn('Need help with my account', mail.outbox[0].body)

    def test_admin_help_user_not_found(self):
        data = {
            'message': 'Need help with my account',
            'uid': 9999  # Non-existent user ID
        }
        response = self.client.post(self.admin_help_url, json.dumps(data), content_type='application/json')

        self.assertEqual(response.status_code, 400)

    def test_admin_help_invalid_data(self):
        data = {
            'message': 'Need help with my account',
            # 'uid' field is missing
        }
        response = self.client.post(self.admin_help_url, json.dumps(data), content_type='application/json')

        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.json()['error'], 'Unknown error occured')