// Sourced from https://mui.com/material-ui/react-app-bar/#responsive-app-bar-with-drawer
import * as React from 'react';
import {
  AppBar,
  Box,
  CssBaseline,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Toolbar,
  Typography,
  styled,
  InputAdornment,
} from '@mui/material';
import Button from '@mui/material/Button';
import MenuIcon from '@mui/icons-material/Menu';
import Menu from '@mui/material/Menu';
import Logout from './Logout';
import { useNavigate } from 'react-router-dom';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AddIcon from '@mui/icons-material/Add';
import LogoutIcon from '@mui/icons-material/Logout';
import BarChartIcon from '@mui/icons-material/BarChart';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { FormInput } from './ContactAdmin';
import BasicModal from './BasicModal';
import ErrorModal from './ErrorModal';
import axios from 'axios';

const drawerWidth = 240;

const StyledAppBar = styled(AppBar)({
  background:'#252525',
  color: 'white',
});

const StyledBoxDrawer = styled(Box)({
  textAlign: 'center',
  background: '#1C1C1C',
  height: '100%'
})

const StyledBoxMain = styled(Box)({
  p: 3
});

const StyledButton = styled(Button)({
  color: '#fff'
})

const StyledTypographyBigBrain = styled(Typography)({
  fontWeight: 560,
  flexGrow: 1,
  display: {
    xs: 'none',
    sm: 'block'
  },
  '&:hover': {
    cursor: 'pointer',
  }
});

const StyledTypography = styled(Typography)({
  fontWeight: 560,
  my: 2,
  paddingTop: '10px',
  paddingBottom: '10px',
  background: '#252525',
  color: '#ffffff',
  '&:hover': {
    cursor: 'pointer',
  }
});

const StyledListItemButton = styled(ListItemButton)({
  textAlign: 'center',
  color: '#ffffff',
  background: '#1C1C1C',
  '&:hover': {
    background: '#84B7AA',
    color: '#31413D'
  }
});

const StyledBox = styled(Box)({
  display: 'flex'
});

const Title1 = styled('span')({
  color: '#FC7202',
});

const FormContainer = styled('div')({
  height: '60vh',
  overflowY: 'auto',
  padding: '10px',
  display: 'flex',
  flexDirection: 'column',
  gap: '10px',
});

const StyledMenu = styled(Menu)({
  '& .MuiList-root': {
    background: "#252525", 
    color: "#FFFFFF",
    width: '300px',
  },
  '& .MuiListItem-root': {
    display: 'flex',
    justifyContent: 'center',
  },
})

const ChangePasswordButton = styled(Button)({
  marginTop: '10px',
  border: 'none',
  borderRadius: '50px',
  width: '70%',
  fontWeight: 'bold',
  backgroundColor: '#31413D',
  color: '#DCCFCF',
  alignSelf: 'center',
  justifySelf: 'center',
  '&:hover': {
    backgroundColor: '#FC7202',
    color: '#000',
    opacity: '0.9'
  },
})

const StyledIconButton = styled(IconButton)({
  color: '#DCCFCF',
});


