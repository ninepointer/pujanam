import React, {useEffect, useState, useContext} from 'react'
import axios from "axios";
import {apiUrl} from "../../../../constants/constants.js"
import MDBox from '../../../../components/MDBox/index.js';
import { ThemeProvider } from 'styled-components';
import PageNavbar from '../../components/Navbars/PageNavbar.jsx';
import theme from '../../utils/theme/index';
import {useLocation} from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { Grid, useMediaQuery } from '@mui/material';
import MDTypography from '../../../../components/MDTypography/index.js';
import moment from 'moment'
import { CiTimer } from "react-icons/ci";
import { CiRead } from "react-icons/ci";
import Footer from '../../../authentication/components/Footer/index.js'
import { CircularProgress } from '@mui/material';
import background from '../../../../assets/images/background.jpg'
import ReactGA from "react-ga"
import { FaTags } from "react-icons/fa";
import { IoMdSunny } from "react-icons/io";
import { IoMoonOutline } from "react-icons/io5";
import { RxAccessibility } from "react-icons/rx";
import { GiPrayer } from "react-icons/gi";
import { BsPersonCircle } from "react-icons/bs";
import getInfo from '../unknownUserIPV4Info.js';
import {LocationContext} from "../../../../locationContext.js";
import Card from '@mui/material/Card';
import { CardActionArea, Divider, Typography } from '@mui/material';
import CardContent from '@mui/material/CardContent';
import Modal from '@mui/material/Modal';
import MDButton from '../../../../components/MDButton/index.js';
import { Tooltip } from "@mui/material";
import MDSnackbar from "../../../../components/MDSnackbar/index.js";

