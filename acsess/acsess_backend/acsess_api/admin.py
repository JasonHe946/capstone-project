from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.contrib.auth.models import User
from .models import hdr_student, cse_staff, room, booking, hotdesk, pending_booking, booking_history

class HDRStudentProfileInline(admin.StackedInline):
    model = hdr_student
    can_delete = False

class CSEStaffProfileInline(admin.StackedInline):
    model = cse_staff
    can_delete = False

class RoomInline(admin.StackedInline):
    model = room
    can_delete = False

class HotdeskInline(admin.StackedInline):
    model = hotdesk
    can_delete = False
    
class BookingInline(admin.StackedInline):
    model = booking
    can_delete = False

class PendingBookingInline(admin.StackedInline):
    model = pending_booking
    can_delete = False

class BookingHistoryInline(admin.StackedInline):
    model = booking_history
    can_delete = False

class UserAdmin(BaseUserAdmin):
    inlines = (HDRStudentProfileInline, CSEStaffProfileInline)

# Register your models here.
admin.site.unregister(User)
admin.site.register(User, UserAdmin)
admin.site.register(hdr_student)
admin.site.register(cse_staff)
admin.site.register(room)
admin.site.register(booking)
admin.site.register(hotdesk)
admin.site.register(pending_booking)
admin.site.register(booking_history)
