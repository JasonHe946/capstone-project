from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status
from django.contrib.auth.models import User
from django.contrib.auth.hashers import make_password
from acsess_api.models import hdr_student, cse_staff
import logging

class ResetPasswordViewTests(TestCase):
    def setUp(self):

        logging.disable(logging.CRITICAL)
        
        self.client = APIClient()
        self.user_email = 'z5647382@student.unsw.edu.au'
        self.user_password = 'old_password'
        self.new_password = 'new_password'
        self.otp = '123456'

        # Create hdr_student user
        self.hdr_user = User.objects.create(
            username='hdr_user',
            email=self.user_email,
            password=make_password(self.user_password),
        )
        self.hdr_student = hdr_student.objects.create(
            user=self.hdr_user,
            otp=self.otp
        )

        # Create cse_staff user
        self.cse_user = User.objects.create(
            username='cse_user',
            email='cse@example.com',
            password=make_password(self.user_password),
        )
        self.cse_staff = cse_staff.objects.create(
            user=self.cse_user,
            otp=self.otp
        )

    def test_send_reset_code(self):
        response = self.client.post(reverse('reset_password'), data={
            'email': self.user_email,
            'otp': '',
            'password': ''
        }, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_reset_password_invalid_otp(self):
        response = self.client.post(reverse('reset_password'), data={
            'email': self.user_email,
            'otp': 'wrong_otp',
            'password': self.new_password
        }, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_reset_password_valid_otp_hdr_student(self):
        response = self.client.post(reverse('reset_password'), data={
            'email': self.user_email,
            'otp': self.otp,
            'password': self.new_password
        }, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.json(), {'success': True, 'message': 'User\'s password has been successfully update.'})
        self.hdr_user.refresh_from_db()
        #self.assertTrue(self.hdr_user.check_password(self.new_password))

    def test_reset_password_valid_otp_cse_staff(self):
        response = self.client.post(reverse('reset_password'), data={
            'email': 'cse@example.com',
            'otp': self.otp,
            'password': self.new_password
        }, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.json(), {'success': True, 'message': 'User\'s password has been successfully update.'})
        self.cse_user.refresh_from_db()
        #self.assertTrue(self.cse_user.check_password(self.new_password))

    def test_reset_password_no_otp_provided(self):
        response = self.client.post(reverse('reset_password'), data={
            'email': self.user_email,
            'otp': None,
            'password': self.new_password
        }, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_reset_password_no_user(self):
        response = self.client.post(reverse('reset_password'), data={
            'email': 'nonexistent@example.com',
            'otp': self.otp,
            'password': self.new_password
        }, format='json')
        self.assertEqual(response.status_code, 400)

    def test_reset_password_no_password_provided(self):
        response = self.client.post(reverse('reset_password'), data={
            'email': self.user_email,
            'otp': self.otp,
            'password': ''
        }, format='json')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json(), {'message': 'OTP has been verified', 'success': True})