export default function MandirData() {
  const [mandirData, setMandirData] = useState();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const locationContextData = useContext(LocationContext)
  const [modalOpen, setModalOpen] = useState(false);
  const [image, setImage] = useState('');

  const handleOpenModal = (image) => {
    setModalOpen(true);
    setImage(image);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  useEffect(()=>{
    ReactGA.pageview(window.location.pathname)
  })

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

  const handleOpenGoogleMaps = (lat,lon) => {
    // Open Google Maps in a new tab with the specified coordinates
    window.open(`https://www.google.com/maps?q=${lat},${lon}`);
  };

  const handleSharePage = (elem) => {
    let text = `https://punyam.app/${elem?.slug}\n${elem?.name}\n${elem?.address_details?.address}, ${elem?.address_details?.city}, ${elem?.address_details?.state}`
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        openSuccessSB('success', 'Link Copied', 'Share it with spiritual friends & family');
  };

  const isMobile = useMediaQuery(theme.breakpoints.down("lg"))

  const [messageObj, setMessageObj] = useState({
    color: '',
    icon: '',
    title: '',
    content: ''
})

const [successSB, setSuccessSB] = useState(false);
const openSuccessSB = (value, title, content) => {
    if (value === "error") {
        messageObj.color = 'error'
        messageObj.icon = 'error'
        messageObj.title = "Error";
        messageObj.content = content;
    };

    if (value === "success") {
        messageObj.color = 'success'
        messageObj.icon = 'check'
        messageObj.title = title;
        messageObj.content = content;
    };

    setMessageObj(messageObj);
    setSuccessSB(true);
}
const closeSuccessSB = () => setSuccessSB(false);

const renderSuccessSB = (
    <MDSnackbar
        color={messageObj.color}
        icon={messageObj.icon}
        title={messageObj.title}
        content={messageObj.content}
        open={successSB}
        onClose={closeSuccessSB}
        close={closeSuccessSB}
        bgWhite="success"
        sx={{ borderLeft: `15px solid ${messageObj.icon == 'check' ? "white" : "red"}`, borderRight: `10px solid ${messageObj.icon == 'check' ? "white" : "red"}`, borderRadius: "15px", width: "auto" }}
    />
);

  return (
    <MDBox>
      <MDBox display='flex' justifyContent='center' alignContent='center' alignItems='flex-start' style={{ backgroundColor: 'white', height: 'auto', width: 'auto', maxWidth: '100vW' }}>
        <ThemeProvider theme={theme}>
          <PageNavbar />
          <Grid container p={0} mt={10} xs={12} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='flex-start' style={{width:'100%'}}>
          {isLoading ?
            
              <Grid container mt={35} display='flex' justifyContent='center' alignContent='center' alignItems='flex-start' xs={12} md={12} lg={12} style={{ maxWidth: '100%', height: 'auto' }}>
                <CircularProgress color='success' />
              </Grid>
           
            :
              <>
                <Helmet>
                  <title>{mandirData?.meta_title}</title>
                  <meta name='description' content={mandirData?.meta_description} />
                  <meta name='keywords' content={mandirData?.keywords} />
                  <meta name="twitter:card" content={mandirData?.cover_image?.url} />
                  <meta name="twitter:title" content={mandirData?.meta_title} />
                  <meta name="twitter:description" content={mandirData?.meta_description} />
                  <meta name="twitter:image" content={mandirData?.cover_image?.url} />
                  <meta itemprop="image" content={mandirData?.cover_image?.url}></meta>
                  <meta property="og:title" content={mandirData?.meta_title} />
                  <meta property="og:description" content={mandirData?.meta_description} />
                  <meta property="og:image" content={mandirData?.cover_image?.url} />
                  <meta property="og:url" content={`https://punyam.app/mandir/${location?.pathname?.split("/")[2]}`} />

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
                    }}>
                </Grid>

                <Grid container xs={12} md={12} lg={12} mt={5} display='flex' justifyContent='center' alignContent='center' alignItems='flex-start' style={{ maxWidth: '90%', height: 'auto', zIndex:1 }}>
                  <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{ maxWidth: '100%', height: 'auto' }}>
                    {/* <Grid container spacing={0} xs={12} md={12} lg={12} mb={2} display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{ maxWidth: '100%', height: 'auto' }}> */}

                      {/* <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{ maxWidth: '100%', height: '100%' }}> */}
                        <Grid container spacing={1} xs={12} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{ maxWidth: '100%', height: '100%' }}>
                            <Grid item xs={12} md={12} lg={6} display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{ maxWidth: '100%', height: 'auto' }}>
                                <Card sx={{ 
                                    minWidth: '100%', 
                                    cursor: 'pointer', 
                                    transition: 'transform 0.3s cubic-bezier(0.25, 0.1, 0.25, 1), box-shadow 0.3s cubic-bezier(0.25, 0.1, 0.25, 1)',
                                    '&:hover': {
                                        transform: 'scale(1.025)',
                                        boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)', // Adjust the box shadow as needed
                                        }
                                    }} 
                                    onClick={() => { handleOpenModal(mandirData?.cover_image?.url) }}
                                    >

                                  <CardActionArea>
                                      <Grid item xs={12} md={4} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{ maxWidth: '100%', height: 'auto' }}>
                                          <img src={mandirData?.cover_image?.url} style={{ maxWidth: '100%', height: 'auto', borderRadius: 10 }} />
                                          
                                      </Grid>
                                  </CardActionArea>
                                </Card>
                            </Grid>
                            <Grid item xs={12} md={12} lg={6} display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{ maxWidth: '100%', height: 'auto' }}>
                              <Grid container spacing={2} xs={12} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{ maxWidth: '100%', height: '100%' }}>
                                
                                <Grid item xs={12} md={12} lg={6} display='flex' justifyContent='center' alignContent='center' alignItems='center' 
                                  style={{ maxWidth: '100%', height: 'auto' }}
                                >
                                  <Card sx={{ 
                                      minWidth: '100%', 
                                      cursor: 'pointer', 
                                      transition: 'transform 0.3s cubic-bezier(0.25, 0.1, 0.25, 1), box-shadow 0.3s cubic-bezier(0.25, 0.1, 0.25, 1)',
                                      '&:hover': {
                                          transform: 'scale(1.05)',
                                          boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)', // Adjust the box shadow as needed
                                          }
                                      }} 
                                      onClick={() => { handleOpenModal(mandirData?.images[0]?.url) }}
                                      >

                                    <CardActionArea>
                                        <Grid item xs={12} md={4} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{ maxWidth: '100%', height: 'auto' }}>
                                            <img src={mandirData?.images[0]?.url} style={{ maxWidth: '100%', height: 'auto', borderRadius: 10 }} />
                                            
                                        </Grid>
                                    </CardActionArea>
                                  </Card>
                                </Grid>

                                <Grid item xs={12} md={12} lg={6} display='flex' justifyContent='center' alignContent='center' alignItems='center' 
                                  style={{ maxWidth: '100%', height: 'auto' }}
                                >
                                  <Card sx={{ 
                                      minWidth: '100%', 
                                      cursor: 'pointer', 
                                      transition: 'transform 0.3s cubic-bezier(0.25, 0.1, 0.25, 1), box-shadow 0.3s cubic-bezier(0.25, 0.1, 0.25, 1)',
                                      '&:hover': {
                                          transform: 'scale(1.05)',
                                          boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)', // Adjust the box shadow as needed
                                          }
                                      }} 
                                      onClick={() => { handleOpenModal(mandirData?.images[1]?.url) }}
                                      >

                                    <CardActionArea>
                                        <Grid item xs={12} md={4} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{ maxWidth: '100%', height: 'auto' }}>
                                            <img src={mandirData?.images[1]?.url} style={{ maxWidth: '100%', height: 'auto', borderRadius: 10 }} />
                                            
                                        </Grid>
                                    </CardActionArea>
                                  </Card>
                                </Grid>

                                <Grid item xs={12} md={12} lg={6} display='flex' justifyContent='center' alignContent='center' alignItems='center' 
                                  style={{ maxWidth: '100%', height: 'auto' }}
                                >
                                  <Card sx={{ 
                                      minWidth: '100%', 
                                      cursor: 'pointer', 
                                      transition: 'transform 0.3s cubic-bezier(0.25, 0.1, 0.25, 1), box-shadow 0.3s cubic-bezier(0.25, 0.1, 0.25, 1)',
                                      '&:hover': {
                                          transform: 'scale(1.05)',
                                          boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)', // Adjust the box shadow as needed
                                          }
                                      }} 
                                      onClick={() => { handleOpenModal(mandirData?.images[2]?.url) }}
                                      >

                                    <CardActionArea>
                                        <Grid item xs={12} md={4} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{ maxWidth: '100%', height: 'auto' }}>
                                            <img src={mandirData?.images[2]?.url} style={{ maxWidth: '100%', height: 'auto', borderRadius: 10 }} />
                                            
                                        </Grid>
                                    </CardActionArea>
                                  </Card>
                                </Grid>

                                <Grid item xs={12} md={12} lg={6} display='flex' justifyContent='center' alignContent='center' alignItems='center' 
                                  style={{ maxWidth: '100%', height: 'auto' }}
                                >
                                  <Card sx={{ 
                                      minWidth: '100%', 
                                      cursor: 'pointer', 
                                      transition: 'transform 0.3s cubic-bezier(0.25, 0.1, 0.25, 1), box-shadow 0.3s cubic-bezier(0.25, 0.1, 0.25, 1)',
                                      '&:hover': {
                                          transform: 'scale(1.05)',
                                          boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)', // Adjust the box shadow as needed
                                          }
                                      }} 
                                      onClick={() => { handleOpenModal(mandirData?.images[3]?.url) }}
                                      >

                                    <CardActionArea>
                                      <Grid item xs={12} md={4} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{ maxWidth: '100%', height: 'auto' }}>
                                        <img src={mandirData?.images[3]?.url} style={{ maxWidth: '100%', height: 'auto', borderRadius: 10 }} />
                                          {/* <MDTypography style={{
                                            variant:'caption',
                                            position: 'absolute',
                                            top: '50%',
                                            left: '50%',
                                            transform: 'translate(-50%, -50%)',
                                            textAlign: 'center',
                                            color: 'white', // You can adjust the text color
                                            fontWeight: 'bold', // You can adjust the font weight
                                            pointerEvents: 'none', // Allow clicks to go through the text
                                          }}>
                                            Open Gallery
                                          </MDTypography>       */}
                                      </Grid>
                                    </CardActionArea>
                                  </Card>
                                </Grid>
                              </Grid>
                            </Grid>
                            <Modal
                              open={modalOpen}
                              onClose={handleCloseModal}
                              aria-labelledby="image-modal"
                              aria-describedby="image-modal-description"
                              image={image}
                            >
                              <div style={{
                                position: 'absolute',
                                top: '50%',
                                left: '50%',
                                transform: 'translate(-50%, -50%)',
                                textAlign: 'center',
                              }}>
                                <img src={image} style={{ maxWidth: '100%', maxHeight: '100%', borderRadius: 10 }} />
                              </div>
                            </Modal>
                        </Grid>
                      {/* </Grid> */}
                    
                    {/* </Grid> */}
                  
                  </Grid>

                  <Grid p={2} mt={2} item xs={12} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{backgroundColor:'white', borderRadius:10 ,maxWidth: '100%', height: 'auto' }}>

                    <Grid container spacing={2} xs={12} md={12} lg={12} mb={2} display='flex' justifyContent='center' alignContent='center' alignItems='flex-start' style={{ maxWidth: '100%', height: 'auto' }}>

                      <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='flex-start' alignContent='center' alignItems='center' style={{ maxWidth: '100%', height: 'auto' }}>
                        <MDBox display='flex' justifyContent='center' alignContent='center' alignItems='center'>
                          <MDTypography variant="h5">{mandirData?.name}</MDTypography>
                          <MDButton 
                            variant="outlined" 
                            color="dark" 
                            size="small"
                            onClick={() => handleOpenGoogleMaps(mandirData?.address_details?.location?.coordinates[0],mandirData?.address_details?.location?.coordinates[1])} style={{ margin: '16px' }}
                          >
                            Direction
                          </MDButton>
                          <MDButton 
                            variant="outlined" 
                            color="dark" 
                            size="small"
                            onClick={() => handleSharePage(mandirData)} style={{ margin: '16px' }}
                          >
                            Share
                          </MDButton>
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
                          <MDTypography variant="body2" style={{ display: 'flex', alignItems: 'center', alignContent: 'center' }}><RxAccessibility /> &nbsp;Accessibility: {mandirData?.accessibility}</MDTypography>
                        </MDBox>
                      </Grid>

                      <Grid mt={2} item xs={12} md={12} lg={12} display='flex' justifyContent='flex-start' alignContent='center' alignItems='center' style={{ maxWidth: '100%', height: 'auto' }}>
                        <MDBox display='flex' justifyContent='flex-start' alignContent='center' alignItems='center'>
                          <MDTypography variant="h6" style={{ display: 'flex', alignItems: 'center', alignContent: 'center' }}>About the Mandir</MDTypography>
                        </MDBox>
                      </Grid>

                      <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{ maxWidth: '100%', height: 'auto' }}>
                          <MDBox style={{ maxWidth: '100%', width: '100%', height: 'auto' }}>
                              <div dangerouslySetInnerHTML={{ __html: mandirData?.description }} />
                              <style>
                                {`
                                img {
                                  max-width: 80%;
                                  height: auto;
                                }
                              `}
                              </style>
                            </MDBox>
                      </Grid>

                    </Grid>
                  </Grid>
                </Grid>

                <Grid container mt={2} display='flex' justifyContent='center' alignContent='center' alignItems='center' xs={12} md={12} lg={12} style={{ minWidth: '100%', height: 'auto', flexGrow: 1, overflowY: 'auto', zIndex:1, overflow: 'visible' }}>
                    <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{ maxWidth: '95%', height: 'auto' }}>
                        <Footer/>
                    </Grid>
                </Grid>
                {renderSuccessSB}
              </>
          }

      </Grid>
      </ThemeProvider>
      </MDBox>
    </MDBox>
  );
}