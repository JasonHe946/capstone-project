import React from 'react';
import { styled, Button } from '@mui/material';
// import { useNavigate } from 'react-router-dom';
import BasicModal from './BasicModal';

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

const BookingTitle = styled('div')({
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  color: '#FFFFFF',
  fontWeight: '400',
  fontSize: '2rem'
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

const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  const date = new Date(dateString);
  return date.toLocaleDateString(undefined, options);
};


function UserCard (props) {
  const [userInfoModal, setUserInfoModal] = React.useState(false);
  // const navigate = useNavigate();
  // const [error, setError] = React.useState(false);
  // const [expanded, setExpanded] = React.useState(false);


  return (
    <>
      <BookingFlexBox>
        <Booking>
          <BookingCardContainer>
            <div>
              <BookingInfo>
                <BookingHeadingContainer>
                  <BookingTitle>{props.username}</BookingTitle>
                  <BookingSubtitle>email: {props.email}</BookingSubtitle>
                </BookingHeadingContainer>
              </BookingInfo>
            </div>
            <BookingBtnContainer>
              <div><BookingBtn onClick={async () => { setUserInfoModal(true) }}>User Information</BookingBtn></div>
            </BookingBtnContainer>
          </BookingCardContainer>
        </Booking>
      </BookingFlexBox>

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
  
    </>
  )  
}


export default UserCard;