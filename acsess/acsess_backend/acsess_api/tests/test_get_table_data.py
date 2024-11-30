from django.test import TestCase, Client
from django.urls import reverse
from django.contrib.auth.models import User
from django.apps import apps
from django.db.models import Q
from django.http import JsonResponse
import json

class GetTableDataTestCase(TestCase):
    def setUp(self):
        self.client = Client()
        self.get_table_data_url = reverse('get_data')
        
        # Create test users for auth_user table
        self.user1 = User.objects.create_user(username='user1', email='user1@example.com', password='password123')
        self.user2 = User.objects.create_user(username='user2', email='user2@example.com', password='password123')
        
        # Assuming you have other tables like 'hdr_student' or similar
        # self.hdr_student = apps.get_model('acsess_api', 'hdr_student')

    def test_missing_required_fields(self):
        data = {
            'table': 'auth_user'
            # 'sort_type' is missing
        }
        response = self.client.post(self.get_table_data_url, json.dumps(data), content_type='application/json')
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.json(), {'error': 'Missing required fields'})

    def test_invalid_table_name(self):
        data = {
            'table': 'invalid_table',
            'sort_type': 1,
            'sort': {'username': 'user1'}
        }
        response = self.client.post(self.get_table_data_url, json.dumps(data), content_type='application/json')
        self.assertEqual(response.status_code, 404)

    def test_valid_request_and_condition(self):
        data = {
            'table': 'auth_user',
            'sort_type': 1,  # AND condition
            'sort': {'username': 'user1', 'email': 'user1@example.com'}
        }
        response = self.client.post(self.get_table_data_url, json.dumps(data), content_type='application/json')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.json()), 1)
        self.assertEqual(response.json()[0]['username'], 'user1')

    def test_valid_request_or_condition(self):
        data = {
            'table': 'auth_user',
            'sort_type': 2,  # OR condition
            'sort': {'username': 'user1', 'email': 'user2@example.com'}
        }
        response = self.client.post(self.get_table_data_url, json.dumps(data), content_type='application/json')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.json()), 2)

    def test_invalid_json_data(self):
        response = self.client.post(self.get_table_data_url, "invalid_json", content_type='application/json')
        self.assertEqual(response.status_code, 500)

    def test_object_does_not_exist(self):
        data = {
            'table': 'auth_user',
            'sort_type': 1,  # AND condition
            'sort': {'username': 'non_existent_user'}
        }
        response = self.client.post(self.get_table_data_url, json.dumps(data), content_type='application/json')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.json()), 0)
