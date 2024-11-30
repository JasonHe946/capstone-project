"""
This module initializes the Celery application for the acsess_backend project.

It ensures that the Celery app is always imported when Django starts,
so that shared_task will use this app.
"""
from __future__ import absolute_import, unicode_literals

# This will make sure the app is always imported when Django starts
# so that shared_task will use this app.
from .celery import app as celery_app

__all__ = ('celery_app',)
