import React from 'react';
import {
  styled,
  Button,
  TextField
} from '@mui/material';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import BasicModal from './BasicModal';
// import manageTokenSet from '../helpers/Global.jsx'
import { useNavigate } from 'react-router-dom';
import validator from 'email-validator';
import logo from '../assets/logo.png';
import axios from 'axios';

const Registration = styled('div')({
  height: '100vh',
  width: '100vw',
  fontFamily: '"Poppins", "Arial", "Helvetica Neue", sans-serif',
  border: 'none',
  backgroundColor: '#1C1C1C',
});

const RegistrationContainer = styled('div')({
  display: 'flex',
  flexDirection: 'row',
  flexWrap: 'wrap',
  justifyContent: 'center',
  alignItems: 'center',
  width: '100%',
  height: '80%',
});

const RegistraionFlexbox = styled('div')({
  justifyContent: 'center',
  paddingTop: '20px',
  paddingBottom: '30px',
  paddingRight: '50px',
  paddingLeft: '35px',
  width: '600px',
  height: '640px',
  boxShadow: '0px 8px 20px 0px rgba(0, 0, 0, 0.15)',
  textAlign: 'left',
  backgroundColor: '#252525',
  zIndex: '2',
});

const RegistrationWrapper = styled('div')({
  padding: '0px 35px'
});

export const FormInputRow = styled('div')({
  paddingTop: '22px',
  fontSize: '12px',
});

const SubmitBtn = styled(Button)({
  marginTop: '25px',
  border: 'none',
  paddingTop: '10px',
  paddingBottom: '10px',
  paddingLeft: '20px',
  paddingRight: '20px',
  borderRadius: '50px',
  color: 'DCCFCF',
  backgroundColor: '#31413D',
  width: '100%',
	fontWeight: 'bold',
  '&:hover': {
		backgroundColor: '#FC7202',
		opacity: '80%',
		color: '#1C1C1C'
  },
  '&.Mui-disabled': {
    backgroundColor: '#666',
    color: '#333',
  }
});

const BackButton = styled(Button)({
  marginLeft: '25px',
	size: 'small',
  color: '#DCCFCF',
  '&:hover': {
    backgroundColor: '#DCCFCF',
    color: '#252525',
  }
});

export const FormInput = styled(TextField)({
  height: '70px',
  '& label.MuiFormLabel-root': {
    color: '#DCCFCF',
  },
  '& label.Mui-focused': {
    color: '#FC7202',
  },
  '& .MuiInputBase-input': {
    color: '#DCCFCF', 
  },
  '&:hover label': {
    color: '#FC7202',
  },
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: '#DCCFCF',
    },
    '&:hover fieldset': {
      borderColor: '#FC7202',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#FC7202',
    },
    backgroundColor: '#252525',
    borderRadius: '15px',
  },

  '& .MuiFormHelperText-root': {
    color: '#DCCFCF',
  },
	'& .MuiInputProps-root': {
    color: '#DCCFCF',
  },
});

const FormTitle = styled('h1')({
	color: '#DCCFCF',
})

export const Switch = styled(ToggleButton)({
	borderColor: '#31413D',
	color: '#DCCFCF',
	fontWeight: 'bold',
	backgroundColor: '#252525',
	borderRadius: '25px',
	'&.Mui-selected': {
    color: '#DCCFCF',
    backgroundColor: '#31413D',
		'&:hover': {
      color: '#DCCFCF',
      backgroundColor: '#31413D',
    },
  },
	'&:hover': {
    backgroundColor: '#FC7202',
    color: '#000',
  },

});

const DispayFlexContainer = styled('div')({
	display: 'flex',
})

const Logo = styled('img')({
    height: '7vmax',
    width: '7vmax',
    paddingLeft: '0.5vw',
    right: '-1vw',
});

const Title = styled('div')({
    fontSize: '2.7vmax',
    paddingTop: '2vmax',
    display: 'inline-flex',
    fontWeight: 'bolder',
});

const Title1 = styled('div')({
    color: '#DCCFCF',
});

const Title2 = styled('div')({
    color: '#FC7202',
});

const Eclipse = styled('div')({
	position: 'absolute',
	background: 'linear-gradient(180deg, #49d3e8 0%, #FB7300 100%)',
  borderRadius: '40px',
	transform: 'rotate(131.28deg)',
	opacity: '50%',
	width: '14vmax',
	height: '14vmax',
	filter: 'blur(8vh)',
  zIndex: '1',
  top: '5%',
  left: '5%',
})


const Rectangle = styled('div')({
	position: 'absolute',
	background: 'linear-gradient(90deg, #4fc7ec 0%, 15%, #FB7300 40%, 85% ,#4fc7ec 100%)',
	opacity: '50%',
	width: '80vw',
	height: '20vmin',
	top: '60%',
	left: '10%',
	filter: 'blur(10vh)',
  zIndex: '1',
})

