import React, { useState, useEffect } from 'react';

import DrawerAppBar from './Nav';
import ErrorModal from './ErrorModal';
import { styled, Button, Box} from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import TextField from '@mui/material/TextField';
import Paper from "@mui/material/Paper";
import WorkspaceCard from './WorkspaceCard';
import allBuildingBannerImg from '../assets/allBuildings.jpg';
import axios from 'axios'
import Menu from '@mui/material/Menu';
import Checkbox from '@mui/material/Checkbox';
import Slider from '@mui/material/Slider';
import MenuItem from '@mui/material/MenuItem';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs from 'dayjs';
import { CustomDateTimePicker } from './BookingPage';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';

const StyledFormControlLabel = styled(FormControlLabel)(() => ({
  '& .MuiFormControlLabel-label': {
    fontSize: '0.85rem', // Adjust the font size here
    color: '#FFFFFF', // You can set a default color or use theme color
  },
  '& .MuiSvgIcon-root': {
    fontSize: 18, // Adjust the checkbox icon size here
    borderRadius: '2px',
    border: '1px solid #999999', // Border color for the checkbox (BIG)
    backgroundColor: '#252525', // Change background color
  },
  '& .MuiCheckbox-root': {
    color: '#252525', // Colour for Checkbox Icon in unchecked State
  },
  '& .MuiCheckbox-root.Mui-checked .MuiSvgIcon-root': {
    backgroundColor: '#FC7202', // Background color when checked
    border: '1px solid #FC7202', // Border color when checked
  },
}));

// Reusable component that accepts a label as a prop
const CustomCheckbox = ({ label, checked, onChange, name }) => {
  return (
    <StyledFormControlLabel
      control={<Checkbox checked={checked} onChange={onChange} name={name} style ={{
        color: "#252525",
      }}/>}
      label={label}
    />
  );
};

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
  backgroundColor: '#999999',
  color: '#DCCFCF',
  flexBasis: '45%',
  '&:hover': {
    backgroundColor: '#FC7202',
    color: '#000',
    opacity: '0.9'
  },
})

const ClearButton = styled(SubmitButton)({
  border: '1px solid #FFFFFF', // Adding border and setting color
  borderColor: '#FFFFFF',
  backgroundColor: '#31413D',
  color: '#DCCFCF',
  '&:hover': {
    backgroundColor: '#FC7202',
    color: '#000',
    opacity: '0.9'
  },
})

const FilterMenu = styled(Menu)({
  '& .MuiPaper-root': {
    backgroundColor: '#31413D', // Set background color to match your design
    color: '#FFFFFF',
    borderRadius: '12px', // Rounded corners
  },
  '& .MuiList-root': {
    backgroundColor: '#31413D', // Same background color to ensure consistent look
    padding: '16px', // Optional: adjust padding if needed
  },
});

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
  paddingLeft: '2vw',
  paddingRight: '2vw',
});
const DashboardSubHeading = styled(DashboardHeading)({
  fontSize: '2.5rem',
  fontWeight: '600',
  color: '#FFFFFF',
  paddingLeft: '2vw',
  paddingRight: '2vw',
  maxWidth: 'fit-content',
  marginLeft: 'auto',
  marginRight: 'auto'
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
  width: '92vw',
  overflowY: 'auto'
});
  

const AdminAutocomplete = styled(Autocomplete)({
  width: '100%',
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

const FilterViewBookingsContainer = styled('div')({
  width: '92vw',
  margin: 'auto',
  display: 'flex',
  flexDirection: 'row',
  flexWrap: 'wrap',
  justifyContent: 'space-between',
  marginTop: '1%',
});

const FilterContainer = styled('div')({
  display: 'flex',
  flexDirection: 'row',
  flexWrap: 'wrap',
  justifyContent: 'space-between',
});

const SearchBlock = styled('div')({
  border: '1px solid #31413D',
  borderRadius: '50px',
  zIndex: '900',
  width: '400px'
});

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
});

