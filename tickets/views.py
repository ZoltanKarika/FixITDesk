from rest_framework import generics, permissions
from .models import Ticket, Note, NoteRead
from .serializers import TicketSerializer, NoteSerializer
from rest_framework.exceptions import PermissionDenied
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.utils import timezone
from datetime import timedelta

class IsSupportStaffOrOwner(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.user.is_support_staff:  # Support staff can always access
            return True
        return obj.user == request.user  # Normal user can only access their own ticket


class TicketListCreateView(generics.ListCreateAPIView):
    serializer_class = TicketSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        queryset = Ticket.objects.all()
          
        if user.is_support_staff:
            limit = timezone.now() - timedelta(days=21)                            # clean up old closed tickets (support staff request)
            Ticket.objects.filter(
                status='closed',
                updated_at__lt=limit
            ).delete()
      
                                                                                # Allow support staff to see all tickets
        if user.is_support_staff:
            status = self.request.query_params.get('status', None)
            if status:
                queryset = queryset.filter(status=status)                         # Filtering by status if passed
        else:
            queryset = Ticket.objects.filter(user=user).exclude(status='closed')  # Regular users can only see their own tickets

        return queryset

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class TicketRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Ticket.objects.all()
    serializer_class = TicketSerializer
    permission_classes = [permissions.IsAuthenticated, IsSupportStaffOrOwner]

    def get_object(self):
        ticket = super().get_object()
        return ticket
    
class NoteListCreateView(generics.ListCreateAPIView):
    serializer_class = NoteSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Retrieve all notes for the specific ticket
        ticket_id = self.kwargs['ticket_id']
        return Note.objects.filter(ticket_id=ticket_id)

    def perform_create(self, serializer):
        ticket = Ticket.objects.get(id=self.kwargs['ticket_id'])  # Get ticket from URL
        user = self.request.user

        # Automatically associate the logged-in user and ticket with the note
        serializer.save(user=user, ticket=ticket)

    def create(self, request, *args, **kwargs):
        # Optionally, add custom permissions or validation before creating the note
        ticket_id = self.kwargs['ticket_id']
        ticket = Ticket.objects.get(id=ticket_id)

        # Only allow support staff to create work notes
        if not request.user.is_support_staff and request.data.get('note_type') == Note.WORK_NOTE:
            raise PermissionDenied("You do not have permission to create work notes.")
        
        return super().create(request, *args, **kwargs)
    
class NoteRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):

    queryset = Note.objects.all()
    serializer_class = NoteSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        note = super().get_object()

        # Only allow the note's creator or support staff to edit or delete the note
        if note.user != self.request.user and not self.request.user.is_support_staff:
            raise PermissionDenied("You do not have permission to edit or delete this note.")

        return note
    
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def mark_notes_read(request, ticket_id):
    ticket = Ticket.objects.get(id=ticket_id)
    if ticket.user != request.user and not request.user.is_support_staff:
        return Response({'error': 'Permission denied'}, status=403)
    
    notes = Note.objects.filter(ticket_id=ticket_id).exclude(user=request.user)
    
    if not request.user.is_support_staff:
        notes = notes.filter(note_type='customer_note')
    
    for note in notes:
        NoteRead.objects.get_or_create(note=note, user=request.user)
    
    return Response({'status': 'ok'})
#Notification api



