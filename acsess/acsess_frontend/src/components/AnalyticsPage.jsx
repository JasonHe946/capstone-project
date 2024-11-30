import React, { useEffect } from 'react';
import { styled, Button } from '@mui/material';
import DrawerAppBar from './Nav';
import Autocomplete from '@mui/material/Autocomplete';
import Paper from "@mui/material/Paper";
import TextField from '@mui/material/TextField';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import WorkspaceUsage from './WorkspaceUsage';
import CheckInRate from './CheckInRate';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import DownloadIcon from '@mui/icons-material/Download';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import axios from 'axios'
import { useNavigate } from 'react-router-dom';


const AnalyticsBody = styled('div')({
    
})

const ButtonContainer = styled('div') ({
    display:'flex',
    flexDirection: 'row',
    width:'94vw',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
  })

const FilterContainer = styled('div') ({
  display:'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
})
  
const GraphContainer = styled('div') ({
  maxWidth: '140vmin',
  // maxHeight:'70vh',
  display:'flex',
  // maxHeight:''
  justifyContent: 'center',
  alignItems: 'center',
  flexDirection: 'column',
  marginLeft: 'auto',
  marginRight: 'auto'
})

const AnalyticsHeading = styled('div')({
    width:'94vw',
    marginLeft: 'auto',
    marginRight: 'auto',
    paddingTop: '2%',
})

