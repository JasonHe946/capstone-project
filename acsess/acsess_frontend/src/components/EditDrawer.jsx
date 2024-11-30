import React, { useEffect, useMemo } from 'react';
import { Drawer , Box, styled, Button, Typography, Autocomplete, TextField} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { DateNavigator, Scheduler, WeekView, Toolbar, TodayButton, Appointments, CurrentTimeIndicator} from '@devexpress/dx-react-scheduler-material-ui';
import { ViewState } from '@devexpress/dx-react-scheduler';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { format, parse, compareAsc } from 'date-fns';
const { differenceInMinutes } = require("date-fns");
import dayjs from 'dayjs';
import ErrorModal from './ErrorModal';
import BasicModal from './BasicModal';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const DrawerBody = styled(Box)({
  backgroundColor: '#1c1c1c',
	width: '80vw',
  height: '100vh',
  border: 'none',
  boxShadow: 24,
  p: 4,
  padding: '20px',
  fontFamily: '"Poppins", "Arial", "Helvetica Neue", sans-serif',
  display: 'flex',
  flexDirection: 'column',
  overflow: 'auto',
})

const SchedulerContainer = styled(Box)({
  flexGrow: '1',
  overflow: 'auto',
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
  paddingTop: '30px',
  flexBasis: '35%',
  backgroundColor: '#252525'
});

const RightColumn = styled(Column)({
  flexBasis: '65%',
});

