"""
This module configures the Celery application for the acsess_backend project.

It sets the default Django settings module for the Celery program,
loads task modules from all registered Django app configs,
and configures Celery to use Django settings.
"""

from __future__ import absolute_import, unicode_literals
import os
from celery import Celery
from django.conf import settings

# Set the default Django settings module for the 'celery' program.
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'acsess_backend.settings')

app = Celery('acsess_backend')

# Using a string here means the worker will not have to pickle the object when using Windows.
app.config_from_object('django.conf:settings', namespace='CELERY')

# Load task modules from all registered Django app configs.
app.autodiscover_tasks()

app.conf.timezone = settings.TIME_ZONE

@app.task(bind=True)
def debug_task(self):
    """A debug task that prints the request information."""
    print(f'Request: {self.request!r}')
