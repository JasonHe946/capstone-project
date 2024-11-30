from django.test import TestCase, Client
from django.urls import reverse
from django.contrib.auth.models import Group
from acsess_api.models import hdr_student, cse_staff
import json
import logging

class SignUpTestCase(TestCase):
    def setUp(self):
        self.client = Client()
        self.staff_register_url = reverse('register_cse_staff')
        self.student_register_url = reverse('register_hdr_student')
        self.staff_email = "staff@example.com"
        self.student_email = "student@example.com"
        self.zID = "z1234567"
        self.name = "John Doe"
        self.staff_role = "Staff"
        self.student_role = "Student"
        self.password = "password123"  # Example password

        # Suppress logging during tests
        logging.disable(logging.CRITICAL)

        # Create the necessary groups
        Group.objects.create(name='cse_staff')
        Group.objects.create(name='hdr_student')

    def tearDown(self):
        # Re-enable logging after tests are done
        logging.disable(logging.NOTSET)

    def test_signup_staff_valid_contact(self):
        data = {
            'user': {
                'username': self.staff_email,
                'password': self.password,
                'email': self.staff_email
            },
            'staff_zid': self.zID,
            'staff_name': self.name,
            'staff_email': self.staff_email,
            'staff_faculty': 'Engineering',
            'staff_school': 'School of CSE',
            'staff_title': 'Lecturer',
            'staff_role': self.staff_role,
            'staff_password': self.password
        }
        response = self.client.post(self.staff_register_url, json.dumps(data), content_type='application/json')
        self.assertEqual(response.status_code, 201)
        self.assertTrue(cse_staff.objects.filter(staff_email=self.staff_email).exists())

    def test_signup_staff_invalid_email(self):
        data = {
            'user': {
                'username': ".gibberishwhadkj",
                'password': self.password,
                'email':  ".gibberishwhadkj"
            },
            'staff_zid': self.zID,
            'staff_name': self.name,
            'staff_email': ".gibberishwhadkj",
            'staff_faculty': 'Engineering',
            'staff_school': 'School of CSE',
            'staff_title': 'Lecturer',
            'staff_role': self.staff_role,
            'staff_password': self.password
        }
        response = self.client.post(self.staff_register_url, json.dumps(data), content_type='application/json')
        self.assertEqual(response.status_code, 400)

    def test_signup_staff_invalid_zID(self):
        data = {
            'user': {
                'username': self.staff_email,
                'password': self.password,
                'email': self.staff_email
            },
            'staff_zid': self.zID + "123",
            'staff_name': self.name,
            'staff_email': self.staff_email,
            'staff_faculty': 'Engineering',
            'staff_school': 'School of CSE',
            'staff_title': 'Lecturer',
            'staff_role': self.staff_role,
            'staff_password': self.password
        }
        response = self.client.post(self.staff_register_url, json.dumps(data), content_type='application/json')
        self.assertEqual(response.status_code, 201)

    def test_signup_staff_invalid_role(self):
        data = {
            'user': {
                'username': self.staff_email,
                'password': self.password,
                'email': self.staff_email
            },
            'staff_zid': self.zID,
            'staff_name': self.name,
            'staff_email': self.staff_email,
            'staff_faculty': 'Engineering',
            'staff_school': 'School of CSE',
            'staff_title': 'Lecturer',
            'staff_role': 'Janitor',
            'staff_password': self.password
        }
        response = self.client.post(self.staff_register_url, json.dumps(data), content_type='application/json')
        self.assertEqual(response.status_code, 201)

    def test_signup_staff_missing_email(self):
        data = {
            'user': {
                'username': '',
                'password': self.password,
                'email': ''
            },
            'staff_zid': self.zID,
            'staff_name': self.name,
            'staff_email': '',
            'staff_faculty': 'Engineering',
            'staff_school': 'School of CSE',
            'staff_title': 'Lecturer',
            'staff_role': self.staff_role,
            'staff_password': self.password
        }
        response = self.client.post(self.staff_register_url, json.dumps(data), content_type='application/json')
        self.assertEqual(response.status_code, 400)

    def test_signup_staff_missing_zID(self):
        data = {
            'user': {
                'username': self.staff_email,
                'password': self.password,
                'email': self.staff_email
            },
            'staff_zid': '',
            'staff_name': self.name,
            'staff_email': self.staff_email,
            'staff_faculty': 'Engineering',
            'staff_school': 'School of CSE',
            'staff_title': 'Lecturer',
            'staff_role': self.staff_role,
            'staff_password': self.password
        }
        response = self.client.post(self.staff_register_url, json.dumps(data), content_type='application/json')
        self.assertEqual(response.status_code, 400)

    def test_signup_staff_missing_name(self):
        data = {
            'user': {
                'username': self.staff_email,
                'password': self.password,
                'email': self.staff_email
            },
            'staff_zid': self.zID,
            'staff_name': '',
            'staff_email': self.staff_email,
            'staff_faculty': 'Engineering',
            'staff_school': 'School of CSE',
            'staff_title': 'Lecturer',
            'staff_role': self.staff_role,
            'staff_password': self.password
        }
        response = self.client.post(self.staff_register_url, json.dumps(data), content_type='application/json')
        self.assertEqual(response.status_code, 400)

    def test_signup_staff_missing_role(self):
        data = {
            'user': {
                'username': self.staff_email,
                'password': self.password,
                'email': self.staff_email
            },
            'staff_zid': self.zID,
            'staff_name': self.name,
            'staff_email': self.staff_email,
            'staff_faculty': 'Engineering',
            'staff_school': 'School of CSE',
            'staff_title': 'Lecturer',
            'staff_role': '',
            'staff_password': self.password
        }
        response = self.client.post(self.staff_register_url, json.dumps(data), content_type='application/json')
        self.assertEqual(response.status_code, 400)

    def test_signup_student_valid_contact(self):
        data = {
            'user': {
                'username': self.student_email,
                'password': self.password,
                'email': self.student_email
            },
            'student_zid': self.zID,
            'student_name': self.name,
            'student_email': self.student_email,
            'student_faculty': 'Engineering',
            'student_school': 'School of CSE',
            'student_degree': 'BSc Computer Science',
            'student_role': self.student_role,
            'student_password': self.password
        }
        response = self.client.post(self.student_register_url, json.dumps(data), content_type='application/json')
        self.assertEqual(response.status_code, 201)
        self.assertTrue(hdr_student.objects.filter(student_email=self.student_email).exists())

    def test_signup_student_invalid_email(self):
        data = {
            'user': {
                'username': self.student_email,
                'password': self.password,
                'email': ".gibberishwhadkj"
            },
            'student_zid': self.zID,
            'student_name': self.name,
            'student_email': ".gibberishwhadkj",
            'student_faculty': 'Engineering',
            'student_school': 'School of CSE',
            'student_degree': 'BSc Computer Science',
            'student_role': self.student_role,
            'student_password': self.password
        }
        response = self.client.post(self.student_register_url, json.dumps(data), content_type='application/json')
        self.assertEqual(response.status_code, 400)

    def test_signup_student_invalid_zID(self):
        data = {
            'user': {
                'username': self.student_email,
                'password': self.password,
                'email': self.student_email
            },
            'student_zid': self.zID + "123",
            'student_name': self.name,
            'student_email': self.student_email,
            'student_faculty': 'Engineering',
            'student_school': 'School of CSE',
            'student_degree': 'BSc Computer Science',
            'student_role': self.student_role,
            'student_password': self.password
        }
        response = self.client.post(self.student_register_url, json.dumps(data), content_type='application/json')
        self.assertEqual(response.status_code, 201)

    def test_signup_student_invalid_role(self):
        data = {
            'user': {
                'username': self.student_email,
                'password': self.password,
                'email': self.student_email
            },
            'student_zid': self.zID,
            'student_name': self.name,
            'student_email': self.student_email,
            'student_faculty': 'Engineering',
            'student_school': 'School of CSE',
            'student_degree': 'BSc Computer Science',
            'student_role': 'Janitor',
            'student_password': self.password
        }
        response = self.client.post(self.student_register_url, json.dumps(data), content_type='application/json')
        self.assertEqual(response.status_code, 201)

    def test_signup_student_missing_email(self):
        data = {
            'user': {
                'username': '',
                'password': self.password,
                'email': ''
            },
            'student_zid': self.zID,
            'student_name': self.name,
            'student_email': '',
            'student_faculty': 'Engineering',
            'student_school': 'School of CSE',
            'student_degree': 'BSc Computer Science',
            'student_role': self.student_role,
            'student_password': self.password
        }
        response = self.client.post(self.student_register_url, json.dumps(data), content_type='application/json')
        self.assertEqual(response.status_code, 400)

    def test_signup_student_missing_zID(self):
        data = {
            'user': {
                'username': self.student_email,
                'password': self.password,
                'email': self.student_email
            },
            'student_zid': '',
            'student_name': self.name,
            'student_email': self.student_email,
            'student_faculty': 'Engineering',
            'student_school': 'School of CSE',
            'student_degree': 'BSc Computer Science',
            'student_role': self.student_role,
            'student_password': self.password
        }
        response = self.client.post(self.student_register_url, json.dumps(data), content_type='application/json')
        self.assertEqual(response.status_code, 400)

    def test_signup_student_missing_name(self):
        data = {
            'user': {
                'username': self.student_email,
                'password': self.password,
                'email': self.student_email
            },
            'student_zid': self.zID,
            'student_name': '',
            'student_email': self.student_email,
            'student_faculty': 'Engineering',
            'student_school': 'School of CSE',
            'student_degree': 'BSc Computer Science',
            'student_role': self.student_role,
            'student_password': self.password
        }
        response = self.client.post(self.student_register_url, json.dumps(data), content_type='application/json')
        self.assertEqual(response.status_code, 400)

    def test_signup_student_missing_role(self):
        data = {
            'user': {
                'username': self.student_email,
                'password': self.password,
                'email': self.student_email
            },
            'student_zid': self.zID,
            'student_name': self.name,
            'student_email': self.student_email,
            'student_faculty': 'Engineering',
            'student_school': 'School of CSE',
            'student_degree': 'BSc Computer Science',
            'student_role': '',
            'student_password': self.password
        }
        response = self.client.post(self.student_register_url, json.dumps(data), content_type='application/json')
        self.assertEqual(response.status_code, 400)
