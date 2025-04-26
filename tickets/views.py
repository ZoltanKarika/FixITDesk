# tickets/views.py
from rest_framework.generics import ListCreateAPIView
from .models import Ticket
from .serializers import TicketSerializer

class TicketListCreateView(ListCreateAPIView):  # 👉 List and Create in one view
    queryset = Ticket.objects.all()
    serializer_class = TicketSerializer
