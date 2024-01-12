import React, {useState, useContext, useEffect} from "react"
import { useMediaQuery } from '@mui/material'
import theme from '../../HomePage/utils/theme/index'; 
import { ThemeProvider } from 'styled-components';
import ReactGA from "react-ga"
import axios from "axios";
import playstore from '../../../assets/images/playstore.png'
import Navbar from '../../HomePage/components/Navbars/Navbar';
import background from '../../../assets/images/background.png'
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

const GOOGLE_MAPS_API_KEY = 'AIzaSyArsP6WOgekS-LFDimu2G6FrsRrB6K29BI';

function loadScript(src, position, id) {
  if (!position) {
    return;
  }

  const script = document.createElement('script');
  script.setAttribute('async', '');
  script.setAttribute('id', id);
  script.src = src;
  position.appendChild(script);
}

const autocompleteService = { current: null };


function Cover(props) {
  const navigate = useNavigate();
  const location = useLocation();
  const [count, setCount] = useState(0);
  const [isLoading,setIsLoading] = useState(false);
  const [data,setData] = useState([]);
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
  const loaded = React.useRef(false);

  if (typeof window !== 'undefined' && !loaded.current) {
    if (!document.querySelector('#google-maps')) {
      loadScript(
        `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places`,
        document.querySelector('head'),
        'google-maps',
      );
    }

    loaded.current = true;
  }

  const fetch = React.useMemo(
    () =>
      debounce((request, callback) => {
        autocompleteService.current.getPlacePredictions(request, callback);
      }, 400),
    [],
  );

  React.useEffect(() => {
    let active = true;

    if (!autocompleteService.current && window.google) {
      autocompleteService.current =
        new window.google.maps.places.AutocompleteService();
    }
    if (!autocompleteService.current) {
      return undefined;
    }

    if (inputValue === '') {
      setOptions(value ? [value] : []);
      return undefined;
    }

    fetch({ input: inputValue }, (results) => {
      if (active) {
        let newOptions = [];

        if (value) {
          newOptions = [value];
        }

        if (results) {
          newOptions = [...newOptions, ...results];
        }

        setOptions(newOptions);
      }
    });

    return () => {
      active = false;
    };
  }, [value, inputValue, fetch]);
  const onLoad = (map) => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setCenter({ lat: latitude, lng: longitude });
        setMarkerPosition({ lat: latitude, lng: longitude });
      },
      (error) => {
        console.error('Error getting current location:', error);
      }
    );
  };

  useEffect(()=>{
    let call1 = axios.get(`${apiUrl}pooja/home`,{
                withCredentials: true,
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Credentials": true
                  },
                })
    Promise.all([call1])
    .then(([api1Response]) => {
      // Process the responses here
      setData(api1Response.data.data)
      setCount(api1Response.data.count)
      setTimeout(()=>{
        setIsLoading(false)
      },100)
    })
    .catch((error) => {
      // Handle errors here
    });
  },[])

  const onPlacesChanged = (places) => {
    const place = places[0];
    setCenter({
      lat: place.geometry.location.lat(),
      lng: place.geometry.location.lng(),
    });
    setMarkerPosition({
      lat: place.geometry.location.lat(),
      lng: place.geometry.location.lng(),
    });
  };
  const isMobile = useMediaQuery(theme.breakpoints.down("lg"))

  const handleImageClick = () => {
    // Open google.com in a new tab
    window.open('https://play.google.com/store/apps/details?id=com.stoxhero.app', '_blank');
  };

  

  return (
    <>
      <MDBox mt={-1} display='flex' justifyContent='center' flexDirection='column' alignContent='center' alignItems='flex-start' style={{backgroundColor:'white', minHeight:'auto', height: 'relative', width: 'auto', minWidth:'100vW'}}>
      <ThemeProvider theme={theme}>
      <Navbar/>

      <Grid container mt={0} xs={12} md={12} lg={12} style={{
          display: 'flex',
          justifyContent: 'center',
          alignContent: 'center',
          alignItems: 'stretch',
          backgroundImage: `url(${background})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center center',
          minHeight: '70vh', // Adjust the percentage as needed
          flexDirection: 'column',
          textAlign: 'center',
          padding: '20px',
        }}>
        <MDBox mt={5} mb={2} display='flex' justifyContent='center'>
          <img src={logo} width={200} style={{textAlign:'center'}}/>
        </MDBox>
        <MDBox mb={2} display='flex' justifyContent='center'>
          <Autocomplete
              id="google-map-demo"
              sx={{ width: 300, textAlign:'center' }}
              getOptionLabel={(option) =>
                typeof option === 'string' ? option : option.description
              }
              filterOptions={(x) => x}
              options={options}
              autoComplete
              includeInputInList
              filterSelectedOptions
              value={value}
              noOptionsText="search your location"
              onChange={(event, newValue) => {
                setOptions(newValue ? [newValue, ...options] : options);
                setValue(newValue);
              }}
              onInputChange={(event, newInputValue) => {
                setInputValue(newInputValue);
              }}
              renderInput={(params) => (
                <TextField {...params} label="select your location" fullWidth />
              )}
              renderOption={(props, option) => {
                const matches =
                  option.structured_formatting.main_text_matched_substrings || [];

                const parts = parse(
                  option.structured_formatting.main_text,
                  matches.map((match) => [match.offset, match.offset + match.length]),
                );

                return (
                  <li {...props}>
                    <Grid container alignItems="center">
                      <Grid item sx={{ display: 'flex', width: 44 }}>
                        <LocationOnIcon sx={{ color: 'text.secondary' }} />
                      </Grid>
                      <Grid item sx={{ width: 'calc(100% - 44px)', wordWrap: 'break-word' }}>
                        {parts.map((part, index) => (
                          <MDBox
                            key={index}
                            component="span"
                            sx={{ fontWeight: part.highlight ? 'bold' : 'regular' }}
                          >
                            {part.text}
                          </MDBox>
                        ))}
                        <Typography variant="body2" color="text.secondary">
                          {option.structured_formatting.secondary_text}
                        </Typography>
                      </Grid>
                    </Grid>
                  </li>
                );
              }}
            />
        </MDBox>
        <MDBox display='flex' justifyContent='center'>
          <MDTypography variant="h4" sx={{ color: '#fff' }}>Book pooja and discover temples near you!</MDTypography>
        </MDBox>

        <MDBox display='flex' justifyContent='center'>
            {/* <MDButton component="a" href="https://play.google.com/store/apps/details?id=com.stoxhero.app" target="_blank"> */}
              <img src={playstore} style={{cursor:'pointer', maxWidth: '15%', maxHeight: '20%', width: 'auto', height: 'auto' }} onClick={handleImageClick}/>
            {/* </MDButton> */}
        </MDBox>
      </Grid>

      <Grid mt={1} container xs={12} md={12} lg={12} style={{
          // display: 'flex',
          // justifyContent: 'center',
          // alignContent: 'center',
          alignItems: 'stretch',
          // backgroundImage: `url(${background})`,
          // backgroundSize: 'cover',
          // backgroundPosition: 'center center',
          minHeight: '5vh', // Adjust the percentage as needed
          flexDirection: 'column',
          // textAlign: 'center',
          // position:'relative'
          // padding: '20px',
        }}>
        <MDBox display='flex' justifyContent='center'>
          <MDTypography variant="h4" sx={{ color: '#000' }}>Pooja services</MDTypography>
        </MDBox>
      </Grid>

      <Grid container spacing={4} xs={12} md={12} lg={12} style={{
          display: 'flex',
          justifyContent: 'center',
          alignContent: 'center',
          flexDirection: 'row',
          textAlign: 'center',
        }}>
          
              {data?.map((elem, index)=>{

                    return (
                      <>
                      <Grid key={elem?._id} item xs={12} md={4} lg={3} display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{width: '100%',height: 'auto'}}>
                      

                      <Card sx={{minWidth:'100%',minHeight:320, maxHeight:320}}>
                        <CardMedia
                          sx={{ minHeight: 200, maxHeight:200 }}
                          image={elem?.image?.url}
                          title={elem?.name}
                        />
                        <CardContent sx={{ minHeight: 60, maxHeight:60}}>
                          <MDTypography gutterBottom variant="h5" component="div">
                            {elem?.name}
                          </MDTypography>
                          <MDTypography gutterBottom variant="caption" component="div">
                            Pandit Ji and Pooja Samagri at your doorstep!
                          </MDTypography>
                        </CardContent>
                        <CardActions sx={{ minHeight: 30, maxHeight:30, textAlign:'center', alignContent:'center', alignItems:'center'}} display='flex' justifyContent='center'>
                          <MDButton component={Link} to={{pathname:`/devidevtadetails`}} state={{ data: elem }} size="small">Book Now</MDButton>
                          {/* <MDButton component={Link} to={{pathname:`/poojadetails`}} state={{ data: elem }} size="small">Share</MDButton> */}
                        </CardActions>
                      </Card>
                      
                    
                      </Grid>  
                      </> 
                    )
              })}
      </Grid>

      <Grid mt={2} container xs={12} md={12} lg={12} style={{
          // display: 'flex',
          // justifyContent: 'center',
          // alignContent: 'center',
          alignItems: 'stretch',
          // backgroundImage: `url(${background})`,
          // backgroundSize: 'cover',
          // backgroundPosition: 'center center',
          minHeight: '5vh', // Adjust the percentage as needed
          flexDirection: 'column',
          // textAlign: 'center',
          // position:'relative'
          // padding: '20px',
        }}>
        <MDBox display='flex' justifyContent='center'>
          <MDTypography variant="h4" sx={{ color: '#000' }}>Temples near me!</MDTypography>
        </MDBox>
      </Grid>

      <Grid container spacing={4} xs={12} md={12} lg={12} style={{
          display: 'flex',
          justifyContent: 'center',
          alignContent: 'center',
          flexDirection: 'row',
          textAlign: 'center',
        }}>
          
              {data?.map((elem, index)=>{

                    return (
                      <>
                      <Grid key={elem?._id} item xs={12} md={4} lg={3} display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{width: '100%',height: 'auto'}}>
                      

                      <Card sx={{minWidth:'100%',minHeight:320, maxHeight:320}}>
                        <CardMedia
                          sx={{ minHeight: 200, maxHeight:200 }}
                          image={elem?.image?.url}
                          title={elem?.name}
                        />
                        <CardContent sx={{ minHeight: 60, maxHeight:60}}>
                          <MDTypography gutterBottom variant="h5" component="div">
                            {elem?.name}
                          </MDTypography>
                          <MDTypography gutterBottom variant="caption" component="div">
                            Pandit Ji and Pooja Samagri at your doorstep!
                          </MDTypography>
                        </CardContent>
                        <CardActions sx={{ minHeight: 30, maxHeight:30, textAlign:'center', alignContent:'center', alignItems:'center'}} display='flex' justifyContent='center'>
                          <MDButton component={Link} to={{pathname:`/devidevtadetails`}} state={{ data: elem }} size="small">Book Now</MDButton>
                          {/* <MDButton component={Link} to={{pathname:`/poojadetails`}} state={{ data: elem }} size="small">Share</MDButton> */}
                        </CardActions>
                      </Card>
                      
                    
                      </Grid>  
                      </> 
                    )
              })}
      </Grid>


      </ThemeProvider>
      
      </MDBox>
      <MDBox mt={2}>
        <Footer/>
      </MDBox>
    </>
      
  );
}

export default Cover;
