import React from 'react';
import {
  styled,
  Button,
  TextField,
  InputAdornment,
  IconButton
} from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import BasicModal from './BasicModal';
import logo from '../assets/logo.png';
import Typewriter from 'typewriter-effect';
import { useNavigate } from 'react-router-dom';
import validator from 'email-validator';
import axios from 'axios';

const LoginBackground = styled('div')({
  backgroundColor: '#1C1C1C',
  height: '100vh',
  width: '100vw',
  fontFamily: '"Poppins", "Arial", "Helvetica Neue", sans-serif'
});

const LoginBody = styled('div')({
  display: 'flex',
  flexDirection: 'row',
  flexWrap: 'wrap-reverse',
  justifyContent: 'center',
  alignItems: 'center',
  paddingTop: '80px',
  paddingBottom: '80px',
  backgroundColor: '#1C1C1C'
});

const FormInputRow = styled('div')({
  paddingTop: '22px',
  fontSize: '12px'
})

const LoginFlexBox = styled('div')({
  justifyContent: 'center',
  padding: '48px',
  width: '460px',
  height: '468px',
  boxShadow: '0px 8px 20px 0px rgba(0, 0, 0, 0.15)'
});

const LoginBox = styled(LoginFlexBox)({
  backgroundColor: '#252525',
  color: '#DCCFCF'
});

const RegistrationBox = styled(LoginFlexBox)({
  backgroundColor: '#1E1E1E',
  textAlign: 'center',
  display: 'flex',
  alignItems: 'center',
  position: 'relative',
})

const FormInput = styled(TextField)({
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
});

const SubmitButton = styled(Button)({
  marginTop: '35px',
  background: 'linear-gradient(to bottom right, #f7595a, #f35586)',
  border: 'none',
  paddingTop: '10px',
  paddingBottom: '10px',
  paddingLeft: '20px',
  paddingRight: '20px',
  borderRadius: '50px',
  color: '#DCCFCF',
  width: '100%'
})

const SignInButton = styled(SubmitButton)({
	fontWeight: 'bold',
  marginTop: '25px',
	background: '#31413D',
	color: '#DCCFCF',
	'&:hover': {
		backgroundColor: '#FC7202',
		opacity: '80%',
    color: '#000'
  },
  '&.Mui-disabled': {
    backgroundColor: '#666',
    color: '#333',
  }
})

const ContactAdminButton = styled(SubmitButton)({
  background: 'none',
  color: '#DCCFCF',
  border: '1px solid #fff',
  borderRadius: '50px',
  width: '175px',
	fontWeight: 'bold',
  '&:hover': {
    color: '#000',
    border: '1px solid #FC7202',
    background: '#FC7202'
  },
})

const SignInTitle = styled('h3')({
  paddingTop: '15px',
	fontSize: '3.5vmin'
})

const StyledText = styled('div')({
	color: '#DCCFCF',
  zIndex: '2',
})

const DispayFlexContainer = styled('div')({
	display: 'flex',
})

const Logo = styled('img')({
    height: '7vw',
    width: '7vw',
    paddingLeft: '0.5vw',
    right: '-1vw',
});

const Title = styled('div')({
    fontSize: '2.7vw',
    paddingTop: '2vw',
    display: 'inline-flex',
    fontWeight: 'bolder',
    color: '#DCCFCF'
});

const Title1 = styled('span')({
    color: '#FC7202',
});

const StyledIconButton = styled(IconButton)({
    color: '#DCCFCF',
});

const GradientBackground = styled('div')({
  background: 'linear-gradient(to bottom right, #FC7202 0%, 15%, #49D3E8 20%, 21%, #1E1E1E 75%, #49D3E8, #FC7202 90%)',
  height: '468px',
  width: '460px',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  filter: 'blur(40px)',
  opacity: '50%',
  position: 'absolute',
  zIndex: '1',
});

