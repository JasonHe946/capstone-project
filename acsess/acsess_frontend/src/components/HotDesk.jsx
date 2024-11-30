import React, {useEffect} from 'react';
import { styled, Button, Box } from '@mui/material';
import { MapContainer, TileLayer, useMap, Popup, Rectangle} from 'react-leaflet'
import "leaflet/dist/leaflet.css";
import DrawerAppBar from './Nav';
import WorkspaceCard from './WorkspaceCard';
import BasicModal from './BasicModal';
import EditDrawer from './EditDrawer';
import axios from 'axios'
import { format, compareAsc } from 'date-fns';
import dayjs from 'dayjs';
import { useNavigate, useLocation } from 'react-router-dom';
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import Menu from '@mui/material/Menu';

const center = {
  lat: 51.505,
  lng: -0.09,
}


const Map = styled(MapContainer) ({
  height: '70vh',
  width:'40vw',
  backgroundColor: '#FFFFFF'
})

const MapTile = styled(TileLayer) ({
  // opacity: '100%'
})

const DashboardHeading = styled('div')({
  fontSize: '2.5rem',
  fontWeight: '600',
  color: '#FFFFFF',
  paddingLeft: '2vw',
  paddingRight: '2vw',
  marginTop: '1vh'
});

const MapHotdeskHeadingContainer = styled('div')({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginTop: '0px',
  marginLeft: 'auto',
  marginRight: 'auto',
  marginBottom: '1%',
  width: '100%',
  padding: '0 9%',
});

const MapHotdeskHeading = styled(DashboardHeading)({
  marginTop: '0px',
  marginLeft: 'auto',
  marginRight: 'auto',
  marginBottom: '1%',
  width: 'fit-content'
})

const HeadingSeperator = styled('hr')({
  width: '98%',
  borderColor: '#31413D',
  borderStyle: 'double'
});

// const outerBounds = [
//   [0,0],
//   [52.505, 29.09]
// ];

const HotDeskBackground = styled('div')({
  backgroundColor: '#1C1C1C',
  height: '100vh',
  width: '100vw'
});

const MapHotdeskContainer = styled('div') ({
  marginLeft: '9%',
  marginRight: '9%',
  display: 'flex',
  flexDirection: 'row',
  flexWrap: 'wrap',
  justifyContent: 'space-between',
})

const HotdeskContainer = styled('div') ({
  display: 'flex',
  flexDirection: 'row',
  flexWrap: 'wrap',
  alignItems: 'center',
  justifyContent: 'center',
  maxHeight: "70vh",
  width: "40vw",
  overflowY: 'auto'
})

const BackButton = styled(Button)({
  color: '#DCCFCF',
  marginTop: '1vh',
  marginLeft: '2vw',
  '&:hover': {
    backgroundColor: '#DCCFCF',
    color: '#252525',
  }
});
const CustomDateTimePicker = styled(DateTimePicker)({
  margin: '15px',
  '&. MuiStack-root': {
    minHeight: '200px'
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

const DatePickerBox = styled(Box)({
  width: '100%',
})

const AlignDatePickers = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  gap: '5%',
  justifyContent: 'center',
})

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
  alignSelf: 'right',
  '&:hover': {
    background: '#84B7AA',
    color: '#31413D'
  }
})

const FilterIcon = styled(FilterAltIcon)({
  paddingRight: '4%'
})

const FilterMenu = styled(Menu)({
  '& .MuiPaper-root': {
    backgroundColor: '#31413D',
    color: '#FFFFFF',
    borderRadius: '12px',
  },
  '& .MuiList-root': {
    backgroundColor: '#31413D',
    padding: '16px',
  },
});

const SaveButton = styled(Button)({
  border: 'none',
  borderRadius: '50px',
  width: '30%',
  fontWeight: 'bold',
  backgroundColor: '#84b7aa',
  color: '#000',
  flexBasis: '45%',
  '&:hover': {
    backgroundColor: '#FC7202',
    color: '#000',
    opacity: '0.9'
  },
})

