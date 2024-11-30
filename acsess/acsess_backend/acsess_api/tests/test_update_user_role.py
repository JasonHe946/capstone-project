from django.test import TestCase, Client
from django.urls import reverse
from django.contrib.auth.models import User, Group
import json, logging

class UpdateUserRoleTestCase(TestCase):
    def setUp(self):
        # Suppress logging during tests
        logging.disable(logging.CRITICAL)

        self.client = Client()
        self.update_user_role_url = reverse('update_role')
        
        # Create user groups
        self.cse_staff_group = Group.objects.create(name='cse_staff')
        self.hdr_student_group = Group.objects.create(name='hdr_student')
        
        # Create test users
        self.hdr_student_user = User.objects.create_user(username='hdrstudent', password='password123')
        self.hdr_student_user.groups.add(self.hdr_student_group)

        self.cse_staff_user = User.objects.create_user(username='csestaff', password='password123')
        self.cse_staff_user.groups.add(self.cse_staff_group)

        self.admin_user = User.objects.create_user(username='adminuser', password='password123')
        self.admin_user.is_staff = True
        self.admin_user.save()

    def test_update_user_role_hdr_to_cse_staff(self):
        data = {
            'username': 'hdrstudent',
            'role': 'staff'
        }
        response = self.client.post(self.update_user_role_url, json.dumps(data), content_type='application/json')
        self.assertEqual(response.status_code, 200)
        self.hdr_student_user.refresh_from_db()
        self.assertTrue(self.hdr_student_user.groups.filter(name='cse_staff').exists())
        self.assertFalse(self.hdr_student_user.groups.filter(name='hdr_student').exists())

    def test_update_user_role_cse_staff_to_hdr_student(self):
        data = {
            'username': 'csestaff',
            'role': 'student'
        }
        response = self.client.post(self.update_user_role_url, json.dumps(data), content_type='application/json')
        self.assertEqual(response.status_code, 200)
        self.cse_staff_user.refresh_from_db()
        self.assertTrue(self.cse_staff_user.groups.filter(name='hdr_student').exists())
        self.assertFalse(self.cse_staff_user.groups.filter(name='cse_staff').exists())

    def test_update_user_role_to_admin(self):
        data = {
            'username': 'csestaff',
            'role': 'admin'
        }
        response = self.client.post(self.update_user_role_url, json.dumps(data), content_type='application/json')
        self.assertEqual(response.status_code, 200)
        # self.cse_staff_user.refresh_from_db()
        # self.assertTrue(self.cse_staff_user.is_staff)

    # def test_update_user_role_admin_to_non_admin(self):
    #     data = {
    #         'username': 'adminuser',
    #         'role': 'non-admin'
    #     }
    #     response = self.client.post(self.update_user_role_url, json.dumps(data), content_type='application/json')
    #     self.assertEqual(response.status_code, 200)
    #     self.admin_user.refresh_from_db()
    #     self.assertFalse(self.admin_user.is_staff)

    def test_update_user_role_invalid_user(self):
        data = {
            'username': 'invaliduser',
            'role': 'staff'
        }
        response = self.client.post(self.update_user_role_url, json.dumps(data), content_type='application/json')
        self.assertEqual(response.status_code, 404)

    # def test_update_user_role_invalid_role(self):
    #     data = {
    #         'username': 'hdrstudent',
    #         'role': 'invalidrole'
    #     }
    #     response = self.client.post(self.update_user_role_url, json.dumps(data), content_type='application/json')
    #     self.assertEqual(response.status_code, 200)

    # def test_update_user_role_missing_fields(self):
    #     data = {
    #         'username': 'hdrstudent'
    #         # Missing 'role'
    #     }
    #     response = self.client.post(self.update_user_role_url, json.dumps(data), content_type='application/json')
    #     self.assertEqual(response.status_code, 400)
        
    #     data = {
    #         'role': 'staff'
    #         # Missing 'username'
    #     }
    #     response = self.client.post(self.update_user_role_url, json.dumps(data), content_type='application/json')
    #     self.assertEqual(response.status_code, 400)