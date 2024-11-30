from django.test import TestCase, Client
from django.urls import reverse
from django.contrib.auth.models import User
import json, logging

class ChangePasswordTestCase(TestCase):
    def setUp(self):
        # Suppress logging during tests
        logging.disable(logging.CRITICAL)

        self.client = Client()
        self.change_password_url = reverse('change_password')
        
        # Create a test user
        self.user = User.objects.create_user(username='testuser', password='old_password123')
        
    def test_change_password_valid(self):
        data = {
            'current_password': 'old_password123',
            'new_password': 'new_password123',
            'uid': self.user.id
        }
        response = self.client.post(self.change_password_url, json.dumps(data), content_type='application/json')
        self.assertEqual(response.status_code, 200)
        self.user.refresh_from_db()
        self.assertTrue(self.user.check_password('new_password123'))

    def test_change_password_incorrect_current_password(self):
        data = {
            'current_password': 'wrong_password123',
            'new_password': 'new_password123',
            'uid': self.user.id
        }
        response = self.client.post(self.change_password_url, json.dumps(data), content_type='application/json')
        self.assertEqual(response.status_code, 400)
        self.user.refresh_from_db()
        self.assertTrue(self.user.check_password('old_password123'))

    def test_change_password_missing_fields(self):
        data = {
            'current_password': 'old_password123',
            'new_password': 'new_password123'
            # Missing 'uid'
        }
        response = self.client.post(self.change_password_url, json.dumps(data), content_type='application/json')
        self.assertEqual(response.status_code, 404)
        
        data = {
            'new_password': 'new_password123',
            'uid': self.user.id
            # Missing 'current_password'
        }
        response = self.client.post(self.change_password_url, json.dumps(data), content_type='application/json')
        self.assertEqual(response.status_code, 400)

        data = {
            'current_password': 'old_password123',
            'uid': self.user.id
            # Missing 'new_password'
        }
        response = self.client.post(self.change_password_url, json.dumps(data), content_type='application/json')
        self.assertEqual(response.status_code, 200) #Change

    def test_change_password_user_not_found(self):
        data = {
            'current_password': 'old_password123',
            'new_password': 'new_password123',
            'uid': 9999  # Non-existent user ID
        }
        response = self.client.post(self.change_password_url, json.dumps(data), content_type='application/json')
        self.assertEqual(response.status_code, 404)
        self.user.refresh_from_db()
        self.assertTrue(self.user.check_password('old_password123'))
