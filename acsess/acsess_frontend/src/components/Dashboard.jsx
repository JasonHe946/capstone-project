import React, { useEffect, useState } from 'react';
import DrawerAppBar from './Nav';
import ghost from '../assets/ghost.png'
import { styled, Button } from '@mui/material';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Autocomplete from '@mui/material/Autocomplete';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import TextField from '@mui/material/TextField';
import Paper from "@mui/material/Paper";
import BookingCard from './BookingCard';
import UserCard from './UserCard';
import check from '../assets/check.png';
import {
  Scheduler,
  DayView,
  WeekView,
  Appointments,
  Toolbar,
  ViewSwitcher,
  DateNavigator,
  TodayButton,
  AppointmentTooltip,
  CurrentTimeIndicator,
} from '@devexpress/dx-react-scheduler-material-ui';
import { ViewState } from '@devexpress/dx-react-scheduler';
import BasicModal from './BasicModal';
import validator from 'email-validator';
import { FormInput, Switch } from './ContactAdmin';
import axios from 'axios';
import EditDrawer from './EditDrawer';
import ErrorModal from './ErrorModal';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';

const Heading = styled('div')({
  paddingTop: '2%',
  width: '94vw',
  marginLeft: 'auto',
  marginRight: 'auto'
})

const DashboardHeading = styled('div')({
  fontSize: '2rem',
  fontWeight: '600',
  color: '#FFFFFF',
});

const HeadingSeperator = styled('hr')({
  width: '98%',
  borderColor: '#31413D',
  borderStyle: 'double'
});

const Bookings = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  flexWrap: 'wrap',
  marginLeft: 'auto',
  marginRight: 'auto',
  alignItems: 'center',
  justifyContent:'center',
});

const BookingContainer = styled('div')({
  display: 'flex',
  flexDirection: 'row',
  flexWrap: 'wrap',
  alignItems: 'center',
  justifyContent: 'center',
  maxHeight: "70vh",
  overflowY: 'auto'
});
  

const AdminAutocomplete = styled(Autocomplete)({
  width: '100%',
  paddingTop: '2vh',
  paddingLeft: '1vw',
  paddingRight: '1vw',
  colour: '#FFFFFF', 
  // arrow in the autocomplete
  '& .MuiSvgIcon-root': { 
    color: '#ffffff',
    width: '40px',
    height: '40px',
    backgroundColor: '#31413D',
    borderRadius: '100px'
  },
});

const HeadingAutocomplete = styled(TextField)({
  '&:hover': {
    background: '#252525',
    color: '#31413D'
  },
});

const DashboardBackground = styled('div')({
  backgroundColor: '#1C1C1C',
  height: '100vh',
  width: '100vw'
});

const AddBookingButton = styled(Button) ({
  color: '#FFFFFF',
  width: '92vw',
  height: '151px',
  margin: '10px',
  background: '#31413D',
  fontWeight: '600',
  fontSize: '16px',
  '&:hover': {
    background: '#84B7AA',
    color: '#31413D'
  }
})

const NoBookingsCardContainer = styled('div')({
  display: 'flex',
  flexDirection: 'row',
  width: '92vw',
  boxShadow: '0px 8px 20px 0px rgba(0, 0, 0, 0.15)',
  backgroundColor: '#252525',
  borderRadius: '5px',
  margin: '10px',
});

const GhostImage = styled('img')({
  margin: '13px',
  width: '10%',
  paddingLeft: '2%'
})

const NoBookingsTextContainer = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  flexWrap: 'wrap',
  marginTop: '1.3%',
  paddingLeft: '3%'
})
const NoBookingsHeading = styled('div')({
  color: '#999999',
  fontWeight: '600',
  fontSize: '1.45rem'
})

const NoBookingsSubheading = styled('div')({
  color: '#999999',
  fontWeight: '400',
  fontSize: '1rem'
})

const FilterViewBookingsContainer = styled('div')({
  width: '92vw',
  margin: 'auto',
  display: 'flex',
  flexDirection: 'row',
  flexWrap: 'wrap',
  justifyContent: 'space-between',
  marginTop: '1%',
  marginBottom: '1%',
})

const SchedulerContainer = styled(FilterViewBookingsContainer)({
  height: '100vh',
})

const FilterContainer = styled('div')({
  display: 'flex',
  flexDirection: 'row',
  flexWrap: 'wrap',
  justifyContent: 'space-between',
})

const SearchBlock = styled('div')({
  border: '1px solid #31413D',
  borderRadius: '50px',
  zIndex: '900',
  width: '400px'
})

const ViewContainer = styled('div')({
  display: 'flex',
  flexDirection: 'row',
  flexWrap: 'wrap',
  justifyContent: 'right',
})

const FilterBtn = styled(Button)({
  color: '#ffffff',
  background: '#31413D',
  border: '1px solid #31413D',
  borderRadius: '50px',
  width: '100px',
  height: '50px',
  marginTop: '1%',
  fontSize: '0.8rem',
  marginLeft: '10px',
  '&:hover': {
    background: '#84B7AA',
    color: '#31413D'
  }
})

const StyledButton = styled(Button)({
  width: '140px',
  height: '50px',
  color: '#5B5B5B',
  fontWeight: 'bold',
  '&:hover': {
    color: '#FFFFFF'
  },
})

const FilterIcon = styled(FilterAltIcon)({
  paddingRight: '4%'
})

const SearchBar = styled(Autocomplete)({
  height: '50px',
  width: '100%',
  paddingBottom: '1%',
  border: 'none',
  borderRadius: '50px',
  "& .MuiOutlinedInput-root": {
    border: 'none',
  },
  "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
    border: 'none',
  },
  "& .MuiAutocomplete-clearIndicator": {
    color: '#FFFFFF',
    paddingBottom: '10px',
  },
})

const CustomViewSwitcher = styled(ViewSwitcher.Switcher)({
  border: 'none',
  backgroundColor: '#31413D',
  color: '#fff',
  '& .MuiSvgIcon-root': { 
    color: '#fff'
  },
  '&:hover': {
    background: '#84B7AA',
    color: '#31413D',
    '& .MuiSvgIcon-root': { 
      color: '#31413d'
    }
  },
})

