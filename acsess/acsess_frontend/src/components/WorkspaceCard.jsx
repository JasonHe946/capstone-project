import React, { useEffect } from 'react';
import ErrorModal from './ErrorModal';
import { styled, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import CardActions from '@mui/material/CardActions';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import IconButton from '@mui/material/IconButton';
import Collapse from '@mui/material/Collapse';
import { Scheduler, DayView, Toolbar, DateNavigator, TodayButton, Appointments } from '@devexpress/dx-react-scheduler-material-ui';
import { ViewState } from '@devexpress/dx-react-scheduler';
import axios from 'axios';

const WorkspaceFlexBox = styled('div')({
  width: '100%',
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

const Workspace = styled('div') ({
  display: 'inline-block',
  width: '95%',
})

const ExpandButton = styled(CardActions)({
  float: 'right'
})

const WorkspaceCardContainer = styled('div')({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  flexWrap: 'wrap',
  height: '100%'
})

const WorkspaceInfo = styled('div')({
  display: 'flex',
  flexDirection: 'row',
  flexWrap: 'wrap',
})

const WorkspaceHeadingContainer = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  flexWrap: 'wrap',
  paddingLeft: '10px',
})

const WorkspaceTitleStatusContainer = styled('div')({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  flexWrap: 'wrap'
})

const WorkspaceTitle = styled('div')({
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  color: '#FFFFFF',
  fontWeight: '400',
  fontSize: '2rem',
  
  marginTop: '20px'
})

const WorkspaceCapacity = styled('div')({
  color: '#ffffff',
  marginTop: '25px',
  paddingLeft: '10px'
})

const Utilities = styled('div')({
  color: '#ffffff',
  marginBottom: '25px',
  paddingLeft: '10px'
})

const ExpandIcon = styled(ExpandMoreIcon)({
  color: '#ffffff'
})

const CardImageContainer = styled('div')({
  overflow: 'hidden',
  height: '10vmin',
  width: '10vmin'
})

const CardImage = styled('img')({
  width: '100%',
  height:'100%',
  objectFit: 'cover'
})

const WorkspaceSubtitle = styled('div')({
  fontSize: '13px',
  color: '#828282',
  paddingBottom: '10%'
})

const ColumnsContainer = styled(Box)({
  display: 'flex',
  flexDirection: 'row',
  width: '100%',
  height: '100%',
});

const Column = styled(Box)({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  padding: '20px',
});

const LeftColumn = styled(Column)({
  margin: '20px 30px 20px 30px',
  flexBasis: '35%',
  backgroundColor: '#1c1c1c'
});

const RightColumn = styled(Column)({
  height: '450px',
  flexBasis: '65%',
});
const SchedulerContainer = styled(Box)({
  flexGrow: '1',
  height: '100%',
  width: '100%',
})
const CustomDayViewTimeScaleLayout = styled(DayView.TimeScaleLayout)({
  backgroundColor: '#D1D0CE',
})

const CustomDayViewDayScaleLayout = styled(DayView.DayScaleLayout)({
  backgroundColor: '#D1D0CE',
})

const CustomDayViewEmptyCell = styled(DayView.DayScaleEmptyCell)({
  backgroundColor: '#D1D0CE',
})
const CustomDateNavigationButton = styled(DateNavigator.NavigationButton)({
  backgroundColor: '#252525',
  '& .MuiSvgIcon-root': { 
    color: '#fff'
  },
  '&:hover': {
    background: '#1C1C1C',
    '& .MuiSvgIcon-root': { 
      color: '#fff'
    }
  }
})

const CustomDateOpenButtom = styled(DateNavigator.OpenButton)({
  backgroundColor: '#31413D',
  color: '#fff',
  border: 'solid 1px #31413D',
  '&:hover': {
    background: '#84B7AA',
    color: '#31413D',
    border: 'solid 1px #84B7AA',
  }
})
const CustomTodayButton = styled(TodayButton.Button)({
  backgroundColor: '#31413D',
  color: '#fff',
  border: 'solid 1px #31413D',
  marginRight: '0.5%',
  '&:hover': {
    background: '#84B7AA',
    color: '#31413D',
    border: 'solid 1px #84B7AA',
  }
})
const CustomScheduler = styled(Scheduler.Root)({
  backgroundColor: '#252525',
})

const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
}));

