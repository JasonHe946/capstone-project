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
})

const Error = styled(Box)({
  position: 'relative',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  backgroundColor: '#DCCFCF',
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
  color: 'black',
  backgroundColor: 'transparent',
  border: 'none',
})
const ExitButton = styled(SubmitButton)({
  backgroundColor: '#31413D',
  color: '#DCCFCF',
  fontWeight: 'bold',
  '&:hover': {
    backgroundColor: '#FC7202',
    color: '#000',
    opacity: '0.9'
  },
})

const ErrorTitle = styled(Typography)({
  fontWeight: 600
})

const ErrorInfo = styled(Typography)({
  marginTop: 20
})

function ErrorModal (props) {
  return (
    <>
        <Modal id="error-modal"
        {...props}
        aria-labelledby="error-modal-title"
        aria-describedby="error-modal-description"
        >
        <Error>
            <Exit>
              <ExitIcon onClick={props.onClose}><CloseIcon /></ExitIcon>
            </Exit>
            <ErrorTitle
              id="error-modal-title"
              variant="h6"
              component="h2"
            >
              {(props.type === 'success') ? 'Success' : 'Error'}
            </ErrorTitle>
            <ErrorInfo
              id="error-modal-description" >
              {props.children}
            </ErrorInfo>
            <Exit>
              <ExitButton
              id="closeBtn"
              onClick={props.onClose}
            >
              Close
            </ExitButton>
            </Exit>
        </Error>
        </Modal>
    </>
  );
}

export default ErrorModal;