import { useState, useEffect } from "react";

// prop-types is a library for typechecking of props.
import PropTypes from "prop-types";

// @mui material components
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import AppBar from "@mui/material/AppBar";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Icon from "@mui/material/Icon";

// Material Dashboard 2 React components
import MDBox from "../../../components/MDBox";

// Material Dashboard 2 React base styles
import breakpoints from "../../../assets/theme/base/breakpoints";

// Images
import backgroundImage from "../../../assets/images/trading.jpg";
import Pending from "../Components/Pending";
import Accepeted from "../Components/Accepted";
import Dispatched from "../Components/Dispatched";
import Delivered from "../Components/Delivered";
import Rejected from "../Components/Rejected";



function WithdrawalHeader({ children }) {
  const [tabsOrientation, setTabsOrientation] = useState("horizontal");
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    // A function that sets the orientation state of the tabs.
    function handleTabsOrientation() {
      return window.innerWidth < breakpoints.values.sm
        ? setTabsOrientation("vertical")
        : setTabsOrientation("horizontal");
    }

    /** 
     The event listener that's calling the handleTabsOrientation function when resizing the window.
    */
    window.addEventListener("resize", handleTabsOrientation);

    // Call the handleTabsOrientation function to set the state with the initial value.
    handleTabsOrientation();

    // Remove event listener on cleanup
    return () => window.removeEventListener("resize", handleTabsOrientation);
  }, [tabsOrientation]);


  const handleSetTabValue = (event, newValue) => setTabValue(newValue);


  return (
   
    <MDBox position="relative" mb={5}>

      <MDBox
        display="flex"
        alignItems="center"
        position="relative"
        minHeight="10rem"
        borderRadius="x1"
        sx={{
        }}
      />
      <Card
        sx={{
          position: "relative",
          mt: -18,
          mx: 0,
          py: 2,
          px: 2,
        }}
      >
      
        <Grid container spacing={6} alignItems="center">
          <Grid item xs={12} md={12} lg={12} sx={{ ml: "auto" }}>
            <AppBar position="static">
              {/* <Tabs orientation={tabsOrientation} value={tabValue} onChange={handleSetTabValue}> */}
              <Tabs orientation={tabsOrientation} value={tabValue} onChange={handleSetTabValue}>
                <Tab
                  label="Pending"
                />
                <Tab
                  label="Accepeted"
                />           
                <Tab
                  label="Dispatched"
                /> 
                <Tab
                  label="Delivered"
                />
                <Tab
                  label="Rejected"
                />           
              </Tabs>
            </AppBar>
            <TabPanel value={tabValue} index={0}><Pending/></TabPanel>
            <TabPanel value={tabValue} index={1}><Accepeted/></TabPanel>
            <TabPanel value={tabValue} index={2}><Dispatched/></TabPanel>
            <TabPanel value={tabValue} index={3}><Delivered/></TabPanel>
            <TabPanel value={tabValue} index={4}><Rejected/></TabPanel>
          </Grid>
        </Grid>
        </Card>     
     </MDBox>
   
    
  );
}

// Setting default props for the Header
WithdrawalHeader.defaultProps = {
  children: "",
};

// Typechecking props for the Header
WithdrawalHeader.propTypes = {
  children: PropTypes.node,
};

function TabPanel(props){
  const{children,value,index}=props;
  return(
    <>
    {
      value === index &&
      <h1>{children}</h1>
    }
    </>
   
  )
}

export default WithdrawalHeader;
