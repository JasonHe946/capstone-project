import random
import string
import json
from django.contrib.auth import authenticate, login
from django.http import JsonResponse
from django.shortcuts import get_object_or_404
from django.contrib.auth.models import User, Group
from rest_framework import status
from rest_framework.response import Response

from ..serializers import CSEStaffSerializer, HDRStudentSerializer
from .email import emailDefaultPassword, emailOTP

def register_hdr(request):
    # Parse the input data
    data = request.data
    # Create a seralizer with the data, validate it and save the new user object
    serializer = HDRStudentSerializer(data=data)
    if serializer.is_valid():
        serializer.save()
        emailDefaultPassword(data, data.get('student_name'))
        return Response({'success': True, 'data': serializer.data}, status=status.HTTP_201_CREATED)
    return Response({'success': False, 'errors': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

def register_cse(request):
    # Parse the input data
    data = request.data
    # Create a seralizer with the data, validate it and save the new user object
    serializer = CSEStaffSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        emailDefaultPassword(data, data.get('staff_name'))
        return Response({'success': True, 'data': serializer.data}, status=status.HTTP_201_CREATED)
    return Response({'success': False, 'errors': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

def update_role(request):
    # Parse the input data
    data = json.loads(request.body)
    username = data.get('username')
    newRole = data.get('role')

    # Get the available groups, the user object, and the list of groups the user belongs to
    cse_staff_group = get_object_or_404(Group, name="cse_staff")
    hdr_student_group = get_object_or_404(Group, name="hdr_student")
    user = get_object_or_404(User, username=username)
    groups = user.groups.values_list('name', flat=True)
    userGroup = list(groups)

    # Error checking then update role
    # HDR Student --> CSE Staff
    # HDR Student -/> Admin
    if userGroup[0] == "hdr_student":
        if newRole == "admin":
            return JsonResponse({'error': 'An HDR Student can\'t be given staff access'}, status=400)
        elif newRole == "student":
            return JsonResponse({'error': 'This user is already an HDR Student'}, status=400)
        else:
            cse_staff_group.user_set.add(user)
            user.groups.remove(hdr_student_group)
            return JsonResponse({'success': True, 'message': "HDR Student has been made a CSE Staff"}, status=200)
    # CSE Staff --> Admin
    # CSE Staff --> HDR Student
    elif userGroup[0] == "cse_staff":
        if newRole == "staff":
            return JsonResponse({'error': 'This user is already a CSE Staff'}, status=400)
        elif newRole == "student":
            hdr_student_group.user_set.add(user)
            user.groups.remove(cse_staff_group)
            return JsonResponse({'success': True, 'message': "CSE Staff has been made an HDR Student"}, status=200)
        else:
            user.is_staff = True
            return JsonResponse({'success': True, 'message': "CSE Staff now has admin access"}, status=200)
    # Admin --> CSE Staff
    # Admin -/> HDR student
    elif user.is_staff:
        if newRole == "admin":
            return JsonResponse({'error': 'This user is already a CSE admin'}, status=400)
        elif newRole == "student":
            return JsonResponse({'error': 'A CSE Admin can\'t be made an HDR Student'}, status=400)
        else:
            user.is_staff = False
            return JsonResponse({'success': True, 'message': "CSE Admin is no longer an admin"}, status=200)
    else:
        return JsonResponse({'error': 'User is a part of unrecognised group'}, status=400)

def change_password(request):
    # Parse the input data
    try:
        data = json.loads(request.body)
        current_password = data.get('current_password')
        new_password = data.get('new_password')
        uid = data.get('uid')
    except:
        return JsonResponse({'error': 'Error parsing request'}, status=400)

    # Obtain the user object with given uid
    user = get_object_or_404(User, id=uid)

    # Verify the current password entered matches
    if not user.check_password(current_password):
        return JsonResponse({'error': 'Current password is incorrect'}, status=400)

    # Update the user's password to the new password and save the object
    user.set_password(new_password)
    user.save()

    return JsonResponse({'success': 'Password has been changed successfully'}, status=200)

def password_reset(request):
    # Parse the input data
    try:
        data = json.loads(request.body)
        email = data.get('email')
        otp = data.get('otp')
        new_password = data.get('password')
    except:
        return JsonResponse({'error': 'Error parsing request'}, status=400)

    # OTP has not been sent yet
    try:
        if otp == '':
            return sendResetCode(email)
        elif new_password == '':
            return verifyOTP(email, otp)
        else:
            return resetPassword(email, otp, new_password)
    except:
        return JsonResponse({'error': 'Unknown error'}, status=400)

def sendResetCode(email):
    # Get the user object
    user = get_object_or_404(User, email=email)

    # check which type of user
    if hasattr(user, 'hdr_student'):
        profile = user.hdr_student
    elif hasattr(user, 'cse_staff'):
        profile = user.cse_staff
    else:
        raise ValueError("User does not have a valid profile")

    # Generate and update OTP
    profile.update_otp()

    try:
        return emailOTP(user, profile)
    except:
        return JsonResponse({'error': 'Unable to send email to user'}, status=400)

def verifyOTP(email, otp):
    # Get the User object
    user = get_object_or_404(User, email=email)

    # Check which type of user
    if hasattr(user, 'hdr_student'):
        profile = user.hdr_student
    elif hasattr(user, 'cse_staff'):
        profile = user.cse_staff
    else:
        raise ValueError("User does not have a valid profile")

    # Verify the otp
    if profile.otp != otp:
        return JsonResponse({'error': 'Invalid code'}, status=400)
    else:
        return JsonResponse({'success': True, 'message': 'OTP has been verified'}, status=200)

def resetPassword(email, otp, password):
    # Get the User object
    user = get_object_or_404(User, email=email)

    # Check which type of user
    if hasattr(user, 'hdr_student'):
        profile = user.hdr_student
    elif hasattr(user, 'cse_staff'):
        profile = user.cse_staff
    else:
        raise ValueError("User does not have a valid profile")

    # Change the user's password
    user.set_password(password)
    user.save()

    return JsonResponse({'success': True, 'message': 'User\'s password has been successfully update.'}, status=200)