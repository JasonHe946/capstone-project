import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { styled, Button, Box } from '@mui/material';
import DrawerAppBar from './Nav';
import allBuildingBannerImg from '../assets/allBuildings.jpg';
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import dayjs from 'dayjs';
import { DateNavigator, Scheduler, WeekView, Toolbar, TodayButton, Appointments, CurrentTimeIndicator} from '@devexpress/dx-react-scheduler-material-ui';
import { ViewState } from '@devexpress/dx-react-scheduler';
import BasicModal from './BasicModal';
import ErrorModal from './ErrorModal';
import axios from 'axios';
import { format, compareAsc } from 'date-fns';
const { differenceInMinutes } = require("date-fns");

const Heading = styled('div')({
  paddingTop: '2%',
  width: '94vw',
  marginLeft: 'auto',
  marginRight: 'auto',
})

const HeadingSeperator = styled('hr')({
  width: '100%',
  borderColor: '#31413D',
  borderStyle: 'double'
});

const DashboardBackground = styled('div')({
  backgroundColor: '#1C1C1C',
  height: '100vh',
  width: '100vw'
});

const DashboardHeading = styled('div')({
	flex: '1',
  fontSize: '2rem',
  fontWeight: '600',
  color: '#FFFFFF',
	textAlign: 'center',
});

const Banner = styled('div')({
  overflow: 'hidden',
  width: '100%',
  height: '13vh'
})

const BannerImg = styled('img')({
  width: '100%',
  height:'100%',
  objectFit: 'cover'
})

const BackButton = styled(Button)({
  color: '#DCCFCF',
  '&:hover': {
    backgroundColor: '#DCCFCF',
    color: '#252525',
  }
});
const HeaderContainer = styled('div')({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
	textAlign: 'center',
});

const BookingSpace = styled('div')({
	backgroundColor: '#252525',
	height: '100%',
	width: '100%',
})

const ColumnsContainer = styled(Box)({
  display: 'flex',
  flexDirection: 'row',
  width: '100%',
  height: '100%',
});

const Column = styled(Box)({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  padding: '20px',
});

const LeftColumn = styled(Column)({
  flexBasis: '25%',
});

const MiddleColumn = styled(Column)({
	flexBasis: '50%',
})

const RightColumn = styled(Column)({
  flexBasis: '25%',
});

const Utilities = styled('div')({
  color: '#ffffff',
  marginBottom: '25px',
  paddingLeft: '10px'
})
export const CustomDateTimePicker = styled(DateTimePicker)(() => ({
  '& .MuiInputBase-root': {
    backgroundColor: '#252525',
    borderRadius: '50px',
    color: '#FFFFFF',
  },
  '& .MuiInputBase-Input': {
    padding: '0px',
  },
  '& .MuiOutlinedInput-notchedOutline': {
    borderColor: '#31413D',
  },
  '& .MuiSvgIcon-root': {
    color: '#FFFFFF'
  },
  '& .MuiInputLabel-root': {
    color: '#FFFFFF',
  },
}));

export const DatePickerBox = styled(Box)({
  minHeight: '150px'
})

const SubmitButton = styled(Button)({
  marginTop: '20px',
  border: 'none',
  padding: '10px 20px',
  borderRadius: '50px',
  width: '100%',
  fontWeight: 'bold',
  backgroundColor: '#31413D',
  color: '#DCCFCF',
  '&:hover': {
    backgroundColor: '#FC7202',
    color: '#000',
    opacity: '0.9'
  },
})

const SchedulerContainer = styled(Box)({
  flexGrow: '1',
  height: '100%',
  width: '100%',
})

