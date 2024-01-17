import React, {useState, useContext, useEffect} from "react"
import { useMediaQuery } from '@mui/material'
import theme from '../../HomePage/utils/theme/index'; 
import { ThemeProvider } from 'styled-components';
// import ReactGA from "react-ga"
import axios from "axios";
import playstore from '../../../assets/images/playstore.png'
import Navbar from '../../HomePage/components/Navbars/Navbar';
import background from '../../../assets/images/background.jpg'
import logo from '../../../assets/images/logo.png'
// import {Stack} from "@mui/material";
// import Autocomplete from 'react-google-autocomplete';


// react-router-dom components
// import { useLocation, useNavigate } from "react-router-dom";

// @mui material components
import Grid from "@mui/material/Grid";

// Material Dashboard 2 React components
import MDBox from "../../../components/MDBox";
import MDTypography from "../../../components/MDTypography";
// import MDButton from "../../../components/MDButton";


// Images
// import { userContext } from '../../../AuthContext';
import Footer from "../components/Footer";
import { apiUrl } from '../../../constants/constants';
// import { CgOverflow } from "react-icons/cg";
import HomePageMandirCard from './homePageMandirCards'
import HomePagePoojaServicesCard from './homePagePoojaServicesCards'
import HomePagePoojaSamagriCard from './homePagePoojaSamagriCards'
import HomePagePoojaWasteCard from './homePagePoojaWasteCards'
import PoojaServices from './poojaServices'
import TemplesNearMe from './templesNearMe'
import MapSearch from "./mapSearch";
import Dhams from './dhams'
import PopularMandirNearMe from './popularmandirNearMe'
import {settingContext} from '../../../settingContext';
import {LocationContext} from "../../../locationContext";


