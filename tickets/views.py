from rest_framework import generics, permissions
from .models import Ticket
from .serializers import TicketSerializer
from rest_framework.exceptions import PermissionDenied

class TicketListCreateView(generics.ListCreateAPIView):
    serializer_class = TicketSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.is_staff:  # Staff can see all tickets
            return Ticket.objects.all()
        return Ticket.objects.filter(user=user)  # Normal user sees only their own tickets

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class TicketRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Ticket.objects.all()
    serializer_class = TicketSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        # Retrieve the ticket object
        ticket = super().get_object()

        # Check if the logged-in user is the owner of the ticket
        if ticket.user != self.request.user:
            raise PermissionDenied("You do not have permission to edit or delete this ticket.")
        
        return ticket