from django.contrib import admin
from .models import Ticket, Note

admin.site.register(Ticket)
admin.site.register(Note)