const CustomTodayButton = styled(TodayButton.Button)({
  backgroundColor: '#31413D',
  color: '#fff',
  border: 'solid 1px #31413D',
  marginRight: '0.5%',
  '&:hover': {
    background: '#84B7AA',
    color: '#31413D',
    border: 'solid 1px #84B7AA',
  }
})

const FormContainer = styled('div')({
  height: '60vh',
  overflowY: 'auto',
  padding: '10px',
  display: 'flex',
  flexDirection: 'column',
  gap: '10px',
});

const CustomDateNavigationButton = styled(DateNavigator.NavigationButton)({
  backgroundColor: '#1C1C1C',
  '& .MuiSvgIcon-root': { 
    color: '#fff'
  },
  '&:hover': {
    background: '#252525',
    '& .MuiSvgIcon-root': { 
      color: '#fff'
    }
  }
})

const CustomDateOpenButtom = styled(DateNavigator.OpenButton)({
  backgroundColor: '#31413D',
  color: '#fff',
  border: 'solid 1px #31413D',
  '&:hover': {
    background: '#84B7AA',
    color: '#31413D',
    border: 'solid 1px #84B7AA',
  }
})

const CustomScheduler = styled(Scheduler.Root)({
  backgroundColor: '#1c1c1c',
})

const CustomWeekViewTimeScaleLayout = styled(WeekView.TimeScaleLayout)({
  backgroundColor: '#D1D0CE',
})

const CustomWeekViewDayScaleLayout = styled(WeekView.DayScaleLayout)({
  backgroundColor: '#D1D0CE',
})

const CustomWeekViewEmptyCellLayout = styled(WeekView.DayScaleEmptyCell)({
  backgroundColor: '#D1D0CE',
})

const CustomDayViewTimeScaleLayout = styled(DayView.TimeScaleLayout)({
  backgroundColor: '#D1D0CE',
})

const CustomDayViewDayScaleLayout = styled(DayView.DayScaleLayout)({
  backgroundColor: '#D1D0CE',
})

const CustomDayViewEmptyCell = styled(DayView.DayScaleEmptyCell)({
  backgroundColor: '#D1D0CE',
})

function getToken() {
  const cookieString = document.cookie;
  const cookies = cookieString.split(';');

  for (let cookie of cookies) {
    const [cookieName, cookieValue] = cookie.trim().split('=');

    if (cookieName === "token") {
      return cookieValue;
    }
  }

  return null;
}

function getUserId() {
  const cookieString = document.cookie;
  const cookies = cookieString.split(';');

  for (let cookie of cookies) {
    const [cookieName, cookieValue] = cookie.trim().split('=');

    if (cookieName === "user_id") {
      return cookieValue;
    }
  }

  return null;
}

function getUserRole() {
  const cookieString = document.cookie;
  const cookies = cookieString.split(';');

  for (let cookie of cookies) {
    const [cookieName, cookieValue] = cookie.trim().split('=');

    if (cookieName === "role") {
      return cookieValue;
    }
  }

  return null;
}

