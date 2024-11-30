from django.test import TestCase, Client
from django.urls import reverse
from django.contrib.auth.models import User
from django.utils import timezone
from acsess_api.models import booking, booking_history, room, hotdesk, hdr_student, cse_staff
import csv
import io

class DownloadBookingHistoryTestCase(TestCase):
    def setUp(self):
        self.client = Client()
        self.download_url = reverse('download_booking_history')

        # Create test users and roles
        self.user1 = User.objects.create_user(username='student1', password='password123')
        self.hdr_student = hdr_student.objects.create(
            user=self.user1,
            student_zid='z1234567',
            student_name='Student One',
            student_email='student1@example.com',
            student_faculty='Science',
            student_school='School of Chemistry',
            student_degree='PhD',
            student_role='student'
        )

        self.user2 = User.objects.create_user(username='staff1', password='password123')
        self.cse_staff = cse_staff.objects.create(
            user=self.user2,
            staff_zid='z2345678',
            staff_name='Staff One',
            staff_email='staff1@example.com',
            staff_faculty='Engineering',
            staff_school='School of Computer Science',
            staff_title='Lecturer',
            staff_role='staff'
        )

        # Create test rooms and hotdesks
        self.room = room.objects.create(
            room_number='Room 101',
            room_location='Building A',
            room_capacity=20,
            room_utilities='Projector, Whiteboard',
            room_description='Conference Room'
        )

        self.hotdesk = hotdesk.objects.create(
            hotdesk_number='Hotdesk 1',
            hotdesk_location='Building B',
            hotdesk_floor=2,
            hotdesk_description='Open space hotdesk'
        )

        # Create test bookings and booking history
        self.booking1 = booking.objects.create(
            room_or_hotdesk=self.room,
            user=self.user1,
            start_time=timezone.now() + timezone.timedelta(hours=1),
            end_time=timezone.now() + timezone.timedelta(hours=2),
            state='pending'
        )

        self.booking_history1 = booking_history.objects.get(booking=self.booking1)

        self.booking2 = booking.objects.create(
            room_or_hotdesk=self.hotdesk,
            user=self.user2,
            start_time=timezone.now() + timezone.timedelta(days=1),
            end_time=timezone.now() + timezone.timedelta(days=1, hours=2),
            state='pending'
        )
        self.booking_history2 = booking_history.objects.get(booking=self.booking2)

    def test_download_booking_history(self):
        response = self.client.get(self.download_url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response['Content-Type'], 'text/csv')
        self.assertEqual(response['Content-Disposition'], 'attachment; filename="booking_history.csv"')

        content = response.content.decode('utf-8')
        reader = csv.reader(io.StringIO(content))
        rows = list(reader)

        # Check header
        self.assertEqual(rows[0], [
            'Booking ID', 'Booking History ID', 'User ID', 'User Name', 'User Email', 'User Faculty', 
            'User School', 'User Role', 'Room/Hotdesk ID', 'Room/Hotdesk Number', 'Room/Hotdesk Location',
            'Room/Hotdesk Description', 'Start Time', 'End Time', 'State', 'Created At', 'Updated At'
        ])

        # Extract the rows without header for comparison
        data_rows = rows[1:]

        # Expected data
        expected_row1 = [
            str(self.booking1.booking_id),
            str(self.booking_history1.booking_history_id),
            str(self.user1.id),
            'Student One',
            'student1@example.com',
            'Science',
            'School of Chemistry',
            'student',
            str(self.room.room_id),
            'Room 101',
            'Building A',
            'Conference Room',
            str(self.booking1.start_time),
            str(self.booking1.end_time),
            'pending',
            str(self.booking_history1.created_at),
            str(self.booking_history1.updated_at),
            'pending',  # Check-in status should be empty
            '',  # Checked-in at should be empty
        ]

        expected_row2 = [
            str(self.booking2.booking_id),
            str(self.booking_history2.booking_history_id),
            str(self.user2.id),
            'Staff One',
            'staff1@example.com',
            'Engineering',
            'School of Computer Science',
            'staff',
            str(self.hotdesk.hotdesk_id),
            'Hotdesk 1',
            'Building B',
            'Open space hotdesk',
            str(self.booking2.start_time),
            str(self.booking2.end_time),
            'pending',
            str(self.booking_history2.created_at),
            str(self.booking_history2.updated_at),
            'pending',  # Check-in status should be empty
            '',  # Checked-in at should be empty
        ]

        # Check if expected rows are in the response
        self.assertIn(expected_row1, data_rows)
        self.assertIn(expected_row2, data_rows)