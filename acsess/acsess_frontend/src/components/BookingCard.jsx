import React from 'react';
import { styled, Button } from '@mui/material';
import ErrorModal from './ErrorModal';
import { useNavigate } from 'react-router-dom';
import CardActions from '@mui/material/CardActions';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import IconButton from '@mui/material/IconButton';
import Collapse from '@mui/material/Collapse';
import CardContent from '@mui/material/CardContent';
import BasicModal from './BasicModal';
import EditDrawer from './EditDrawer';
import format from 'date-fns/format';
import axios from 'axios';

const BookingFlexBox = styled('div')({
  width: '92vw',
  boxShadow: '0px 8px 20px 0px rgba(0, 0, 0, 0.15)',
  backgroundColor: '#252525',
  borderRadius: '5px',
  margin: '10px',
  transition: 'all .1s ease-in-out',
  '&:hover': {
    transform: 'scale(1.0025)',
    boxShadow: '0px 16px 40px 0px rgba(0, 0, 0, 0.15)',
    zIndex: 1,
  }
})

const Booking = styled('div') ({
  display: 'inline-block',
  width: '85vw',
  paddingTop: '1.3%',
  paddingLeft: '1.3%'
})

const ExpandButton = styled(CardActions)({
  float: 'right'
})

const BookingCardContainer = styled('div')({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  flexWrap: 'wrap',
  paddingBottom: '2%'

})

const BookingInfo = styled('div')({
  display: 'flex',
  flexDirection: 'row',
  flexWrap: 'wrap',
})

const BookingHeadingContainer = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  flexWrap: 'wrap',
  paddingLeft: '10px',
})

const BookingTitleStatusContainer = styled('div')({
  display: 'flex',
  flexDirection: 'row',
  flexWrap: 'wrap'
})

const BookingTitle = styled('div')({
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  color: '#FFFFFF',
  fontWeight: '400',
  fontSize: '2rem'
})


const PendingStatus = styled('div')({
  background: 'rgba(251, 115, 0, 0.4)',
  border: '1px solid #FB7300',
  marginTop: '10px',
  marginLeft: '10px',
  paddingTop: '5px',
  paddingBottom: '5px',
  textAlign: 'center',
  borderRadius: '50px',
  color: '#FB7300',
  width: '139px',
  height: '30px',
  fontSize: '0.8rem',
  fontWeight: '600'
})

const ApprovedStatus = styled(PendingStatus)({
  background: 'rgba(49, 65, 61, 0.4)',
  border: '1px solid #84B7AA',
  color: '#84B7AA'
})

const DeniedStatus = styled(PendingStatus)({
  background: 'rgba(255, 0, 0, 0.2)',
  border: '1px solid #FF8080',
  color: '#FF8080'
})


const ActiveStatus = styled(PendingStatus)({
  background: 'rgba(132, 183, 170, 1)',
  border: '1px solid #31413D',
  color: '#31413D'

})

const BookingSubtitle = styled('div')({
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  fontSize: '13px',
  textOverflow: 'ellipsis',
  color: '#828282',
  paddingBottom: '2%'
})


const BookingBtnContainer = styled('div')({
  height: '100%',
  display: 'flex',
  flexDirection: 'row',
  flexWrap: 'wrap',
})



const BookingBtn = styled(Button)({
  color: '#ffffff',
  '&:hover': {
    background: '#84B7AA',
    color: '#31413D'
  },
  "&:disabled": {
      color: "#5B5B5B"
    }
})

const Utilities = styled(CardContent)({
  marginLeft: '1%',
  color: '#ffffff'
})

const ExpandIcon = styled(ExpandMoreIcon)({
  color: '#ffffff'
})



const ExpandMore = styled((props) => {
  const { ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
}));


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

