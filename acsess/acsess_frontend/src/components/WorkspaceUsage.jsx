import React from 'react';
import { Bar } from 'react-chartjs-2';
import { styled } from '@mui/material';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarController,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  BarController
);

const BarGraph = styled(Bar) ({
  flexBasis: '100%',
  width: '94vw'
})

const WorkspaceUsage = (props) => {
  const [bookingData, setBookingData] = React.useState(props.data);
  const [viewWorkspace, setviewWorkspace] = React.useState(props.view); // Default to 'Show Both'
  const [periodView, setPeriodView] = React.useState(props.period);

  // Update state when props change
  React.useEffect(() => {
    setBookingData(props.data);
    setviewWorkspace(props.view);
    setPeriodView(props.period);
  }, [props.data, props.view, props.period]);

  // Utility function to check inclusion condition
  const shouldIncludeType = (type) => 
    viewWorkspace === `${type}` || viewWorkspace === 'Show All Workspaces';

  const getFormattedData = () => {
    let uniqueTitles = []
    let datasetList = []
    if (bookingData.length > 0) {
      // Create a Map to count occurrences by title and type
      const titleCounts = {
        hotdesk: new Map(),
        meetingRoom: new Map()
      };

      // Count occurrences of each title by type
      bookingData.forEach(obj => {
        const { title, type } = obj;
        // Determine which Map to use based on type
        const typeKey = type === 'Meeting-Room' ? 'meetingRoom' : 'hotdesk';
        
        if (titleCounts[typeKey].has(title)) {
            titleCounts[typeKey].set(title, titleCounts[typeKey].get(title) + 1);
        } else {
            titleCounts[typeKey].set(title, 1);
        }
      });
      
      // Calculate total occurrences of each title for included types
      const totalCounts = new Map();

      if (shouldIncludeType('Show Hotdesks')) {
        for (const title of titleCounts.hotdesk.keys()) {
          totalCounts.set(
            title,
            (totalCounts.get(title) || 0) + titleCounts.hotdesk.get(title)
          );
        }
      }

      if (shouldIncludeType('Show Meeting Rooms')) {
        for (const title of titleCounts.meetingRoom.keys()) {
          totalCounts.set(
            title,
            (totalCounts.get(title) || 0) + titleCounts.meetingRoom.get(title)
          );
        }
      }
      //sort titles
      uniqueTitles = [...totalCounts.keys()].sort((a, b) => totalCounts.get(b) - totalCounts.get(a));
    
      // Prepare data arrays for chart
      const hotdeskData = uniqueTitles.map(title => titleCounts.hotdesk.get(title) || 0);
      const meetingRoomData = uniqueTitles.map(title => titleCounts.meetingRoom.get(title) || 0);
      
      if (shouldIncludeType('Show Hotdesks')) {
        datasetList.push({
          label: 'Hotdesks',
          backgroundColor: 'rgba(49, 65, 61, 0.8)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1,
          data: hotdeskData,
        })
      }

      if (shouldIncludeType('Show Meeting Rooms')) {
        datasetList.push({
          label: 'Meeting Rooms',
          backgroundColor: 'rgba(251, 115, 0, 0.2)',
          borderColor: '#FB7300',
          borderWidth: 1,
          data: meetingRoomData,
        })
      }
    }
      // Prepare data for chart with separate datasets for each type
      const data = {
        labels: uniqueTitles,
        datasets: datasetList,
      };
      return data;
    }
  
    const options = {
      scales: {
        x: {
          grid: {
            display: true,
            color: 'rgba(255, 99, 132, 0.2)', // Change the grid line color here
            borderColor: 'rgba(255, 99, 132, 1)', // Change the border color here
          },
          stacked: true,
        },
        y: {
          beginAtZero: true,
          grid: {
            display: true,
            color: 'rgba(54, 162, 235, 0.2)', // Change the grid line color here
            borderColor: 'rgba(54, 162, 235, 1)', // Change the border color here
          },
          stacked: true,
        },
      },
    };

    return (
        <BarGraph data={getFormattedData()} options={options} />
    );
  };

  export default WorkspaceUsage;