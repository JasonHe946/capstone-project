import { Box, Modal, Typography, styled, Button } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';


const SubmitButton = styled(Button)({
  marginTop: '35px',
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
  flexBasis: '45%',
  '&:hover': {
    backgroundColor: '#FC7202',
    color: '#000',
    opacity: '0.9'
  },
})

const ModalBody = styled(Box)({
  position: 'relative',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  backgroundColor: '#252525',
  border: 'none',
  boxShadow: 24,
  p: 4,
  padding: '20px',
  fontFamily: '"Poppins", "Arial", "Helvetica Neue", sans-serif',
})

const Exit = styled('div')({
  textAlign: 'right',
})
const ExitIcon = styled('button')({
  color: '#FFFFFF',
  backgroundColor: 'transparent',
  border: 'none',
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

const ModalTitle = styled(Typography)({
  color: '#FFFFFF',
  fontWeight: 600
})

const ModalInfo = styled(Typography)({
  color: '#FFFFFF',
  marginTop: 20
})

const BtnContainer = styled('div')({
  display: 'flex',
  flexDirection: 'row',
  flexWrap: 'wrap',
  justifyContent: 'space-around',
  width: '360px',

})

const HeaderContainer = styled('div')({
  display: 'flex',
  flexDirection: 'row',
  flexWrap: 'wrap',
  justifyContent: 'space-between',
    
})

const HeadingSeperator = styled('hr')({
  width: '98%',
  borderColor: '#31413D',
  borderStyle: 'double'
  });
  
// Can submit in props:
// - title
// - submitfunc: "function for true case"
// - submitBtnText
// - exitBtnText
// - isSubmit: "boolean for 1 or 2 buttons cancel and submit"
function BasicModal (props) {
  return (
    <>
      <Modal id="basic-modal"
      {...props}
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
      >
      <ModalBody>
      <HeaderContainer>
        <ModalTitle
          id="modal-title"
          variant="h5"
          component="h2"
        >
          {props.title}
        </ModalTitle>
        <Exit>
          <ExitIcon onClick={props.onClose}><CloseIcon /></ExitIcon>
        </Exit>
      </HeaderContainer>
      <HeadingSeperator></HeadingSeperator>
        <ModalInfo
          id="modal-description" >
          {props.children}
        </ModalInfo>
        {props.issubmit ?  (
        <Exit>
          <BtnContainer>
            <ExitButton
              id="closeBtn"
              onClick={props.onClose}
            >
            {props.exitbtntext}</ExitButton>
            <SubmitButton
              id="confirmBtn"
              onClick={props.submitfunc}
              disabled={props.submitDisabled}
            >
              {props.submitbtntext}
            </SubmitButton>
          </BtnContainer>
        </Exit>) : (
        <Exit>
          <SubmitButton
          id="closeBtn"
          onClick={props.onClose}
          >
          {props.exitbtntext}
          </SubmitButton>
        </Exit>
        )}
      </ModalBody>
      </Modal>
    </>
  );
}

export default BasicModal;
