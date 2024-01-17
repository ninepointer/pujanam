import React, {useEffect, useState, useContext} from 'react'
import axios from "axios";
import {apiUrl} from "../../../constants/constants.js"
import MDBox from '../../../components/MDBox';
import { ThemeProvider } from 'styled-components';
import Navbar from '../components/Navbars/Navbar';
import theme from '../utils/theme/index';
import {useLocation} from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { Grid, useMediaQuery } from '@mui/material';
import MDTypography from '../../../components/MDTypography/index.js';
import moment from 'moment'
import { CiTimer } from "react-icons/ci";
import { CiRead } from "react-icons/ci";
import Footer from '../../authentication/components/Footer/index.js'
import { CircularProgress } from '@mui/material';
import background from '../../../assets/images/background.jpg'
import ReactGA from "react-ga"
import { FaTags } from "react-icons/fa";
import { IoMdSunny } from "react-icons/io";
import { IoMoonOutline } from "react-icons/io5";
import { RxAccessibility } from "react-icons/rx";
import { GiPrayer } from "react-icons/gi";
import { BsPersonCircle } from "react-icons/bs";
import getInfo from './unknownUserIPV4Info.js';
import {LocationContext} from "../../../locationContext";

export default function MandirData() {
  const [mandirData, setMandirData] = useState();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const locationContextData = useContext(LocationContext)

  // console.log("locationContextData", locationContextData.locationState)
  useEffect(()=>{
    if(mandirData?._id){
      storeUnknownUserInfo();
    }
    
  }, [mandirData])

  async function storeUnknownUserInfo(){
    const data = await getInfo();

    const { ip, country, isMobile } = data;

    const res = await fetch(`${apiUrl}unknown/mandir`, {
      method: "POST",
      credentials: "include",
      headers: {
        "content-type": "application/json",
        "Access-Control-Allow-Credentials": true
      },
      body: JSON.stringify({
        ip, country, is_mobile: isMobile, mandirId: mandirData?._id, 
        address: locationContextData.locationState.address,
        longitude: locationContextData.locationState.longitude,
        latitude: locationContextData.locationState.latitude
      })
    });

    const getData = await res.json();
    console.log(getData);
  }

  useEffect(() => {
    let call1 = axios.get(`${apiUrl}mandir/user/byslug/${location?.pathname?.split("/")[2]}`, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "Access-Control-Allow-Credentials": true
      },
    })
    Promise.all([call1])
      .then(([api1Response]) => {
        setMandirData(api1Response.data.data)
        setTimeout((() => setIsLoading(false)), 500);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  useEffect(() => {
    ReactGA.pageview(window.location.pathname)
  }, []);

  useEffect(()=>{
    mandirData && fetchDeviceDetail(mandirData?._id);
  }, [mandirData])
  const fetchDeviceDetail = async (id)=>{
    const ipData = await axios.get('https://geolocation-db.com/json/');
    console.log(ipData)
    const ip = ipData?.data?.IPv4;
    const country = ipData?.data?.country_name;
    const isMobile = /Mobi/.test(navigator.userAgent);

    const res = await fetch(`${apiUrl}mandir/savereader`, {
      method: "PATCH",
      credentials: "include",
      headers: {
        "content-type": "application/json",
        "Access-Control-Allow-Credentials": true
      },
      body: JSON.stringify({
        ip, country, isMobile, mandirId: id
      })
    });


    const data = await res.json();
  }

  const isMobile = useMediaQuery(theme.breakpoints.down("lg"))

  return (
    <MDBox>
      <MDBox display='flex' justifyContent='center' alignContent='center' alignItems='flex-start' style={{ backgroundColor: 'white', height: 'auto', width: 'auto', maxWidth: '100vW' }}>
        <ThemeProvider theme={theme}>
          <Navbar />
          <Grid container p={5} xs={12} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='flex-start' style={{width:'100%'}}>
          {isLoading ?
            
              <Grid container mt={35} display='flex' justifyContent='center' alignContent='center' alignItems='flex-start' xs={12} md={12} lg={12} style={{ maxWidth: '100%', height: 'auto' }}>
                <CircularProgress color='success' />
              </Grid>
           
            :
              <>
                <Helmet>
                  <title>{mandirData?.name}</title>
                  <meta name='description' content={mandirData?.description} />
                  <meta name='keywords' content={mandirData?.tags} />
                  <meta name="twitter:card" content="summary_large_image" />
                  <meta name="twitter:title" content={mandirData?.name} />
                  <meta name="twitter:description" content={mandirData?.description} />
                  <meta name="twitter:image" content={mandirData?.cover_image?.url} />
                  <meta itemprop="image" content={mandirData?.cover_image?.url}></meta>
                  <meta property="og:title" content={mandirData?.name} />
                  <meta property="og:description" content={mandirData?.description} />
                  <meta property="og:image" content={mandirData?.cover_image?.url} />
                  <meta property="og:url" content={`https://stoxhero.com/mandir/${location?.pathname?.split("/")[2]}`} />

                </Helmet>
                {/* } */}

                <Grid container mt={0} xs={12} md={12} lg={12} display='flex' justifyContent='center' alignItems='center' style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignContent: 'center',
                    backgroundImage: `url(${background})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center center',
                    height: '100vh',
                    flexDirection: 'column',
                    textAlign: 'center',
                    padding: '20px',
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    // filter: backdropFilter,
                    // backgroundColor: backgroundColor,
                    // overflow: 'visible'
                    }}>
                </Grid>

                <Grid container xs={12} md={12} lg={10} mt={5} display='flex' justifyContent='center' alignContent='center' alignItems='flex-start' style={{ maxWidth: '100%', height: 'auto', zIndex:1 }}>
                  <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='flex-start' style={{ maxWidth: '100%', height: 'auto' }}>
                    <Grid container spacing={1} xs={12} md={12} lg={12} mb={5} display='flex' justifyContent='center' alignContent='center' alignItems='flex-start' style={{ maxWidth: '100%', height: 'auto' }}>

                      <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{ maxWidth: '100%', height: '100%' }}>
                        <Grid container spacing={3} xs={12} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{ width: '100%', height: '100%' }}>
                            <Grid item xs={12} md={12} lg={6} style={{ maxWidth: '100%', height: '100%' }}>
                            <img src={mandirData?.cover_image?.url} width='100%' />
                            </Grid>
                            <Grid item xs={12} md={12} lg={6} style={{ maxWidth: '100%', height: '100%' }}>
                            <Grid container spacing={2} xs={12} md={12} lg={12} style={{ maxWidth: '98%' }}>
                                <Grid item xs={6} md={6} lg={6} style={{ maxWidth: '100%' }}>
                                <img src={mandirData?.images[0]?.url} width='100%' />
                                </Grid>
                                <Grid item xs={6} md={6} lg={6} style={{ maxWidth: '100%' }}>
                                <img src={mandirData?.images[1]?.url} width='100%' />
                                </Grid>
                                <Grid item xs={6} md={6} lg={6} style={{ maxWidth: '100%' }}>
                                <img src={mandirData?.images[2]?.url} width='100%' />
                                </Grid>
                                <Grid item xs={6} md={6} lg={6} style={{ maxWidth: '100%' }}>
                                <img src={mandirData?.cover_image?.url} width='100%' />
                                </Grid>
                            </Grid>
                            </Grid>
                        </Grid>
                      </Grid>

                      <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='flex-start' alignContent='center' alignItems='flex-start' style={{ maxWidth: '100%', height: 'auto' }}>
                        <MDBox display='flex' justifyContent='flex-start' alignContent='center' alignItems='flex-start'>
                          <MDTypography variant="h5">{mandirData?.name}</MDTypography>
                        </MDBox>
                      </Grid>

                      <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='flex-start' alignContent='center' alignItems='flex-start' style={{ maxWidth: '100%', height: 'auto' }}>
                        <MDBox display='flex' justifyContent='flex-start' alignContent='center' alignItems='flex-start'>
                          <MDTypography variant="body2">{mandirData?.address_details?.address}, {mandirData?.address_details?.city}, {mandirData?.address_details?.state}, {mandirData?.address_details?.country}</MDTypography>
                        </MDBox>
                      </Grid>

                      <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='flex-start' alignContent='center' alignItems='flex-start' style={{ maxWidth: '100%', height: 'auto' }}>
                        <MDBox display='flex' justifyContent='flex-start' alignContent='center' alignItems='flex-start'>
                          <MDTypography color='success' variant="body2" style={{ display: 'flex', alignItems: 'center', alignContent: 'center' }}>
                            <CiTimer /> &nbsp;
                            {`${mandirData?.readingTime || 1} min read`} &nbsp;
                            <CiRead /> &nbsp;
                            {`${mandirData?.viewCount || 0} visitors`}
                          </MDTypography>
                        </MDBox>
                      </Grid>

                      <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='flex-start' alignContent='center' alignItems='center' style={{ maxWidth: '100%', height: 'auto' }}>
                        <MDBox display='flex' justifyContent='flex-start' alignContent='center' alignItems='center'>
                          <MDTypography variant="body2" style={{ display: 'flex', alignItems: 'center', alignContent: 'center' }}><FaTags /> &nbsp;{mandirData?.tags || "Tags not available"}</MDTypography>
                        </MDBox>
                      </Grid>

                      <Grid item xs={12} md={12} lg={6} display='flex' justifyContent='flex-start' alignContent='center' alignItems='center' style={{ maxWidth: '100%', height: 'auto' }}>
                        <MDBox display='flex' justifyContent='flex-start' alignContent='center' alignItems='center'>
                          <MDTypography variant="body2" style={{ display: 'flex', alignItems: 'center', alignContent: 'center' }}><IoMdSunny /> &nbsp;Morning Session: {moment.utc(mandirData?.morning_opening_time).utcOffset('+05:30').format('HH:mm a')} - {moment.utc(mandirData?.morning_closing_time).utcOffset('+05:30').format('HH:mm a')}</MDTypography>
                        </MDBox>
                      </Grid>

                      <Grid item xs={12} md={12} lg={6} display='flex' justifyContent='flex-start' alignContent='center' alignItems='center' style={{ maxWidth: '100%', height: 'auto' }}>
                        <MDBox display='flex' justifyContent='flex-start' alignContent='center' alignItems='center'>
                          <MDTypography variant="body2" style={{ display: 'flex', alignItems: 'center', alignContent: 'center' }}><GiPrayer /> &nbsp;Morning Aarti: {moment.utc(mandirData?.morning_opening_time).utcOffset('+05:30').format('HH:mm a')}</MDTypography>
                        </MDBox>
                      </Grid>

                      <Grid item xs={12} md={12} lg={6} display='flex' justifyContent='flex-start' alignContent='center' alignItems='center' style={{ maxWidth: '100%', height: 'auto' }}>
                        <MDBox display='flex' justifyContent='flex-start' alignContent='center' alignItems='center'>
                          <MDTypography variant="body2" style={{ display: 'flex', alignItems: 'center', alignContent: 'center' }}><IoMoonOutline /> &nbsp;Evening Session: {moment.utc(mandirData?.evening_opening_time).utcOffset('+05:30').format('HH:mm a')} - {moment.utc(mandirData?.evening_closing_time).utcOffset('+05:30').format('HH:mm a')}</MDTypography>
                        </MDBox>
                      </Grid>

                      <Grid item xs={12} md={12} lg={6} display='flex' justifyContent='flex-start' alignContent='center' alignItems='center' style={{ maxWidth: '100%', height: 'auto' }}>
                        <MDBox display='flex' justifyContent='flex-start' alignContent='center' alignItems='center'>
                          <MDTypography variant="body2" style={{ display: 'flex', alignItems: 'center', alignContent: 'center' }}><GiPrayer /> &nbsp;Evening Aarti: {moment.utc(mandirData?.morning_opening_time).utcOffset('+05:30').format('HH:mm a')}</MDTypography>
                        </MDBox>
                      </Grid>

                      <Grid item xs={12} md={12} lg={6} display='flex' justifyContent='flex-start' alignContent='center' alignItems='center' style={{ maxWidth: '100%', height: 'auto' }}>
                        <MDBox display='flex' justifyContent='flex-start' alignContent='center' alignItems='center'>
                          <MDTypography variant="body2" style={{ display: 'flex', alignItems: 'center', alignContent: 'center' }}><BsPersonCircle /> &nbsp;Main Diety: {mandirData?.devi_devta?.name}</MDTypography>
                        </MDBox>
                      </Grid>

                      <Grid item xs={12} md={12} lg={6} display='flex' justifyContent='flex-start' alignContent='center' alignItems='center' style={{ maxWidth: '100%', height: 'auto' }}>
                        <MDBox display='flex' justifyContent='flex-start' alignContent='center' alignItems='center'>
                          <MDTypography variant="body2" style={{ display: 'flex', alignItems: 'center', alignContent: 'center' }}><RxAccessibility /> &nbsp;Accessibility: Open to all/Members only</MDTypography>
                        </MDBox>
                      </Grid>

                      <Grid mt={5} item xs={12} md={12} lg={12} display='flex' justifyContent='flex-start' alignContent='center' alignItems='center' style={{ maxWidth: '100%', height: 'auto' }}>
                        <MDBox display='flex' justifyContent='flex-start' alignContent='center' alignItems='center'>
                          <MDTypography variant="h6" style={{ display: 'flex', alignItems: 'center', alignContent: 'center' }}>About the Mandir</MDTypography>
                        </MDBox>
                      </Grid>

                      <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='flex-start' alignContent='center' alignItems='flex-start' style={{ maxWidth: '100%', height: 'auto' }}>
                        <MDBox display='flex' justifyContent='flex-start' alignContent='center' alignItems='flex-start'>
                          <MDTypography variant="body2">{mandirData?.description}</MDTypography>
                        </MDBox>
                      </Grid>

                    </Grid>
                  </Grid>
                </Grid>

                <Grid container mt={2} mb={2} display='flex' justifyContent='center' alignContent='center' alignItems='center' xs={12} md={12} lg={12} style={{ minWidth: '100%', height: 'auto', flexGrow: 1, overflowY: 'auto', zIndex:3, overflow: 'visible' }}>
                    <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{ maxWidth: '95%', height: 'auto' }}>
                        <Footer/>
                    </Grid>
                </Grid>
              </>

            
          }

      </Grid>
      </ThemeProvider>
      </MDBox>


      <MDBox>
        <Footer />
      </MDBox>
    </MDBox>
  );
}