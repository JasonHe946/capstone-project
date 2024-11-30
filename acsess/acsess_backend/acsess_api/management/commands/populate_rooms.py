from django.core.management.base import BaseCommand
from acsess_api.models import room
import random

rooms_list = ['201A','201B','217A','301A','301B','401A','412A','501A','510A']
utilities = ['projector','whiteboard','computer','microphone','monitor']
         

class Command(BaseCommand):
    help = 'Populates the Room table with sample data'

    def handle(self, *args, **kwargs):
        rooms = [
            room(room_number=room_no, 
                 room_location=f'K17', 
                 room_capacity=(random.randint(1, 20) * 5),
                 room_utilities=','.join(random.sample(utilities, 3)),
                 room_description='Sample room description')
                
            for room_no in rooms_list
        ]
        room.objects.bulk_create(rooms)
        self.stdout.write(self.style.SUCCESS('Successfully populated the Room table with sample data'))