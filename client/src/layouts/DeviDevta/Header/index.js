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
import Active from '../data/activeDev'
import InActive from '../data/inactiveDev'


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
    <MDBox mt={2} bgColor="light" color="light" mb={1} p={2} borderRadius={10} minHeight='auto'>
    <MDBox mb={1} display="flex" justifyContent="space-between">
    <MDButton 
    variant="outlined" 
    color="success" 
    size="small"
    component={Link}
    to='/devidevtadetails'
    >
        Create DeviDevta
    </MDButton>
    </MDBox>
      <TabContext value={value}>
        <MDBox sx={{ border: 1, borderRadius:2, borderColor: 'divider'}}>
          <TabList onChange={handleChange} aria-label="lab API tabs example">
            <Tab label="Active" value="1" />
            <Tab label="Inactive" value="2" />
          </TabList>
        </MDBox>
          <TabPanel value="1">
          {isLoading ? 
          
          <MDBox display="flex" justifyContent="center" alignItems="center" mt={2} mb={2}>
            <CircularProgress color="success" />
          </MDBox>
          : 
          <MDBox style={{minWidth:'100%'}}>
          <Active/>
          </MDBox>
          }
          </TabPanel>
          <TabPanel value="2">
          {isLoading ? 
          
          <MDBox display="flex" justifyContent="center" alignItems="center" mt={2} mb={2}>
            <CircularProgress color="success" />
          </MDBox>
          : 
          <MDBox style={{minWidth:'100%'}}>
          <InActive/>
          </MDBox>
          }
          </TabPanel>
     
      
      </TabContext>
    </MDBox>
  );
}