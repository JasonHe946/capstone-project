from rest_framework.response import Response # type: ignore 
from rest_framework.views import APIView # type: ignore
from rest_framework.decorators import api_view # type: ignore
from rest_framework_simplejwt.views import TokenObtainPairView # type: ignore
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer # type: ignore
from rest_framework.permissions import AllowAny # type: ignore
from rest_framework import status # type: ignore
from rest_framework import generics # type: ignore
from django.http import JsonResponse # type: ignore
from django.views.decorators.csrf import csrf_exempt # type: ignore
from django.utils.decorators import method_decorator # type: ignore
from django.contrib.auth.models import User # type: ignore
from .serializers import UserSerializer
from .src.auth import change_password, password_reset, register_cse, register_hdr, update_role
from .src.email import adminHelp, contactAdmin
from .src.booking import create_room_booking, admin_accept_or_deny_booking, cancel_booking, edit_booking, create_hotdesk_booking, checkIntoBooking
from .src.database import get_table_data, download_booking_history

from drf_yasg.utils import swagger_auto_schema # type: ignore
from drf_yasg import openapi # type: ignore

@method_decorator(csrf_exempt, name='dispatch')
class GetDataView(APIView):
    @swagger_auto_schema(
        operation_description="Get data from the desired database table using search queries",
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'table': openapi.Schema(type=openapi.TYPE_STRING, description='Table name'),
                'sort_type': openapi.Schema(type=openapi.TYPE_INTEGER, description='Sort type'),
                'sort': openapi.Schema(
                    type=openapi.TYPE_OBJECT,
                    additional_properties=openapi.Schema(type=openapi.TYPE_STRING)
                )
            },
            example={
                "table": "hotdesk",
                "sort_type": 1,
                "sort": {
                    "hotdesk_floor": 3
                }
            }
        ),
        responses={200: openapi.Response('A lisf of database entries')},
    )
    def post(self, request):
        return get_table_data(request)

@method_decorator(csrf_exempt, name='dispatch')
class LoginView(TokenObtainPairView):
    permission_classes = (AllowAny,)
    serializer_class = TokenObtainPairSerializer
    @swagger_auto_schema(
        operation_description="Login to the system",
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'username': openapi.Schema(type=openapi.TYPE_STRING, description='Username'),
                'password': openapi.Schema(type=openapi.TYPE_STRING, description='Password')
            },
            example={
                "username": "admin",
                "password": "admin"
            }
        ),
        responses={200: openapi.Response('User token and ID')},
    )
    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        username = request.data.get('username')
        try:
            serializer.is_valid(raise_exception=True)
        except Exception as e:
            return JsonResponse({'success': False}, status=status.HTTP_401_UNAUTHORIZED)

        response = super().post(request, *args, **kwargs)
        token = response.data.get('access')

        try:
            user = User.objects.get(username=username)
        except User.DoesNotExist:
            return JsonResponse({'success': False, 'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

        user_id = user.id
        user_role = ""
        
        groups = user.groups.values_list('name', flat=True)
        userGroup = list(groups)
        
        if user.is_staff:
            user_role = "admin"
        elif userGroup[0] == "hdr_student":
            user_role = "student"
        else:
            user_role = "staff"

        return JsonResponse({'success': True, 'token': token, 'user_id': user_id, 'role': user_role}, status=status.HTTP_200_OK)

@method_decorator(csrf_exempt, name='post')
class HDRStudentRegisterView(APIView):
    @swagger_auto_schema(
        operation_description="Register a new HDR Student",
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'user': openapi.Schema(
                    type=openapi.TYPE_OBJECT,
                    properties={
                        'username': openapi.Schema(type=openapi.TYPE_STRING, description='Username'),
                        'password': openapi.Schema(type=openapi.TYPE_STRING, description='Password'),
                        'email': openapi.Schema(type=openapi.TYPE_STRING, description='Email')
                    }
                ),
                'student_zid': openapi.Schema(type=openapi.TYPE_STRING, description='ZID'),
                'student_name': openapi.Schema(type=openapi.TYPE_STRING, description='Name'),
                'student_email': openapi.Schema(type=openapi.TYPE_STRING, description='Email'),
                'student_faculty': openapi.Schema(type=openapi.TYPE_STRING, description='Faculty'),
                'student_school': openapi.Schema(type=openapi.TYPE_STRING, description='School'),
                'student_degree': openapi.Schema(type=openapi.TYPE_STRING, description='Degree'),
                'student_role': openapi.Schema(type=openapi.TYPE_STRING, description='Role'),
                'student_password': openapi.Schema(type=openapi.TYPE_STRING, description='Password')
            },
            example={
                "user": {
                    "username": "admin",
                    "password": "admin",
                    "email": "example@example.com",
                },
                "student_zid": "12345678",
                "student_name": "John Doe",
                "student_email": "johndoe@example.com",
                "student_faculty": "Computer Science",
                "student_school": "University of Example",
                "student_degree": "Bachelor of Science",
                "student_role": "Student",
                "student_password": "example"
            }
        ),
        responses={201: openapi.Response('HDR Student created successfully')},
    )             
    def post(self, request):
        return register_hdr(request)

