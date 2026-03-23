from rest_framework import serializers
from .models import Note, Ticket

from .models import Ticket, Note, NoteRead

class TicketSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    unread_count = serializers.SerializerMethodField()

    def get_unread_count(self, obj):
        request = self.context.get('request')
        if not request:
            return 0
        
        notes = obj.notes.exclude(user=request.user)
        
        if not request.user.is_support_staff:
            notes = notes.filter(note_type='customer_note')
        
        read_note_ids = NoteRead.objects.filter(
            user=request.user,
            note__in=notes
        ).values_list('note_id', flat=True)
        
        return notes.exclude(id__in=read_note_ids).count()

    class Meta:
        model = Ticket
        fields = '__all__'
        read_only_fields = ['id', 'created_at', 'updated_at', 'user']
   

class NoteSerializer(serializers.ModelSerializer):
    # Optionally, you can include user and ticket information in the response
    user = serializers.StringRelatedField(read_only=True)  # Shows the username of the user who created the note
    ticket = serializers.StringRelatedField(read_only=True)  # Shows the title of the related ticket
    is_support_staff = serializers.SerializerMethodField()

    def get_is_support_staff(self, obj):
        return obj.user.is_support_staff
    class Meta:
        model = Note
        fields = ['id', 'ticket', 'user', 'content', 'note_type', 'created_at', 'is_support_staff']
        read_only_fields = ['id', 'created_at', 'user', 'ticket']


