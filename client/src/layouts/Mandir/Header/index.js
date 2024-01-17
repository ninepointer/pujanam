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
import Active from '../data/activeMandir'
import Inactive from '../data/inactiveMandir'
import Draft from '../data/draftMandir'
import MDTypography from '../../../components/MDTypography';


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
    <MDBox bgColor="light" color="light" mt={2} mb={1} p={2} borderRadius={10} minHeight='auto'>
    <MDBox mb={2} display="flex" justifyContent="space-between">
      <MDButton 
        variant="outlined" 
        color="success" 
        size="small"
        component={Link}
        to='/mandirdetails'
      >
        <MDTypography fontFamily='Itim' variant='caption'>Create Mandir</MDTypography>
    </MDButton>
    </MDBox>
      <TabContext value={value}>
        <MDBox sx={{ border: 1, borderRadius:2, borderColor: 'divider'}}>
          <TabList onChange={handleChange} aria-label="lab API tabs example">
            <Tab style={{fontFamily:'Itim'}} label="Active" value="1" />
            <Tab style={{fontFamily:'Itim'}} label="Inactive" value="2" />
            <Tab style={{fontFamily:'Itim'}} label="Draft" value="3" />
          </TabList>
        </MDBox>
          <TabPanel value="1">
          {isLoading ? 
          
          <MDBox display="flex" justifyContent="center" alignItems="center" mt={5} mb={5}>
            <CircularProgress color="info" />
          </MDBox>
          : 
          <MDBox style={{minWidth:'100%'}}>
            <Active/>
          </MDBox>
          }
          </TabPanel>
          <TabPanel value="2">
          {isLoading ? 
          
          <MDBox display="flex" justifyContent="center" alignItems="center" mt={5} mb={5}>
            <CircularProgress color="info" />
          </MDBox>
          : 
          <MDBox style={{minWidth:'100%'}}>
            <Inactive/>
          </MDBox>
          }
          </TabPanel>
          <TabPanel value="3">
          {isLoading ? 
          
          <MDBox display="flex" justifyContent="center" alignItems="center" mt={5} mb={5}>
            <CircularProgress color="info" />
          </MDBox>
          : 
          <MDBox style={{minWidth:'100%'}}>
            <Draft/>
          </MDBox>
   
          }
          </TabPanel>
     
      
      </TabContext>
    </MDBox>
  );
}