@method_decorator(csrf_exempt, name='post')
class CSEStaffRegisterView(APIView):
    @swagger_auto_schema(
        operation_description="Register a new CSE Staff",
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'user': openapi.Schema(
                    type=openapi.TYPE_OBJECT,
                    properties={
                        'username': openapi.Schema(type=openapi.TYPE_STRING, description='Username'),
                        'password': openapi.Schema(type=openapi.TYPE_STRING, description='Password'),
                        'email': openapi.Schema(type=openapi.TYPE_STRING, description='Email')
                    }
                ),
                'staff_zid': openapi.Schema(type=openapi.TYPE_STRING, description='ZID'),
                'staff_name': openapi.Schema(type=openapi.TYPE_STRING, description='Name'),
                'staff_email': openapi.Schema(type=openapi.TYPE_STRING, description='Email'),
                'staff_faculty': openapi.Schema(type=openapi.TYPE_STRING, description='Faculty'),
                'staff_school': openapi.Schema(type=openapi.TYPE_STRING, description='School'),
                'staff_title': openapi.Schema(type=openapi.TYPE_STRING, description='Title'),
                'staff_role': openapi.Schema(type=openapi.TYPE_STRING, description='Role'),
                'staff_password': openapi.Schema(type=openapi.TYPE_STRING, description='Password')
            },
            example={
                "user": {
                    "username": "admin",
                    "password": "admin",
                    "email": "example@example.com",
                },
                "staff_zid": "12345678",
                "staff_name": "John Doe",
                "staff_email": "johndoe@example.com",
                "staff_faculty": "Computer Science",
                "staff_school": "University of Example",
                "staff_title": "Professor",
                "staff_role": "Staff",
                "staff_password": "example"
            }
        ),
        responses={201: openapi.Response('CSE Staff created successfully')},
    )
    def post(self, request):
        return register_cse(request)

@method_decorator(csrf_exempt, name='dispatch')
class ContactAdminView(APIView):
    @swagger_auto_schema(
        operation_description="Contact admin with a message",
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'email': openapi.Schema(type=openapi.TYPE_STRING, description='Email'),
                'zid': openapi.Schema(type=openapi.TYPE_STRING, description='ZID'),
                'name': openapi.Schema(type=openapi.TYPE_STRING, description='Name'),
                'role': openapi.Schema(type=openapi.TYPE_STRING, description='Role'),
                'message': openapi.Schema(type=openapi.TYPE_STRING, description='Message')
            },
            example={
                "email": "example@example.com",
                "zid": "z1234567",
                "name": "John Doe",
                "role": "Student",
                "message": "Example message"
            }
        ),
        responses={200: openapi.Response('Email sent successfully')},
    )
    def post(self, request):
        return contactAdmin(request)

@api_view(['GET'])
def protected_view(request):
    return Response(data={"message": "This is a protected view"}, status=200)

@method_decorator(csrf_exempt, name='dispatch')
class UpdateUserRoleView(APIView):
    @swagger_auto_schema(
        operation_description="Update the role of a user",
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'username': openapi.Schema(type=openapi.TYPE_STRING, description='Username'),
                'role': openapi.Schema(type=openapi.TYPE_STRING, description='Role')
            },
            example={
                "username": "admin",
                "role": "admin"
            }
        ),
        responses={200: openapi.Response('User role updated successfully')},
    )
    def post(self, request, *args, **kwargs):
        return update_role(request)

@method_decorator(csrf_exempt, name='dispatch')
class ChangePasswordView(APIView):
    @swagger_auto_schema(
        operation_description="Change the password of a user",
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'current_password': openapi.Schema(type=openapi.TYPE_STRING, description='Current password'),
                'new_password': openapi.Schema(type=openapi.TYPE_STRING, description='New password'),
                'uid': openapi.Schema(type=openapi.TYPE_INTEGER, description='User ID')
            },
            example={
                "current_password": "admin",
                "new_password": "admin123",
                "uid": 1
            }
        ),
        responses={200: openapi.Response('Password changed successfully')},
    )
    def post(self, request, *args, **kwargs):
        return change_password(request)

@method_decorator(csrf_exempt, name='dispatch')
class UserListView(generics.ListAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer

@method_decorator(csrf_exempt, name='dispatch')
class CreateRoomBookingView(APIView):
    @swagger_auto_schema(
        operation_description="Create a room booking",
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'user_id': openapi.Schema(type=openapi.TYPE_INTEGER, description='User ID'),
                'room_id': openapi.Schema(type=openapi.TYPE_INTEGER, description='Room ID'),
                'start_time': openapi.Schema(type=openapi.TYPE_STRING, description='Start time'),
                'end_time': openapi.Schema(type=openapi.TYPE_STRING, description='End time')
            },
            example={
                "user_id": 1,
                "room_id": 1,
                "start_time": "2022-01-01 10:00:00",
                "end_time": "2022-01-01 12:00:00"
            }
        ),
        responses={200: openapi.Response('Room booking created successfully')},
    )
    def post(self, request):
        return create_room_booking(request)

