from django.core.management.base import BaseCommand
from django.db import connection

class Command(BaseCommand):
    help = 'Truncate specified tables'

    def handle(self, *args, **kwargs):
        tables = ['auth_user','acsess_api_room', 'acsess_api_hotdesk', 'acsess_api_cse_staff', 'acsess_api_hdr_student', 'acsess_api_booking', 'acsess_api_booking_history', 'acsess_api_pending_booking']
        with connection.cursor() as cursor:
            for table in tables:
                cursor.execute(f'TRUNCATE TABLE {table} RESTART IDENTITY CASCADE;')
                self.stdout.write(self.style.SUCCESS(f'Successfully truncated {table}'))