function HotDesk () {
  // const [position, setPosition] = React.useState(center)
  const [openEditDrawer, setOpenEditDrawer] = React.useState(false)
  const [deskId, setDeskId] = React.useState(null)
  const [deskFloor, setDeskFloor] = React.useState(null)
  const [deskLocation, setDeskLocation] = React.useState('')
  const [deskNumber, setDeskNumber] = React.useState(null)
  const [successModal, setSuccessModal] = React.useState(false)
  const [failModal, setFailModal] = React.useState(false)

  const [startTime, setStartTime] = React.useState(null)
  const [endTime, setEndTime] = React.useState(null)
  const [formattedStartTime, setFormattedStartTime] = React.useState(null)
  const [formattedEndTime, setFormattedEndTime] = React.useState(null)

  const [bookings, setBookings] = React.useState([])
  const [originalHotdesks, setOriginalHotdesks] = React.useState([])
  const [hotdesks, setHotDesks] = React.useState([])

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const navigate = useNavigate();
  const {state} = useLocation();


const ComponentResize = () => {
	const map = useMap();

	setTimeout(() => {
		map.invalidateSize();
	}, 0);

	return null;
};

React.useEffect( () => {
  async function fetchData() {
    const response = await axios.post('http://localhost:8000/api/get-data/', {
      table: "hotdesk",
      sort_type: 1,
      sort: {
        "hotdesk_floor": state.hotdesk_floor,
        "hotdesk_location": state.hotdesk_location
      }
    });
    setHotDesks(response.data);
    setOriginalHotdesks(response.data)
  }
  fetchData();
}, []); //runs only on first render

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

  const formattedStartDate = format(d, 'd MMM y hh:mm aa')
  const formattedEndDate = format(d1, 'd MMM y hh:mm aa')

  useEffect(() => {
    const fetchAllBookings = async () => {
      try {
        const response = await axios.post('http://localhost:8000/api/get-data/', {
          "table": "booking",
          "sort_type": 1,
          "sort": {}
        });
        setBookings(response.data.filter((booking) => booking.content_type_id === 11))

      } catch (error) {
        console.error('Error fetching bookings data:', error);
      }
    }; 

    const filterHotdesks = () => {
      if (startTime && endTime) {
        const start = new Date(startTime);
        const end = new Date(endTime);

        const availableHotdesks = originalHotdesks.filter(hotdesk => {
          const hotdeskBookings = bookings.filter(booking => booking.object_id === hotdesk.hotdesk_id);
          const isAvailable = hotdeskBookings.every(booking => {
            const bookingStart = new Date(booking.start_time);
            const bookingEnd = new Date(booking.end_time);
            const startInBetween = (compareAsc(start, bookingStart) === 1 && compareAsc(start, bookingEnd) === -1)
            const endInBetween = (compareAsc(end, bookingStart) === 1 && compareAsc(end, bookingEnd) === -1)
            const bookingStartInBetween = (compareAsc(bookingStart, start) === 1 && compareAsc(bookingStart, end) === -1)
            const bookingEndInBetween = (compareAsc(bookingEnd, start) === 1 && compareAsc(bookingEnd, end) === -1)
            const sameStartAndEnd = (compareAsc(start, bookingStart) === 0 && compareAsc(end, bookingEnd) === 0)
            return (!startInBetween && !endInBetween && !bookingStartInBetween && !bookingEndInBetween && !sameStartAndEnd);
          });
          return isAvailable;
        });

        setHotDesks(availableHotdesks)
      }
    }

    const getAvailableHotdesks = async () => {
      await fetchAllBookings();
      filterHotdesks();
    }

    getAvailableHotdesks();

  }, [startTime, endTime])

return (
  <>
  <HotDeskBackground>
    <DrawerAppBar/>
    <BackButton 
      startIcon={<KeyboardDoubleArrowLeftIcon />}
      onClick={() => navigate('/booking')}
    >
      Back
    </BackButton>
    <DashboardHeading>Hot Desks</DashboardHeading>
    <HeadingSeperator></HeadingSeperator>
    {hotdesks.length > 0 && 
    <>
    <MapHotdeskHeadingContainer>
      <MapHotdeskHeading>
        {hotdesks[0].hotdesk_location + ' Floor ' + hotdesks[0].hotdesk_floor}
      </MapHotdeskHeading> 
      <FilterBtn
        onClick={handleClick}
        id="basic-button"
        aria-controls={open ? 'basic-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
      >
        <FilterIcon/>
        Filter
      </FilterBtn>
      <FilterMenu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        <DatePickerBox>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DemoContainer components={['DateTimePicker']}>
              <AlignDatePickers>
                <CustomDateTimePicker 
                  label="Booking Start Time"
                  onChange={(newValue) => {setStartTime(newValue); setFormattedStartTime(format(new Date(newValue), 'd MMM y hh:mm aa'))}}
                  disablePast
                  format='DD MMM YYYY hh:mm A'
                  value={startTime}
                />
                <CustomDateTimePicker
                  label="Booking End Time"
                  onChange={(newValue) => {setEndTime(newValue); setFormattedEndTime(format(new Date(newValue), 'd MMM y hh:mm aa'))}}
                  disablePast
                  minDateTime={startTime ? startTime : dayjs(new Date())}
                  format='DD MMM YYYY hh:mm A'
                  value={endTime}
                />
                </AlignDatePickers>
            </DemoContainer>
          </LocalizationProvider>
        </DatePickerBox>
        <SaveButton onClick={handleClose}>Save</SaveButton>
      </FilterMenu>
    </MapHotdeskHeadingContainer>
    </>}
    <MapHotdeskContainer>
      <Map center={center} zoom={1} minZoom={0} maxZoom={1} scrollWheelZoom={true}>
        <ComponentResize />
      {hotdesks.length > 0 && <MapTile
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url={`/assets/hot-desk/maps/${hotdesks[0].hotdesk_location} Floor ${hotdesks[0].hotdesk_floor}/{z}/{x}/{y}.png`}
        tileSize='360'
        noWrap='true'
    
      />}

        {hotdesks.map((hotdesk) => {
          let bounds = []
          console.log(hotdesk.hotdesk_coordinates != null)
          if (hotdesk.hotdesk_coordinates != null) {
            console.log(typeof(hotdesk.hotdesk_coordinates[0]))
             bounds = [
              [hotdesk.hotdesk_coordinates[0], hotdesk.hotdesk_coordinates[1]], // First coordinate pair
              [hotdesk.hotdesk_coordinates[2], hotdesk.hotdesk_coordinates[3]] // Second coordinate pair
            ];
          } else {
            // if no co-ordinates given set it to default co-ordinates
            bounds = [
              [69.41124235697256, -39.386923202347965],
              [58.81374171570782, -21.828125000000004],
            ]
          }
          console.log(typeof(69.41124235697256));

          return (<Rectangle {...hotdesk} bounds={bounds} pathOptions={{ color: 'grey' }}> 
            <Popup>
              <span onClick={() => {setDeskId(hotdesk.hotdesk_id); setDeskFloor(hotdesk.hotdesk_floor); setDeskLocation(hotdesk.hotdesk_location); setDeskNumber(hotdesk.hotdesk_number); setOpenEditDrawer(true);}}>
              Hot Desk {hotdesk.hotdesk_number}
              <br></br>
              {'(Click This Pop-up To Book)'}
              </span>
            </Popup>
          </Rectangle>
        )})}

      </Map>
      <HotdeskContainer>
        {hotdesks.sort((a, b) => a.hotdesk_id - b.hotdesk_id).map((hotdesk) => (
          <WorkspaceCard{...hotdesk} hotdesk_utilities={'PC, Outlets, Projecter, AC'} key={hotdesk.hotdesk_id} acsess='desk' onClick={() => {setDeskId(hotdesk.hotdesk_id); setDeskFloor(hotdesk.hotdesk_floor); setDeskLocation(hotdesk.hotdesk_location); setDeskNumber(hotdesk.hotdesk_number); setOpenEditDrawer(true)}}/>
        ))}
      </HotdeskContainer>
    </MapHotdeskContainer>
  </HotDeskBackground>
  {hotdesks.length > 0 && <EditDrawer 
  open={openEditDrawer}
  title={'Create Booking'}
  onClose={() => setOpenEditDrawer(false)}
  bookingId={deskId} 
  bookingTitle={`${deskLocation} Floor ${deskFloor}: Hotdesk ${deskNumber}`}
  bookingStartTime={startTime && endTime ? formattedStartTime : formattedStartDate}
  bookingEndTime={endTime && startTime ? formattedEndTime : formattedEndDate}
  bookingUtilities={'PC, Outlets, Projecter, AC'}
  submitfunc={true}
  room={11}
  />}
  <BasicModal        
    open={successModal}
    title={'Booking Created'}
    exitbtntext={'Exit'}
    issubmit={false}
    onClose={() => {setSuccessModal(false); navigate('/dashboard')}}>
    Your booking has been created!
  </BasicModal>
  <BasicModal        
    open={failModal}
    title={'Booking Failed'}
    exitbtntext={'Exit'}
    issubmit={false}
    onClose={() => setFailModal(false)}>
    Booking failed to be created
  </BasicModal>
  </>
); 

}

export default HotDesk;