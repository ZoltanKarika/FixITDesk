from django.db import models
from django.conf import settings

class Ticket(models.Model):
    INCIDENT = 'incident'
    PROBLEM = 'problem'
    REQUEST = 'request'
    CHANGE = 'change'
    
    TICKET_TYPE_CHOICES = [
        (INCIDENT, 'Incident'),
        (PROBLEM, 'Problem'),
        (REQUEST, 'Request'),
        (CHANGE, 'Change')
    ]
    
    LOW = 'low'
    MEDIUM = 'medium'
    HIGH = 'high'
    URGENT = 'urgent'
    
    PRIORITY_CHOICES = [
        (LOW, 'Low'),
        (MEDIUM, 'Medium'),
        (HIGH, 'High'),
        (URGENT, 'Urgent')
    ]
    
    LOW_IMPACT = 'low'
    MEDIUM_IMPACT = 'medium'
    HIGH_IMPACT = 'high'
    
    IMPACT_CHOICES = [
        (LOW_IMPACT, 'Low'),
        (MEDIUM_IMPACT, 'Medium'),
        (HIGH_IMPACT, 'High')
    ]
    
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    title = models.CharField(max_length=255)
    description = models.TextField()
    type = models.CharField(
        max_length=20,
        choices=TICKET_TYPE_CHOICES,
        default=INCIDENT
    )
    status = models.CharField(
        max_length=20,
        choices=[('open', 'Open'), ('in_progress', 'In Progress'), ('resolved', 'Resolved'), ('closed', 'Closed')],
        default='open'
    )
    priority = models.CharField(
        max_length=20,
        choices=PRIORITY_CHOICES,
        default=LOW
    )
    impact = models.CharField(
        max_length=20,
        choices=IMPACT_CHOICES,
        default=LOW_IMPACT
    )
    assigned_to = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='assigned_tickets', on_delete=models.SET_NULL, null=True, blank=True)
    department = models.CharField(max_length=100)
    submitted_via = models.CharField(max_length=20, choices=[('widget', 'Widget'), ('email', 'Email'), ('api', 'API')], default='widget')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"Ticket {self.id} - {self.title}"
    
class Note(models.Model):
    # Types of notes: internal work notes or customer-visible notes
    WORK_NOTE = 'work_note'
    CUSTOMER_NOTE = 'customer_note'
    
    NOTE_TYPE_CHOICES = [
        (WORK_NOTE, 'Work Note'),
        (CUSTOMER_NOTE, 'Customer Note'),
    ]
    
    ticket = models.ForeignKey(Ticket, related_name='notes', on_delete=models.CASCADE)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='notes', on_delete=models.CASCADE)
    content = models.TextField()
    note_type = models.CharField(
        max_length=20,
        choices=NOTE_TYPE_CHOICES, 
        default=WORK_NOTE,
    )
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.get_note_type_display()} on {self.ticket.title} by {self.user.username} at {self.created_at}"