function WorkspaceCard (props) {
  const navigate = useNavigate();
  const [error, setError] = React.useState(false);
  const [expanded, setExpanded] = React.useState(false);
  const [schedulerData, setSchedulerData] = React.useState([])
  
  let workspaceName = '';
  let workspaceCapacity = 0;
  let workspaceUtilities = [];
  let workspaceDescription = '';
  let type = props.acsess;
  let workspaceId = null;
  if (type === 'meeting-room') {
    workspaceName = props.room_location + ' ' + props.room_number;
    workspaceCapacity = props.room_capacity;
    workspaceUtilities = props.room_utilities.split(',')
    workspaceDescription = props.room_description;
    workspaceId = props.room_id;
  } else if (type === 'hot-desk' || type === 'desk') {
    if (type === 'hot-desk') {
      workspaceName = props.hotdesk_location + ' Floor ' + props.hotdesk_floor;
    } else {
      workspaceName = 'Hot Desk ' + props.hotdesk_number;
    }
    workspaceUtilities = [props.hotdesk_utilities]
    workspaceDescription = props.hotdesk_description;
    workspaceId = props.hotdesk_id;
  } 

  let currHours = new Date().getHours()

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const CustomAppointments = ({ children, style, ...restProps }) => {
    return (
      <Appointments.Appointment
      {...restProps}
      style={{
        ...style,
        backgroundColor: '#D26969',
        color: '#FFFFFF',
      }}
    >
    </Appointments.Appointment>
    )
  }
  
  const handleClick = () => {
    const workspaceData = {
      type: type,
      name: workspaceName,
      hotdesk_location: props.hotdesk_location,
      hotdesk_floor: props.hotdesk_floor,
      capacity: workspaceCapacity,
      description: workspaceDescription,
      id: workspaceId,
      utilities: workspaceUtilities,
    }
    const route = type === 'meeting-room' ? 'meeting-room' : 'hot-desk';
    navigate(`/booking/${route}`, { state: workspaceData });
  };

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axios.post('http://localhost:8000/api/get-data/', {
          "table": "booking",
          "sort_type": 1,
          "sort": {
            "object_id": workspaceId
          }
        });
        const formattedData = response.data.map(booking => ({
          ...booking,
          startDate: new Date(booking.start_time),
          endDate: new Date(booking.end_time)
        }));
        
        setSchedulerData(formattedData);
      } catch (error) {
        console.error('Error fetching hot desks data:', error);
        setError(true);
      }
    };
    fetchBookings();
  }, [workspaceId]);


  return (
    <>
      <WorkspaceFlexBox>
        <Workspace onClick={props.onClick ? props.onClick : () => handleClick()}>
          <WorkspaceCardContainer>
            <div>
              <WorkspaceInfo>
                  <WorkspaceTitleStatusContainer>
                  {type !== 'desk' && <CardImageContainer><CardImage src={`./assets/${type}/${workspaceName}.jpg`} onError={(e) => { e.target.onerror = null; e.target.src = './assets/default.jpg'; }}></CardImage></CardImageContainer>}
                    <WorkspaceHeadingContainer>
                      <WorkspaceTitle>{workspaceName}</WorkspaceTitle>
                      {type === 'meeting-room' || type === 'desk' && (<WorkspaceSubtitle><b>Description:</b> {workspaceDescription}</WorkspaceSubtitle>)}
                    </WorkspaceHeadingContainer>             
                  </WorkspaceTitleStatusContainer>
              </WorkspaceInfo>
            </div>
            {type === 'meeting-room' && (
              <WorkspaceCapacity>{'Capacity: ' +  workspaceCapacity}</WorkspaceCapacity>
            )}
            {(type === 'hot-desk' || type === 'desk') && (
              <div>
                {type === 'hot-desk' && <WorkspaceCapacity><b>Desks Currently in Use:</b> 1/20 Desks</WorkspaceCapacity> }
                <Utilities>
                <p></p>
                  <div><b>Utilities:</b></div>
                  <div>{workspaceUtilities}</div>
                </Utilities>
              </div>
            )}
          </WorkspaceCardContainer>
        </Workspace>
        {type === 'meeting-room' && (
          <ExpandButton disableSpacing>
            <ExpandMore
              expand={expanded}
              onClick={handleExpandClick}
              aria-expanded={expanded}
              aria-label="show more"
            >
              <ExpandIcon/>
            </ExpandMore>
          </ExpandButton>
          )}
          <Collapse in={expanded} timeout="auto" unmountOnExit>
          <ColumnsContainer>
            <LeftColumn>
              <Utilities>
              <p></p>
                <div><b>Utilities:</b></div>
                <ul>
                {workspaceUtilities.map((utilitiy) => (
                  <li>{utilitiy}</li>
                ))}
                </ul>
              </Utilities>
            </LeftColumn>
            <RightColumn>
              <SchedulerContainer>
                <Scheduler firstDayOfWeek={1} rootComponent={CustomScheduler} data={schedulerData}>
                  <ViewState
                    defaultCurrentDate={new Date()}
                  />
                  <DayView
                    dayScaleLayoutComponent={CustomDayViewDayScaleLayout}
                    timeScaleLayoutComponent={CustomDayViewTimeScaleLayout}
                    dayScaleEmptyCellComponent={CustomDayViewEmptyCell}
                  />
                  <Toolbar />
                  <DateNavigator 
                    navigationButtonComponent={CustomDateNavigationButton}
                    openButtonComponent={CustomDateOpenButtom}
                  />
                  <TodayButton 
                    buttonComponent={CustomTodayButton}
                  />
                  <Appointments 
                    appointmentComponent={CustomAppointments}
                  />
                </Scheduler>
              </SchedulerContainer>
            </RightColumn>
          </ColumnsContainer>
         </Collapse>

      </WorkspaceFlexBox>
      <ErrorModal open={error} onClose={() => setError(false)}>Invalid Token or Input</ErrorModal>
    </>
  )
}
export default WorkspaceCard;