function getUserID() {
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


function BookingCard (props) {
  const navigate = useNavigate();
  const [error, setError] = React.useState(false);
  const [expanded, setExpanded] = React.useState(false);
  const [editBooking, setEditBooking] = React.useState(false)
  const [canelBookingModal, setCancelBookingModal] = React.useState(false);
  const [cancelConfirmation, setCancelConfirmation] = React.useState(false);
  const [approveBookingModal, setApproveBookingModal] = React.useState(false);
  const [denyBookingModal, setDenyBookingModal] = React.useState(false);

  const [successApproveModal, setSuccessApproveModal] = React.useState(false);
  const [errorActionModal, setErrorActionModal] = React.useState(false);
  const [errorDescription, setErrorDescription] = React.useState('');
  const [successDenyModal, setSuccessDenyModal] = React.useState(false);

  const [userInfoModal, setUserInfoModal] = React.useState(false);

  const [CheckInModal, setCheckInModal] = React.useState(false);
  const [CheckInModalSuccess, setCheckInModalSuccess] = React.useState(false);
  const [CheckInModalFail, setCheckInModalFail] = React.useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const handleApproveMeeting = async () => {
    try{
      const response = await axios.post('http://localhost:8000/api/admin-accept-or-deny-booking/', {
        "booking_id" : booking_id,
        "is_accepted" : true
      });

      if (response.data.success) {
        setSuccessApproveModal(true)
        setApproveBookingModal(false)
      } else {
        setErrorDescription('Something went wrong. Please try again!');
      }

    }
    catch (error) {
      const errorMessage = error.response.data.error;
      setErrorDescription(errorMessage)
      setErrorActionModal(true)
      setApproveBookingModal(false)
    }
  };

  const handleDenyMeeting = async () => {
    try{
      const response = await axios.post('http://localhost:8000/api/admin-accept-or-deny-booking/', {
        "booking_id" : booking_id,
        "is_accepted" : false
      });

      if (response.data.success) {
        setSuccessDenyModal(true)
        setDenyBookingModal(false)
      } else {
        setErrorDescription('Something went wrong. Please try again!');
      }

    }
    catch (error) {
      const errorMessage = error.response.data.error;
      setErrorDescription(errorMessage)
      setErrorActionModal(true)
      setDenyBookingModal(false)
    }    
  }

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, options);
  };

  const handleCheckIn = async () => {
    // Get the current local time
    const currentTime = new Date();

    // Calculate the time difference from the start time
    const timeDifference = props.startTime - currentTime;

    // If user is trying to check in between 5 minutes before start time and before end time:
    if (timeDifference <= 300000 && currentTime <= props.endTime) { // 300000 milliseconds = 5 minutes
      try{
        const response = await axios.post('http://localhost:8000/api/check-in/', {
          "booking_id" : booking_id,
        });

        if (response.data.success) {
          setCheckInModalSuccess(true)
          setCheckInModal(false)
        } else {
          setErrorDescription('Something went wrong. Please try again!');
        }

      }
      catch (error) {
        const errorMessage = error.response.data.error;
        setErrorDescription(errorMessage)
        setErrorActionModal(true)
        setCheckInModal(false)
      }
    } else {
      setCheckInModalFail(true)
      setCheckInModal(false)
      navigate('/dashboard')
    }
  };


  let RoomName, startDateTime, endDateTime, status, currDateTime, booking_id;

    RoomName = props.title;
    startDateTime = format(props.startTime, 'EEEE d MMM y hh:mm aa');
    endDateTime = format(props.endTime, 'EEEE d MMM y hh:mm aa');
    status = props.status;
    currDateTime = new Date();
    booking_id = props.id;


  return (
    <>
      <BookingFlexBox style={status === 'active' ? {background:'#D2CFCF'} : {}}>
        <Booking>
          <BookingCardContainer>
            <div>
              <BookingInfo>
                <BookingHeadingContainer>
                  <BookingTitleStatusContainer>
                    {
                      props.acsess !== 'user' ? (
                        <>
                          <BookingTitle style={status === 'active' ? {color:'#000000'} : {}}>{RoomName}</BookingTitle>
                          {status === 'pending' &&
                            <PendingStatus>Pending Approval</PendingStatus>
                          }
                          {status === 'approved' &&
                            <ApprovedStatus>Approved</ApprovedStatus>
                          }
                          {status === 'denied' &&
                            <DeniedStatus>Denied</DeniedStatus>
                          }
                          {status === 'active' && 
                            <ActiveStatus>Active</ActiveStatus>
                          }
                        </>
                      ) : (
                        <BookingTitle>{props.name}</BookingTitle>
                      )
                    }

   
                  </BookingTitleStatusContainer>
                  {
                    props.acsess !== 'user' ? (
                        <BookingSubtitle>{startDateTime} - {endDateTime}</BookingSubtitle>
                    ) : (
                      <BookingSubtitle>{props.role}: z{props.zID}</BookingSubtitle>
                    )
                  }
                </BookingHeadingContainer>
              </BookingInfo>
            </div>
            <BookingBtnContainer>
              {props.acsess === 'booking' && (
                <>
                <div><BookingBtn onClick={async () => { }} style={status === 'active' ? {color:'#000000'} : {}}>Map</BookingBtn></div>
                { status !== "active" &&
                  <div><BookingBtn disabled={currDateTime < startDateTime || currDateTime >= endDateTime || status === 'pending'} onClick={() => setCheckInModal(true)}>Check-In</BookingBtn></div>
                }
                <div><BookingBtn onClick={() => setEditBooking(true)} style={status === 'active' ? {color:'#000000'} : {}}>Edit</BookingBtn></div>
                <div><BookingBtn onClick={async () => {setCancelBookingModal(true)}} style={status === 'active' ? {color:'#000000'} : {}}>Cancel</BookingBtn></div>
                </>
              )}
              {props.acsess === 'request' && (<>
                <div><BookingBtn onClick={async () => { setUserInfoModal(true) }}>User</BookingBtn></div>
                <div><BookingBtn onClick={async () => { setApproveBookingModal(true) }}>Approve</BookingBtn></div>
                <div><BookingBtn onClick={async () => { setDenyBookingModal(true) }}>Deny</BookingBtn></div>
              </>)}
              {props.acsess === 'user' && (<>
                <div><BookingBtn onClick={async () => { }}>User Information</BookingBtn></div>
                <div><BookingBtn onClick={async () => { }}>Remove user</BookingBtn></div>
              </>)}
            </BookingBtnContainer>
          </BookingCardContainer>
        </Booking>
        {props.acsess !== 'user' && (
          <ExpandButton disableSpacing>
            <ExpandMore
              expand={expanded}
              onClick={handleExpandClick}
              aria-expanded={expanded}
              aria-label="show more"
            >
              <ExpandIcon style={status === 'active' ? {color:'#000000'} : {}}/>
            </ExpandMore>
          </ExpandButton>
        )}
        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <Utilities>
        
            <div style={status === 'active' ? {color:'#000000'} : {}}>Utilities:</div>
            <ul style={status === 'active' ? {color:'#000000'} : {}}>
                <li>Whiteboard/Chalkboard</li>
                <li>Projector</li>
                <li>Audio-Visual Equipment</li>
                <li>Power Outlets</li>
                <li>Seating Capacity</li>
                <li>Air Conditioning/Heating</li>
                <li>Accessibility Features (e.g., wheelchair access)</li>
                <li>Natural Lighting</li>
                <li>Conference Phone</li>
                <li>Printer/Scanner</li>
                <li>Refreshment Facilities (e.g., water dispenser, coffee machine)</li>
            </ul>
          </Utilities>
       </Collapse>
      </BookingFlexBox>
      <BasicModal 
        open={error} 
        onClose={() => setError(false)} 
        title={error} 
        issubmit={false} 
        exitBtnText={'Close'}
      >
        Invalid Token or Input
      </BasicModal>
      <EditDrawer
        open={editBooking}
        bookingTitle={RoomName}
        title={'Edit Booking'}
        bookingStartTime={format(props.startTime, 'd MMM y hh:mm aa')}
        bookingEndTime={format(props.endTime, 'd MMM y hh:mm aa')}
        onClose={() => {setEditBooking(false); window.location.reload()}}
        bookingId={props.id}
        key={props.id}
        room={props.room}
      />
      <ErrorModal open={error} onClose={() => setError(false)}>Invalid Token or Input</ErrorModal>
      <BasicModal
        open={canelBookingModal}
        submitfunc={async () =>
          {
            try{
              const token = getToken()
              const userId = getUserID()
              const response = await axios.post('http://localhost:8000/api/cancel-booking/', {
                "user_id": userId,
                "message": 'Successfully Canceled',
                "booking_id" : booking_id,
                "token" : token,
              });

              if (response.data.success) {
                setCancelConfirmation(true)
                setCancelBookingModal(false)
              } else {
                setErrorDescription('Something went wrong. Please try again!');
              }
            }
            catch (error) {
              const errorMessage = error.response.data.error;
              setErrorDescription(errorMessage)
              setErrorActionModal(true)
            }

          }}
        title={'Cancel Booking'}
        submitbtntext={'Confirm'}
        exitbtntext={'Exit'}
        issubmit={true}
        onClose={() => setCancelBookingModal(false)}>
        Are you sure you want to cancel your booking for <b>{RoomName}</b> at <b>{startDateTime}</b> - <b>{endDateTime}</b>?
      </BasicModal>
      <BasicModal
        open={cancelConfirmation}
        submitfunc={() =>
          {
            setCancelConfirmation(false)
            navigate('/booking')
          }}
        title={'Booking Canceled'}
        submitbtntext={'Confirm'}
        exitbtntext={'Exit'}
        issubmit={true}
        onClose={() => {
        { setCancelConfirmation(false)
          window.location.reload()
        }
        }}>
        Your booking has been succesfully canceled. Would you like to reschedule your booking?
      </BasicModal>
      <BasicModal
        open={approveBookingModal}
        submitfunc={handleApproveMeeting}
        title={'Approve Booking'}
        submitbtntext={'Confirm'}
        exitbtntext={'Cancel'}
        issubmit={true}
        onClose={() => setApproveBookingModal(false)}>
        Are you sure you want to <b>approve</b> the booking for <b>{RoomName}</b> at <b>{startDateTime}</b> - <b>{endDateTime}</b>?
      </BasicModal>
      <BasicModal
        open={successApproveModal}
        title={'Success'}
        exitbtntext={'Close'}
        issubmit={false}
        onClose={() => {
          setSuccessApproveModal(false)
          props.refreshData()
        }}>
        You have successfully approved the meeting!!
      </BasicModal>
      <BasicModal
        open={denyBookingModal}
        submitfunc={handleDenyMeeting}
        title={'Deny Booking'}
        submitbtntext={'Confirm'}
        exitbtntext={'Cancel'}
        issubmit={true}
        onClose={() => setDenyBookingModal(false)}>
        Are you sure you want to <b>deny</b> the booking for <b>{RoomName}</b> at <b>{startDateTime}</b> - <b>{endDateTime}</b>?
      </BasicModal>
      <BasicModal
        open={successDenyModal}
        title={'Success'}
        exitbtntext={'Close'}
        issubmit={false}
        onClose={() => {
          setSuccessDenyModal(false)
          props.refreshData()
        }}>
        You have successfully denied the meeting!!
      </BasicModal>
      <BasicModal 
        open={errorActionModal} 
        title={'Error handling booking!'}  
        onClose={() => setErrorActionModal(false)} 
        exitbtntext={'Cancel'} 
        issubmit={false}
      >
        <p> There was an error processing the booking: {errorDescription}</p>
      </BasicModal>
      <BasicModal 
        open={userInfoModal} 
        title={'User Details'}  
        onClose={() => setUserInfoModal(false)} 
        exitbtntext={'Close'} 
        issubmit={false}
      >
      <div><strong>Username:</strong> {props.currUserUsername}</div>
      <div><strong>Email:</strong> {props.currUserEmail}</div>
      <div><strong>Role:</strong> {props.currUserRole}</div>
      <div><strong>Date Joined:</strong> {formatDate(props.currUserDate)}</div>
      </BasicModal>
      <BasicModal
        open={CheckInModal}
        submitfunc={handleCheckIn}
        title={"At your workspace?"}
        submitbtntext={"Check In"}
        exitbtntext={"Cancel"}
        issubmit={true}
        onClose={() => setCheckInModal(false)}>
        Are you sure you want to Check-In at <b>{RoomName}</b>?
      </BasicModal>
      <BasicModal
        open={CheckInModalSuccess}
        title={"You are Checked-In!"}
        exitbtntext={"Close"}
        issubmit={false}
        onClose={() => 
        {
          setCheckInModalSuccess(false)
          props.refreshData()
        }}>
        Thank you for checking in!
      </BasicModal>
      <BasicModal
        open={CheckInModalFail}
        title={"Check In Failed"}
        exitbtntext={"Close"}
        issubmit={false}
        onClose={() => 
        {
          setCheckInModalFail(false)
        }}>
        You can only check in within 5 minutes before the booking start time.
      </BasicModal>
    </>
  )
}
  //  {/*
  //     Data needed
  //     - Room name
  //     - booking status
  //     - time and date of booking
  //     - utilitiy information
  //     - book status of the room on the day (for quick view timetable)
  //     - isMeetingRoom or isHotDeask

  //     Aspects needed:
  //     - heading for name
  //     - sub-heading for date time
  //     - styled div for status
  //     - if isMeetingRoom
  //       - 3 buttons (Check-In, Edit, cancel)
  //       - Check-in button disabled if not right time
  //       - modals for edit and cancel
  //       - edit is a modal or sidetab
  //     - else if isHotDesk (Map, Check-In, Edit, cancel)
  //       - 4 buttons
  //       - Check-in button disabled if not right time
  //       - modals for edit and cancel
  //       - edit is just in place on the quick view timetable

  //     functions needed(this sprint):
  //     - cancel meeting
  //     - edit meeting time (and day, for meeting room)
  //     - check acceptance?
  //     - get booking information for user
  //     - get user info
  //     */}
export default BookingCard;