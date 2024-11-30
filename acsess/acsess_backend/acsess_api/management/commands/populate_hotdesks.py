from django.core.management.base import BaseCommand
from acsess_api.models import hotdesk
import random

hotdesk_list = ['1','2','3','4','5','6','7','8','9','10','11','12','13','14','15']
utilities = ['projector','whiteboard','computer','microphone','monitor']


class Command(BaseCommand):
    help = 'Populates the Hotdesk table with sample data'

    def handle(self, *args, **kwargs):
        hotdesks = [
            hotdesk(hotdesk_number=hotdesk_no, 
                    hotdesk_location='K17',
                    hotdesk_floor=random.randint(2, 5),
                    hotdesk_utilities=','.join(random.sample(utilities, 3)),
                    hotdesk_description='Sample hotdesk description')
            for hotdesk_no in hotdesk_list
        ]
        hotdesk.objects.bulk_create(hotdesks)
        self.stdout.write(self.style.SUCCESS('Successfully populated the Hotdesk table with sample data'))
