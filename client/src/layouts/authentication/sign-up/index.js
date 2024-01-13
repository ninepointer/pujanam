import React, {useState, useContext, useEffect} from "react"
import { useMediaQuery } from '@mui/material'
import theme from '../../HomePage/utils/theme/index'; 
import { ThemeProvider } from 'styled-components';
import ReactGA from "react-ga"
import axios from "axios";
import playstore from '../../../assets/images/playstore.png'
import Navbar from '../../HomePage/components/Navbars/Navbar';
import background from '../../../assets/images/background.jpg'
import logo from '../../../assets/images/logo.png'
// import Autocomplete from 'react-google-autocomplete';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import LocationOnIcon from '@mui/icons-material/LocationOn';
// import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import parse from 'autosuggest-highlight/parse';
import { debounce } from '@mui/material/utils';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import { CardActionArea, Divider } from '@mui/material';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import { Link } from "react-router-dom";

// react-router-dom components
import { useLocation, useNavigate } from "react-router-dom";
import { GoogleMap, LoadScript, StandaloneSearchBox, Marker } from '@react-google-maps/api';

// @mui material components
import Grid from "@mui/material/Grid";

// Material Dashboard 2 React components
import MDBox from "../../../components/MDBox";
import MDTypography from "../../../components/MDTypography";
import MDButton from "../../../components/MDButton";


// Images
import { userContext } from '../../../AuthContext';
import Footer from "../components/Footer";
import { apiUrl } from '../../../constants/constants';
import { CgOverflow } from "react-icons/cg";
import HomePageMandirCard from './homePageMandirCards'
import HomePagePoojaServicesCard from './homePagePoojaServicesCards'
import HomePagePoojaSamagriCard from './homePagePoojaSamagriCards'
import HomePagePoojaWasteCard from './homePagePoojaWasteCards'
import MapSearch from "./mapSearch";

// const GOOGLE_MAPS_API_KEY = 'AIzaSyArsP6WOgekS-LFDimu2G6FrsRrB6K29BI';

// function loadScript(src, position, id) {
//   if (!position) {
//     return;
//   }

//   const script = document.createElement('script');
//   script.setAttribute('async', '');
//   script.setAttribute('id', id);
//   script.src = src;
//   position.appendChild(script);
// }

// const autocompleteService = { current: null };