const SubmitButton = styled(Button)({
  marginTop: '20px',
  border: 'none',
  paddingTop: '10px',
  paddingBottom: '10px',
  paddingLeft: '20px',
  paddingRight: '20px',
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

const ExitButton = styled(SubmitButton)({
  backgroundColor: '#999999',
  color: '#DCCFCF',
  '&:hover': {
    backgroundColor: '#FC7202',
    color: '#000',
    opacity: '0.9'
  },
})
const HeaderContainer = styled('div')({
  display: 'flex',
  flexDirection: 'row',
  flexWrap: 'wrap',
  justifyContent: 'space-between',
    
})

const HeadingSeperator = styled('hr')({
  width: '100%',
  borderColor: '#31413D',
  borderStyle: 'double'
});

const Exit = styled('div')({
  textAlign: 'right',
})
const ExitIcon = styled('button')({
  color: '#FFFFFF',
  backgroundColor: 'transparent',
  border: 'none',
})
const DrawerTitle = styled(Typography)({
  color: '#FFFFFF',
  fontWeight: 600
})

const DrawerInfo = styled(Typography)({
	color: '#FFFFFF'
})
const SearchBlock = styled('div')({
  border: '1px solid #31413D',
  borderRadius: '50px',
  zIndex: '900',
	marginTop: '20px',
  marginBottom: '20px',
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

const DatePickerBox = styled(Box)({
  minHeight: '150px'
})

const CustomDateTimePicker = styled(DateTimePicker)({
  '&. MuiStack-root': {
    minHeight: '150px'
  },
  '&. MuiFormControl-root': {
    height: '50px',
    width: '40%',
  },
  '& .MuiInputBase-root': {
    backgroundColor: '#252525',
    borderRadius: '50px',
    color: '#FFFFFF'
  },
  '& .MuiInputBase-Input': {
    padding: '0px',
  },
  '& .MuiOutlinedInput-notchedOutline': {
    borderColor: '#31413D'
  },
  '&:hover .MuiOutlinedInput-notchedOutline': {
    borderColor: '#31413D'
  },
  '& .MuiSvgIcon-root': {
    color: '#FFFFFF'
  },
  '& .MuiInputLabel-root': {
    color: '#FFFFFF',
  },
  '& .Mui-focused .MuiOutlinedInput-notchedOutline': {
    borderColor: '#31413D',
  },
});

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

// You need to pass in the following items as props to work with the Edit Drawer
// - Current Boooking Room as bookingTitle
// - Current Booking Start Time as bookingStartTime as a string of format 'd MMM y hh:mm aa'
// - Current Booking End Time as bookingEndTime as a string of format 'd MMM y hh:mm aa'
// - Drawer Title as title
// - Open :: boolean to open the drawer
// - onClose: To instruct what to do on close
// - onSubmit: To instruct what to do on confirm
// We are yet add code to open up a Modal to confirm edit booking and then make the BE Request from this page 
function EditDrawer (props) {

  const currentStartTime = useMemo(() => parse(props.bookingStartTime, 'd MMM y hh:mm aa', new Date()), [props.open]);
  const currentEndTime = useMemo(() => parse(props.bookingEndTime, 'd MMM y hh:mm aa', new Date()), [props.open]);

  const [selectedRoom, setSelectedRoom] = React.useState(props.bookingTitle)
  const [schedulerData, setSchedulerData] = React.useState([])
  const [updatedStartTime, setUpdatedStartTime] = React.useState(dayjs(currentStartTime))
  const [updatedEndTime, setUpdatedEndTime] = React.useState(dayjs(currentEndTime))
  const [disableSubmitBtn, setDisableSubmitBtn] = React.useState(false)
  const [roomOrHotdeskId, setRoomOrHotdeskId] = React.useState(null)

  const [error, setError] = React.useState(false);
  const [openModal, setOpenModal] = React.useState(false);
  const [openModal2, setOpenModal2] = React.useState(false);
  const [openModal3, setOpenModal3] = React.useState(false);

  const [meetingRooms, setMeetingRooms] = React.useState([])
  const [hotDesks, setHotDesks] = React.useState([])

  const bookingId = props.bookingId;
  const navigate = useNavigate();

  useEffect(() => {
    const resetDrawerState = () => {
      setSelectedRoom(props.bookingTitle);
      setUpdatedStartTime(dayjs(currentStartTime));
      setUpdatedEndTime(dayjs(currentEndTime));
      setDisableSubmitBtn(false);
      if (updatedEndTime.isBefore(updatedStartTime)) {
        setDisableSubmitBtn(true)
      }
    };
    resetDrawerState();
  }, [props.open])

    useEffect(() => {
    const fetchMeetingRooms = async () => {

      try {
        const response = await axios.post('http://localhost:8000/api/get-data/', {
          "table": "room",
          "sort_type": 1,
          "sort": {}
        });
        setMeetingRooms(response.data);

      } catch (error) {
        console.error('Error fetching meeting rooms data:', error);

      }
    };
  
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
  }, [meetingRooms]);
  
  const rooms = useMemo(() => {
    return props.room === 9 
      ? meetingRooms.map(room => `${room.room_location}-${room.room_number}`)
      : hotDesks.map(desk => `${desk.hotdesk_location} Floor ${desk.hotdesk_floor}: Hotdesk ${desk.hotdesk_number}`);
  }, [hotDesks]);


  const fetchBookingsById = async (roomId) => {
    try {
      const response = await axios.post('http://localhost:8000/api/get-data/', {
        table: "booking",
        sort_type: 1,
        sort: {
          content_type_id: props.room,
          object_id: roomId,
        }
      });
      const formattedData = response.data.map(booking => ({
        ...booking,
        startDate: new Date(booking.start_time),
        endDate: new Date(booking.end_time)
      }));
      
      if (props.room === 9) {
        const approvedBookings = formattedData.filter((booking) => booking.state === 'approved');
        setSchedulerData(approvedBookings)
      } else {
        setSchedulerData(formattedData)
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
    }
  };

  useEffect(() => {
    if (selectedRoom) {
      const selected = (props.room === 9 ? meetingRooms : hotDesks).find(
        (room) => props.room === 9
          ? `${room.room_location}-${room.room_number}` === selectedRoom
          : `${room.hotdesk_location} Floor ${room.hotdesk_floor}: Hotdesk ${room.hotdesk_number}` === selectedRoom
      );
  
      if (selected) {
        const id = (props.room === 9 ? selected.room_id : selected.hotdesk_id)
        setRoomOrHotdeskId(id)
        fetchBookingsById(id);
      }
    }
  }, [selectedRoom, meetingRooms, hotDesks, props.room]);

  const CustomAppointments = ({ style, ...restProps }) => {
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

  const handleStartTimeChange = (newValue) => {
    setUpdatedStartTime(newValue)
    if(updatedEndTime) {
      if(newValue.isAfter(updatedEndTime)) {
        setDisableSubmitBtn(true)
      } else {
        setDisableSubmitBtn(false)
      }
    } else {
      if(newValue.isAfter(currentEndTime)) {
        setDisableSubmitBtn(true)
      } else {
        setDisableSubmitBtn(false)
      }
    }
  }

  const handleEndTimeChange = (newValue) => {
    if (updatedStartTime && newValue && newValue.isBefore(updatedStartTime)) {
      setDisableSubmitBtn(true);
    } else {
      setDisableSubmitBtn(false);
      setUpdatedEndTime(newValue);
    }
  }

  return (
    <>
			<Drawer open={props.open} onClose={() => props.onClose()}>
				<DrawerBody>
					<HeaderContainer>
						<DrawerTitle
							id="modal-title"
							variant="h5"
							component="h2"
						>
							{props.title}
						</DrawerTitle>
						<Exit>
							<ExitIcon onClick={() => props.onClose()}><CloseIcon /></ExitIcon>
						</Exit>
					</HeaderContainer>
					<HeadingSeperator></HeadingSeperator>
          <ColumnsContainer>
            <LeftColumn>
              <DrawerInfo>You are updating your booking for {props.bookingTitle} from {props.bookingStartTime} to {props.bookingEndTime}</DrawerInfo>
              <SearchBlock>
                <SearchBar
                  freeSolo
                  disableClearable
                  options={rooms}
                  defaultValue={props.bookingTitle}
                  onChange={(event, newValue) => setSelectedRoom(newValue)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={props.room === 9 ? "Select Room" : "Select Desk"}
                      InputProps={{
                        ...params.InputProps,
                        style: {paddingBottom: '10%',color: '#FFFFFF'}
                      }}
                      InputLabelProps={{ style: { color: '#FFFFFF', textAlign: 'center' }}}
                    />
                  )}
                />
              </SearchBlock>
              <DatePickerBox>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DemoContainer components={['DateTimePicker']}>
                    <CustomDateTimePicker 
                      label="Booking Start Time"
                      defaultValue={dayjs(currentStartTime)}
                      onChange={(newValue) => handleStartTimeChange(newValue)}
                      disablePast
                      format='DD MMM YYYY hh:mm A'
                      />
                    <CustomDateTimePicker
                      label="Booking End Time"
                      defaultValue={dayjs(currentEndTime)}
                      onChange={(newValue) => handleEndTimeChange(newValue)}
                      disablePast
                      minDateTime={updatedStartTime ? dayjs(updatedStartTime) : dayjs(currentStartTime)}
                      format='DD MMM YYYY hh:mm A'
                      />
                  </DemoContainer>
                </LocalizationProvider>
              </DatePickerBox>
              <ExitButton onClick={() => props.onClose()}>Cancel</ExitButton>
              <SubmitButton onClick={() => setOpenModal(true)} disabled={disableSubmitBtn}>Confirm</SubmitButton>
            </LeftColumn>
            <RightColumn>
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
            </RightColumn>
          </ColumnsContainer>
				</DrawerBody>
			</Drawer>
      <ErrorModal open={error} onClose={() => setError(false)}>{error}</ErrorModal>
      {!props.submitfunc && <>
      <BasicModal
        open={openModal}
        submitfunc={async () =>
          {
            setOpenModal(false)
            const isRoomAvailable = schedulerData.every(booking => {
              const bookingStartTime = new Date(booking.startDate);
              const bookingEndTime = new Date(booking.endDate);
              const newBookingStartTime = updatedStartTime.toDate();
              const newBookingEndTime = updatedEndTime.toDate();

              // console.log("bookingStartTime", bookingStartTime);
              // console.log("bookingEndTime", bookingEndTime);
              // console.log("newBookingStartTime", newBookingStartTime);
              // console.log("newBookingEndTime", newBookingEndTime);

              const startInBetween = (compareAsc(newBookingStartTime, bookingStartTime) === 1 && compareAsc(newBookingStartTime, bookingEndTime) === -1)
              const endInBetween = (compareAsc(newBookingEndTime, bookingStartTime) === 1 && compareAsc(newBookingEndTime, bookingEndTime) === -1)
              const bookingStartInBetween = (compareAsc(bookingStartTime, newBookingStartTime) === 1 && compareAsc(bookingStartTime, newBookingEndTime) === -1)
              const bookingEndInBetween = (compareAsc(bookingEndTime, newBookingStartTime) === 1 && compareAsc(bookingEndTime, newBookingEndTime) === -1)
              const sameStartAndEnd = (compareAsc(bookingStartTime, newBookingStartTime) === 0 && compareAsc(bookingEndTime, newBookingEndTime) === 0)
              return (!startInBetween && !endInBetween && !bookingStartInBetween && !bookingEndInBetween && !sameStartAndEnd);
            });

            // console.log("isRoomAvailable:", isRoomAvailable);

            if (isRoomAvailable) {
              const newBookingStartTime = updatedStartTime.toDate();
              const newBookingEndTime = updatedEndTime.toDate();
              const durationInMinutes = differenceInMinutes(newBookingEndTime, newBookingStartTime);
              if (durationInMinutes > 480) {
                setError('Cannot make a booking for more than 8 hours.');
                return;
              }
              const token = getToken()        
              try {
                const response = await axios.post('http://localhost:8000/api/edit-booking/', {
                  "booking_id" : bookingId,
                  "token" : token,
                  "start_time": format(updatedStartTime.toDate(), "yyyy-MM-dd HH:mm:ss"),
                  "end_time": format(updatedEndTime.toDate(), "yyyy-MM-dd HH:mm:ss"),
                  "room_or_hotdesk_id": roomOrHotdeskId,
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
              setError("This space is not available for the selected time slot. Please choose a different time.")
            }
          }}
        title={'Confirm Edit'}
        submitbtntext={'Confirm'}
        exitbtntext={'Exit'}
        issubmit={true}
        onClose={() => setOpenModal(false)}>
        Are you sure you want update your booking?
      </BasicModal>
      <BasicModal
        open={openModal2}
        title={'Edit Saved!'}
        exitbtntext={'Exit'}
        issubmit={false}
        onClose={() => {setOpenModal2(false); props.onClose()}}>
        Your booking has been updated
      </BasicModal>
      </>
      }
      {props.submitfunc && <>
          <BasicModal
            open={openModal}
            submitfunc={async () =>
              {
                setOpenModal(false)
                const user_id = getUserId();
                const fetchUserBookings = async () => {
                  try {
                    const response = await axios.post('http://localhost:8000/api/get-data/', {
                      "table": "booking",
                      "sort_type": 1,
                      "sort": {
                        "user_id": user_id
                      }
                    });
                    return response.data
                  } catch (error) {
                    console.error('Error fetching bookings data:', error);
                  }
                };

                const userBookings = await fetchUserBookings();
                const bookingMade = userBookings.some((booking) => booking.content_type_id === 11)

                if (bookingMade) {
                  setError('You already have an existing hotdesk booking. Multiple hotdesk bookings are not allowed.');
                  return;
                }

                const isDeskAvailable = schedulerData.every(booking => {
                  const bookingStartTime = new Date(booking.startDate);
                  const bookingEndTime = new Date(booking.endDate);
                  const newBookingStartTime = updatedStartTime.toDate();
                  const newBookingEndTime = updatedEndTime.toDate();
      
                  const startInBetween = (compareAsc(newBookingStartTime, bookingStartTime) === 1 && compareAsc(newBookingStartTime, bookingEndTime) === -1)
                  const endInBetween = (compareAsc(newBookingEndTime, bookingStartTime) === 1 && compareAsc(newBookingEndTime, bookingEndTime) === -1)
                  const bookingStartInBetween = (compareAsc(bookingStartTime, newBookingStartTime) === 1 && compareAsc(bookingStartTime, newBookingEndTime) === -1)
                  const bookingEndInBetween = (compareAsc(bookingEndTime, newBookingStartTime) === 1 && compareAsc(bookingEndTime, newBookingEndTime) === -1)
                  const sameStartAndEnd = (compareAsc(bookingStartTime, newBookingStartTime) === 0 && compareAsc(bookingEndTime, newBookingEndTime) === 0)
                  return (!startInBetween && !endInBetween && !bookingStartInBetween && !bookingEndInBetween && !sameStartAndEnd);
                });
    

                if (isDeskAvailable) {
                  try{
                    const token = getToken()
                    const user_id = getUserId();
                    const newBookingStartTime = updatedStartTime.toDate();
                    const newBookingEndTime = updatedEndTime.toDate();
                    const durationInMinutes = differenceInMinutes(newBookingEndTime, newBookingStartTime);
                    if (durationInMinutes > 480) {
                      setError('Cannot make a booking for more than 8 hours.');
                      return;
                    }
                    const response = await axios.post('http://localhost:8000/api/create-hotdesk-booking/', {
                      "token" : token,
                      "user_id" :  user_id,
                      "start_time": format(updatedStartTime.toDate(), "yyyy-MM-dd HH:mm:ss"),
                      "end_time": format(updatedEndTime.toDate(), "yyyy-MM-dd HH:mm:ss"),
                      "hotdesk_id": props.bookingId,
                    });
      
                    if (response.data.success) {
                      setOpenModal3(true)
                    } else {
                      setError('Something went wrong. Please try again!');
                    }
      
                  }
                  catch (error) {
                    console.error('An error occurred. Please try again.', error);
                  }
                } else {
                  setError('This space is not available for the selected time slot. Please choose a different time.')
                }
    
              }
            }
            title={'Confirm booking'}
            submitbtntext={'Confirm'}
            exitbtntext={'Exit'}
            issubmit={true}
            onClose={() => setOpenModal(false)}>
            Are you sure you want create a booking for booking for {props.bookingTitle} from {format(updatedStartTime.toDate(), "yyyy-MM-dd HH:mm:ss")} to {format(updatedEndTime.toDate(), "yyyy-MM-dd HH:mm:ss")}?
          </BasicModal>
          <BasicModal
          open={openModal3}
          title={'Booking Created'}
          exitbtntext={'Exit'}
          issubmit={false}
          onClose={() => {setOpenModal3(false); navigate('/dashboard')}}>
          Your booking has been created!
        </BasicModal>
        </>
      }

    </>
  )
}

export default EditDrawer