function DrawerAppBar (props) {
  const navigate = useNavigate();
  const { window } = props;
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [userRole, setUserRole] = React.useState('')
  
  const [message, setMessage] = React.useState('')
  const [sendMesssageModal, setSendMessageModal] = React.useState(false)
  const [validMessage, setValidMessage] = React.useState(false)
  const [openConfirmationModal, setOpenConfirmationModal] = React.useState(false)
  const [error, setError] = React.useState(false)
  const [userData, setUserData] = React.useState([]);

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const [changePasswordModal, setChangePasswordModal] = React.useState(false)
  const [confirmChangePassword, setConfirmChangePassword] = React.useState(false)
  const [currentPassword, setCurrentPassword] = React.useState('')
  const [newPassword, setNewPassword] = React.useState('')
  const [confirmNewPassword, setConfirmNewPassword] = React.useState('')
  const [showCurrentPassword, setShowCurrentPassword] = React.useState(false)
  const [showNewPassword, setShowNewPassword] = React.useState(false)
  const [showConfirmNewPassword, setShowConfirmNewPassword] = React.useState(false)

  const [validPassword, setValidPassword] = React.useState(true)
  const [passwordsEqual, setPasswordsEqual] = React.useState(true)

  const handleClickShowPassword1 = () => setShowCurrentPassword((show) => !show);
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleClickShowPassword2 = () => setShowNewPassword((show) => !show);
  const handleClickShowPassword3 = () => setShowConfirmNewPassword((show) => !show);

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
  

  const handleDrawerToggle = () => {
    setMobileOpen((prevState) => !prevState);
  };

  const validateMessage = (message) => {
    if (message === '') {
      setValidMessage(false)
    } else {
      setValidMessage(true)
    }
    setMessage(message)
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

  React.useEffect(() => {
    setUserRole(getUserRole())

    const fetchUserData = async () => {
      const userId = getUserId()
      try {
        const response = await axios.post('http://localhost:8000/api/get-data/', {
          "table": "auth_user",
          "sort_type": 1,
          "sort": {
            id: userId
          }
        });
        const email = response.data[0].email
        const first_name = response.data[0].first_name
        const last_name = response.data[0].last_name
        const username = response.data[0].username
        setUserData({ email, first_name, last_name, username });
      } catch (error) {
        console.error('Error fetching meeting rooms data:', error);
      }
    }
    
    const awaitFetch = async () => {
      await fetchUserData();
    }

    awaitFetch();

  }, [])

  const drawer = (
    <StyledBoxDrawer onClick={handleDrawerToggle}>
      <StyledTypography
      variant="h6"
      aria-label="ACSESS"
      id="navlistLogoBtn"
      onClick={() => navigate('/dashboard')}>
        <div>
          A<Title1>CSE</Title1>SS
        </div>

      </StyledTypography>
      <Divider />
      <List>
          <ListItem disablePadding>
            <StyledListItemButton
            startIcon={<DashboardIcon />}
            aria-label="dashboard"
            id="navlistDashboardBtn"
            onClick={() => navigate('/dashboard')}>
              <ListItemText
              primary='Dashboard'/>
            </StyledListItemButton>
          </ListItem>
          {userRole === 'admin' ? 
            <ListItem disablePadding>
            <StyledListItemButton
            startIcon={<BarChartIcon />}
            aria-label='analytics'
            id='navListAnalyticsBtn'
            onClick={() => navigate('/analytics')}
            >
              <ListItemText primary='Analytics'/>
            </StyledListItemButton>
          </ListItem> : <></>
          }
          <ListItem disablePadding>
            <StyledListItemButton
            aria-label="create booking"
            id="navlistCreateBookingBtn"
            startIcon={<AddIcon />}
            onClick={ () => {props.onCreate(true); }}>
              <ListItemText primary='Create Booking' />
            </StyledListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <StyledListItemButton
              aria-label='contact admin'
              id='navListContactBtn'
              startIcon={<MailOutlineIcon />}
              onClick={() => setSendMessageModal(true)}
            >
              <ListItemText primary='Contact Admin'/>
            </StyledListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <StyledListItemButton
            startIcon={<LogoutIcon />}
            id="navlistLogoutBtn"
            onClick={() => {
              Logout();
              navigate('/');
            }}>
              <ListItemText primary='Sign out' />
            </StyledListItemButton>
          </ListItem>
      </List>
    </StyledBoxDrawer>
  );

  const container = window !== undefined ? () => window().document.body : undefined;

  return (
    <>
    <StyledBox>
      <CssBaseline />
      <StyledAppBar component="nav">
        <Toolbar>
          <IconButton
            id="openNavDrawerBtn"
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <StyledTypographyBigBrain
            variant="h6"
            component="div"
            aria-label="menu"
            id="navLogoBtn"
            onClick={() => navigate('/dashboard')}
          >
            A<Title1>CSE</Title1>SS
          </StyledTypographyBigBrain>
          <Box sx={{ display: { xs: 'none', sm: 'block' }}}>
              <StyledButton
              aria-label="dashboard"
              id="navDeshboardBtn"
              startIcon={<DashboardIcon />}
              onClick={() => navigate('/dashboard')}>
                Dashboard
              </StyledButton>
              {userRole === 'admin' ? 
                <StyledButton
                aria-label="analytics"
                id="navDeshboardBtn"
                startIcon={<BarChartIcon />}
                onClick={() => navigate('/analytics')}>
                  Analytics
                </StyledButton> : <></>
              }
              <StyledButton
              aria-label="create booking"
              startIcon={<AddIcon />}
              id="navCreateBookingBtn"
              onClick={ () => navigate('/booking')}>
              Create Booking
              </StyledButton>
              <StyledButton
              aria-label="contact admin"
              startIcon={<MailOutlineIcon />}
              id="navContactAdminBtn"
              onClick={() => setSendMessageModal(true)}
              >
              Contact Admin
              </StyledButton>
              <StyledButton
                id="profile-nav-button"
                aria-controls={open ? 'profile-nav-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                onClick={handleClick}
                startIcon={<AccountCircleIcon />}
              >
                Your Profile
              </StyledButton>
              <StyledMenu
                id="profile-nav-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                  'aria-labelledby': 'profile-nav-button',
                }}
              >
                <List>
                  <ListItem>
                    <ListItemText><b>First name:</b> {userData.first_name}</ListItemText>
                  </ListItem>
                  <ListItem>
                    <ListItemText><b>Last name:</b> {userData.last_name}</ListItemText>
                  </ListItem>
                  <ListItem>
                    <ListItemText><b>Username:</b> {userData.username}</ListItemText>
                  </ListItem>
                  <ListItem>
                    <ListItemText><b>Email:</b> {userData.email}</ListItemText>
                  </ListItem>
                  <ListItem>
                    <ChangePasswordButton
                      onClick={() => setChangePasswordModal(true)}
                    >
                      Change Password
                    </ChangePasswordButton>
                  </ListItem>
                </List>
              </StyledMenu>
              <StyledButton
              aria-label="logout"
              id="navLogoutBtn"
              startIcon={<LogoutIcon />}
              onClick={() => {
                Logout();
                navigate('/');
              }}>
                Sign Out
              </StyledButton>
          </Box>
        </Toolbar>
      </StyledAppBar>
      <Box component="nav">
        <Drawer
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
        >
          {drawer}
        </Drawer>
      </Box>
      <StyledBoxMain component="main">
        <Toolbar />
      </StyledBoxMain>
    </StyledBox>
    <BasicModal
      open={sendMesssageModal}
      title={'Contact Admin'}
      submitfunc={
        async () => {
          if (!validMessage || message.trim() === '') {
            setValidMessage(false);
            alert("Please enter a valid message")
            setSendMessageModal(true)
            return;
          }
            try {
              const token = getToken()
              const user_id = getUserId();
              const response = await axios.post('http://localhost:8000/api/help/', {
                "message": message,
                "token" : token,
                "uid": user_id
              });                
              if (response.data.success) {
                setSendMessageModal(false)
                setOpenConfirmationModal(true)
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
      Please write a message for the admins.
      <FormContainer style={{height: '175px'}}>
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
          rows={4}
        />
      </FormContainer>
    </BasicModal>
    <BasicModal
      open={openConfirmationModal}
      title={'Message Sent'}
      submitbtntext={'Confirm'}
      exitbtntext={'Close'}        
      issubmit={false}
      onClose={() => {setOpenConfirmationModal(false)}}
    >
      Your message has been succesfully sent to the admin.
    </BasicModal>
    <BasicModal
      open={changePasswordModal}
      title={'Change Password'}
      submitbtntext={'Confirm'}
      exitbtntext={'Close'}
      issubmit={true}
      onClose={() => setChangePasswordModal(false)}
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
            const user_id = getUserId();
            const response = await axios.post('http://localhost:8000/api/change-password/', {
              "uid": user_id,
              "current_password": currentPassword,
              "new_password": confirmNewPassword
            });                
            if (response.data.success) {
              setChangePasswordModal(false)
              setConfirmChangePassword(true)
            } else if (response.data.error) {
              setError(response.data.error);
            }
          }
          catch (error) {
            if (error.response.data.error === 'Current password is incorrect') {
              setError('Current password is incorrect')
            } else {
              console.error('An error occurred. Please try again.', error);
            }
          }
        }
      }
    >
      Please enter your current and new password to change your account password. <br /><br />
      <FormContainer style={{height: '300px'}}>
        <FormInput
          required
          label="Current Password"
          name="current password"
          id="current-password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          variant="outlined"
          fullWidth
          type={showCurrentPassword ? 'text' : 'password'}
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
                  {showCurrentPassword ? <VisibilityOff /> : <Visibility />}
                </StyledIconButton>
              </InputAdornment>
            )
          }}
        />
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
      Your password has been changed successfully.
    </BasicModal>
    <ErrorModal open={error} onClose={() => setError(false)}>{error}</ErrorModal>
    </>
  );
}

export default DrawerAppBar;
