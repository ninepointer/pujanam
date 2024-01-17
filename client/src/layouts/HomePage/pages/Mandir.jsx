import { Grid } from '@mui/material'
import { ThemeProvider } from 'styled-components';
import React, {useState, useContext, useEffect} from "react"
import ReactGA from "react-ga";
import axios from "axios";
import PageNavbar from '../components/Navbars/PageNavbar'
import theme from '../utils/theme/index'
import background from '../../../assets/images/background.jpg'
import dhamicon from '../../../assets/images/dham.png'
import nearmeicon from '../../../assets/images/nearme.png'
import popularnearmeicon from '../../../assets/images/popular.png'
import Footer from '../../authentication/components/Footer'
import { apiUrl } from '../../../constants/constants';
import MDBox from '../../../components/MDBox';
import MDTypography from '../../../components/MDTypography';
import {Typography} from '@mui/material';
import MandirCard from './MandirCard'
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import AppBar from '@mui/material/AppBar';
import Tabs from '@mui/material/Tabs';
import PropTypes from 'prop-types';
import SwipeableViews from 'react-swipeable-views';
import TabPanel from '@mui/lab/TabPanel';
import MDAvatar from '../../../components/MDAvatar';
import {LocationContext} from "../../../locationContext";

function TabPanel1(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 0 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `full-width-tab-${index}`,
    'aria-controls': `full-width-tabpanel-${index}`,
  };
}


