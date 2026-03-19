from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    department = models.CharField(max_length=100, blank=True)
    is_support_staff = models.BooleanField(default=False)
    
    
    def save(self, *args, **kwargs):# menti a superuser-t is_staff-nak
        if self.is_superuser:
            self.is_support_staff = True
        super().save(*args, **kwargs)