function Dashboard () {
  const [acsess, setAcsess] = React.useState('Current Bookings');
  const [view, setView] = React.useState('List View');
  const [error, setError] = React.useState(false);
  const [qstAdded, setqstAdded] = React.useState(false)
  
  // states used for deleting bookings
  const [openModalDelete, setOpenModalDelete] = React.useState(false);
  const [openModalConfirmDelete, setOpenModalConfirmDelete] = React.useState(false)
  const [openModalConfirmDeleteSomeoneElse, setOpenModalConfirmDeleteSomeoneElse] = React.useState(false)
  const [deleteSomeoneElseMeeting, setDeleteSomeoneElseMeeting] = React.useState(false)
  const [username, setUsername] = React.useState(null)
  const [message, setMessage] = React.useState('')
  const [validMessage, setValidMessage] = React.useState(false)
  const [sendMesssageModal, setSendMessageModal] = React.useState(false)
  
  // States used for edit drawer
  const [openEditDrawer, setOpenEditDrawer] = React.useState(false)
  const [bookingId, setBookingId] = React.useState(null)
  const [bookingUtilities, setBookingUtilities] = React.useState(null)
  const [bookingTitle, setBookingTitle] = React.useState(null)
  const [bookingStartTime, setBookingStartTime] = React.useState(null)
  const [bookingEndTime, setBookingEndTime] = React.useState(null)
  const [room, setRoom] = React.useState(0)
  
  // Data for all bookings
  const [allBookingData, setAllBookingData] = React.useState([])
  const [allRequestData, setAllRequestData] = React.useState([])
  const [userBookingData, setUserBookingData] = React.useState([])
  const [meetingRooms, setMeetingRooms] = React.useState([])
  const [hotDesks, setHotDesks] = React.useState([])
  const [userBookingSchedulerData, setUserBookingSchedulerData] = React.useState([])
  const [allBookingSchedulerData, setAllBookingSchedulerData] = React.useState([])
  const [allUserData, setAllUserData] = React.useState([])

  // user data for logged in User
  const [userDataRole, setUserDataRole] = React.useState(null)
  const [reloadData, setReloadData] = React.useState(0)

  // add new user State variables
  const [addUserModal, setAddUserModal] = React.useState(false);
  const [confirmNewUserModal, setConfirmNewUserModal] = React.useState(false);
  const [errorModal, setErrorModal] = React.useState(false);
  const [successModal, setSuccessModal] = React.useState(false);
  const [errorDescription, setErrorDescription] = React.useState('');
  const [email, setEmail] = React.useState('');
	const [validEmail, setValidEmail] = React.useState(true)
  const [name, setName] = React.useState('');
  const [validName, setValidName] = React.useState(true)
	const [zid, setZid] = React.useState('');
	const [validZid, setValidZid] = React.useState(true)
  const [role, setRole] = React.useState('student');
  const [faculty, setFaculty] = React.useState('');
	const [validFaculty, setValidFaculty] = React.useState(true)
  const [school, setSchool] = React.useState('');
	const [validSchool, setValidSchool] = React.useState(true)
  const [degree, setDegree] = React.useState('');
	const [validDegree, setValidDegree] = React.useState(true)
  const [schoolRole, setSchoolRole] = React.useState('');
	const [validSchoolRole, setValidSchoolRole] = React.useState(true)
  const [filterStr, setFilterStr] = React.useState('');

  const navigate = useNavigate();

  const defaultProps = {
    options: [
      {title: 'Current Bookings'}, 
      {title: 'Current Requests'}, 
      {title: 'Current Users'},
      {title: 'All Bookings'},
    ],
    getOptionLabel: (option) => option.title,
  };

  const handleAddUserClick = () => {
    setAddUserModal(true);
  }

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name || !email || !zid || !faculty || !school || !schoolRole) {
      setValidName(name);
      setValidEmail(email);
      setValidZid(zid);
      setValidFaculty(faculty)
      setValidSchool(school)
      setValidSchoolRole(schoolRole)
      return;
    }
    
    setConfirmNewUserModal(true);
  }

  function generateRandomPassword(str1, str2, length = 12) {
    const combinedString = str1 + str2;
    let password = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * combinedString.length);
        password += combinedString[randomIndex];
    }
    return password;
  }

  const handleConfirmUser = async (e) => {
    e.preventDefault();
    const password = generateRandomPassword(name, zid);
    let requestBody, backendCall;

      try {
        if (role === 'student') {
          backendCall = 'http://localhost:8000/api/register/hdr_student/'
          requestBody = {
            "user": {
              "username": name,
              "password": password,
              "email": email
            },
            "student_name": name,
            "student_email": email,
            "student_zid": zid,
            "student_faculty": faculty,
            "student_school": school,
            "student_degree": degree,
            "student_role": schoolRole,
            "student_password": password
          };          
        } else if (role === 'staff') {
          backendCall = 'http://localhost:8000/api/register/cse_staff/'
          requestBody = {
            "user": {
              "username": name,
              "password": password,
              "email": email
            },
            "staff_name": name,
            "staff_email": email,
            "staff_zid": zid,
            "staff_faculty": faculty,
            "staff_school": school,
            "staff_title": degree,
            "staff_role": schoolRole,
            "staff_password": password
          };           
        }

        const response = await axios.post(backendCall, requestBody);
  
        if ((response.status === 200 || response.status === 201) && response.data.success) {
          // show success modal and close add user modals
          setSuccessModal(true);
          setConfirmNewUserModal(false);
          setAddUserModal(false);

          // update list of current users
          fetchUsers();
  
          // reset form
          setName('');
          setZid('');
          setEmail('');
          setRole('student');
          setFaculty('');
          setSchool('');
          setDegree('');
          setSchoolRole('');
        
        } else {
          const errorMessage = response.data.error || 'Unexpected status code: ' + response.status;
          setErrorDescription(errorMessage);
          setErrorModal(true);
          setConfirmNewUserModal(false);
        }
      } catch (error) {
          console.error('There was an error adding a user!', error);
          let errorMessage = 'An error occurred. Please try again.';

          try {
            const errorResponse = JSON.parse(error.request.responseText);
          
            // Check if errors exists in errorResponse
            if (errorResponse.errors) {
              // Iterate over keys in errors object
              for (const key in errorResponse.errors) {
                // Check if the key exists and is an array
                if (Array.isArray(errorResponse.errors[key]) && errorResponse.errors[key].length > 0) {
                  errorMessage = errorResponse.errors[key][0]; // Get the first error message
                  break; // Exit loop once first error message is found
                } else if (typeof errorResponse.errors[key] === 'object') {
                  // Check if the value is an object with potential nested errors
                  for (const smallKey in errorResponse.errors[key]) {
                    if (Array.isArray(errorResponse.errors[key][smallKey]) && errorResponse.errors[key][smallKey].length > 0) {
                      errorMessage = errorResponse.errors[key][smallKey][0]; // Get the first nested error message
                      break; // Exit inner loop once first nested error message is found
                    }
                  }
                  break; // Exit outer loop once error message is found
                }
              }
            }

          } catch (parseError) {
            console.error('Error parsing JSON response:', parseError);
            errorMessage = 'Error parsing server response.';
          }
        setErrorDescription(errorMessage);
        setErrorModal(true);
        setConfirmNewUserModal(false);
      }

  }

  const validateEmail = (email) => {
		if (email === '') {
			setValidEmail(true)
		} else {
			setValidEmail(validator.validate(email));
		}
		setEmail(email);
	}

	const validateZid = (zid) => {
		const pattern = /^z\d{7}$/;
		if (pattern.test(zid) || zid === '') {
			setValidZid(true);
		} else {
			setValidZid(false);
		}
		setZid(zid)
	}

  const validateName = (name) => {
    if (name === '') {
      setValidName(false)
    } else {
      setValidName(true)
    }
    setName(name)
  }

  const handleRoleChange = () => {
		if (role === 'student') {
			setRole('staff')
		} else {
			setRole('student')
		}
	}

  const faculties = ['Engineering', 'Law', 'Business', 'Medicine', 'Arts', 'Science']
  const validateFaculty = (faculty) => {
    if (faculties.includes(faculty)) {
      setValidFaculty(true)
    } else {
      setValidFaculty(false)
    }
    setFaculty(faculty)
  }

  const validateSchool = (school) => {
    if (school === '') {
      setValidSchool(false)
    } else {
      setValidSchool(true)
    }
    setSchool(school)
  }

  const validateSchoolRole = (schoolRole) => {
    if (schoolRole === '') {
      setValidSchoolRole(false)
    } else {
      setValidSchoolRole(true)
    }
    setSchoolRole(schoolRole)
  }

  const validateDegree = (degree) => {
    if (degree === '') {
      setValidDegree(false)
    } else {
      setValidDegree(true)
    }
    setDegree(degree)
  }

  const validateMessage = (message) => {
    if (message === '') {
      setValidMessage(false)
    } else {
      setValidMessage(true)
    }
    setMessage(message)
  }

  useEffect(() => {
    const role = getUserRole();
    setUserDataRole(role);
  }, []);

  const d = new Date();
  d.setDate(d.getDate() + 1)
  d.setHours(2,0,0,0)

  const fetchUsers = async () => {
    try {
      const response = await axios.post('http://localhost:8000/api/get-data/', {
        "table": "auth_user",
        "sort_type": 1,
        "sort": {}
      });
      setAllUserData(response.data);
    } catch (error) {
      console.error('Error fetching meeting rooms data:', error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleEditDrawerClose = () => {
    setOpenEditDrawer(false)
  }

  useEffect(() => {
    fetchMeetingRooms();
  }, [openEditDrawer, reloadData])

  const fetchMeetingRooms = async () => {
    try {
      const response = await axios.post('http://localhost:8000/api/get-data/', {
        "table": "room",
        "sort_type": 1,
        "sort": {}
      });
      setMeetingRooms(response.data);
      return 
    } catch (error) {
      console.error('Error fetching meeting rooms data:', error);
    }
  };

  useEffect(() => {
    fetchMeetingRooms();
  }, []);

  useEffect(() => {
    const fetchHotDesks = async () => {
      try {
        const response = await axios.post('http://localhost:8000/api/get-data/', {
          "table": "hotdesk",
          "sort_type": 1,
          "sort": {}
        });
        setHotDesks(response.data);
      } catch (error) {
        console.error('Error fetching hot desks data:', error);
      }
    };

    fetchHotDesks();
  }, [meetingRooms])

  const fetchData = () => {
    const user_id = getUserId()
    const fetchUserBookings = async () => {
      try {
        const response = await axios.post('http://localhost:8000/api/get-data/', {
          "table": "booking",
          "sort_type": 1,
          "sort": {
            "user_id": user_id
          }
        });
        setUserBookingData(mapBookingData(response.data, meetingRooms, hotDesks));
      } catch (error) {
        console.error('Error fetching bookings data:', error);
      }
    };

    const fetchAllBookings = async () => {
      try {
        const response = await axios.post('http://localhost:8000/api/get-data/', {
          "table": "booking",
          "sort_type": 1,
          "sort": {}
        });
        setAllBookingData(mapBookingData(response.data, meetingRooms, hotDesks));
      } catch (error) {
        console.error('Error fetching bookings data:', error);
      }
    };

    const fetchPendingBookings = async () => {
      try {
        const response = await axios.post('http://localhost:8000/api/get-data/', {
          "table": "pending_booking",
          "sort_type": 1,
          "sort": {}
        });
        setAllRequestData(mapBookingData(response.data, meetingRooms, hotDesks));
      } catch (error) {
        console.error('Error fetching pending bookings data:', error);
      }
    };

    const fetchBookingData = async () => {
      await fetchPendingBookings();
      await fetchAllBookings();
      await fetchUserBookings();
    }

    fetchBookingData();
  }

  useEffect(() => {
    fetchData();
  }, [hotDesks]);



  useEffect(() => {
    const schedulerData1 = userBookingData.map((booking) => ({
      startDate: booking.startTime,
      endDate: booking.endTime,
      title: booking.title,
      id: booking.id,
      status: booking.status,
      location: booking.title,
      utilities: booking.utilities,
      room: booking.room,
      userId: booking.zID
    }));

    const schedulerData2 = allBookingData
    .filter((booking) => booking.status === 'approved' || booking.status === 'active')
    .map((booking) => ({
      startDate: booking.startTime,
      endDate: booking.endTime,
      title: booking.title,
      id: booking.id,
      status: booking.status,
      location: booking.title,
      utilities: booking.utilities,
      room: booking.room,
      userId: booking.zID
    }));

    setUserBookingSchedulerData(schedulerData1)
    setAllBookingSchedulerData(schedulerData2)


  }, [userBookingData])

  const mapBookingData = (data, meetingRooms, hotDesks) => {
    return data.map(item => {
      const isRoom = item.content_type_id === 9;
      const content = isRoom
        ? meetingRooms.find(room => room.room_id === item.object_id)
        : hotDesks.find(desk => desk.hotdesk_id === item.object_id);

      return {
        id: item.booking_id,
        zID: item.user_id,
        title: isRoom ? `${content.room_location}-${content.room_number}` : `${content.hotdesk_location} Floor ${content.hotdesk_floor}: Hotdesk ${content.hotdesk_number}`,
        type: isRoom ? 'Meeting-Room' : 'HotDesk',
        startTime: new Date(item.start_time),
        endTime: new Date(item.end_time),
        status: item.state,
        utilities: isRoom ? content.room_utilities : '',
        timetable: {},
        room: item.content_type_id
      };
    });
  };

  let autoCompleteOptions = [];
  switch (acsess) {
    case 'Current Bookings':
      autoCompleteOptions = userBookingData.map((booking) => booking.title);
      break;
    case 'Current Requests':
      autoCompleteOptions = allRequestData.map((request) => request.title);
      break;
    case 'Current Users':
      autoCompleteOptions = allUserData.map((user) => user.username);
      break;
    default:
      autoCompleteOptions = [];
  }
  const [currentViewName, setCurrentViewName] = React.useState('Week');

  // var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  // var days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  // function timeTwelveHourFormat(hours, mins) {
  //   return `${(hours%12<10?'0':'')+hours%12}:${(mins<10?'0':'')+mins} ${hours<12?'AM':'PM'}`
  // }
  
  // function formatDateTime(dateTime) {
  //   return days[dateTime.getDay()] + ' ' + dateTime.getDate() + ' ' +months[dateTime.getMonth()] + ' ' + dateTime.getFullYear() + ' ' + timeTwelveHourFormat(dateTime.getHours(), dateTime.getMinutes())
  // }

  const CustomAppointments = ({ children, data, style, ...restProps }) => {
    let backgroundColor = '#31413D';
    let status = 'Approved';
    let color = '#1C1C1C'
  
    switch (data.status) {
      case 'pending':
        backgroundColor = 'rgba(251, 115, 0)';
        status = 'Pending'
        color = '#1C1C1C'
        break;
      case 'active':
        backgroundColor = 'rgba(132, 183, 170)';
        status = 'Active'
        color = '#1C1C1C'
        break;
      case 'denied':
        backgroundColor = '#D26969';
        status = 'Denied';
        color = '#FFFFFF'
        break;
      case 'approved':
        backgroundColor = '#31413D';
        status = 'Approved'
        color = '#FFFFFF'
        break;
      default:
        backgroundColor = '#31413D';
        status = 'Approved'
        color = '#1C1C1C'
    }
  
    return (
      <Appointments.Appointment
      {...restProps}
      style={{
        ...style,
        backgroundColor,
        color,
      }}
      data={data}
    >
      {children}
      <div className='VerticalAppointment-content css-gyiown'>{status}</div>
    </Appointments.Appointment>
    )
  };


  const AllBookingCustomAppointments = ({ children, data, style, ...restProps }) => {
    let backgroundColor = '#31413D';
    let color = '#1C1C1C'
    switch (data.status) {
      case 'pending':
        backgroundColor = 'rgba(251, 115, 0)';
        color = '#1C1C1C'
        break;
      case 'active':
        backgroundColor = 'rgba(132, 183, 170)';
        color = '#1C1C1C'
        break;
      case 'denied':
        backgroundColor = '#D26969';
        color = '#FFFFFF'
        break;
      case 'approved':
        backgroundColor = '#31413D';
        color = '#FFFFFF'
        break;
      default:
        backgroundColor = '#31413D';
        color = '#1C1C1C'
    }

    const [userData, setUserData] = useState({ username: '', email: '' });
      useEffect(() => {
        let isMounted = true;
        
        const fetchUserData = async () => {
            try {
              const response = await axios.post('http://localhost:8000/api/get-data/', {
                "table": "auth_user",
                "sort_type": 1,
                "sort": {
                  "id": data.userId
                }
              });
                if (isMounted) {
                  const user = response.data[0];
                  setUserData({ username: user.username, email: user.email });
                }
            } catch (error) {
              console.error('Failed to fetch user data:', error);
            }
        };
        if (data.userId) {
          fetchUserData();
        }

        return () => {
            isMounted = false;
        };
      }, [data.userId]);

  
    return (
      <Appointments.Appointment
      {...restProps}
      style={{
        ...style,
        backgroundColor,
        color,
      }}
      data={data}
    >
      {children}
      <div className='VerticalAppointment-content css-gyiown'>
          <>
            User Name: {userData.username}
            <br />
            Email: {userData.email}
          </>
      </div>
    </Appointments.Appointment>
    )
  };
  
  const CustomAppointmentToolkitContent = ({ appointmentData, ...restProps }) => {
    let status = 'Active';
  
    switch (appointmentData.status) {
      case 'pending':
        status = 'Pending'
        break;
      case 'active':
        status = 'Active'
        break;
      case 'denied':
        status = 'Denied';
        break;
      case 'approved':
        status = 'Approved'
        break;
      default:
        status = 'Active'
    }
  
    return (
      <AppointmentTooltip.Content
      {...restProps}
        appointmentData={appointmentData}
      >
        <div 
          style={{marginLeft: '64px'}}
        >Status: {status}</div>
      </AppointmentTooltip.Content>
  
    )
  }

  const CustomAppointmentToolkitContentAllBookings = ({ appointmentData, ...restProps }) => {
    const [userData, setUserData] = useState({ username: '', email: '' });
    const [status, setStatus] = useState('Active');

    useEffect(() => {
        let isMounted = true;
        
        const fetchUserData = async () => {
            try {
              const response = await axios.post('http://localhost:8000/api/get-data/', {
                "table": "auth_user",
                "sort_type": 1,
                "sort": {
                  "id": appointmentData.userId
                }
              });
                if (isMounted) {
                  const user = response.data[0];
                  setUserData({ username: user.username, email: user.email });
                  setUsername(user.username)
                }
            } catch (error) {
              console.error('Failed to fetch user data:', error);
            }
        };

        fetchUserData();

        return () => {
            isMounted = false;
        };
    }, [appointmentData.userId]);

    useEffect(() => {
        switch (appointmentData.status) {
            case 'pending':
                setStatus('Pending');
                break;
            case 'active':
                setStatus('Active');
                break;
            case 'denied':
                setStatus('Denied');
                break;
            case 'approved':
                setStatus('Approved');
                break;
            default:
                setStatus('Active');
        }
    }, [appointmentData.status]);

    return (
        <AppointmentTooltip.Content
            {...restProps}
            appointmentData={appointmentData}
        >
            <div style={{ marginLeft: '64px' }}>
                Booking Status: {status}<br></br>
                User Name: {userData.username}<br></br>
                Email: {userData.email}
            </div>
        </AppointmentTooltip.Content>
    );
};

  const CustomAppointmentToolkitHeader = ({ appointmentData, onHide,  ...restProps }) => {
    const handleDeleteClick = () => {
      onHide();
      setTimeout(() => {
        setBookingId(appointmentData.id)
        setBookingStartTime(format(appointmentData.startDate, 'd MMM y hh:mm aa'))
        setBookingEndTime(format(appointmentData.endDate, 'd MMM y hh:mm aa'))
        setBookingTitle(appointmentData.title)
        setBookingUtilities(appointmentData.utilities)
        setOpenModalDelete(true)
      }, 0);
    };
    const handleEditClick = () => {
      onHide();
      setTimeout(() => {
        setBookingId(appointmentData.id)
        setBookingStartTime(format(appointmentData.startDate, 'd MMM y hh:mm aa'))
        setBookingEndTime(format(appointmentData.endDate, 'd MMM y hh:mm aa'))
        setBookingTitle(appointmentData.title)
        setBookingUtilities(appointmentData.utilities)
        setRoom(appointmentData.room)
        setOpenEditDrawer(true)
      }, 0);
    }
    return (
      <AppointmentTooltip.Header
        {...restProps}
        showOpenButton
        showDeleteButton
        onDeleteButtonClick={handleDeleteClick}
        onOpenButtonClick={handleEditClick}
      >
      </AppointmentTooltip.Header> 
    )
  }

  const CustomAppointmentToolkitHeaderAllBookings = ({ appointmentData, onHide,  ...restProps }) => {
    const handleDeleteClick = () => {
      onHide();
      setTimeout(() => {
        setBookingId(appointmentData.id)
        setBookingStartTime(format(appointmentData.startDate, 'd MMM y hh:mm aa'))
        setBookingEndTime(format(appointmentData.endDate, 'd MMM y hh:mm aa'))
        setBookingTitle(appointmentData.title)
        setBookingUtilities(appointmentData.utilities)
        setDeleteSomeoneElseMeeting(true)
      }, 0);
    };
  
    return (
      <AppointmentTooltip.Header
        {...restProps}
        showDeleteButton
        onDeleteButtonClick={handleDeleteClick}
      >
      </AppointmentTooltip.Header> 
    )
  }

  return (
    <DashboardBackground>
      <Heading>
        <DrawerAppBar isCreate={qstAdded} onCreate={(created) => { setqstAdded(created); }}/>
        { userDataRole === 'admin'
          ? (
            <AdminAutocomplete
            {...defaultProps}
            id="disable-close-on-select"
            disableClearable
            defaultValue={defaultProps.options[0]}
            onChange={(e) => {setAcsess(e.target.textContent); setView('List View')}}
            PaperComponent={({ children }) => (
              <Paper sx={{ background: "#31413d", color: "#FFFFFF" }}>{children}</Paper>
            )}
            renderInput={(params) => (
              <HeadingAutocomplete {...params} id="admin-heading" label="SELECT ACSESS:" variant="standard"
              InputProps={{...params.InputProps, disableUnderline: true, style: {  fontSize: '2.5rem', fontWeight: '600', color: '#FFFFFF'}}} 
              InputLabelProps={{ style: { color: '#FFFFFF', fontSize:'20px' }}}/>
            )}
          />
            )
          : (
            //show this user is not an admin
            <DashboardHeading>Current Bookings</DashboardHeading>
          )}
        <HeadingSeperator></HeadingSeperator>
      </Heading>
      <FilterViewBookingsContainer>
        <FilterContainer>

        {acsess !== 'All Bookings' && view === 'List View' ? (
          <>
          <SearchBlock>
              <SearchBar
                freeSolo           
                options={autoCompleteOptions}
                PaperComponent={({ children }) => (
                  <Paper sx={{ background: "#31413d", color: "#FFFFFF" }}>{children}</Paper>)}
                onChange={(e) => {setFilterStr(e.target.textContent);}}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Search input"
                    InputProps={{
                      ...params.InputProps,
                      style: {color: '#FFFFFF'}
                    }}
                    InputLabelProps={{ style: { color: '#FFFFFF', textAlign: 'center'}}}
                  />
                )}
              />
          </SearchBlock>
          <FilterBtn><FilterIcon/>Filter</FilterBtn>
          </>
        ) : <></>}
        </FilterContainer>
        {
          acsess === 'Current Bookings' && (
            <ViewContainer>
            <StyledButton 
              style={view === 'List View' ? {color:'#FFFFFF'} : {}} 
              onClick={() => setView('List View')}>
              List View
            </StyledButton>
            <StyledButton 
              style={view === 'Calander View' ? {color:'#FFFFFF'} : {}} 
              onClick={() => setView('Calander View')}>
              Calander View
            </StyledButton>
          </ViewContainer>
          )
        }

      </FilterViewBookingsContainer>
      { view === 'List View' ? (
        <Bookings>
        <BookingContainer>
          {
            ((acsess === 'Current Bookings' && userDataRole !== 'student') || (acsess === 'Current Bookings' && userBookingData.length <= 0)) ?
              <div><AddBookingButton onClick={() => navigate('/booking')}> Add Booking + </AddBookingButton></div> :
            (acsess === 'Current Users' && userDataRole !== 'student') ?
              <div><AddBookingButton onClick={handleAddUserClick}> Add User + </AddBookingButton></div> :
            null
          }
          {acsess === 'Current Bookings' && (
            userBookingData.length > 0 ? (
              userBookingData.sort((a,b) => new Date(a.startTime) - new Date(b.startTime)).map((booking) => {
                if (booking.title.includes(filterStr)) {
                  return (<BookingCard {...booking} key={booking.id} acsess='booking' refreshData={() => fetchData()}/>)
                }
              })
            ) : (
              <NoBookingsCardContainer>
                <GhostImage src={ghost} alt="" />
                <NoBookingsTextContainer>
                  <NoBookingsHeading>It is Looking Rather Empty Here</NoBookingsHeading>
                  <NoBookingsSubheading>Go make a BOOking!</NoBookingsSubheading>
                </NoBookingsTextContainer>
              </NoBookingsCardContainer>
              
            )
          )}
          {acsess === 'Current Requests' &&(
            allRequestData.length > 0 ? (
              allRequestData.sort((a,b) => new Date(a.startTime) - new Date(b.startTime)).map((request) => {
                if (request.title.includes(filterStr)) {
                  const matchedUser = allUserData.find(certainUser => certainUser.id === request.zID);
                  return (<BookingCard {...request} key={request.id} acsess='request' refreshData={() => fetchData()}
                    currUserUsername={matchedUser.username} 
                    currUserEmail={matchedUser.email}
                    currUserRole={matchedUser.is_superuser ? "Admin" : "Staff"}
                    currUserDate ={matchedUser.date_joined}
                  />)
                }
              })
            ) : (
              <NoBookingsCardContainer>
                <GhostImage src={check} alt="" />
                <NoBookingsTextContainer>
                  <NoBookingsHeading>Everyone Has Acsess To Their Workspaces</NoBookingsHeading>
                  <NoBookingsSubheading>No new requests to approve</NoBookingsSubheading>
                </NoBookingsTextContainer>
              </NoBookingsCardContainer>
            )
          )}
          {acsess === 'Current Users' &&(
            allUserData.length > 0 ? (
              allUserData.map((user) => {
                if (user.username.includes(filterStr)) {
                  const matchedUser = allUserData.find(certainUser => certainUser.username === user.username);
                  return (<UserCard {...user} key={user.username} acsess='user'
                    currUserUsername={matchedUser.username} 
                    currUserEmail={matchedUser.email}
                    currUserRole={matchedUser.is_superuser ? "Admin" : "Student/Staff"}
                    currUserDate ={matchedUser.date_joined}                  
                  />)
                }
              })
            ) : (
              <NoBookingsCardContainer>
                <GhostImage src={check} alt="" />
                <NoBookingsTextContainer>
                  <NoBookingsHeading>No users</NoBookingsHeading>
                  <NoBookingsSubheading>Add a user to the system</NoBookingsSubheading>
                </NoBookingsTextContainer>
              </NoBookingsCardContainer>
            )
          )}
          {acsess === 'All Bookings' && (
            <SchedulerContainer>
              <Scheduler data={allBookingSchedulerData} firstDayOfWeek={1} rootComponent={CustomScheduler}>
                <ViewState 
                  defaultCurrentDate={new Date()} 
                  currentViewName={currentViewName}
                  onCurrentViewNameChange={setCurrentViewName}
                />
                <DayView 
                  dayScaleLayoutComponent={CustomDayViewDayScaleLayout}
                  timeScaleLayoutComponent={CustomDayViewTimeScaleLayout}
                  dayScaleEmptyCellComponent={CustomDayViewEmptyCell}
                />
                <WeekView 
                  timeScaleLayoutComponent={CustomWeekViewTimeScaleLayout}
                  dayScaleLayoutComponent={CustomWeekViewDayScaleLayout}
                  dayScaleEmptyCellComponent={CustomWeekViewEmptyCellLayout}
                />
                <Toolbar />
                <ViewSwitcher 
                  switcherComponent={CustomViewSwitcher}
                />
                <DateNavigator 
                  navigationButtonComponent={CustomDateNavigationButton}
                  openButtonComponent={CustomDateOpenButtom}
                />
                <TodayButton 
                  buttonComponent={CustomTodayButton}
                />
                <Appointments 
                  appointmentComponent={AllBookingCustomAppointments}
                />
                <AppointmentTooltip 
                  headerComponent={CustomAppointmentToolkitHeaderAllBookings}
                  contentComponent={CustomAppointmentToolkitContentAllBookings}
                />
                <CurrentTimeIndicator 
                  shadePreviousAppointments
                  shadePreviousCells
                />
              </Scheduler>
            </SchedulerContainer>
          )}
        </BookingContainer>
      </Bookings>
      
      ) : (
        <SchedulerContainer>
        <Scheduler data={userBookingSchedulerData} firstDayOfWeek={1} rootComponent={CustomScheduler}>
          <ViewState 
            defaultCurrentDate={new Date()} 
            currentViewName={currentViewName}
            onCurrentViewNameChange={setCurrentViewName}
          />
          <DayView 
            dayScaleLayoutComponent={CustomDayViewDayScaleLayout}
            timeScaleLayoutComponent={CustomDayViewTimeScaleLayout}
            dayScaleEmptyCellComponent={CustomDayViewEmptyCell}
          />
          <WeekView 
            timeScaleLayoutComponent={CustomWeekViewTimeScaleLayout}
            dayScaleLayoutComponent={CustomWeekViewDayScaleLayout}
            dayScaleEmptyCellComponent={CustomWeekViewEmptyCellLayout}
          />
          <Toolbar />
          <ViewSwitcher 
            switcherComponent={CustomViewSwitcher}
          />
          <DateNavigator 
            navigationButtonComponent={CustomDateNavigationButton}
            openButtonComponent={CustomDateOpenButtom}
          />
          <TodayButton 
            buttonComponent={CustomTodayButton}
          />
          <Appointments 
            appointmentComponent={CustomAppointments}
          />
          <AppointmentTooltip 
            headerComponent={CustomAppointmentToolkitHeader}
            contentComponent={CustomAppointmentToolkitContent}
          />
          <CurrentTimeIndicator 
            shadePreviousAppointments
            shadePreviousCells
          />
        </Scheduler>
        </SchedulerContainer>
      )}
      <ErrorModal open={error} onClose={() => setError(false)}>{error}</ErrorModal>
      <EditDrawer 
        open={openEditDrawer}
        title={'Edit Booking'}
        onClose={() => {handleEditDrawerClose()}}
        bookingId={bookingId} 
        bookingTitle={bookingTitle}
        bookingStartTime={bookingStartTime}
        bookingEndTime={bookingEndTime}
        bookingUtilities={bookingUtilities}
        key={bookingId}
        room={room}
      />
      {/* Modals for admins to delete someone else's meeting */}
      <BasicModal
        open={deleteSomeoneElseMeeting}
        submitfunc={() => {
          setDeleteSomeoneElseMeeting(false)
          setSendMessageModal(true)
        }}
        title={'Cancel Booking'}
        submitbtntext={'Confirm'}
        exitbtntext={'Exit'}
        issubmit={true}
        onClose={() => {setDeleteSomeoneElseMeeting(false); setReloadData(reloadData + 1)}}>
        Are you sure you want to cancel <b>{username}&apos;</b>s booking for <b>{bookingTitle}</b> at <b>{bookingStartTime}</b> - <b>{bookingEndTime}</b>?
      </BasicModal>
      <BasicModal
        open={sendMesssageModal}
        title={'Send Message'}
        submitfunc={
          async () => {
            if (!validMessage || message.trim() === '') {
              setValidMessage(false);
              alert("Please enter a valid message")
              setSendMessageModal(false)
              setDeleteSomeoneElseMeeting(true)
              return;
            }

            setSendMessageModal(false)
            try {
              const token = getToken()
              const user_id = getUserId();
              const response = await axios.post('http://localhost:8000/api/cancel-booking/', {
                "booking_id" : bookingId,
                "token" : token,
                "user_id": user_id
              });                
              if (response.data.success) {
                setOpenModalConfirmDeleteSomeoneElse(true)
              } else {
                setError('Something went wrong. Please try again!');
              }
            }
            catch (error) {
              console.error('An error occurred. Please try again.', error);
            }
          }
        }
      submitbtntext={'Confirm'}
      exitbtntext={'Exit'}
      issubmit={true}
      onClose={() => setSendMessageModal(false)}
      >
        Send a message to the user to inform them why you are cancelling their booking.
        <FormContainer style={{height: '155px'}}>
          <FormInput
            label="Message"
            name="Message"
            onChange={(e) => validateMessage(e.target.value)}
            helperText={(validMessage) ? '' : `Field cannot be empty`}
            error={validMessage}
            fullWidth
            margin="normal"
            variant="outlined"
            multiline
            rows={3}
          />
        </FormContainer>

      </BasicModal>
      
      {/* Modals to delete your own booking */}
      <BasicModal
        open={openModalDelete}
        submitfunc={
          async () =>
            {
              setOpenModalDelete(false)
              try{
                const token = getToken()
                const user_id = getUserId();
                const response = await axios.post('http://localhost:8000/api/cancel-booking/', {
                  "booking_id" : bookingId,
                  "token" : token,
                  "user_id": user_id,
                  "message": 'Cancel Booking'
                });
                if (response.data.success) {
                  setOpenModalConfirmDelete(true)
                } else {
                  setError('Something went wrong. Please try again!');
                }
              }
              catch (error) {
                console.error('An error occurred. Please try again.', error);
              }
            }
        }
        title={'Cancel Booking'}
        submitbtntext={'Confirm'}
        exitbtntext={'Exit'}
        issubmit={true}
        onClose={() => setOpenModalDelete(false)}>
        Are you sure you want to cancel your booking for <b>{bookingTitle}</b> at <b>{bookingStartTime}</b> - <b>{bookingEndTime}</b>?
      </BasicModal>
      <BasicModal
        open={openModalConfirmDelete}
        submitfunc={() =>
          {
            setOpenModalConfirmDelete(false)
            navigate('/booking')
          }}
        title={'Booking Canceled'}
        submitbtntext={'Confirm'}
        exitbtntext={'Exit'}
        issubmit={true}
        onClose={() => {setOpenModalConfirmDelete(false); setReloadData(reloadData + 1)}}>
        Your booking has been succesfully canceled. Would you like to reschedule your booking?
      </BasicModal>
      <BasicModal
        open={openModalConfirmDeleteSomeoneElse}
        submitfunc={() =>
          {
            setOpenModalConfirmDeleteSomeoneElse(false)
          }}
        title={'Booking Canceled'}
        submitbtntext={'Confirm'}
        exitbtntext={'Exit'}
        issubmit={false}
        onClose={() => {setOpenModalConfirmDeleteSomeoneElse(false); setReloadData(reloadData + 1)}}>
        You have successfully cancelled the booking.
      </BasicModal>
     
      {/* Modals for adding users */}
      <BasicModal
        open={addUserModal}
        onClose={() => {
          setAddUserModal(false)
          setName('')
          setZid('')
          setEmail('')
          setRole('student')
          setFaculty('')
          setSchool('')
          setDegree('')
          setSchoolRole('')
        }}
        title="Enter new user details"
        issubmit={true}
        submitfunc={handleSubmit}
        submitbtntext="Submit"
        exitbtntext="Cancel"
      >
        <FormContainer>
          <FormInput
            label="Name"
            name="name"
            value={name}
            onChange={(e) => validateName(e.target.value)}
            helperText={(validName) ? '' : `Field cannot be empty`}
            fullWidth
            margin="normal"
            variant="outlined"
          />
          <FormInput
            label="zID"
            name="zID"
            value={zid}
            onChange={(e) => validateZid(e.target.value)}
            helperText={(validZid) ? '' : `Please enter zID in the form 'z1234567'`}
            fullWidth
            margin="normal"
            variant="outlined"
          />
          <FormInput
            label="Email"
            name="email"
            value={email}
            onChange={(e) => validateEmail(e.target.value)}
            helperText={(validEmail) ? '' : 'Please enter a valid email'}
            fullWidth
            margin="normal"
            variant="outlined"
          />
            <ToggleButtonGroup
              exclusive
              value={role}
              onChange={handleRoleChange}
              fullWidth
            >
              <Switch value="student">Student</Switch>
              <Switch value="staff">Staff</Switch>
            </ToggleButtonGroup>

          <FormInput
          label="Faculty"
          name="faculty"
          value={faculty}
          onChange={(e) => validateFaculty(e.target.value)}
          helperText={(validFaculty) ? '' : 'Please enter a valid faculty'}
          fullWidth
          margin="normal"
          variant="outlined"
          />
          <FormInput
            label="School"
            name="school"
            value={school}
            onChange={(e) => validateSchool(e.target.value)}
            helperText={(validSchool) ? '' : `Please enter a valid school`}
            fullWidth
            margin="normal"
            variant="outlined"
          />
          <FormInput
            label="Degree (Students) / Title (Staff)"
            name="degree"
            value={degree}
            onChange={(e) => validateDegree(e.target.value)}
            helperText={(validDegree) ? '' : `Please input 'degree' for students or 'title' for staff`}
            fullWidth
            margin="normal"
            variant="outlined"
          />        
          <FormInput
            label="School Role"
            name="schoolRole"
            value={schoolRole}
            onChange={(e) => validateSchoolRole(e.target.value)}
            helperText={(validSchoolRole) ? '' : `Please enter a valid school role`}
            fullWidth
            margin="normal"
            variant="outlined"
          /> 
        </FormContainer>
      </BasicModal>
      <BasicModal 
        open={confirmNewUserModal} 
        title={'Add this user?'}  
        submitfunc={handleConfirmUser} 
        submitbtntext={'Confirm'} 
        onClose={() => setConfirmNewUserModal(false)} 
        exitbtntext={'Cancel'} 
        issubmit={true}
      >
        <p> Are you sure you want to add the user [{name}] to the booking system?</p>
      </BasicModal>
      <BasicModal 
        open={errorModal} 
        title={'Error ading user!'}  
        onClose={() => setErrorModal(false)} 
        exitbtntext={'Cancel'} 
        issubmit={false}
      >
        <p> There was an error adding user: {errorDescription}</p>
      </BasicModal>
      <BasicModal 
        open={successModal} 
        title={'Successfully added user!'}  
        onClose={() => setSuccessModal(false)} 
        exitbtntext={'Close'} 
        issubmit={false}
      >
      </BasicModal>   

    </DashboardBackground>
  );
}

export default Dashboard;

