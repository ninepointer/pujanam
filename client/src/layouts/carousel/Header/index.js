import React, {useState} from 'react';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { CircularProgress } from '@mui/material';
import MDBox from '../../../components/MDBox';
import MDButton from '../../../components/MDButton';
import {Link} from 'react-router-dom'
import LiveCarousels from '../data/liveCarousels'
import UpcomingCarousels from '../data/upcomingCarousels'
import DraftCarousels from '../data/draftCarousels'
import MDTypography from '../../../components/MDTypography';
import PastCarousels from '../data/pastCarousals';


//data
// import UpcomingContest from '../data/UserContestCard'

export default function LabTabs() {
  const [value, setValue] = React.useState('1');
  const [isLoading,setIsLoading] = useState(false);

  const handleChange = (event, newValue) => {
    setIsLoading(true)
    setValue(newValue);
    setTimeout(() => {
      setIsLoading(false)
    }, 500);
  };

  return (
    <MDBox bgColor="light" color="light" mt={2} mb={1} p={1} borderRadius={10} minHeight='auto'>
    <MDBox mb={1} display="flex" justifyContent="space-between">
    <MDButton  
    variant="outlined" 
    color="success" 
    size="small"
    component={Link}
    to='/carouseldetails'
    >
        Create Carousel
    </MDButton>
    </MDBox>
      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider'}}>
          <TabList onChange={handleChange} aria-label="lab API tabs example">
            <Tab label="All Carousels" value="1" />
            <Tab label="Draft Carousels" value="2" />
            <Tab label="Past Carousels" value="3" />
          </TabList>
        </Box>
        <TabPanel value="1">
          {isLoading ? 
          <MDBox display="flex" justifyContent="center" alignItems="center" mt={2} mb={2}>
            <CircularProgress color="info" />
          </MDBox>
          : 
          <MDBox>
            <MDBox>
              <LiveCarousels/> 
            </MDBox>
            <MDBox>
              <UpcomingCarousels/> 
            </MDBox>
          </MDBox>
          }
        </TabPanel>
        <TabPanel value="2">
          {isLoading ? 
          <MDBox display="flex" justifyContent="center" alignItems="center" mt={5} mb={5}>
            <CircularProgress color="info" />
          </MDBox>
          : 
            <MDBox>
              <DraftCarousels/> 
            </MDBox>
          }
        </TabPanel>

        <TabPanel value="3">
          {isLoading ? 
          <MDBox display="flex" justifyContent="center" alignItems="center" mt={5} mb={5}>
            <CircularProgress color="info" />
          </MDBox>
          : 
            <MDBox>
              <PastCarousels/> 
            </MDBox>
          }
        </TabPanel>
      </TabContext>
    </MDBox>
  );
}