@method_decorator(csrf_exempt, name='dispatch')
class AdminAcceptOrDenyBookingView(APIView):
    @swagger_auto_schema(
        operation_description="Accept or deny a room booking",
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'booking_id': openapi.Schema(type=openapi.TYPE_INTEGER, description='Booking ID'),
                'is_accepted': openapi.Schema(type=openapi.TYPE_BOOLEAN, description='Accept or deny')
            },
            example={
                "booking_id": 1,
                "is_accepted": True
            }
        ),
        responses={200: openapi.Response('Booking accepted/denied successfully')},
    )
    def post(self, request):
        return admin_accept_or_deny_booking(request)

@method_decorator(csrf_exempt, name='dispatch')
class CancelBookingView(APIView):
    @swagger_auto_schema(
        operation_description="Cancel a room booking",
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'booking_id': openapi.Schema(type=openapi.TYPE_INTEGER, description='Booking ID')
            },
            example={
                "booking_id": 1
            }
        ),
        responses={200: openapi.Response('Booking cancelled successfully')},
    )
    def post(self, request):
        return cancel_booking(request)

@method_decorator(csrf_exempt, name='dispatch')
class EditBookingView(APIView):
    @swagger_auto_schema(
        operation_description="Edit a room booking",
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'booking_id': openapi.Schema(type=openapi.TYPE_INTEGER, description='Booking ID'),
                'start_time': openapi.Schema(type=openapi.TYPE_STRING, description='Start time'),
                'end_time': openapi.Schema(type=openapi.TYPE_STRING, description='End time')
            },
            example={
                "booking_id": 1,
                "start_time": "2022-01-01 10:00:00",
                "end_time": "2022-01-01 12:00:00"
            }
        ),
        responses={200: openapi.Response('Booking edited successfully')},
    )
    def post(self, request):
        return edit_booking(request)

@method_decorator(csrf_exempt, name='dispatch')
class CreateHotdeskBookingView(APIView):
    @swagger_auto_schema(
        operation_description="Create a hotdesk booking",
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'user_id': openapi.Schema(type=openapi.TYPE_INTEGER, description='User ID'),
                'hotdesk_id': openapi.Schema(type=openapi.TYPE_INTEGER, description='Hotdesk ID'),
                'start_time': openapi.Schema(type=openapi.TYPE_STRING, description='Start time'),
                'end_time': openapi.Schema(type=openapi.TYPE_STRING, description='End time')
            },
            example={
                "user_id": 1,
                "hotdesk_id": 1,
                "start_time": "2022-01-01 10:00:00",
                "end_time": "2022-01-01 12:00:00"
            }
        ),
        responses={200: openapi.Response('Hotdesk booking created successfully')},
    )
    def post(self, request):
        return create_hotdesk_booking(request)

@method_decorator(csrf_exempt, name='dispatch')
class UserListView(generics.ListAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer

@method_decorator(csrf_exempt, name='dispatch')
class ResetPasswordView(APIView):
    @swagger_auto_schema(
        operation_description="Reset a user's password",
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'email': openapi.Schema(type=openapi.TYPE_INTEGER, description='User\'s email'),
                'otp': openapi.Schema(type=openapi.TYPE_INTEGER, description='One time password sent to the user.\n\nIf left blank in the request, it will indicate that the OTP has not yet been sent.'),
                'password': openapi.Schema(type=openapi.TYPE_STRING, description='The user\'s new password')
            },
            example={
                "OTP request example": {
                    "email": "z5647382@student.unsw.edu.au",
                    "otp": "",
                    "password": ""
                },
                "Verify OTP example": {
                    "email": "z5647382@student.unsw.edu.au",
                    "otp": "HASHAS",
                    "password": ""
                },
                "Reset with OTP example": {
                    "email": "z5647382@student.unsw.edu.au",
                    "otp": "HASHAS",
                    "password": "Password123"
                }
            }
        ),
        responses={200: openapi.Response('Password has been reset')},
    )
    def post(self, request):
        return password_reset(request)



class DownloadBookingHistoryView(APIView):
    @swagger_auto_schema(
        operation_description="Download booking history as CSV",
        responses={200: openapi.Response('Booking history downloaded successfully')},
    )
    def get(self, request, *args, **kwargs):
        return download_booking_history(request)

class AdminHelpView(APIView):
    @swagger_auto_schema(
        operation_description="Contact the admin team for assistance",
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'uid': openapi.Schema(type=openapi.TYPE_INTEGER, description='User ID'),
                'message': openapi.Schema(type=openapi.TYPE_STRING, description='Message to admins')
            },
            example={
                "uid": 16,
                "message": "Why can't I book two hotdesks?"
            }
        ),
        responses={200: openapi.Response('Request has been sent to admins')},
    )
    def post(self, request):
        return adminHelp(request)

class CheckInView(APIView):
    @swagger_auto_schema(
        operation_description="Check into a booking",
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'booking_id': openapi.Schema(type=openapi.TYPE_INTEGER, description='Booking ID')
            },
            example={
                "booking_id": "30"
            }
        ),
        responses={200: openapi.Response('User has checked in')},
    )
    def post(self, request):
        return checkIntoBooking(request)