function ContactAdmin () {
  const navigate = useNavigate();
  const [email, setEmail] = React.useState('');
	const [validEmail, setValidEmail] = React.useState(true)
  const [name, setName] = React.useState('');
  const [validName, setValidName] = React.useState(true)
	const [zid, setZid] = React.useState('');
	const [validZid, setValidZid] = React.useState(true)
	const [role, setRole] = React.useState('student');
	const [message, setMessage] = React.useState('');
  const [error, setError] = React.useState('');
  const [success, setSuccess] = React.useState('')

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

	const navigateLoginPage = () => {
		navigate('/login');
	}

	const handleRoleChange = () => {
		if (role === 'student') {
			setRole('staff')
		} else {
			setRole('student')
		}
	}

  const contactAdmin = async (e) => {
    e.preventDefault();

    if (!name || !email || !zid) {
      setValidName(name);
      setValidEmail(email);
      setValidZid(zid);
      return;
    }

    try {
      const response = await axios.post('http://localhost:8000/api/contact-admin/', {
          email,
          zid,
          name,
          role,
          message
      });

      if (response.data.success) {
          navigate('/');
          setSuccess('Your information has been sent to a CSE Admin!')
      } else {
          setError('Something went wrong. Please try again!');
      }
    } catch (error) {
      console.error('An error occurred. Please try again.', error);
      setError('An error occurred. Please try again.');
    }

  }

  const handleSuccess = () => {
    setSuccess(false);
    navigate('/')
  }

  return (
    <>
      <Registration>

				<DispayFlexContainer>
          <Logo src={logo} alt="Logo" />
          <Title>
            <Title1>A</Title1>
            <Title2>CSE</Title2>
            <Title1>SS</Title1>
          </Title>
        </DispayFlexContainer>

        <DispayFlexContainer>
        <Eclipse></Eclipse>
				<Rectangle></Rectangle>
        </DispayFlexContainer>

        <RegistrationContainer>
          <RegistraionFlexbox>
					<BackButton 
              startIcon={<KeyboardDoubleArrowLeftIcon />}
              onClick={navigateLoginPage}
            >
              Back
            </BackButton>
            <RegistrationWrapper>
              <FormTitle>Contact Admin</FormTitle>
              <form>
                
                <div>
                  <FormInputRow>
                    <FormInput
                        required
                        label="UNSW Staff/Student Email"
                        type='email'
                        id="email"
                        value={email}
                        onChange={(e) => validateEmail(e.target.value)}
                        variant="outlined"
                        fullWidth
												helperText={(validEmail) ? '' : 'Please enter a valid email'}
                    />
                  </FormInputRow>
                </div>
								
								<div>
									<FormInputRow>
										<FormInput 
											required
											label="zID"
											id="zid"
											value={zid}
											onChange={(e) => validateZid(e.target.value)}
											variant='outlined'
											fullWidth
											helperText={(validZid) ? '' : `Please enter zID in the form 'z1234567'`}
										/>
									</FormInputRow>
								</div>

								<div>
                  <FormInputRow>
                      <FormInput
                        required
                        label="Name"
                        id="name"
                        value={name}
                        onChange={(e) => validateName(e.target.value)}
                        helperText={(validName) ? '' : `Field cannot be empty`}
                        variant="outlined"
                        fullWidth
                      />
                  </FormInputRow>
                </div>
								
								<div>
									<FormInputRow>
										<ToggleButtonGroup
											exclusive
											value={role}
											onChange={handleRoleChange}
											fullWidth
										>
											<Switch value="student">Student</Switch>
											<Switch value="staff">Staff</Switch>
										</ToggleButtonGroup>
									</FormInputRow>
								</div>

								<div>
									<FormInputRow>
										<FormInput
											label="Message"
											multiline
											rows={2}
											fullWidth
											value={message}
											onChange={(e) => setMessage(e.target.value)}
											variant='outlined'
										>

										</FormInput>
									</FormInputRow>
								</div>
                
								<div>
                <SubmitBtn
                  variant="contained"
                  id="send"
                  disabled={!validEmail || !validZid || !validName}
                  onClick={contactAdmin}  
                >
                    Send
                </SubmitBtn>
                </div>
              </form>
            </RegistrationWrapper>
          </RegistraionFlexbox>
        </RegistrationContainer>
      </Registration>
      <BasicModal
        open={error}
        onClose={() => setError(false)}
        title={'Error'}
        issubmit={false}
        exitbtntext={'Close'}
      >
        {error}
      </BasicModal>
      <BasicModal
        open={success}
        onClose={handleSuccess}
        title={'Success'}
        issubmit={false}
        exitbtntext={'Close'}
      >
        {success}
      </BasicModal>
    </>
  )
}

export default ContactAdmin;