const About = () => {
    const [value, setValue] = React.useState(0);
    const [scrollPosition, setScrollPosition] = useState(0);
    const [data,setData] = useState([]);
    const [dham,setDham] = useState([]);
    const [popular,setPopular] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const locationContextData = useContext(LocationContext);
    const lat = locationContextData.locationState.latitude;
    const long = locationContextData.locationState.longitude;
    const handleChange = (event, newValue) => {
      setValue(newValue);
    };
  
    const handleChangeIndex = (index) => {
      setValue(index);
    };
  

  
    useEffect(()=>{
        let call1 = axios.get(`${apiUrl}mandir/user/allhome?lat=${lat}&long=${long}`,{
                    withCredentials: false,
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json",
                        "Access-Control-Allow-Credentials": true
                      },
                    })
        let call2 = axios.get(`${apiUrl}mandir/user/homedham?lat=${lat}&long=${long}`,{
          withCredentials: false,
          headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
              "Access-Control-Allow-Credentials": true
            },
          })
        let call3 = axios.get(`${apiUrl}mandir/user/allhomepopular?lat=${lat}&long=${long}`,{
          withCredentials: false,
          headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
              "Access-Control-Allow-Credentials": true
            },
          })
        Promise.all([call1,call2,call3])
        .then(([api1Response1,api1Response2,api1Response3]) => {
          // Process the responses here
          setData(api1Response1?.data?.data)
          setDham(api1Response2?.data?.data)
          setPopular(api1Response3?.data?.data)
          setTimeout(()=>{
            setIsLoading(false)
          },500)
        })
        .catch((error) => {
          // Handle errors here
        });
      },[locationContextData.locationState])

    useEffect(()=>{
        ReactGA.pageview(window.location.pathname)
    })

    useEffect(() => {
        const handleScroll = () => {
            setScrollPosition(window.scrollY);
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const handleOpenNewTab = async (elem) => {
    
        const newTab = window.open(`/mandir/${elem?.slug}`, '_blank');
        // await fetchDeviceDetail(elem?._id);
      };
    
    const backgroundColor = scrollPosition > 10 ? 'rgba(0, 0, 0, 0.8)' : 'transparent'
    const backdropFilter = scrollPosition > 10 ? 'blur(5px)' : 'none'

    return (
        <>
      <MDBox mt={-1} display='flex' justifyContent='center' flexDirection='column' alignContent='center' alignItems='center' style={{ minHeight:'auto', width: 'auto', minWidth:'100vW', overflow: 'visible'}}>
        <ThemeProvider theme={theme}>
          <PageNavbar />
          
          <Grid container display='flex' justifyContent='center' alignContent='center' alignItems='center' xs={12} md={12} lg={12} 
            style={{ 
                justifyContent: 'center',
                alignContent: 'center',
                backgroundImage: `url(${background})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center center',
                height: '100vh',
                // flexDirection: 'column',
                textAlign: 'center',
                padding: '20px',
                position: 'fixed',
                top: 0,
                left: 0,
                // filter: backdropFilter,
                // backgroundColor: backgroundColor,
                overflow: 'visible'
                }}
          >

          </Grid>

          <Grid container mt={15} mb={2} display='flex' justifyContent='flex-start' alignContent='center' alignItems='center' xs={12} md={12} lg={12} style={{ maxWidth: '95%', height: 'auto', flexGrow: 1, overflowY: 'auto', zIndex:3, overflow: 'visible' }}>
          <AppBar position="static" style={{borderBottom:'0.5px solid white',backgroundColor:"rgba(0, 0, 0, 0)", color:"red", display:'flex', maxWidth: '100%'}}>
            <Tabs
              value={value}
              onChange={handleChange}
              indicatorColor="secondary"
              textColor="inherit"
              variant="fullWidth"
              aria-label="full width tabs example"
              style={{backgroundColor:"rgba(0, 0, 0, 0)", color:"red", maxWidth:'60%'}}
            >
              <Tab 
                // label="About 4 Dham" 
                disableRipple="true" {...a11yProps(0)} 
                label={
                  <Grid container xs={12} md={12} lg={12} display='flex' justifyContent='center' alignItems='center' alignContent='center'>
                    <Grid xs={12} md={12} lg={12} item display='flex' justifyContent='center' alignItems='center' alignContent='center'>
                      <MDAvatar size='md' src={dhamicon} color='success'/>
                    </Grid>
                    <Grid xs={12} md={12} lg={12} item display='flex' justifyContent='center' alignItems='center' alignContent='center'>
                      About 4 Dham
                    </Grid>   
                  </Grid>
                }
              />
              <Tab 
                // label="Popular Mandir near me" 
                disableRipple="true" 
                {...a11yProps(1)}
                label={
                  <Grid container xs={12} md={12} lg={12} display='flex' justifyContent='center' alignItems='center' alignContent='center'>
                    <Grid xs={12} md={12} lg={12} item display='flex' justifyContent='center' alignItems='center' alignContent='center'>
                      <MDAvatar size='md' src={popularnearmeicon} color='success'/>
                    </Grid>
                    <Grid xs={12} md={12} lg={12} item display='flex' justifyContent='center' alignItems='center' alignContent='center'>
                      Popular Mandir near me
                    </Grid>   
                  </Grid>
                }
                />
              <Tab 
                // label="Mandir near me" 
                disableRipple="true" 
                {...a11yProps(2)} 
                label={
                  <Grid container xs={12} md={12} lg={12} display='flex' justifyContent='center' alignItems='center' alignContent='center'>
                    <Grid xs={12} md={12} lg={12} item display='flex' justifyContent='center' alignItems='center' alignContent='center'>
                      <MDAvatar size='md' src={nearmeicon} color='success'/>
                    </Grid>
                    <Grid xs={12} md={12} lg={12} item display='flex' justifyContent='center' alignItems='center' alignContent='center'>
                      Mandir near me
                    </Grid>   
                  </Grid>
                }
                />
            </Tabs>
          </AppBar>
          <SwipeableViews
            axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
            index={value}
            onChangeIndex={handleChangeIndex}
          >
            {!isLoading ? 
            <TabPanel1 value={value} index={0} dir={theme.direction}>
                <Grid item mt={2} mb={1} xs={12} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{ width: '100%', height: 'auto' }}>
                <Grid container xs={12} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{ maxWidth: '100%', height: 'auto' }}>
                    <Grid ml={2} item xs={12} md={12} lg={12} display='flex' justifyContent='flex-start' alignContent='center' alignItems='center' style={{ maxWidth: '100%', height: 'auto' }}>
                      <MDBox display='flex' justifyContent='flex-start' alignContent='flext-start' alignItems='center' style={{ maxWidth: '100%', height: 'auto' }}>
                        <MDTypography variant="h4" color="dark">All about 4 dham mandir!</MDTypography>
                      </MDBox>
                    </Grid>

                    <Grid mt={1} ml={2} item xs={12} md={12} lg={12} display='flex' justifyContent='flex-start' alignContent='center' alignItems='center' style={{backgroundColor:'white', borderRadius:10 ,maxWidth: '100%', height: 'auto' }}>
                      <MDBox p={2} display='flex' justifyContent='center' alignContent='flext-start' alignItems='center' style={{ maxWidth: '100%', height: 'auto' }}>
                        <MDTypography variant="body2" color="dark">Char Dham are the four places in India with high pilgrimage importance. These four places are namely Rameshwaram, Jaganath-Puri, Badrinath-Kedarnath and Dwarka. Adi Shankaracharya defined the term Char Dham as the three Vaishnavite, than one Shaivite and the last a state of mixed ones. It is some of the most holy places that a Hindu should visit, at least once in a lifetime. The origin of these four temples here is still not well known and has remained to be a mysterious fact. Shankaracharya is said to have established the Advaita school of Hinduism, which was also accountable for the origin of the Char Dham. The four Hindu temples are lying across the four corners of India. The Badrinath temple is in the north, followed by the east temple of Jaganath Puri, the Dwarkadhish Temple located at Dwarka in the west, and Rameswaram in the south, the Ramanathaswamy Temple.</MDTypography>
                      </MDBox>
                    </Grid>

                    {dham?.length > 0 ?
                        <Grid item xs={12} mt={2} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{ maxWidth: '100%', height: 'auto' }}>

                        <MDBox display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{ maxWidth: '100%', height: 'auto' }}>
                            <Grid container spacing={4} xs={12} md={12} lg={12} display='flex' justifyContent='flex-start' alignContent='center' alignItems='center' style={{ width: '100%', height: 'auto' }}>
                            {dham?.map((elem) => {
                                return (
                                <Grid key={elem?._id} item xs={12} md={4} lg={3} display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{ width: '100%', height: 'auto' }}>
                                    <MandirCard elem={elem}/>
                                </Grid>
                                )
                            })}
                            </Grid>
                        </MDBox>

                        </Grid>
                        :
                        <>
                        {/* <img src={NoData} width='500px' height='500px' /> */}
                        </>
                    }

                </Grid>
                </Grid>
            </TabPanel1>
            :
            <TabPanel1 value={value} index={0} dir={theme.direction}>
            <MDBox display='flex' justifyContent='center' alignContent='center' alignItems='center'>
              <MDTypography></MDTypography>
            </MDBox>
            </TabPanel1>
            }
            <TabPanel1 value={value} index={1} dir={theme.direction}>
                <Grid item mt={2} mb={1} xs={12} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{ width: '100%' }}>
                <Grid container xs={12} md={12} lg={12} display='flex' justifyContent='flex-start' alignContent='center' alignItems='center' style={{ maxWidth: '100%', height: 'auto' }}>
                    <Grid ml={2} item xs={12} md={12} lg={12} display='flex' justifyContent='flex-start' alignContent='center' alignItems='center' style={{ maxWidth: '100%', height: 'auto' }}>
                      <MDBox display='flex' justifyContent='center' alignContent='flext-start' alignItems='center' style={{ maxWidth: '100%', height: 'auto' }}>
                        <MDTypography variant="h4" color="dark">Popular Mandir near you!</MDTypography>
                      </MDBox>
                    </Grid>

                    <Grid ml={2} item xs={12} md={12} lg={12} display='flex' justifyContent='flex-start' alignContent='center' alignItems='center' style={{ maxWidth: '100%', height: 'auto' }}>
                      <MDBox display='flex' justifyContent='center' alignContent='flext-start' alignItems='center' style={{ maxWidth: '100%', height: 'auto' }}>
                        <MDTypography variant="body2" color="dark">All Mandir near you!</MDTypography>
                      </MDBox>
                    </Grid>

                    {popular?.length > 0 ?
                        <Grid item xs={12} mt={2} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{ maxWidth: '100%', height: 'auto' }}>

                        <MDBox display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{ maxWidth: '100%', height: 'auto' }}>
                            <Grid container spacing={4} xs={12} md={12} lg={12} display='flex' justifyContent='flex-start' alignContent='center' alignItems='center' style={{ width: '100%', height: 'auto' }}>
                            {popular?.map((elem) => {
                                return (
                                <Grid key={elem?._id} item xs={12} md={4} lg={3} display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{ width: '100%', height: 'auto' }}>
                                    <MandirCard elem={elem}/>
                                </Grid>
                                )
                            })}
                            </Grid>
                        </MDBox>

                        </Grid>
                        :
                        <>
                        {/* <img src={NoData} width='500px' height='500px' /> */}
                        </>
                    }

                </Grid>
                </Grid>
            </TabPanel1>
            <TabPanel1 value={value} index={2} dir={theme.direction}>
                <Grid item mt={2} mb={1} xs={12} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{ width: '100%' }}>
                <Grid container xs={12} md={12} lg={12} display='flex' justifyContent='flex-start' alignContent='center' alignItems='center' style={{ maxWidth: '100%', height: 'auto' }}>
                    <Grid ml={2} item xs={12} md={12} lg={12} display='flex' justifyContent='flex-start' alignContent='center' alignItems='center' style={{ maxWidth: '100%', height: 'auto' }}>
                      <MDBox display='flex' justifyContent='center' alignContent='flext-start' alignItems='center' style={{ maxWidth: '100%', height: 'auto' }}>
                        <MDTypography variant="h4" color="dark">All Mandir near you!</MDTypography>
                      </MDBox>
                    </Grid>

                    <Grid ml={2} item xs={12} md={12} lg={12} display='flex' justifyContent='flex-start' alignContent='center' alignItems='center' style={{ maxWidth: '100%', height: 'auto' }}>
                      <MDBox display='flex' justifyContent='center' alignContent='flext-start' alignItems='center' style={{ maxWidth: '100%', height: 'auto' }}>
                        <MDTypography variant="body2" color="dark">All Mandir near you!</MDTypography>
                      </MDBox>
                    </Grid>

                    {data?.length > 0 ?
                        <Grid item xs={12} mt={2} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{ maxWidth: '100%', height: 'auto' }}>

                        <MDBox display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{ maxWidth: '100%', height: 'auto' }}>
                            <Grid container spacing={4} xs={12} md={12} lg={12} display='flex' justifyContent='flex-start' alignContent='center' alignItems='center' style={{ width: '100%', height: 'auto' }}>
                            {data?.map((elem) => {
                                return (
                                <Grid key={elem?._id} item xs={12} md={4} lg={3} display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{ width: '100%', height: 'auto' }}>
                                    <MandirCard elem={elem}/>
                                </Grid>
                                )
                            })}
                            </Grid>
                        </MDBox>

                        </Grid>
                        :
                        <>
                        {/* <img src={NoData} width='500px' height='500px' /> */}
                        </>
                    }

                </Grid>
                </Grid>
            </TabPanel1>
          </SwipeableViews>
              </Grid>
        </ThemeProvider>
      </MDBox>

      <MDBox display='flex' justifyContent='center' alignContent='center' alignItems='flex-end' >
        <Footer />
      </MDBox>
    </>
    )
}

export default About;