const AnalyticsAutocomplete = styled(Autocomplete)({
    width: '100%',
    paddingTop: '2vh',
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

const Analytics = styled(AnalyticsHeading)({
    width:'94vw',
    marginLeft: 'auto',
    marginRight: 'auto',
    paddingTop: '0%',
    display:'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
})

const HeadingSeperator = styled('hr')({
    width: '94vw',
    borderColor: '#31413D',
    borderStyle: 'double',
    marginBottom: '2vh'
});

const WorkspaceViewSelector = styled(List)({
   background: "#31413d", 
   color: "#FFFFFF", 
   borderRadius: '10px', 
   width: '200px', 
   padding: '0px', 
   paddingLeft: '10px', 
   
})

const PeriodViewSelector = styled(WorkspaceViewSelector)({
  width: '80px',

})

const PeriodViewContainer = styled('div') ({
  display:'flex',
  flexDirection: 'row',
  width: '320px', 
  justifyContent: 'space-around',
  alignItems: 'center'
})

const Icon = styled("span") ({
  paddingLeft: '2px',
  marginTop: '10px'
})

const PeriodViewText = styled(ListItemText)({
    textAlign: 'center'
})

const PeriodDate = styled('div') ({
  color: '#FFFFFF',
  fontSize: '25px',
  fontWeight: '500'
});

const PeriodOffsetButton = styled(Button)({
  width: '140px',
  height: '50px',
  color: '#FFFFFF',
  fontWeight: 'bold',
  '&:hover': {
    color: '#FFFFFF'
  },
})

const PressentPeriodButton = styled(PeriodOffsetButton) ({
  backgroundColor:'#31413d',
  fontSize: '16px',
  color: ' #ffffff',
  fontWeight: 'normal',
  textTransform: 'none',
  padding: '0px',
  width: '66px',
  height: '42px',
  borderRadius: '10px'
})

const DownloadButton = styled(PressentPeriodButton) ({
  width: '120px',
  backgroundColor: 'rgb(0,0,0,0)',
  borderColor: '#31413d',
  borderWidth: '2px',
  borderStyle: 'solid', 
  '&:hover': {
    backgroundColor: '#31413d'
  },
})

const SearchBlock = styled('div')({
  border: '1px solid #31413D',
  borderRadius: '50px',
  zIndex: '900',
  width: '300px',
  marginRight: '10px'
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

const BookingTotal = styled('div') ({
  marginTop: '20px',
  fontWeight: '700',
  fontSize: ' 30px',
  color: '#e5e5e5'
})

const defaultProps = {
options: [
    {title: 'Workspace Usage'}, 
    {title: 'Check-In Rate'}
],
getOptionLabel: (option) => option.title,
};

const viewData = ['Show Hotdesks', 'Show Meeting Rooms', 'Show All Workspaces'];
const periodData = ['Day', 'Week', 'Month', 'Year']


function AnalyticsPage ()  {
    const [analytics, setAnalytics] = React.useState('Workspace Usage');
    const [meetingRooms, setMeetingRooms] = React.useState([]);
    const [hotDesks, setHotDesks] = React.useState([]);
    const [bookingData, setBookingData] = React.useState([]);
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [anchorElPeriod, setanchorElPeriod] = React.useState(null);
    const [selectedIndex, setSelectedIndex] = React.useState(2); // Default to 'Show Both'
    const [periodIndex, setPeriodIndex] = React.useState(2); //Default to Month
    const [periodOffset, setPeriodOffset] = React.useState(0);
    const [currPeriod, setCurrPeriod] = React.useState('')
    const [filterStr, setFilterStr] = React.useState('');
    const [searchTitles, setSearchTitles] = React.useState('');
    const [resetInputField, setResetInputField] = React.useState(false);
    const [propsData, setPropsData] = React.useState({        
      data: [],
      view: viewData[selectedIndex]});
    const open = Boolean(anchorEl);
    const periodOpen = Boolean(anchorElPeriod);
    
    const navigate = useNavigate()

    React.useEffect(() => {
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
        const userRole = getUserRole()
        if (userRole !== 'admin') {
          navigate('/dashboard')
        }
    
        fetchMeetingRooms();
    }, []);
  
  
    React.useEffect(() => {
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
    }, [meetingRooms])
  
    React.useEffect(() => {
        const fetchBookings = async () => {
          try {

            const response = await axios.post('http://localhost:8000/api/get-data/', {
              "table": "booking_history",
              "sort_type": 1,
              "sort": {
                "state": 'finished'
              }
            });
            setBookingData(mapBookingData(response.data, meetingRooms, hotDesks));
          } catch (error) {
            console.error('Error fetching bookings data:', error);
          }
        };
        fetchBookings();
    }, [hotDesks]);

    const downloadBookingData = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/download-booking-history/', {
          responseType: 'blob' // Set the response type to 'blob' to handle binary data
        });
        // Create a new Blob object using the response data
        const blob = new Blob([response.data], { type: 'text/csv' });
        // Create a link element
        const link = document.createElement('a');
        // Create an object URL for the Blob
        const url = URL.createObjectURL(blob);
        // Set the link's href to the object URL
        link.href = url;
        // Set the suggested file name for download
        link.download = 'booking-history.csv';
        // Append the link to the document body
        document.body.appendChild(link);
        // Programmatically click the link to trigger the download
        link.click();
        // Remove the link from the document
        document.body.removeChild(link);
        // Release the object URL after the download is complete
        URL.revokeObjectURL(url);

      } catch (error) {
        console.error('Error fetching bookings data:', error);
      }
    }
  
    const mapBookingData = (data, meetingRooms, hotDesks) => {
      return data.map((item, index) => {
        const isRoom = item.content_type_id === 9;
        const content = isRoom
          ? meetingRooms.find(room => room.room_id === item.object_id)
          : hotDesks.find(desk => desk.hotdesk_id === item.object_id);
  
        return {
          id: item.booking_id,
          zID: item.user_id,
          title: isRoom ? `${content.room_location}-${content.room_number}` : `${content.hotdesk_location} Floor ${content.hotdesk_floor}: Hotdesk ${content.hotdesk_number}`,
          type: isRoom ? 'Meeting-Room' : 'HotDesk',
          startTime: new Date(item.start_time),
          endTime: new Date(item.end_time),
          status: item.state,
          utilities: isRoom ? content.room_utilities : '',
          checkIn: (item.check_in_status === 'checked-in'), //TODO change when new database changes are made
          timetable: {},
          room: item.content_type_id
        };
      });
    };

    const handleClickListItem = (event) => {
      setAnchorEl(event.currentTarget);
    };
  
    const handleMenuItemClick = (event, index) => {
      setSelectedIndex(index);
      setFilterStr('');
      setAnchorEl(null);
    };

  
    const handleClose = () => {
      setAnchorEl(null);
    };

    //period listeners
    const handleClickListPeriodItem = (event) => {
      setanchorElPeriod(event.currentTarget);

    };
  
    const handleMenuPeriodItemClick = (event, index) => {
      setPeriodIndex(index);
      setPeriodOffset(0);
      setFilterStr('');
      setanchorElPeriod(null);
    };

    const handleClosePeriod = () => {
      setanchorElPeriod(null);
    };

  function dataInPeriod(date, offset) {
    let period = [];
    const periodType = periodData[periodIndex]; // Determine the current period type
    const months = [
      "January", "February", "March", "April", "May", "June", "July", "August",
      "September", "October", "November", "December"
    ];
    
    let day = date.getDate(); // Default day
    let monthIndex = date.getMonth(); // Default month index
    let year = date.getFullYear(); // Default year
    // Determine the appropriate suffix for the day
    const getDaySuffix = (day) => {
      if (day >= 11 && day <= 13) {
        return "th";
      }
      switch (day % 10) {
        case 1:
          return "st";
        case 2:
          return "nd";
        case 3:
          return "rd";
        default:
          return "th";
      }
    };

    // Apply offset based on the current period type
    if (periodType === "Day") {
      day -= offset;
      // Adjust date by offset
      date.setDate(day);
      while (day <= 0) {
        // Move to the previous month
        monthIndex -= 1;
        if (monthIndex < 0) {
          monthIndex = 11; // Wrap around to December
          year -= 1; // Decrement year
        }
        // Set the day to the last day of the previous month
        date = new Date(year, monthIndex + 1, 0)
        day += date.getDate();
      }
      for (let data of bookingData) {
      if (((data.startTime.getDate() === day && data.startTime.getMonth() === date.getMonth() && data.startTime.getYear() === date.getYear()) || (data.endTime.getDate() === day && data.endTime.getMonth() === date.getMonth() && data.endTime.getYear() === date.getYear()))) {
          period.push(data);
        }
      }
    } else if (periodType === "Week") {
      // Adjust the date to the start of the week (Monday)
      const currentDayOfWeek = date.getDay();
      const daysSinceMonday = (currentDayOfWeek + 6) % 7; // Calculate days since Monday (0 = Monday)
      date.setDate(date.getDate() - daysSinceMonday); // Set to Monday of the current week

      if (offset > 0) {
        // Subtract weeks using offset
        date.setDate(date.getDate() - offset * 7);
      }

      // Calculate the end day of the week
      let endDay = new Date(date); // Clone the date
      endDay.setDate(date.getDate() + 6);
      // Update variables based on the start of the week
      day = date.getDate();
      monthIndex = date.getMonth();
      year = date.getFullYear();

      // Get start and end months for the week
      const startMonthIndex = monthIndex;
      const endMonthIndex = endDay.getMonth();
      const startMonthName = months[startMonthIndex];
      const endMonthName = months[endMonthIndex];

      // Format the week as "StartDay Month to EndDay Month Year"
      const startDaySuffix = getDaySuffix(day);
      const endDaySuffix = getDaySuffix(endDay.getDate());
      for (let data of bookingData) {
        if ((data.startTime >= date && data.startTime <= endDay) || (data.endTime >= date && data.endTime <= endDay)) {
          period.push(data);
        }
      }
      if (startMonthIndex === endMonthIndex) {
        // If both start and end days are in the same month
        return {
          dateFormat: `${day}${startDaySuffix} to ${endDay.getDate()}${endDaySuffix} ${startMonthName} ${year}`,
          dataInPeriod: period
        }
      } else {
        // If start and end days are in different months
        return {
          dateFormat: `${day}${startDaySuffix} ${startMonthName} to ${endDay.getDate()}${endDaySuffix} ${endMonthName} ${year}`,
          dataInPeriod: period
        }
        
      }
    } else if (periodType === "Month") {
      // Calculate new month index and adjust year accordingly
      monthIndex -= offset;
      while (monthIndex < 0) {
        monthIndex += 12; // Wrap around the months
        year -= 1; // Adjust year for each full wrap-around of 12 months
      }
      // Adjust day for the new month
      const lastDayOfNewMonth = new Date(year, monthIndex + 1, 0).getDate();
      if (day > lastDayOfNewMonth) {
        day = lastDayOfNewMonth; // Adjust day to the last valid day of the new month
      }
      for (let data of bookingData) {
        if ((data.startTime.getMonth() === monthIndex || data.endTime.getMonth() === monthIndex)) {
          period.push(data);
        }
      }
      const monthName = months[monthIndex];
      return {
        dateFormat: `${monthName} ${year}`,
        dataInPeriod: period
      }
    } else if (periodType === "Year") {
      year -= offset;
      for (let data of bookingData) {
        if (data.startTime.getYear() === year - 1900 || data.endTime.getYear() === year - 1900) { //-1900 cause that's what get year returns
          period.push(data);
        }
      }
      return {
        dateFormat: `${year}`,
        dataInPeriod: period
      }
    }
  
    // Get month name based on calculated monthIndex
    const monthName = months[monthIndex];

    return {
      dateFormat: `${day}${getDaySuffix(day)} ${monthName} ${year}`,
      dataInPeriod: period
    }
  }

  // Utility function to check inclusion condition
  const shouldIncludeType = (type) => 
    viewData[selectedIndex] === `${type}` || viewData[selectedIndex] === 'Show All Workspaces';

  const getAllFilteredTitles = (data) => {
    let uniqueTitles = [];
    if (data.length > 0) {
      data.forEach(booking => {
        if (shouldIncludeType('Show Hotdesks') && booking.type === 'HotDesk') {
          uniqueTitles.push(booking.title);
        } else if (shouldIncludeType('Show Meeting Rooms') && booking.type === 'Meeting-Room') {
          uniqueTitles.push(booking.title);
        }
      });
    }
    return uniqueTitles;
  }

  useEffect(() => {
      let data = dataInPeriod(new Date(), periodOffset)
      if (filterStr === '') {
        setResetInputField((prev) => !prev);
      }
      setPropsData({
        data: data.dataInPeriod.filter((data) => data.title.includes(filterStr)),
        view: viewData[selectedIndex],
        period: periodData[periodIndex]
      });
      setCurrPeriod(data.dateFormat);
      setSearchTitles([...new Set(getAllFilteredTitles(data.dataInPeriod))]);
    }, [selectedIndex, bookingData, periodIndex, periodOffset, filterStr]);
  
  return (
    <AnalyticsBody>
        <DrawerAppBar></DrawerAppBar>
        <AnalyticsHeading>
            <AnalyticsAutocomplete
            {...defaultProps}
            id="disable-close-on-select"
            disableClearable
            defaultValue={defaultProps.options[0]}
            onChange={(e) => {setAnalytics(e.target.textContent);}}
            PaperComponent={({ children }) => (
            <Paper sx={{ background: "#31413d", color: "#FFFFFF" }}>{children}</Paper>
            )}
            renderInput={(params) => (
            <HeadingAutocomplete {...params} id="analytics-heading" label="SELECT ANALYTICS:" variant="standard"
            InputProps={{...params.InputProps, disableUnderline: true, style: {  fontSize: '2.5rem', fontWeight: '600', color: '#FFFFFF'}}} 
            InputLabelProps={{ style: { color: '#FFFFFF', fontSize:'20px' }}}/>
            )}
            />
      </AnalyticsHeading>
      <HeadingSeperator></HeadingSeperator>
      <Analytics>

        <GraphContainer>
        <ButtonContainer>
          <FilterContainer>
          <SearchBlock>
              <SearchBar
                freeSolo           
                options={searchTitles}
                PaperComponent={({ children }) => (
                  <Paper sx={{ background: "#31413d", color: "#FFFFFF" }}>{children}</Paper>)}
                onChange={(e) => {setFilterStr(e.target.textContent);}}
                key={resetInputField}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Search input"
                    InputProps={{
                      ...params.InputProps,
                      style: {color: '#FFFFFF'}
                    }}
                    InputLabelProps={{ style: { color: '#FFFFFF', textAlign: 'center'}}}
                  />
                )}
              />
            </SearchBlock>
            <WorkspaceViewSelector component="nav" aria-label="Display options">
                <ListItemButton
                id="lock-button"
                aria-haspopup="listbox"
                aria-controls="lock-menu"
                aria-label="select display option"
                aria-expanded={open ? 'true' : undefined}
                onClick={handleClickListItem}
                sx={{ padding: '0px'}}
                >
                <ListItemText primary='Select Workspace Type' secondary={viewData[selectedIndex]} />
                </ListItemButton>
            </WorkspaceViewSelector>
            <Menu
                id="lock-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                'aria-labelledby': 'lock-button',
                role: 'listbox',
                }}
                sx={{
                // Custom styles for the Menu component
                '& .MuiList-root': {
                    background: "#31413d", 
                    color: "#FFFFFF"
                },
                }}
            >
                {viewData.map((view, index) => (
                <MenuItem
                    key={view}
                    selected={index === selectedIndex}
                    onClick={(event) => handleMenuItemClick(event, index)}
                >
                    {view}
                </MenuItem>
                ))}
            </Menu>

        </FilterContainer>
        <PeriodViewContainer>
          <div>
              <DownloadButton onClick={() => {downloadBookingData()}}>Download <Icon><DownloadIcon/></Icon></DownloadButton>
          </div>
          <div>
            <PressentPeriodButton onClick={() => {setPeriodOffset(0); setFilterStr('');}}>Today</PressentPeriodButton>
          </div>
          <div>
            <PeriodViewSelector component="nav" aria-label="Display options">
              <ListItemButton
              id="lock-period-button"
              aria-haspopup="listbox"
              aria-controls="lock-period-menu"
              aria-label="select display option"
              aria-expanded={open ? 'true' : undefined}
              onClick={handleClickListPeriodItem}
              sx={{ padding: '0px'}}
              >
              <PeriodViewText primary={periodData[periodIndex]} />
              {!periodOpen && <Icon><ArrowDropDownIcon></ArrowDropDownIcon></Icon>}
              {periodOpen && <Icon><ArrowDropUpIcon></ArrowDropUpIcon></Icon>}
              </ListItemButton>
            </PeriodViewSelector>
            <Menu
                id="lock-period-menu"
                anchorEl={anchorElPeriod}
                open={periodOpen}
                onClose={handleClosePeriod}
                MenuListProps={{
                'aria-labelledby': 'lock-period-button',
                role: 'listbox',
                }}
                sx={{
                // Custom styles for the Menu component
                '& .MuiList-root': {
                    background: "#31413d", 
                    color: "#FFFFFF"
                },
                }}
            >
                {periodData.map((view, index) => (
                    <MenuItem
                        key={view}
                        selected={index === periodIndex}
                        onClick={(event) => handleMenuPeriodItemClick(event, index)}
                    >
                        {view}
                    </MenuItem>
                ))
                }
            </Menu>
          </div>
        </PeriodViewContainer>
        </ButtonContainer>
        <PeriodDate>
          <PeriodOffsetButton disabled={periodOffset === 0} onClick={() => {setPeriodOffset(periodOffset + -1); setFilterStr('')}}><ArrowBackIosIcon/></PeriodOffsetButton> 
            {currPeriod} 
          <PeriodOffsetButton  onClick={() => {setPeriodOffset(periodOffset + 1); setFilterStr('')}}><ArrowForwardIosIcon/></PeriodOffsetButton>
        </PeriodDate>
            {analytics === 'Workspace Usage' &&
            <WorkspaceUsage {...propsData}></WorkspaceUsage>
            }
            {analytics === 'Check-In Rate' && 
            <CheckInRate {...propsData}></CheckInRate>
            }
        </GraphContainer>
        <BookingTotal>Total Bookings: {getAllFilteredTitles(dataInPeriod(new Date(), periodOffset).dataInPeriod).filter((title) => title.includes(filterStr)).length}</BookingTotal>
      </Analytics>
    </AnalyticsBody>
  )
}
export default AnalyticsPage;