function Cover(props) {
  const navigate = useNavigate();
  const location = useLocation();
  const [count, setCount] = useState(0);
  const [isLoading,setIsLoading] = useState(false);
  const [data,setData] = useState([]);
  const [pooja,setPooja] = useState([]);
  const [scrollPosition, setScrollPosition] = useState(0);
  // const GOOGLE_MAPS_API_KEY = 'AIzaSyC3aviU6KHXAjoSnxcw6qbOhjnFctbxPkE';
  const handlePlaceSelected = (place) => {
    // Handle the selected place data (e.g., extract latitude and longitude)
    console.log('Selected Place:', place);
  };
  const [center, setCenter] = useState({ lat: 0, lng: 0 });
  const [markerPosition, setMarkerPosition] = useState(null);
  const [value, setValue] = React.useState(null);
  const [inputValue, setInputValue] = React.useState('');
  const [options, setOptions] = React.useState([]);
  // const loaded = React.useRef(false);

  // if (typeof window !== 'undefined' && !loaded.current) {
  //   if (!document.querySelector('#google-maps')) {
  //     loadScript(
  //       `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places`,
  //       document.querySelector('head'),
  //       'google-maps',
  //     );
  //   }

  //   loaded.current = true;
  // }

  // const fetch = React.useMemo(
  //   () =>
  //     debounce((request, callback) => {
  //       autocompleteService.current.getPlacePredictions(request, callback);
  //     }, 400),
  //   [],
  // );

  // React.useEffect(() => {
  //   let active = true;

  //   if (!autocompleteService.current && window.google) {
  //     autocompleteService.current =
  //       new window.google.maps.places.AutocompleteService();
  //   }
  //   if (!autocompleteService.current) {
  //     return undefined;
  //   }

  //   if (inputValue === '') {
  //     setOptions(value ? [value] : []);
  //     return undefined;
  //   }

  //   fetch({ input: inputValue }, (results) => {
  //     if (active) {
  //       let newOptions = [];

  //       if (value) {
  //         newOptions = [value];
  //       }

  //       if (results) {
  //         newOptions = [...newOptions, ...results];
  //       }

  //       setOptions(newOptions);
  //     }
  //   });

  //   return () => {
  //     active = false;
  //   };
  // }, [value, inputValue, fetch]);


  // const onLoad = (map) => {
  //   navigator.geolocation.getCurrentPosition(
  //     (position) => {
  //       const { latitude, longitude } = position.coords;
  //       setCenter({ lat: latitude, lng: longitude });
  //       setMarkerPosition({ lat: latitude, lng: longitude });
  //     },
  //     (error) => {
  //       console.error('Error getting current location:', error);
  //     }
  //   );
  // };

  useEffect(()=>{
    let call1 = axios.get(`${apiUrl}usermandir/home`,{
                withCredentials: false,
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Credentials": true
                  },
                })
    let call2 = axios.get(`${apiUrl}pooja/home`,{
      withCredentials: false,
      headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "Access-Control-Allow-Credentials": true
        },
      })
    Promise.all([call1,call2])
    .then(([api1Response,api1Response1]) => {
      // Process the responses here
      setData(api1Response.data.data)
      setPooja(api1Response1.data.data)
      setTimeout(()=>{
        setIsLoading(false)
      },100)
    })
    .catch((error) => {
      // Handle errors here
    });
  },[])

  // const onPlacesChanged = (places) => {
  //   const place = places[0];
  //   setCenter({
  //     lat: place.geometry.location.lat(),
  //     lng: place.geometry.location.lng(),
  //   });
  //   setMarkerPosition({
  //     lat: place.geometry.location.lat(),
  //     lng: place.geometry.location.lng(),
  //   });
  // };
  
  const isMobile = useMediaQuery(theme.breakpoints.down("lg"))

  const handleImageClick = () => {
    // Open google.com in a new tab
    window.open('https://play.google.com/store/apps/details?id=com.stoxhero.app', '_blank');
  };

  const handleOpenNewTab = async (elem) => {
    
    const newTab = window.open(`/pooja/${elem?.slug}`, '_blank');
    // await fetchDeviceDetail(elem?._id);
  };

  function limitStringWithEllipsis(inputString, maxLength) {
    if (inputString.length > maxLength) {
      return inputString.slice(0, maxLength) + '...';
    }
    return inputString;
  }
  
  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const backgroundColor = scrollPosition > 250 ? 'white' : 'transparent'
  const backdropFilter = scrollPosition > 250 ? 'blur(5px)' : 'none'

  

  return (
    <>
      <MDBox mt={-1} display='flex' justifyContent='center' flexDirection='column' alignContent='center' alignItems='flex-start' style={{backgroundColor:'white', minHeight:'auto', height: 'relative', width: 'auto', minWidth:'100vW'}}>
      <ThemeProvider theme={theme}>
      <Navbar/>

      <Grid container mt={0} xs={12} md={12} lg={12} style={{
          display: 'flex',
          justifyContent: 'center',
          alignContent: 'center',
          // alignItems: 'stretch',
          backgroundImage: `url(${background})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center center',
          height: '100vh', // Adjust the percentage as needed
          flexDirection: 'column',
          textAlign: 'center',
          padding: '20px',
          position: 'fixed',
          top: 0,
          left: 0,
          // zIndex: 2,
          filter: backdropFilter,
          backgroundColor: backgroundColor,
        }}>
       
        <Grid container mt={8} xs={12} md={12} lg={12} display='flex' justifyContent='center' alignItems='center' style={{ position: 'relative', textAlign: 'center', width: '100%', height: '100vh' }}>
          <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center' alignItems='center'>
            <MDBox mb={2} display='flex' justifyContent='center' alignItems='center'>
              <img src={logo} width={150} alt="Logo" />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center' alignItems='center'>
            <MDBox mb={2} display='flex' justifyContent='center' alignItems='center'>
              <MapSearch />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center' alignItems='center'>
            <MDBox display='flex' justifyContent='center' alignItems='center'>
              <MDTypography variant="h4" sx={{ color: '#fff' }} style={{fontFamily: 'Itim'}}>Seamlessly book pooja services,<br/> discover nearby and popular mandirs,<br/> and order pooja samagri with our app punyam</MDTypography>
            </MDBox>
          </Grid>
          <Grid item xs={12} md={12} lg={4} mb={10} display='flex' justifyContent='center' alignItems='center'>
            <MDBox display='flex' justifyContent='center' alignItems='center'>   
              <img src={playstore} style={{cursor:'pointer', maxWidth: '80%', maxHeight: '10%', width: 'auto', height: 'auto' }} onClick={handleImageClick}/>
            </MDBox>
          </Grid>
        </Grid>
      </Grid>

      <Grid container mt={75} mb={2} display='flex' justifyContent='center' alignContent='center' alignItems='center' xs={12} md={12} lg={12} style={{ maxWidth: '100%', height: 'auto', flexGrow: 1, overflowY: 'auto', zIndex:3 }}>

            <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{ maxWidth: '95%', height: 'auto' }}>
              <Grid container xs={12} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='center'>

                <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{ width: '100%' }}>
                  <Grid container spacing={2} xs={12} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{ maxWidth: '100%', height: 'auto' }}>
                    <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{ maxWidth: '100%', height: 'auto' }}>
                      <MDBox display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{ maxWidth: '100%', height: 'auto' }}>
                        <MDTypography fontSize={20} fontWeight="bold" style={{color:'#000', fontFamily: 'Itim'}}>punyam services!</MDTypography>
                      </MDBox>
                    </Grid>
                    <Grid item xs={12} md={12} lg={3}>
                      <HomePageMandirCard />
                    </Grid>
                    <Grid item xs={12} md={12} lg={3}>
                      <HomePagePoojaServicesCard />
                    </Grid>
                    <Grid item xs={12} md={12} lg={3}>
                      <HomePagePoojaSamagriCard />
                    </Grid>
                    <Grid item xs={12} md={12} lg={3}>
                      <HomePagePoojaWasteCard />
                    </Grid>
                  </Grid>
                </Grid>

              </Grid>
            </Grid>
      </Grid>

      <Grid container mb={2} display='flex' justifyContent='center' alignContent='center' alignItems='center' xs={12} md={12} lg={12} style={{ maxWidth: '100%', height: 'auto', flexGrow: 1, overflowY: 'auto', zIndex:3 }}>

            <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{ maxWidth: '95%', height: 'auto' }}>
              <Grid container xs={12} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='center'>

                <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{ width: '100%' }}>
                  <Grid container xs={12} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{ maxWidth: '100%', height: 'auto' }}>
                    <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='flex-start' alignContent='center' alignItems='center' style={{ maxWidth: '100%', height: 'auto' }}>
                      <MDBox display='flex' justifyContent='flex-start' alignContent='center' alignItems='center' style={{ maxWidth: '100%', height: 'auto' }}>
                        <MDTypography fontSize={20} fontWeight="bold" ml={2} style={{color:'#000', fontFamily:'Itim'}}>Trending Pooja, book at your doorstep now!</MDTypography>
                      </MDBox>
                    </Grid>

                      {pooja.length > 0 ?
                        <Grid item xs={12} mt={2} md={12} lg={12} alignItems='stretch'>

                          <MDBox display='flex' justifyContent='center' alignContent='center' alignItems='center'>
                            <Grid container spacing={3} xs={12} md={12} lg={12} display='flex' justifyContent='flex-start' alignContent='center' alignItems='center' style={{ maxWidth: '100%', height: 'auto' }}>
                              {pooja?.map((elem) => {
                                return (
                                  <Grid item xs={12} md={4} lg={3} display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{ maxWidth: '100%', height: 'auto' }}>
                                    <Grid container xs={12} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{ maxWidth: '100%', height: 'auto' }}>
                                      <Card sx={{ minWidth: '100%', cursor: 'pointer' }} onClick={() => { handleOpenNewTab(elem) }}>

                                        <CardActionArea>
                                          <Grid item xs={12} md={4} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{ maxWidth: '100%', height: 'auto' }}>
                                            <img src={elem?.image?.url} style={{ maxWidth: '100%', height: 'auto', borderTopLeftRadius: 10, borderTopRightRadius: 10 }} />
                                            <Typography variant="h6" fontSize={10} fontWeight={400} style={{ position: 'absolute', top: 0, right: 0, margin: '8px', textAlign: 'center', color: 'black', backgroundColor: "white", borderRadius: "15px", padding: "2px 10px 2px 10px", marginTop: "10px", fontFamily: 'Itim' }}>
                                              Starting ₹{new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(elem?.packages?.[0]?.price)}
                                            </Typography>
                                          </Grid>
                                          <Grid item xs={12} md={4} lg={12} display='flex' justifyContent='flex-start' alignContent='center' alignItems='center' style={{ maxWidth: '100%', height: 'auto' }}>
                                            <CardContent display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{ maxWidth: '100%', height: 'auto' }}>
                                              <MDBox display='flex' justifyContent='flex-start' alignContent='center' alignItems='center' style={{ width: '100%' }}>
                                                <Typography variant="h5" fontWeight={400} style={{ textAlign: 'center', fontFamily: 'Itim' }}>
                                                  {elem?.name}
                                                </Typography>
                                              </MDBox>
                                              <MDBox display='flex' justifyContent='flex-start' alignContent='center' alignItems='center' style={{ maxWidth: '100%', height: 'auto', fontFamily: 'Itim' }}>
                                                <Typography variant='caption' style={{fontFamily:'Itim'}}>
                                                  {limitStringWithEllipsis(elem?.description,30)}
                                                </Typography>
                                              </MDBox>
                                              <MDBox mb={-2} display='flex' justifyContent='flex-end' alignContent='center' alignItems='center' style={{ width: '100%'}}>
                                                <MDButton size='small' variant='contained' style={{fontFamily:'Itim'}}>Book Now</MDButton>
                                              </MDBox>
                                            </CardContent>
                                          </Grid>
                                        </CardActionArea>
                                      </Card>
                                    </Grid>
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

      <Grid container mt={2} mb={2} display='flex' justifyContent='center' alignContent='center' alignItems='center' xs={12} md={12} lg={12} style={{ maxWidth: '100%', height: 'auto', flexGrow: 1, overflowY: 'auto', zIndex:3 }}>

            <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{ maxWidth: '95%', height: 'auto' }}>
              <Grid container xs={12} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='center'>

                <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{ width: '100%' }}>
                  <Grid container xs={12} md={12} lg={12} display='flex' justifyContent='flex-start' alignContent='center' alignItems='center' style={{ maxWidth: '100%', height: 'auto' }}>
                    <Grid ml={2} item xs={12} md={12} lg={12} display='flex' justifyContent='flex-start' alignContent='center' alignItems='center' style={{ maxWidth: '100%', height: 'auto' }}>
                      <MDBox display='flex' justifyContent='center' alignContent='flext-start' alignItems='center' style={{ maxWidth: '100%', height: 'auto' }}>
                      <MDTypography fontSize={20} fontWeight="bold" style={{color:'#000', fontFamily: 'Itim'}}>Temples near me!</MDTypography>
                      </MDBox>
                    </Grid>

                      {data.length > 0 ?
                        <Grid item xs={12} mt={2} md={12} lg={12} alignItems='stretch'>

                          <MDBox display='flex' justifyContent='center' alignContent='center' alignItems='center'>
                            <Grid container spacing={3} xs={12} md={12} lg={12} display='flex' justifyContent='flex-start' alignContent='center' alignItems='center' style={{ maxWidth: '100%', height: 'auto' }}>
                              {data?.map((elem) => {
                                console.log("Packages:",elem)
                                return (
                                  <Grid item xs={12} md={4} lg={3} display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{ maxWidth: '100%', height: 'auto' }}>
                                    <Grid container xs={12} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{ maxWidth: '100%', height: 'auto' }}>
                                      <Card sx={{ minWidth: '100%', cursor: 'pointer' }} onClick={() => { handleOpenNewTab(elem) }}>

                                        <CardActionArea>
                                          <Grid item xs={12} md={4} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{ maxWidth: '100%', height: 'auto' }}>
                                            <img src={elem?.cover_image?.url} style={{ maxWidth: '100%', height: 'auto', borderTopLeftRadius: 10, borderTopRightRadius: 10 }} />
                                            <Typography variant="h6" fontSize={10} fontWeight={400} style={{ position: 'absolute', top: 0, right: 0, margin: '8px', textAlign: 'center', color: 'black', backgroundColor: "white", borderRadius: "15px", padding: "2px 10px 2px 10px", marginTop: "10px", fontFamily: 'Itim' }}>
                                              {elem?.address_details?.state || "NA"}
                                            </Typography>
                                          </Grid>
                                          <Grid item xs={12} md={4} lg={12} display='flex' justifyContent='flex-start' alignContent='center' alignItems='center' style={{ maxWidth: '100%', height: 'auto' }}>
                                            <CardContent display='flex' justifyContent='flex-start' alignContent='center' alignItems='center' style={{ maxWidth: '100%', height: 'auto' }}>
                                              <MDBox display='flex' justifyContent='flex-start' alignContent='center' alignItems='center' style={{ width: '100%'}}>
                                                <Typography variant="h5" fontWeight={400} style={{ fontFamily: 'Itim' }}>
                                                  {limitStringWithEllipsis(elem?.name,20)}
                                                </Typography>
                                              </MDBox>
                                              
                                              <MDBox display='flex' justifyContent='flex-start' alignContent='center' alignItems='center' style={{ maxWidth: '100%', height: 'auto' }}>
                                                <Typography variant='caption' style={{fontFamily:'Itim'}}>
                                                  {limitStringWithEllipsis(elem?.description,75)}
                                                </Typography>
                                              </MDBox>
                                            </CardContent>
                                          </Grid>
                                        </CardActionArea>
                                      </Card>
                                    </Grid>
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

      <Grid container mt={2} mb={2} display='flex' justifyContent='center' alignContent='center' alignItems='center' xs={12} md={12} lg={12} style={{ minWidth: '100%', height: 'auto', flexGrow: 1, overflowY: 'auto', zIndex:3 }}>
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