const FilterIcon = styled(FilterAltIcon)({
  paddingRight: '4%'
})

export const DatePickerBox = styled(Box)({
  minHeight: '150px'
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
  }
})

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

const marks = [
  {
    value: 10,
    label: '10',
  },
  {
    value: 20,
    label: '20',
  },
  {
    value: 30,
    label: '30',
  },
  {
    value: 40,
    label: '40',
  },
  {
    value: 50,
    label: '50',
  },
  {
    value: 60,
    label: '60',
  },
];

function valuetext(value) {
  return `${value}`;
}


function Booking () {

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

  const [userRole, setUserRole] = React.useState(getUserRole())
  const [meetingRooms, setMeetingRooms] = React.useState([]);
  const [hotDesks, setHotDesks] = React.useState([]);
  const [error, setError] = React.useState(false);
  const [qstAdded, setqstAdded] = React.useState(false);
  const [workspaceType, setWorkspaceType] = React.useState( userRole === 'student' ? 'Hot Desks' : 'Meeting Rooms');
  const [filterStr, setFilterStr] = React.useState('');
  const [filterOpen, setFilterOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [sliderValue, setSliderValue] = useState(10);
  const [checkedItems, setCheckedItems] = useState({
    whiteboard: false,
    projector: false,
    computer: false,
    microphone: false,
    monitor: false,
  });

  const [updatedStartTime, setUpdatedStartTime] = React.useState(dayjs(d))
  const [updatedEndTime, setUpdatedEndTime] = React.useState(dayjs(d1))
	// const [qstAdded, setqstAdded] = React.useState(false);
	const [disableButton, setDisableButton] = React.useState(false)
  const [allCurrBookings, setAllCurrBookings] = React.useState([]);
  const [timeFilterApplied, setTimeFilterApplied] = useState(false);

  //get work areas
  // React.useEffect(() => {
  //   axios.get('http://localhost:8000/api/newPage/')
  //     .then(response => {
  //       setMeetingRooms(response.data.message);
  //     })
  //     .catch(error => {
  //       console.log(error);
  //     });
  //   axios.get('http://localhost:8000/api/newPage/')
  //     .then(response => {
  //       setHotDesks(response.data.message);
  //     })
  //     .catch(error => {
  //       console.log(error);
  //     });
  // }, []);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axios.post('http://localhost:8000/api/get-data/', {
          "table": "booking",
          "sort_type": 1,
          "sort": {}
        });
        const formattedData = response.data.map(booking => ({
          ...booking,
          startDate: new Date(booking.start_time),
          endDate: new Date(booking.end_time)
        }));
        const acceptedBookings = formattedData.filter(booking => booking.state === 'approved')
        
        setAllCurrBookings(acceptedBookings);
      } catch (error) {
        console.error('Error fetching hot desks data:', error);
        setError(true);
      }
    };
    fetchBookings();
    setUserRole(getUserRole())
  }, []);

  // ==============================Remove when properly implemented with backend====================
  // dummy data
  const UserData = {
    name: 'Mitchell Wang',
    zID: 5358496,
    role: 'staff'
  }
   // ==============================Remove when properly implemented with backend====================
   const defaultProps = {
    options: userRole === 'student' ? [{ title: 'Hot Desks' }] : [{ title: 'Meeting Rooms' }, { title: 'Hot Desks' }],
    getOptionLabel: (option) => option.title,
  };
  
  useEffect(() => {
    const fetchMeetingRooms = async () => {
      // console.log("Hello from fetch Meeting rooms")
      try {
        const response = await axios.post('http://localhost:8000/api/get-data/', {
          "table": "room",
          "sort_type": 1,
          "sort": {}
        });
        setMeetingRooms(response.data);
        // console.log(response.data)
      } catch (error) {
        console.error('Error fetching hot desks data:', error);
        setError(true);
      }
    };

    const fetchHotDesks = async () => {
      // console.log("Hello from fetch Hotdesks")
      try {
        const response = await axios.post('http://localhost:8000/api/get-data/', {
          "table": "hotdesk",
          "sort_type": 1,
          "sort": {}
        });
        
        setHotDesks(response.data);

      } catch (error) {
        console.error('Error fetching hot desks data:', error);
        // setError(true);
      }
    };

    fetchMeetingRooms();
    fetchHotDesks();
  }, []);

  const handleStartTimeChange = (newValue) => {
    setUpdatedStartTime(newValue);
    setTimeFilterApplied(true);
    if(newValue.isAfter(updatedEndTime)) {
      setDisableButton(true)
    } else {
      setDisableButton(false)
    }
  }

  const handleEndTimeChange = (newValue) => {
		setUpdatedEndTime(newValue);
    setTimeFilterApplied(true);
    if (newValue.isBefore(updatedStartTime)) {
      setDisableButton(true);
    } else {
      setDisableButton(false);
    }
  }
  

  const handleFilterButtonClick = (event) => {
    setAnchorEl(event.currentTarget)
    setFilterOpen(true);
  };

  const handleCloseMenu = () => {
    setFilterOpen(false);
    setAnchorEl(null);
  };

  const handleSliderChange = (event, newValue) => {
    setSliderValue(newValue);
  };

  const handleCheckboxChange = (event) => {
    setCheckedItems({
      ...checkedItems,
      [event.target.name]: event.target.checked,
    });
  };

  const handleClearFilter = () => {
    setCheckedItems({
      whiteboard: false,
      projector: false,
      computer: false,
      microphone: false,
      monitor: false,
    });
    setSliderValue(10);
    setUpdatedStartTime(dayjs(d));
    setUpdatedEndTime(dayjs(d1));
    setTimeFilterApplied(false);
  }

  const isRoomAvailable = (roomId, allCurrBookings, chosenStartDate, chosenEndDate) => {
    // Convert chosen dayjs objects to Date objects
    const chosenStartDateObj = chosenStartDate.toDate();
    const chosenEndDateObj = chosenEndDate.toDate();
  
    return !allCurrBookings.some(booking => {
      if (booking.object_id !== roomId) {
        return false;
      }
  
      // Check for overlapping bookings
      return (booking.startDate < chosenEndDateObj && chosenStartDateObj < booking.endDate);
    });
  };



  return (
    <DashboardBackground>
      <Heading>
        <DrawerAppBar isCreate={qstAdded} onCreate={(created) => { setqstAdded(created); }}/>
        <Banner>
          <BannerImg src={allBuildingBannerImg} alt='banner image of UNSW main walkway'/>
        </Banner>
        <DashboardSubHeading>Workspaces</DashboardSubHeading>
        { UserData.role !== 'student'
          ? (
            <AdminAutocomplete
            {...defaultProps}
            id="disable-close-on-select"
            disableClearable
            defaultValue={defaultProps.options[0]}
            onChange={(e) => {setWorkspaceType(e.target.textContent); console.log(e.target.textContent)}}
            PaperComponent={({ children }) => (
              <Paper sx={{ background: "#31413d", color: "#FFFFFF" }}>{children}</Paper>
            )}
            renderInput={(params) => (
              <HeadingAutocomplete {...params} id="admin-heading" label="Select Workspace:" variant="standard"
              InputProps={{...params.InputProps, disableUnderline: true, style: {  fontSize: '2.5rem', fontWeight: '600', color: '#FFFFFF'}}} 
              InputLabelProps={{ style: { color: '#FFFFFF', fontSize:'20px' }}}/>
            )}
          />
            )
          : (
            //show this user is not an admin
            <DashboardHeading>Hot Desks</DashboardHeading>
          )}

        <HeadingSeperator></HeadingSeperator>
        
      </Heading>
      <FilterViewBookingsContainer>
        <FilterContainer>
          <SearchBlock>
          { workspaceType === 'Meeting Rooms'
            ? (
              <SearchBar
                freeSolo
                options= {meetingRooms.map((workspace) => workspace.room_location + ' ' + workspace.room_number)} //{acsess === 'Current Bookings' ? bookingData.map((booking) => booking.title) : requestData.map((request) => request.title)}
                onChange={(e) => {setFilterStr(e.target.textContent);}}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Search input"
                    InputProps={{
                      ...params.InputProps,
                      style: {color: '#FFFFFF'}
                    }}
                    InputLabelProps={{ style: { color: '#FFFFFF', textAlign: 'center' }}}
                  />
                )}
              />
            )
            : (
              <SearchBar
                freeSolo
                options= {hotDesks.map((workspace) => workspace.hotdesk_location + ' Floor ' + workspace.hotdesk_floor)} //{acsess === 'Current Bookings' ? bookingData.map((booking) => booking.title) : requestData.map((request) => request.title)}
                onChange={(e) => {setFilterStr(e.target.textContent);}}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Search input"
                    InputProps={{
                      ...params.InputProps,
                      style: {color: '#FFFFFF'}
                    }}
                    InputLabelProps={{ style: { color: '#FFFFFF', textAlign: 'center' }}}
                  />
                )}
              />

            )}
          </SearchBlock>
          <FilterBtn onClick={handleFilterButtonClick}><FilterIcon/>Filter</FilterBtn>
        </FilterContainer>
      </FilterViewBookingsContainer>
      <Bookings>
        <BookingContainer>
        { workspaceType === 'Meeting Rooms'
            ? (
              meetingRooms.map((meetingRoom) => {
                // Combine room location and number
                const roomInfo = meetingRoom.room_location + ' ' + meetingRoom.room_number;
                /* eslint-disable no-unused-vars */
                const selectedUtilities = Object.entries(checkedItems)
                  .filter(([utility, isChecked]) => isChecked)
                  .map(([utility]) => utility);
                /* eslint-enable no-unused-vars */
                // Check if the room matches the selected utilities
                const matchesUtilities = selectedUtilities.every((utility) =>
                  meetingRoom.room_utilities.includes(utility))

                // Check if the room's capacity matches the selected capacity range
                const matchesCapacity = meetingRoom.room_capacity >= sliderValue

                // check if room is available during specified range
                const matchesAvailability = timeFilterApplied ? isRoomAvailable(meetingRoom.room_id, allCurrBookings, updatedStartTime, updatedEndTime) : true;

                if (roomInfo.includes(filterStr) && matchesUtilities && matchesCapacity && matchesAvailability)  {
                    return (<WorkspaceCard {...meetingRoom} key={meetingRoom.room_id} acsess='meeting-room' />)
                }
              })
          ) : (
            (() => {
              const seenCombinations = new Set();
              const filteredHotDesks = hotDesks.filter((hotDesk) => {
                const combination = `${hotDesk.hotdesk_location} Floor ${hotDesk.hotdesk_floor}`;
                if (!seenCombinations.has(combination)) {
                  seenCombinations.add(combination);
                  return true;
                }
                return false;
              });

              filteredHotDesks.sort((a, b) => {
                const locationA = a.hotdesk_location.toLowerCase();
                const locationB = b.hotdesk_location.toLowerCase();
                if (locationA < locationB) return -1;
                if (locationA > locationB) return 1;
            
                const floorA = a.hotdesk_floor;
                const floorB = b.hotdesk_floor;
                return floorA - floorB;
              });
              
              return filteredHotDesks.map((hotDesk) => {
                // Combine room location and number
                const roomInfo = `${hotDesk.hotdesk_location} Floor ${hotDesk.hotdesk_floor}`;
                // Check if the combined string includes the filter string
                if (roomInfo.includes(filterStr)) {
                  return (
                    <WorkspaceCard
                      {...hotDesk}
                      key={hotDesk.hotdesk_id}
                      acsess='hot-desk'
                    />
                  );
                }
                return null; // Return null if the condition is not met
              });
            })()
          )}
        </BookingContainer>
      </Bookings>
      <ErrorModal open={error} onClose={() => setError(false)}>Invalid token or input</ErrorModal> 
      <FilterMenu
        id="filter-menu"
        anchorEl={anchorEl}
        open={filterOpen}
        onClose={handleCloseMenu}
        MenuListProps={{
          'aria-labelledby': 'lock-button',
          role: 'listbox',
        }}
        sx={{
          '& .MuiPaper-root': {
            backgroundColor: '#31413D', // Set background color to match your design
            color: '#FFFFFF',
            borderRadius: '12px', // Rounded corners
          },
          '& .MuiList-root': {
            backgroundColor: '#31413D', // Same background color to ensure consistent look
            padding: '16px', // Optional: adjust padding if needed
          },
          '& .Mui-disabled': {
            opacity: 1, // Keep the opacity the same
            color: '#FFFFFF', // Ensure text color remains consistent
          },
        }}
      >
        <MenuItem
          sx={{
            cursor: 'default',
            pointerEvents: 'None'
          }}
        > <div style={{ color: '#FFFFFF', marginRight: '16px'}}>Capacity:</div></MenuItem>
          <Slider
            value={sliderValue}
            onChange={handleSliderChange}
            size="large"
            aria-label="small"
            getAriaValueText={valuetext}
            valueLabelDisplay="auto"
            min={10}
            max={60}
            marks={marks}
            sx={{
              marginLeft: '20px',
              marginRight: '20px',
              width: 330, // Set width to ensure slider is visible
              color: '#84B7AA',
              '& .MuiSlider-thumb': {
                width: 18,
                height: 18,
                borderRadius: '50%',
                border: '2px solid #FFFFFF',
              },
              '& .MuiSlider-rail': {
                color: '#FFFFFF',
              },
              '& .MuiSlider-markLabel': {
                fontSize: '0.75rem',
                color: '#FFFFFF',
              },
            }}
          />
        <MenuItem
        sx={{
          cursor: 'default',
          pointerEvents: 'None'
        }}
        >Utilities:</MenuItem>
        <FormGroup
          sx={{
                paddingLeft: '30px',
          }}
        >
          <CustomCheckbox
            label="Whiteboard"
            checked={checkedItems.whiteboard}
            onChange={handleCheckboxChange}
            name="whiteboard"
          />
          <CustomCheckbox
            label="Projector"
            checked={checkedItems.projector}
            onChange={handleCheckboxChange}
            name="projector"
          />
          <CustomCheckbox
            label="Computer"
            checked={checkedItems.computer}
            onChange={handleCheckboxChange}
            name="computer"
          />
          <CustomCheckbox
            label="Microphone"
            checked={checkedItems.microphone}
            onChange={handleCheckboxChange}
            name="microphone"
          />
          <CustomCheckbox
            label="Monitor"
            checked={checkedItems.monitor}
            onChange={handleCheckboxChange}
            name="monitor"
          />
          </FormGroup>
          <MenuItem
          sx={{
            cursor: 'default',
            pointerEvents: 'None'
          }}
          >Time:</MenuItem>
          <DatePickerBox>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DemoContainer components={['DateTimePicker']}>
                <CustomDateTimePicker 
                  label="Booking Start Time"
                  defaultValue={updatedStartTime}
                  onChange={(newValue) => handleStartTimeChange(newValue)}
                  disablePast
                  format='DD MMM YYYY hh:mm A'
                  />
                <CustomDateTimePicker
                  label="Booking End Time"
                  defaultValue={updatedEndTime}
                  onChange={(newValue) => handleEndTimeChange(newValue)}
                  disablePast
                  minDateTime={updatedStartTime ? dayjs(updatedStartTime) : dayjs(d)}
                  format='DD MMM YYYY hh:mm A'
                  />
              </DemoContainer>
            </LocalizationProvider>
          </DatePickerBox>
        
          <ClearButton onClick={handleClearFilter} >Clear</ClearButton>
      </FilterMenu>
    </DashboardBackground>
  );
}

export default Booking;