function Cover() {
  const locationContextData = useContext(LocationContext)
  const [isLoading,setIsLoading] = useState(false);
  const [data,setData] = useState([]);
  const [dham,setDham] = useState([]);
  const [popular,setPopular] = useState([]);
  const [pooja,setPooja] = useState([]);
  const [scrollPosition, setScrollPosition] = useState(0);

  const currentLocation = ({
    latitude: locationContextData.locationState.latitude,
    longitude: locationContextData.locationState.longitude
  });

  const setting = useContext(settingContext)

  useEffect(()=>{
    let call1 = axios.get(`${apiUrl}mandir/user/home?lat=${currentLocation.latitude}&long=${currentLocation.longitude}`,{
                withCredentials: false,
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Credentials": true
                  },
                })
    let call2 = axios.get(`${apiUrl}pooja/user/home`,{
      withCredentials: false,
      headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "Access-Control-Allow-Credentials": true
        },
      })
    let call3 = axios.get(`${apiUrl}mandir/user/homedham?lat=${currentLocation.latitude}&long=${currentLocation.longitude}`,{
      withCredentials: false,
      headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "Access-Control-Allow-Credentials": true
        },
      })
    let call4 = axios.get(`${apiUrl}mandir/user/homepopular?lat=${currentLocation.latitude}&long=${currentLocation.longitude}`,{
      withCredentials: false,
      headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "Access-Control-Allow-Credentials": true
        },
      })
    Promise.all([call1,call2,call3,call4])
    .then(([api1Response,api1Response1,api1Response2,api1Response3]) => {
      // Process the responses here
      setData(api1Response.data.data)
      setPooja(api1Response1.data.data)
      setDham(api1Response2.data.data)
      setPopular(api1Response3.data.data)
      setTimeout(()=>{
        setIsLoading(false)
      },100)
    })
    .catch((error) => {
      // Handle errors here
    });
  },[locationContextData.locationState])
  
  const isMobile = useMediaQuery(theme.breakpoints.down("lg"))

  const handlePlaystoreNavigate = () => {
    // Open google.com in a new tab
    window.open(`${setting.playstore_link}`, '_blank');
  };
  
  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const backgroundColor = scrollPosition > 10 ? 'rgba(0, 0, 0, 0.8)' : 'transparent'
  const backdropFilter = scrollPosition > 10 ? 'blur(5px)' : 'none'

  

  return (
    <>
      <MDBox mt={-1} display='flex' justifyContent='center' flexDirection='column' alignContent='center' alignItems='center' style={{ minHeight:'auto', width: 'auto', minWidth:'100vW', overflow: 'visible'}}>
      <ThemeProvider theme={theme}>
      <Navbar/>
      
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
          filter: backdropFilter,
          backgroundColor: backgroundColor,
          overflow: 'visible'
        }}>
       
        <Grid container mt={8} xs={12} md={12} lg={12} display='flex' justifyContent='center' alignItems='center' style={{ position: 'relative', textAlign: 'center', width: '100%', height: '100vh', overflow: 'visible' }}>
          <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center' alignItems='center' style={{overflow: 'visible'}}>
            <MDBox mb={2} display='flex' justifyContent='center' alignItems='center' style={{overflow: 'visible'}}>
              <img src={logo} width={350} alt="Logo" />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center' alignItems='center' style={{overflow: 'visible'}}>
            <MDBox mb={2} display='flex' justifyContent='center' alignItems='center' style={{overflow: 'visible'}}>
              <MapSearch  />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center' alignItems='center'>
            <MDBox display='flex' justifyContent='center' alignItems='center'>
              <MDTypography variant="h4" sx={{ color: '#fff' }} style={{fontFamily: 'Itim'}}>Seamlessly book pooja services,<br/> discover nearby and popular mandir,<br/> and order pooja samagri with punyam app</MDTypography>
            </MDBox>
          </Grid>
          <Grid item xs={12} md={12} lg={4} mb={isMobile ? 8 : 10} display='flex' justifyContent='center' alignItems='center'>
            <MDBox display='flex' justifyContent='center' alignItems='center'>   
              <img src={playstore} style={{cursor:'pointer', maxWidth: '80%', maxHeight: '10%', width: 'auto', height: 'auto' }} onClick={handlePlaystoreNavigate}/>
            </MDBox>
          </Grid>
        </Grid>
      </Grid>
      

      <Grid container mt={isMobile ? '93vH' : '87vH'} mb={2} display='flex' justifyContent='center' alignContent='center' alignItems='center' xs={12} md={12} lg={12} style={{ maxWidth: '100%', height: 'auto', flexGrow: 1, overflowY: 'auto', zIndex:3, overflow: 'visible' }}>

            <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{ maxWidth: '95%', height: 'auto', overflow: 'visible' }}>
              <Grid container xs={12} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{overflow: 'visible'}}>

                <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{ width: '100%', overflow: 'visible' }}>
                  <Grid container spacing={4} xs={12} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{ maxWidth: '100%', height: 'auto', overflow: 'visible' }}>
                    <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{ maxWidth: '100%', height: 'auto' }}>
                      <MDBox display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{ maxWidth: '100%', height: 'auto' }}>
                        <MDTypography variant="h4" fontWeight="bold" style={{color:'#fff', fontFamily: 'Itim'}}>|| offerings on punyam ||</MDTypography>
                      </MDBox>
                    </Grid>
                    <Grid item xs={12} md={12} lg={3} style={{overflow: 'visible'}}>
                      <HomePageMandirCard />
                    </Grid>
                    <Grid item xs={12} md={12} lg={3}>
                      <HomePagePoojaServicesCard />
                    </Grid>
                    <Grid item xs={12} md={12} lg={3}>
                      <HomePagePoojaSamagriCard />
                    </Grid>
                    <Grid item xs={12} md={12} lg={3} style={{overflow: 'visible'}}>
                      <HomePagePoojaWasteCard />
                    </Grid>
                  </Grid>
                </Grid>

              </Grid>
            </Grid>
      </Grid>

      <Grid container mb={2} display='flex' justifyContent='center' alignContent='center' alignItems='center' xs={12} md={12} lg={12} style={{ maxWidth: '100%', height: 'auto', flexGrow: 1, overflowY: 'auto', zIndex:3, overflow: 'visible' }}>

            <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{ maxWidth: '95%', height: 'auto' }}>
              <Grid container xs={12} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='center'>

                <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{ width: '100%' }}>
                  <Grid container xs={12} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{ maxWidth: '100%', height: 'auto' }}>
                    <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='flex-start' alignContent='center' alignItems='center' style={{ maxWidth: '100%', height: 'auto' }}>
                      <MDBox display='flex' justifyContent='flex-start' alignContent='center' alignItems='center' style={{ maxWidth: '100%', height: 'auto' }}>
                        <MDTypography fontSize={20} fontWeight="bold" ml={2} style={{color:'#fff', fontFamily:'Itim'}}>Trending Pooja, book at your doorstep now!</MDTypography>
                      </MDBox>
                    </Grid>

                      {pooja.length > 0 ?
                        <Grid item xs={12} mt={2} md={12} lg={12} alignItems='stretch'>

                          <MDBox display='flex' justifyContent='center' alignContent='center' alignItems='center'>
                            <Grid container spacing={3} xs={12} md={12} lg={12} display='flex' justifyContent='flex-start' alignContent='center' alignItems='center' style={{ maxWidth: '100%', height: 'auto' }}>
                              {pooja?.map((elem) => {
                                return (
                                  <Grid key={elem?._id} item xs={12} md={4} lg={3} display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{ maxWidth: '100%', height: 'auto' }}>
                                    <PoojaServices elem={elem} />
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

              </Grid>
            </Grid>
      </Grid>

      <Grid container mt={2} mb={2} display='flex' justifyContent='center' alignContent='center' alignItems='center' xs={12} md={12} lg={12} style={{ maxWidth: '100%', height: 'auto', flexGrow: 1, overflowY: 'auto', zIndex:3, overflow: 'visible' }}>

            <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{ maxWidth: '95%', height: 'auto' }}>
              <Grid container xs={12} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='center'>

                <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{ width: '100%' }}>
                  <Grid container xs={12} md={12} lg={12} display='flex' justifyContent='flex-start' alignContent='center' alignItems='center' style={{ maxWidth: '100%', height: 'auto' }}>
                    <Grid ml={2} item xs={12} md={12} lg={12} display='flex' justifyContent='flex-start' alignContent='center' alignItems='center' style={{ maxWidth: '100%', height: 'auto' }}>
                      <MDBox display='flex' justifyContent='center' alignContent='flext-start' alignItems='center' style={{ maxWidth: '100%', height: 'auto' }}>
                      <MDTypography fontSize={20} fontWeight="bold" style={{color:'#fff', fontFamily: 'Itim'}}>Mandir near me!</MDTypography>
                      </MDBox>
                    </Grid>

                      {data.length > 0 ?
                        <Grid item xs={12} mt={2} md={12} lg={12} alignItems='stretch'>

                          <MDBox display='flex' justifyContent='center' alignContent='center' alignItems='center'>
                            <Grid container spacing={3} xs={12} md={12} lg={12} display='flex' justifyContent='flex-start' alignContent='center' alignItems='center' style={{ maxWidth: '100%', height: 'auto' }}>
                              {data?.map((elem) => {
                                return (
                                  <Grid key={elem?._id} item xs={12} md={4} lg={3} display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{ maxWidth: '100%', height: 'auto' }}>
                                    <TemplesNearMe elem={elem}/>
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

              </Grid>
            </Grid>
      </Grid>

      <Grid container mt={2} mb={2} display='flex' justifyContent='center' alignContent='center' alignItems='center' xs={12} md={12} lg={12} style={{ maxWidth: '100%', height: 'auto', flexGrow: 1, overflowY: 'auto', zIndex:3, overflow: 'visible' }}>

            <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{ maxWidth: '95%', height: 'auto' }}>
              <Grid container xs={12} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='center'>

                <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{ width: '100%' }}>
                  <Grid container xs={12} md={12} lg={12} display='flex' justifyContent='flex-start' alignContent='center' alignItems='center' style={{ maxWidth: '100%', height: 'auto' }}>
                    <Grid ml={2} item xs={12} md={12} lg={12} display='flex' justifyContent='flex-start' alignContent='center' alignItems='center' style={{ maxWidth: '100%', height: 'auto' }}>
                      <MDBox display='flex' justifyContent='center' alignContent='flext-start' alignItems='center' style={{ maxWidth: '100%', height: 'auto' }}>
                      <MDTypography fontSize={20} fontWeight="bold" style={{color:'#fff', fontFamily: 'Itim'}}>Popular mandir near me!</MDTypography>
                      </MDBox>
                    </Grid>

                      {popular.length > 0 ?
                        <Grid item xs={12} mt={2} md={12} lg={12} alignItems='stretch'>

                          <MDBox display='flex' justifyContent='center' alignContent='center' alignItems='center'>
                            <Grid container spacing={3} xs={12} md={12} lg={12} display='flex' justifyContent='flex-start' alignContent='center' alignItems='center' style={{ maxWidth: '100%', height: 'auto' }}>
                              {popular?.map((elem) => {
                                return (
                                  <Grid key={elem?._id} item xs={12} md={4} lg={3} display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{ maxWidth: '100%', height: 'auto' }}>
                                    <PopularMandirNearMe elem={elem}/>
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

              </Grid>
            </Grid>
      </Grid>

      <Grid container mt={2} mb={2} display='flex' justifyContent='center' alignContent='center' alignItems='center' xs={12} md={12} lg={12} style={{ maxWidth: '100%', height: 'auto', flexGrow: 1, overflowY: 'auto', zIndex:3, overflow: 'visible' }}>

            <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{ maxWidth: '95%', height: 'auto' }}>
              <Grid container xs={12} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='center'>

                <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{ width: '100%' }}>
                  <Grid container xs={12} md={12} lg={12} display='flex' justifyContent='flex-start' alignContent='center' alignItems='center' style={{ maxWidth: '100%', height: 'auto' }}>
                    <Grid ml={2} item xs={12} md={12} lg={12} display='flex' justifyContent='flex-start' alignContent='center' alignItems='center' style={{ maxWidth: '100%', height: 'auto' }}>
                      <MDBox display='flex' justifyContent='center' alignContent='flext-start' alignItems='center' style={{ maxWidth: '100%', height: 'auto' }}>
                      <MDTypography fontSize={20} fontWeight="bold" style={{color:'#fff', fontFamily: 'Itim'}}>Char Dham!</MDTypography>
                      </MDBox>
                    </Grid>

                      {dham.length > 0 ?
                        <Grid item xs={12} mt={2} md={12} lg={12} alignItems='stretch'>

                          <MDBox display='flex' justifyContent='center' alignContent='center' alignItems='center'>
                            <Grid container spacing={3} xs={12} md={12} lg={12} display='flex' justifyContent='flex-start' alignContent='center' alignItems='center' style={{ maxWidth: '100%', height: 'auto' }}>
                              {dham?.map((elem) => {
                                return (
                                  <Grid key={elem?._id} item xs={12} md={4} lg={3} display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{ maxWidth: '100%', height: 'auto' }}>
                                    <Dhams elem={elem}/>
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

              </Grid>
            </Grid>
      </Grid>

      <Grid container mt={2} mb={2} display='flex' justifyContent='center' alignContent='center' alignItems='center' xs={12} md={12} lg={12} style={{ minWidth: '100%', height: 'auto', flexGrow: 1, overflowY: 'auto', zIndex:3, overflow: 'visible' }}>
        <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{ maxWidth: '95%', height: 'auto' }}>
          <Footer/>
        </Grid>
      </Grid>
      </ThemeProvider>
      </MDBox>
    </>
      
  );
}

export default Cover;
