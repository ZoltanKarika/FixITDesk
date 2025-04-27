from rest_framework import serializers
from .models import Note, Ticket

class TicketSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ticket
        fields = '__all__'
        read_only_fields = ['id', 'created_at', 'updated_at', 'user']


class NoteSerializer(serializers.ModelSerializer):
    # Optionally, you can include user and ticket information in the response
    user = serializers.StringRelatedField(read_only=True)  # Shows the username of the user who created the note
    ticket = serializers.StringRelatedField(read_only=True)  # Shows the title of the related ticket
    
    class Meta:
        model = Note
        fields = ['id', 'ticket', 'user', 'content', 'note_type', 'created_at']
        read_only_fields = ['id', 'created_at', 'user', 'ticket']