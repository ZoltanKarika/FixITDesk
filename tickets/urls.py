from django.urls import path
from .views import TicketListCreateView, TicketRetrieveUpdateDestroyView

urlpatterns = [
    path('tickets/', TicketListCreateView.as_view(), name='ticket-list-create'),
    path('tickets/<int:pk>/', TicketRetrieveUpdateDestroyView.as_view(), name='ticket-detail'),
]