from rest_framework import serializers # type: ignore
from django.contrib.auth.models import User, Group # type: ignore
from .models import cse_staff, hdr_student
from django.db.utils import IntegrityError

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('username', 'password', 'email')
        extra_kwargs = {'password': {'write_only': True}}

class HDRStudentSerializer(serializers.ModelSerializer):
    user = UserSerializer()

    class Meta:
        model = hdr_student
        fields = ('user', 'student_zid', 'student_name', 'student_email', 'student_faculty', 'student_school'
                    , 'student_degree', 'student_role', 'otp')

    def create(self, validated_data):
        user_data = validated_data.pop('user')
        hdr_student_group = Group.objects.get(name='hdr_student')
        user = User.objects.create_user(**user_data)
        def generate_unique_student_no():
            last_student = hdr_student.objects.all().order_by('student_no').last()
            if last_student:
                return last_student.student_no + 1
            else:
                return 1

        # Attempt to create the HDRStudent object, retrying if the student_no already exists
        while True:
            try:
                validated_data['student_no'] = generate_unique_student_no()
                HDRStudent = hdr_student.objects.create(user=user, **validated_data)
                break
            except IntegrityError:
                continue  # If a duplicate key error occurs, try again

        # Add user to the hdr_student group
        hdr_student_group.user_set.add(user)

        return HDRStudent

class CSEStaffSerializer(serializers.ModelSerializer):
    user = UserSerializer()

    class Meta:
        model = cse_staff
        fields = ('user', 'staff_zid', 'staff_name', 'staff_email', 'staff_faculty', 'staff_school'
                    , 'staff_title', 'staff_role', 'otp')

    def create(self, validated_data):
        user_data = validated_data.pop('user')
        cse_staff_group = Group.objects.get(name='cse_staff')
        user = User.objects.create_user(**user_data)
        def generate_unique_staff_no():
            last_staff = cse_staff.objects.all().order_by('staff_no').last()
            if last_staff:
                return last_staff.staff_no + 1
            else:
                return 1

        # Attempt to create the CSEStaff object, retrying if the staff_no already exists
        while True:
            try:
                validated_data['staff_no'] = generate_unique_staff_no()
                CSEStaff = cse_staff.objects.create(user=user, **validated_data)
                break
            except IntegrityError:
                continue  # If a duplicate key error occurs, try again

        # Add user to the cse_staff group
        cse_staff_group.user_set.add(user)

        return CSEStaff