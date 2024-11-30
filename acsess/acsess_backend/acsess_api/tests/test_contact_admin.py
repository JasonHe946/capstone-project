from django.test import TestCase, Client
from django.urls import reverse
import json

class ContactAdminTestCase(TestCase):
    def setUp(self):
        self.client = Client()
        self.contact_admin_url = reverse('contact_admin')

    def test_contact_admin_valid(self):
        data = {
            'name': 'John Doe',
            'email': 'john.doe@example.com',
            'zid': 'z1234567',
            'role': 'staff',
            'message': 'This is a test message.'
        }
        response = self.client.post(self.contact_admin_url, json.dumps(data), content_type='application/json')
        self.assertEqual(response.status_code, 200)
        self.assertJSONEqual(response.content, {'success': True, 'message': 'Email sent successfully'})

    def test_contact_admin_missing_fields(self):
        data = {
            'name': 'John Doe',
            'email': 'john.doe@example.com',
            'zid': 'z1234567'
            # Missing 'role' and 'message'
        }
        response = self.client.post(self.contact_admin_url, json.dumps(data), content_type='application/json')
        self.assertEqual(response.status_code, 406)
        self.assertJSONEqual(response.content, {'error': "'Missing fields'"})

    def test_contact_admin_invalid_json(self):
        data = 'invalid json'
        response = self.client.post(self.contact_admin_url, data, content_type='application/json')
        self.assertEqual(response.status_code, 400)
        self.assertJSONEqual(response.content, {'error': 'Invalid JSON'})

