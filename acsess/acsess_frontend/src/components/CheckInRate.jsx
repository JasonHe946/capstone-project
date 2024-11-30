import React from 'react';
import { Pie } from 'react-chartjs-2';
import { styled } from '@mui/material';

import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend
  } from 'chart.js';

// Register Chart.js components
ChartJS.register(
    ArcElement,
    Tooltip,
    Legend
);


const PieGraph = styled(Pie) ({
  flexBasis: '100%',
  maxHeight: '60vmin'
})

const NoInfo = styled('p')({
  fontSize: '40px',
  fontWeight: '700',
  color: '#5a5a5a',
})


const CheckInRate = (props) => {
  const [bookingData, setBookingData] = React.useState(props.data);
  const [viewWorkspace, setviewWorkspace] = React.useState(props.view); // Default to 'Show Both'
  const [periodView, setPeriodView] = React.useState(props.period);

  // Update state when props change
  React.useEffect(() => {
    setBookingData(props.data);
    setviewWorkspace(props.view);
    setPeriodView(props.period)
  }, [props.data, props.view, props.period]);

    // Utility function to check inclusion condition
    const shouldIncludeType = (type) => 
      viewWorkspace === `${type}` || viewWorkspace === 'Show All Workspaces';


  // Define the data for the pie chart
  let checkIn = 0;
  let noCheckIn = 0;
  for (let booking of bookingData) {
    if (booking.type === "HotDesk" && shouldIncludeType("Show Hotdesks") || booking.type === "Meeting-Room" && shouldIncludeType('Show Meeting Rooms')) {
      if (booking.checkIn) {
        checkIn++;
      } else {
        noCheckIn++;
      }
    }

  }
  const data = {
    labels: ["Checked-In", "No Check-In"],
    datasets: [
      {
        label: "Votes",
        data: [checkIn, noCheckIn],
        backgroundColor: [
          "rgba(49, 65, 61, 0.8)",
          "rgba(251, 115, 0, 0.2)",
        ],
        borderColor: [
          "rgba(75, 192, 192, 1)",
          "#FB7300",
        ],
        borderWidth: 1
      }
    ]
  };

  // Define the options for the pie chart
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
        labels: {
          boxWidth: 20,
          padding: +10
        }
      },
      tooltip: {
        enabled: true
      }
    }
  };
  
    return (
    <>
      {(checkIn === 0 && noCheckIn === 0) ? (
        <NoInfo>No data to display</NoInfo>
      ) : (
        <PieGraph data={data} options={options} />
      )}
    </>
    );
}

export default CheckInRate;