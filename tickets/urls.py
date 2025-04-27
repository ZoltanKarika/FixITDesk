from django.urls import path
from .views import TicketListCreateView, TicketRetrieveUpdateDestroyView
from . import views

urlpatterns = [
    path('tickets/', TicketListCreateView.as_view(), name='ticket-list-create'),
    path('tickets/<int:pk>/', TicketRetrieveUpdateDestroyView.as_view(), name='ticket-detail'),
    path('tickets/<int:ticket_id>/notes/', views.NoteListCreateView.as_view(), name='note-list-create'),
    path('notes/<int:pk>/', views.NoteRetrieveUpdateDestroyView.as_view(), name='note-retrieve-update-destroy'),
]