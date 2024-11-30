# apps.py

from django.apps import AppConfig
from django.db.models.signals import post_migrate

class AcsessApiConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'acsess_api'

    def ready(self):
        import acsess_api.signals
        