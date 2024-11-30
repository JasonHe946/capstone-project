import pandas as pd
from django.core.management.base import BaseCommand
from acsess_api.models import hdr_student, cse_staff
from django.contrib.auth.models import User, Group
import os

class Command(BaseCommand):
    help = 'Import data from Excel files into the database'

    
    def add_arguments(self, parser):
        parser.add_argument('file_paths', nargs='+', type=str, help='Paths to the Excel files')

    def handle(self, *args, **kwargs):
        file_paths = kwargs['file_paths']
        
        cse_staff_group, created = Group.objects.get_or_create(name='cse_staff')
        hdr_student_group, created = Group.objects.get_or_create(name='hdr_student')
        
        file_path = os.path.abspath(__file__)
        print(file_path)
        
        for file_path in file_paths:
            print(file_path)
        
        
        # Define a mapping from sheet names to models and field mappings
        sheet_model_mapping = {
            'hdr_student': (hdr_student, {
                'No': 'student_no', 
                'Candidate zID': 'student_zid', 
                'Candidate Name': 'student_name', 
                'Email ID': 'student_email', 
                'Faculty Name': 'student_faculty', 
                'School Name': 'student_school', 
                'Degree (PhD/MRes)': 'student_degree', 
                'Other roles within CSE': 'student_role', 
                'Password': 'student_password'}),
            
            'cse_staff': (cse_staff, {
                'No': 'staff_no', 
                'Staff zID': 'staff_zid', 
                'Staff Name': 'staff_name', 
                'Email ID': 'staff_email', 
                'Faculty Name': 'staff_faculty', 
                'School Name': 'staff_school', 
                'Title': 'staff_title', 
                'Role': 'staff_role', 
                'Password': 'staff_password'})
        }

        for file_path in file_paths:
            xls = pd.ExcelFile(file_path)
            for sheet_name in xls.sheet_names:
                if sheet_name in sheet_model_mapping:
                    model, field_mapping = sheet_model_mapping[sheet_name]
                    data = pd.read_excel(file_path, sheet_name=sheet_name)

                    for index, row in data.iterrows():
                        obj_data = {field_mapping[col]: row[col] for col in row.index if col in field_mapping}
                        
                        if 'student_password' in obj_data:
                            password = str(obj_data['student_password'])
                            if len(password) < 8:
                                password = password.ljust(8, '1')
                            obj_data['student_password'] = password
                        
                        if 'staff_password' in obj_data:
                            password = str(obj_data['staff_password'])
                            if len(password) < 8:
                                password = password.ljust(8, '1')
                            obj_data['staff_password'] = password
                                
                        # Create or retrieve the User object
                        if sheet_name == 'hdr_student':
                            user, created = User.objects.get_or_create(
                                username=obj_data['student_zid'],
                                defaults={
                                    'email': obj_data['student_email']
                                }
                            )
                            if created:
                                user.set_password(password)  # Set and hash the password
                                user.save()
                            hdr_student_group.user_set.add(user)
                        else:
                            user, created = User.objects.get_or_create(
                                username=obj_data['staff_zid'],
                                defaults={
                                    'email': obj_data['staff_email']
                                }
                            )
                            if created:
                                user.set_password(password)  # Set and hash the password
                                user.save()
                            cse_staff_group.user_set.add(user)

                        # Assign the User object to the 'user' field of the model
                        obj_data['user'] = user
                        
                        # Remove password from obj_data
                        if 'student_password' in obj_data:
                            del obj_data['student_password']
                        if 'staff_password' in obj_data:
                            del obj_data['staff_password']
                        
                        obj = model(**obj_data)
                        obj.save()

        self.stdout.write(self.style.SUCCESS('Data imported successfully'))