from django.contrib.auth.models import User, Group
from django.test import TestCase, Client
from django.urls import reverse
from acsess_api.models import hdr_student, cse_staff
import json
import logging

class LoginTestCase(TestCase):
    def setUp(self):
        self.client = Client()
        self.login_url = reverse('login')
        self.register_url = reverse('register_hdr_student')
        self.email = "test@example.com"
        self.password = "securepassword"

        # Suppress logging during tests
        logging.disable(logging.CRITICAL)
        
        # Create the 'hdr_student' group if it doesn't exist
        if not Group.objects.filter(name='hdr_student').exists():
            Group.objects.create(name='hdr_student')

        # Register a new user
        response = self.client.post(self.register_url, json.dumps({
            'user': {
                'username': self.email,
                'password': self.password,
                'email': self.email
            },
            'student_zid': 'z1234567',
            'student_name': 'Test Student',
            'student_email': self.email,
            'student_faculty': 'Engineering',
            'student_school': 'School of CSE',
            'student_degree': 'BSc Computer Science',
            'student_role': 'student',
            'student_password': self.password
        }), content_type='application/json')
        
        if response.status_code != 201:
            print("Registration failed:", response.content)  # Print response content for debugging
        # Ensure the user was registered successfully
        self.assertEqual(response.status_code, 201)
        
        # Verify that the user is created and active
        user = User.objects.get(username=self.email)
        self.assertTrue(user.is_active)
        
        # Log in to get the token
        response = self.client.post(self.login_url, json.dumps({
            'username': self.email,
            'password': self.password
        }), content_type='application/json')
        response_data = json.loads(response.content)
        self.assertIn('token', response_data)
        self.token = response_data.get('token')

    def tearDown(self):
        # Re-enable logging after tests
        logging.disable(logging.NOTSET)


    def test_login_valid(self):
        response = self.client.post(self.login_url, json.dumps({
            'username': self.email,
            'password': self.password
        }), content_type='application/json')
        self.assertEqual(response.status_code, 200)
        response_data = json.loads(response.content)
        self.assertTrue(response_data['success'])
        self.assertIn('token', response_data)

    def test_login_invalid_password(self):
        response = self.client.post(self.login_url, json.dumps({
            'username': self.email,
            'password': self.password + "awujdb"
        }), content_type='application/json')
        self.assertEqual(response.status_code, 401)
        response_data = json.loads(response.content)
        self.assertFalse(response_data['success'])

    def test_login_invalid_email(self):
        response = self.client.post(self.login_url, json.dumps({
            'username': self.email + ".hwaid",
            'password': self.password
        }), content_type='application/json')
        self.assertEqual(response.status_code, 401)
        response_data = json.loads(response.content)
        self.assertFalse(response_data['success'])

    def test_login_invalid_credentials(self):
        response = self.client.post(self.login_url, json.dumps({
            'username': self.email + ".hwaid",
            'password': self.password + "awujdb"
        }), content_type='application/json')
        self.assertEqual(response.status_code, 401)
        response_data = json.loads(response.content)
        self.assertFalse(response_data['success'])

    def test_login_missing_email(self):
        response = self.client.post(self.login_url, json.dumps({
            'username': "",
            'password': self.password
        }), content_type='application/json')
        self.assertEqual(response.status_code, 401)
        response_data = json.loads(response.content)
        self.assertFalse(response_data['success'])

    def test_login_missing_password(self):
        response = self.client.post(self.login_url, json.dumps({
            'username': self.email,
            'password': ""
        }), content_type='application/json')
        self.assertEqual(response.status_code, 401)
        response_data = json.loads(response.content)
        self.assertFalse(response_data['success'])

    def test_login_missing_credentials(self):
        response = self.client.post(self.login_url, json.dumps({
            'username': "",
            'password': ""
        }), content_type='application/json')
        self.assertEqual(response.status_code, 401)
        response_data = json.loads(response.content)
        self.assertFalse(response_data['success'])