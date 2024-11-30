from django.urls import path, include
from .views import AdminHelpView, CheckInView, LoginView, HDRStudentRegisterView, CSEStaffRegisterView, ContactAdminView, UpdateUserRoleView, ChangePasswordView, CreateRoomBookingView, AdminAcceptOrDenyBookingView, CancelBookingView, EditBookingView, CreateHotdeskBookingView, GetDataView, ResetPasswordView, DownloadBookingHistoryView
from rest_framework_simplejwt.views import TokenRefreshView
from .views import protected_view

urlpatterns = [
    path('login/', LoginView.as_view(), name='login'),
    path('register/hdr_student/', HDRStudentRegisterView.as_view(), name='register_hdr_student'),
    path('register/cse_staff/', CSEStaffRegisterView.as_view(), name='register_cse_staff'),
    path('contact-admin/', ContactAdminView.as_view(), name='contact_admin'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('protected/', protected_view, name='protected_view'),
    path('update-role/', UpdateUserRoleView.as_view(), name='update_role'),
    path('change-password/', ChangePasswordView.as_view(), name='change_password'),
    path('create-room-booking/', CreateRoomBookingView.as_view(), name='create_room_booking'),
    path('admin-accept-or-deny-booking/', AdminAcceptOrDenyBookingView.as_view(), name='admin_accept_or_deny_booking'),
    path('cancel-booking/', CancelBookingView.as_view(), name='cancel_booking'),
    path('edit-booking/', EditBookingView.as_view(), name='edit_booking'),
    path('create-hotdesk-booking/', CreateHotdeskBookingView.as_view(), name='create_hotdesk_booking'),
    path('get-data/', GetDataView.as_view(), name='get_data'),
    path('cancel-booking/', CancelBookingView.as_view(), name='cancel_booking'),
    path('reset-password/', ResetPasswordView.as_view(), name='reset_password'),
    path('help/', AdminHelpView.as_view(), name='admin_help'),
    path('check-in/', CheckInView.as_view(), name='check_in'),
    path('download-booking-history/', DownloadBookingHistoryView.as_view(), name='download_booking_history')
]