const CustomScheduler = styled(Scheduler.Root)({
  backgroundColor: '#252525',
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

const CustomDateNavigationButton = styled(DateNavigator.NavigationButton)({
  backgroundColor: '#252525',
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

const BookingPage = () => {
  const location = useLocation();
  const workspaceData = location.state;
	const navigate = useNavigate()

	let d = new Date()
	let d1 = new Date()
	d.setHours(d.getHours() + 1)
	d.setMinutes(0);
	d.setSeconds(0);
	d.setMilliseconds(0);
	d1.setHours(d.getHours() + 1)
	d1.setMinutes(0);
	d1.setSeconds(0);
	d1.setMilliseconds(0);

	const [updatedStartTime, setUpdatedStartTime] = React.useState(dayjs(d))
  const [updatedEndTime, setUpdatedEndTime] = React.useState(dayjs(d1))
	const [qstAdded, setqstAdded] = React.useState(false);
	const [disableButton, setDisableButton] = React.useState(false)
	const [openModal1, setOpenModal1] = React.useState(false)
	const [openModal2, setOpenModal2] = React.useState(false)
	const [error, setError] = React.useState(false)
  const [schedulerData, setSchedulerData] = React.useState([])

  const [bookings, setBookings] = React.useState([])

	let name = workspaceData.name;
	let capacity = workspaceData.capacity;
	let description = workspaceData.description;
	let id = workspaceData.id;
	let utilities = workspaceData.utilities;
	let type = workspaceData.type

	const handleStartTimeChange = (newValue) => {
    setUpdatedStartTime(newValue)
    if(newValue.isAfter(updatedEndTime)) {
      setDisableButton(true)
    } else {
      setDisableButton(false)
    }
  }

  const handleEndTimeChange = (newValue) => {
		setUpdatedEndTime(newValue);
    if (newValue.isBefore(updatedStartTime)) {
      setDisableButton(true);
    } else {
      setDisableButton(false);
    }
  }
	const CustomAppointments = ({ children, style, ...restProps }) => {
    return (
      <Appointments.Appointment
      {...restProps}
      style={{
        ...style,
        backgroundColor: '#D26969',
        color: '#FFFFFF',
      }}
    >
    </Appointments.Appointment>
    )
  };

	const handleClose = () => {
		setOpenModal2(false)
		navigate('/booking')
	}


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

  useEffect(() => {
    const fetchBookingsForARoom = async () => {
      try {
        const response = await axios.post('http://localhost:8000/api/get-data/', {
          "table": "booking",
          "sort_type": 1,
          "sort": {
            "content_type_id": 9,
            "object_id": id
          }
        });

        const approvedBookings = response.data.filter((booking) => booking.state === 'approved')

        setBookings(approvedBookings)
        const formattedData = approvedBookings.map(booking => ({
          ...booking,
          startDate: new Date(booking.start_time),
          endDate: new Date(booking.end_time)
        }));
        setSchedulerData(formattedData);
      } catch (error) {
        console.error('Error fetching hot desks data:', error);
      }
    };
    fetchBookingsForARoom();
  }, [id]);

  return (
    <>
			<DashboardBackground>
				<Heading>
					<DrawerAppBar isCreate={qstAdded} onCreate={(created) => { setqstAdded(created); }}/>
					<Banner>
						<BannerImg src={allBuildingBannerImg} alt='banner image of UNSW main walkway'/>
					</Banner>
					<HeaderContainer>
					<BackButton 
              startIcon={<KeyboardDoubleArrowLeftIcon />}
              onClick={() => navigate('/booking')}
          >
            Back
          </BackButton>
					<DashboardHeading>{name}</DashboardHeading>
					</HeaderContainer>
					<HeadingSeperator></HeadingSeperator>
				</Heading>
				<BookingSpace>
					<ColumnsContainer>
						<LeftColumn>
							<DatePickerBox>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DemoContainer components={['DateTimePicker']}>
                    <CustomDateTimePicker 
                      label="Booking Start Time"
                      defaultValue={dayjs(d)}
                      onChange={(newValue) => handleStartTimeChange(newValue)}
                      disablePast
											format='DD MMM YYYY hh:mm A'
                      />
                    <CustomDateTimePicker
                      label="Booking End Time"
                      defaultValue={dayjs(d1)}
                      onChange={(newValue) => handleEndTimeChange(newValue)}
                      disablePast
                      minDateTime={updatedStartTime ? dayjs(updatedStartTime) : dayjs(d)}
											format='DD MMM YYYY hh:mm A'
                      />
                  </DemoContainer>
                </LocalizationProvider>
              </DatePickerBox>
							<SubmitButton onClick={() => setOpenModal1(true)} disabled={disableButton}>Confirm</SubmitButton>
						</LeftColumn>
						<MiddleColumn>
							<SchedulerContainer>
                <Scheduler firstDayOfWeek={1} rootComponent={CustomScheduler} data={schedulerData}>
                  <ViewState
                    defaultCurrentDate={new Date()}
                  />
                  <WeekView
                    timeScaleLayoutComponent={CustomWeekViewTimeScaleLayout}
                    dayScaleLayoutComponent={CustomWeekViewDayScaleLayout}
                    dayScaleEmptyCellComponent={CustomWeekViewEmptyCellLayout}
                  />

                  <Toolbar />
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
                  <CurrentTimeIndicator 
                    shadePreviousAppointments
                    shadePreviousCells
                  />
                
                </Scheduler>
              </SchedulerContainer>
						</MiddleColumn>
						<RightColumn>
							<Utilities>
                <p></p>
								<b>Description: </b> 
								{description}
								<p></p>
								{type === 'meeting-room' && (
									<>
										<b>Capacity: </b> {capacity}
										<p></p>
									</>
								)}
                <div><b>Utilities:</b></div>
                <ul>
                {utilities.map((utilitiy) => (
                  <li>{utilitiy}</li>
                ))}
                </ul>
              </Utilities>
						</RightColumn>
					</ColumnsContainer>
				</BookingSpace>
			</DashboardBackground>
			<BasicModal
        open={openModal1}
        submitfunc={async () =>
          {
            setOpenModal1(false);

            const isRoomAvailable = bookings.every(booking => {
              const bookingStartTime = new Date(booking.start_time);
              const bookingEndTime = new Date(booking.end_time);
              const newBookingStartTime = updatedStartTime.toDate();
              const newBookingEndTime = updatedEndTime.toDate();

              const startInBetween = (compareAsc(newBookingStartTime, bookingStartTime) === 1 && compareAsc(newBookingStartTime, bookingEndTime) === -1)
              const endInBetween = (compareAsc(newBookingEndTime, bookingStartTime) === 1 && compareAsc(newBookingEndTime, bookingEndTime) === -1)
              const bookingStartInBetween = (compareAsc(bookingStartTime, newBookingStartTime) === 1 && compareAsc(bookingStartTime, newBookingEndTime) === -1)
              const bookingEndInBetween = (compareAsc(bookingEndTime, newBookingStartTime) === 1 && compareAsc(bookingEndTime, newBookingEndTime) === -1)
              const sameStartAndEnd = (compareAsc(bookingStartTime, newBookingStartTime) === 0 && compareAsc(bookingEndTime, newBookingEndTime) === 0)

              return (!startInBetween && !endInBetween && !bookingStartInBetween && !bookingEndInBetween && !sameStartAndEnd);
            });

            if(isRoomAvailable) {
              const newBookingStartTime = updatedStartTime.toDate();
              const newBookingEndTime = updatedEndTime.toDate();
              const durationInMinutes = differenceInMinutes(newBookingEndTime, newBookingStartTime);
              if (durationInMinutes > 480) {
                setError('Cannot make a booking for more than 8 hours.');
                return;
              }

              try{
                const token = getToken()
                const user_id = getUserId()
                const response = await axios.post(`http://localhost:8000/api/create-room-booking/`, {
                  "user_id": user_id,
                  "token": token,
                  "start_time": format(updatedStartTime.toDate(), "yyyy-MM-dd HH:mm:ss"),
                  "end_time": format(updatedEndTime.toDate(), "yyyy-MM-dd HH:mm:ss"),
                  "room_id": id,
                });
  
                if (response.data.success) {
                  setOpenModal2(true)
                } else {
                  setError('Something went wrong. Please try again!');
                }
  
              }
              catch (error) {
                console.error('An error occurred. Please try again.', error);
              }
            } else {
              setError("Room is not available for the selected time slot. Please choose a different time.")
            }

          }}
        title={'Confirm Booking'}
        submitbtntext={'Confirm'}
        exitbtntext={'Exit'}
        issubmit={true}
        onClose={() => setOpenModal1(false)}>
        Do you want to confirm your booking for {name} at {format(updatedStartTime.toDate(), 'd MMM y hh:mm aa')} - {format(updatedEndTime.toDate(), 'd MMM y hh:mm aa')}?
      </BasicModal>
      <BasicModal
        open={openModal2}
        title={'Booking Saved!'}
        exitbtntext={'Exit'}
        issubmit={false}
        onClose={() => handleClose()}>
        Your booking has been saved.
      </BasicModal>
			<ErrorModal open={error} onClose={() => setError(false)}>{error}</ErrorModal>
    </>
  );
};

export default BookingPage;