const BackButton = styled(Button)({
  size: 'small',
  color: '#DCCFCF',
  '&:hover': {
    background: '#DCCFCF',
    color: '#252525'
  },
})

const ForgotPasswordButton = styled(Button)({
  // marginTop: '20px',
  // backgroundColor: '#999999',
  // color: '#000',
  // '&:hover': {
  //   backgroundColor: '#FC7202',
  //   color: '#000',
  //   opacity: '0.9'
  // },
  color: '#999'
})

const FormContainer = styled('div')({
  height: '60vh',
  overflowY: 'auto',
  padding: '10px',
  display: 'flex',
  flexDirection: 'column',
  gap: '10px',
});


function setCookie(name, value, days) {
  let expires = "";
  if (days) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    expires = "; expires=" + date.toUTCString();
  }
  document.cookie = name + "=" + (value || "") + expires + "; path=/";
}

function Login () {
  const navigate = useNavigate();
  const [username, setusername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);

  const [openGetEmailModal, setOpenGetEmailModal] = React.useState(false)
  const [openGetOTPModal, setOpenGetOTPModal] = React.useState(false)
  const [openGetNewPasswordModal, setOpenGetNewPasswordModal] = React.useState(false)
  const [email, setEmail] = React.useState('')
  const [otp, setOtp] = React.useState('')
  const [validEmail, setValidEmail] = React.useState(false)
  const [newPassword, setNewPassword] = React.useState('')
  const [confirmNewPassword, setConfirmNewPassword] = React.useState('')
  const [showNewPassword, setShowNewPassword] = React.useState(false)
  const [showConfirmNewPassword, setShowConfirmNewPassword] = React.useState(false)
  const [validPassword, setValidPassword] = React.useState(true)
  const [passwordsEqual, setPasswordsEqual] = React.useState(true)
  const [confirmChangePassword, setConfirmChangePassword] = React.useState(false)
  
  
  const handleClickShowPassword1 = () => setShowPassword((show) => !show);
  const handleClickShowPassword2 = () => setShowNewPassword((show) => !show);
  const handleClickShowPassword3 = () => setShowConfirmNewPassword((show) => !show);
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };
  const navigateLandingPage = () => {
    navigate('/');
  }

  const handleEmailChange = (value) => {
    setEmail(value)
    if (validator.validate(value)) {
      setValidEmail(true)
    } else {
      setValidEmail(false)
    }
  }

  const handleNewPasswordChange = (value) =>  {
    setNewPassword(value)
    const hasMinimumLength = value.length >= 8;
    const hasLowercase = /[a-z]/.test(value);
    const hasUppercase = /[A-Z]/.test(value);
    const hasNumber = /[0-9]/.test(value);

    if (hasMinimumLength && hasLowercase && hasUppercase && hasNumber) {
      setValidPassword(true)
    } else {
      setValidPassword(false)
    }

    if (value === confirmNewPassword) {
      setPasswordsEqual(true)
    } else {
      setPasswordsEqual(false)
    }
  }

  const handleConfirmNewPasswordChange = (value) => {
    setConfirmNewPassword(value)
    if (value === newPassword && newPassword !== '') {
      setPasswordsEqual(true)
    } else {
      setPasswordsEqual(false)
    }
  }
  

  const login = async (e) => {
    e.preventDefault();

    try {
        const response = await axios.post('http://localhost:8000/api/login/', {
            username,
            password
        });

        if (response.data.success) {
            setCookie("token", response.data.token, 1)
            setCookie("user_id", response.data.user_id, 1)
            setCookie("role", response.data.role, 1)
            navigate('/dashboard');
        } else {
            setError('Invalid login credentials');
        }
    } catch (error) {
        if (error.response.statusText === 'Unauthorized') {
          setError('Invalid login credentials');
        } else {
          console.error('There was an error logging in!', error.response);
          setError('An error occurred. Please try again.');
        }
    }
};

  return (
    <>
      <LoginBackground>
				<DispayFlexContainer>
          <Logo src={logo} alt="Logo" />
          <Title>
            A<Title1>CSE</Title1>SS
          </Title>
        </DispayFlexContainer>

        <LoginBody>
          <LoginBox>
            <BackButton 
              startIcon={<KeyboardDoubleArrowLeftIcon />}
              onClick={navigateLandingPage}
            >
              Back
            </BackButton>
            <SignInTitle>Login</SignInTitle>
            <form>
              <FormInputRow>
                <FormInput
                  required
                  label="Username"
                  name="username"
                  id="username"
                  value={username}
                  onChange={(e) => setusername(e.target.value)}
                  variant="outlined"
                  fullWidth
                  type="username"
                /><br />
              </FormInputRow>
              <FormInputRow>
                <FormInput
                  required
                  label="Password"
                  name="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  variant="outlined"
                  fullWidth
                  type={showPassword ? 'text' : 'password'}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <StyledIconButton
                          disableRipple
                          disableFocusRipple
                          disableTouchRipple
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword1}
                          onMouseDown={handleMouseDownPassword}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </StyledIconButton>
                      </InputAdornment>
                    )
                  }}
                />
                <FormInputRow style={{paddingTop: '0px', display:'flex', justifyContent: 'flex-end'}}>
                  <ForgotPasswordButton
                    onClick={() => setOpenGetEmailModal(true)}
                  >
                    Forgot Password?
                  </ForgotPasswordButton>
                </FormInputRow>
                <br />
              </FormInputRow>
              <SignInButton
              name="signin"
              id="signin"
              onClick={login}
              >
                Sign in
              </SignInButton>
            </form>
          </LoginBox>
          <RegistrationBox>
            <GradientBackground />
            <StyledText>
              <h1>
                <Typewriter
                onInit={(typewriter) => {
                  typewriter
                    .typeString('Welcome to ACSESS')
                    .start();
                }}
                />
              </h1>
              <div>Don&apos;t have acsess yet?</div>
							<div>Contact an Admin</div>
              <ContactAdminButton
              id="signup"
              onClick={() => {
                navigate('/contact-admin');
              }}>
                Contact Admin
              </ContactAdminButton>
            </StyledText>
          </RegistrationBox>
        </LoginBody>
      </LoginBackground>
      <BasicModal 
        open={error}
        onClose={() => setError(false)}
        title={'Error'} 
        issubmit={false}
        exitbtntext={'Close'}
        submitbtntext={''}
        submitfunc={{}} 
      >
        {error}
      </BasicModal>

      <BasicModal
        open={openGetEmailModal}
        onClose={() => setOpenGetEmailModal(false)}
        title={'Reset Password'}
        issubmit={true}
        exitbtntext={'Close'}
        submitbtntext={'Submit'}
        submitfunc={
          async () => {
            try {
              const response = await axios.post('http://localhost:8000/api/reset-password/', {
                  "email": email,
                  "otp": '',
                  "password": ''
              });
              if (response.data.success) {
                setOpenGetEmailModal(false)
                setOpenGetOTPModal(true)
              } else {
                  setError('Invalid login credentials');
              }
            } catch (error) {
                console.error('There was an error logging in!', error);
                setOpenGetEmailModal(false)
                setOpenGetOTPModal(true)
            }
          }
        }
      >
        Please enter the email address associated with your Acsess account.
        <form>
          <FormInputRow>
            <FormInput
              required
              label="Email"
              name="email"
              id="email"
              value={email}
              onChange={(e) => handleEmailChange(e.target.value)}
              variant="outlined"
              fullWidth
              type="email"
              helperText={validEmail ? '' : 'Please enter a valid email address.'}
            /><br />
          </FormInputRow>
        </form>
      </BasicModal>
      <BasicModal
        open={openGetOTPModal}
        onClose={() => {setOpenGetOTPModal(false); setEmail(''); setOtp('')}}
        title={'Enter One Time Password'}
        issubmit={true}
        exitbtntext={'Close'}
        submitbtntext={'Submit'}
        submitfunc={
          async () => {
            try {
              const response = await axios.post('http://localhost:8000/api/reset-password/', {
                  "email": email,
                  "otp": otp,
                  "password": ''
              });
              if (response.data.success) {
                setOpenGetOTPModal(false)
                setOpenGetNewPasswordModal(true)
              } else {
                  setError('Invalid login credentials');
              }
            } catch (error) {
                console.error('There was an error logging in!', error);
                alert('Incorrect One Time Passowrd entered')
            }
          }
        }
      >
        If the email you provided is associated with a valid ACSESS account, we have sent an One Time Password to it. Please enter the One Time Password below.
        <form>
          <FormInputRow>
            <FormInput
              required
              label="One Time Password"
              name="otp"
              id="otp"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              variant="outlined"
              fullWidth
            /><br />
          </FormInputRow>
        </form>
      </BasicModal>
      <BasicModal
      open={openGetNewPasswordModal}
      title={'Change Password'}
      submitbtntext={'Confirm'}
      exitbtntext={'Close'}
      issubmit={true}
      onClose={() => setOpenGetNewPasswordModal(false)}
      submitfunc={
        async () => {
          if (!validPassword) {
            alert('Password must be at least 8 characters long and include at least one lowercase letter, one uppercase letter, and one number.')
            return
          } else if (!passwordsEqual) {
            alert(`Passwords don't match.`)
            return
          } 

          try {
            const response = await axios.post('http://localhost:8000/api/reset-password/', {
              "email": email,
              "otp": otp,
              "password": confirmNewPassword
            });                
            if (response.data.success) {
              setOpenGetNewPasswordModal(false)
              setConfirmChangePassword(true)
            }
          }
          catch (error) {
            console.error('An error occurred. Please try again.', error);
          }
        }
      }
    >
      Please enter your current and new password to change your account password. <br /><br />
      <FormContainer style={{height: '220px'}}>
        <FormInput
          required
          label="New Password"
          name="new password"
          id="new-password"
          value={newPassword}
          onChange={(e) => handleNewPasswordChange(e.target.value)}
          variant="outlined"
          fullWidth
          style={!validPassword ? {marginBottom: '60px'} : {}}
          type={showNewPassword ? 'text' : 'password'}
          helperText={validPassword ? '' : 'Password must be at least 8 characters long and include at least one lowercase letter, one uppercase letter, and one number.'}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <StyledIconButton
                  disableRipple
                  disableFocusRipple
                  disableTouchRipple
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword2}
                  onMouseDown={handleMouseDownPassword}
                  edge="end"
                >
                  {showNewPassword ? <VisibilityOff /> : <Visibility />}
                </StyledIconButton>
              </InputAdornment>
            )
          }}
        />
        <FormInput
          required
          label="Confirm New Password"
          name="confirm new password"
          id="confirm-new-password"
          value={confirmNewPassword}
          onChange={(e) => handleConfirmNewPasswordChange(e.target.value)}
          variant="outlined"
          fullWidth
          helperText={passwordsEqual ? '' : `Passwords don't match`}
          type={showConfirmNewPassword ? 'text' : 'password'}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <StyledIconButton
                  disableRipple
                  disableFocusRipple
                  disableTouchRipple
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword3}
                  onMouseDown={handleMouseDownPassword}
                  edge="end"
                >
                  {showConfirmNewPassword ? <VisibilityOff /> : <Visibility />}
                </StyledIconButton>
              </InputAdornment>
            )
          }}
        />
      </FormContainer>
    </BasicModal>
    <BasicModal
      open={confirmChangePassword}
      title={'Password Changed'}
      submitbtntext={'Confirm'}
      exitbtntext={'Close'}        
      issubmit={false}
      onClose={() => {setConfirmChangePassword(false)}}
    >
      Your password has been updated, please login using your new password.
    </BasicModal>


    </>
  )
}

export default Login;