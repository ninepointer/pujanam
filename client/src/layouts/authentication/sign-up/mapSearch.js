import React, { useEffect, useState } from 'react';
import { Grid } from '@mui/material';
import MDBox from '../../../components/MDBox';
import { debounce } from '@mui/material/utils';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import Typography from '@mui/material/Typography';
import parse from 'autosuggest-highlight/parse';
import axios from 'axios';
import { apiUrl } from '../../../constants/constants';
import MDAvatar from "../../../components/MDAvatar";
import logo from "../../../assets/images/logo.png";
import SearchIcon from '@mui/icons-material/Search';
import { Divider } from '@mui/material';
import { Box } from '@mui/system';
import InputLabel from '@mui/material/InputLabel';
import { useMediaQuery } from '@mui/material'
import theme from '../../HomePage/utils/theme/index'; 


function MapSearch({currentLocation}) {
    const [value, setValue] = React.useState(null);
    const [inputValue, setInputValue] = React.useState('');
    const [templeValue, setTempleValue] = useState();
    const [options, setOptions] = React.useState([]);
    const [templeData, setTempleData] = useState([]);
    const [templeInputValue, setTempleInputValue] = useState([]);
    const [currentPlace, setCurrentPlace] = useState("");
    const [coordinates, setCoordinates] = React.useState({
        lat: 0,
        long: 0
    })

    useEffect(()=>{
        getCurrentPlace()
    }, [currentLocation])

    async function getCurrentPlace(){
        if(currentLocation.latitude && currentLocation.longitude){
            const data = await axios(`${apiUrl}location/currentplace?lat=${currentLocation.latitude}&long=${currentLocation.longitude}`);
            setCurrentPlace(data.data.data?.results[0].formatted_address);
            const templeData = await axios(`${apiUrl}mandir/user/bydistance?lat=${data.data.data?.results[0]?.geometry.location.lat}&long=${data.data.data?.results[0]?.geometry.location.lng}&search=${templeInputValue}`,
            { withCredentials: true });
            setTempleData(templeData?.data?.data);  
        }
    }

    console.log("currentPlace", currentPlace)

    async function getCoordinates() {
        if (value?.place_id) {
            const data = await axios(`${apiUrl}location/placedetails?place_id=${value.place_id}`);
            setCoordinates({
                lat: data.data.data.geometry.location.lat,
                long: data.data.data.geometry.location.lng,
            })

            const templeData = await axios(`${apiUrl}mandir/user/bydistance?lat=${data.data.data.geometry.location.lat}&long=${data.data.data.geometry.location.lng}&search=${templeInputValue}`,
            { withCredentials: true });

            setTempleData(templeData?.data?.data);
        }
    }

    useEffect(() => {
        getCoordinates()
    }, [value])

    const fetch = React.useMemo(
        () =>
            debounce(async (request, callback) => {
                console.log("request", request)
                const templeData = await axios(`${apiUrl}location/autocomplete?search=${request.input}`);
                callback(templeData.data.data);
            }, 400),
        [],
    );

    React.useEffect(() => {
        let active = true;

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
    }, [inputValue, fetch]);

    const fetchTemple = React.useMemo(
        () =>
            debounce(async (request, callback) => {
                console.log("request", request)
                const templeData = await axios(`${apiUrl}mandir/user/bydistance?lat=${coordinates.lat}&long=${coordinates.long}&search=${request.input}`,
            { withCredentials: true });

            callback(templeData?.data?.data);
                // callback(templeData.data.data);
            }, 400),
        [],
    );

    React.useEffect(() => {
        let active = true;

        if (templeInputValue === '') {
            setTempleData(templeValue ? [templeValue] : []);
            return undefined;
        }

        fetchTemple({ input: templeInputValue }, (results) => {
            if (active) {
                let newOptions = [];

                if (templeValue) {
                    newOptions = [templeValue];
                }

                if (results) {
                    newOptions = [...newOptions, ...results];
                }

                setTempleData(newOptions);
            }
        });

        return () => {
            active = false;
        };
    }, [templeInputValue, fetchTemple]);

    const isMobile = useMediaQuery(theme.breakpoints.down("lg"))


    return (
        <>
        <Grid container spacing={isMobile ? 1 : 0} ml={isMobile ? 0 : 8} xs={12} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{width:'100%'}}>
            <Grid item xs={12} md={12} lg={4} display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{width:'100%'}}>
            {/* <MDBox mb={2} display='flex' justifyContent='center'> */}
                <MDBox display='flex' justifyContent='center'>
                    <MDBox display='flex' justifyContent='center' alignItems='center' alignContent='center'>
                        <MDBox display='flex' justifyContent='center' alignItems='center' alignContent='center' style={{padding:8}}
                        sx={{
                            display: "flex", justifyContent: "space-between", alignContent: "center", alignItems: "center", 
                            backgroundColor: "#FFFFFF",
                            borderTopRightRadius: isMobile ? "0px" : "0px",
                            borderBottomRightRadius: isMobile ? "0px" : "0px",
                            borderTopLeftRadius: isMobile ? "10px" : "10px",
                            borderBottomLeftRadius: isMobile ? "10px" : "10px",
                        }}>
                            <LocationOnIcon sx={{ color: '#9C4722', height: 34, }} />
                        </MDBox>
                        <MDBox display='flex' justifyContent='center' alignItems='center' alignContent='center'>
                            <Autocomplete
                                id="google-map-demo"
                                sx={{
                                    width: 300,
                                    textAlign: 'center',
                                    backgroundColor: "#FFFFFF",
                                    border: "none",
                                    borderTopRightRadius: isMobile ? "10px" : "0px",
                                    borderBottomRightRadius: isMobile ? "10px" : "0px",
                                    borderTopLeftRadius: isMobile ? "0px" : "0px",
                                    borderBottomLeftRadius: isMobile ? "0px" : "0px",
                                    outline: "none"
                                }}
                                getOptionLabel={(option) =>
                                    typeof option === 'string' ? option : option.description
                                }
                                filterOptions={(x) => x}
                                options={options}
                                autoComplete
                                includeInputInList
                                filterSelectedOptions
                                value={currentPlace || value}
                                noOptionsText="Search your location"
                                onChange={(event, newValue) => {
                                    setOptions(newValue ? [newValue, ...options] : options);
                                    setValue(newValue);
                                }}
                                onInputChange={(event, newInputValue) => {
                                    setInputValue(newInputValue);
                                }}
                                renderInput={(params) => (
                                    <TextField variant="standard" {...params} 
                                    // label="Select your location" 
                                    fullWidth
                                    placeholder="Select your location"    
                                    InputProps={{
                                            ...params.InputProps,
                                            style: {
                                                color: '#ED9121',
                                                height: 50,
                                                outline: "none",
                                                borderWidth: 0,
                                                '&:hover': {
                                                    borderWidth: 0, // Adjust the styles for hover if needed
                                                },
                                                border: "none"
                                            },
                                        }}
                                    />
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
                                            <Grid container xs={12} md={12} lg={12} display='flex' justifyContent='center' alignItems="center">
                                                <Grid item xs={2} md={2} lg={2} display='flex' justifyContent='center' sx={{ display: 'flex', width: "100%" }}>
                                                    <LocationOnIcon sx={{ color: 'text.secondary' }} />
                                                </Grid>
                                                <Grid item xs={10} md={10} lg={10} display='flex' justifyContent='flex-start' sx={{ width: '100%', wordWrap: 'break-word' }}>
                                                    <Grid container xs={12} md={12} lg={12} display='flex' justifyContent='flex-start' alignItems="center">
                                                        {parts.map((part, index) => (
                                                        <MDBox
                                                                key={index}
                                                                component="span"
                                                                sx={{ fontWeight: part.highlight ? 'bold' : 'regular' }}
                                                            >
                                                            <Typography variant="body2" color="text.secondary" style={{fontFamily: 'Itim'}}>
                                                                {part.text}
                                                            </Typography>
                                                        </MDBox>
                                                        ))}
                                                        <MDBox>
                                                            <Typography variant="caption" color="text.secondary" style={{fontFamily: 'Itim'}}>
                                                                {option.structured_formatting.secondary_text}
                                                            </Typography>
                                                        </MDBox>
                                                    </Grid>
                                                </Grid>
                                            </Grid>
                                        </li>
                                    );
                                }}
                            />
                        </MDBox>
                    </MDBox>
                </MDBox>
            </Grid>
                {/* <Divider orientation="vertical" color='black' backgroundColor='#FFFFFF' /> */}
            <Grid item xs={12} md={12} lg={8} display='flex' justifyContent='center' style={{width:'100%'}}>   
                <MDBox display='flex' justifyContent='center' alignItems='center' alignContent='center'>
                    <MDBox display='flex' justifyContent='center' alignItems='center' alignContent='center' style={{padding:8}}
                    sx={{
                        display: "flex", justifyContent: "space-between", alignContent: "center", alignItems: "center", 
                        backgroundColor: "#FFFFFF",
                        borderTopRightRadius: isMobile ? "0px" : "0px",
                        borderBottomRightRadius: isMobile ? "0px" : "0px",
                        borderTopLeftRadius: isMobile ? "10px" : "0px",
                        borderBottomLeftRadius: isMobile ? "10px" : "0px",
                    }}>
                        <SearchIcon sx={{ color: '#9C4722', height: 34, }} />
                    </MDBox>
                    <MDBox display='flex' justifyContent='center' alignContent= "center" alignItems="center">
                        <Autocomplete
                            id="mandirs"
                            sx={{
                                width: isMobile ? 300 : 400,
                                textAlign: 'center',
                                backgroundColor: "#FFFFFF",
                                border: "none",
                                borderTopRightRadius: isMobile ? "10px" : "10px",
                                borderBottomRightRadius: isMobile ? "10px" : "10px",
                                borderTopLeftRadius: isMobile ? "0px" : "0px",
                                borderBottomLeftRadius: isMobile ? "0px" : "0px",
                                outline: "none"
                            }}
                            style={{ border: 'none' }}
                            getOptionLabel={(option) =>
                                typeof option === 'string' ? option : option.name
                            }
                            filterOptions={(x) => x}
                            options={templeData}
                            autoHighlight
                            autoComplete
                            includeInputInList
                            filterSelectedOptions
                            value={templeValue}
                            noOptionsText= {templeInputValue ? "No Temple Found!" : "Search for temples"}
                            onChange={(event, newValue) => {
                                setTempleValue(newValue);
                            }}
                            onInputChange={(event, newInputValue) => {
                                setTempleInputValue(newInputValue);
                            }}
                            renderOption={(props, option) => (
                                <li {...props}>
                                    <Grid container lg={12} xs={12} md={12} display='flex' flexDirection={'row'} justifyContent={'center'} alignContent={'center'} alignItems='center'>
                                        <Grid item lg={4} xs={4} md={4} sx={{ display: 'flex', width: "100%" }}>
                                            <MDAvatar
                                                src={option.cover_image.url || logo}
                                                alt={"Mandir"}
                                                size="lg"
                                                sx={{
                                                    cursor: "pointer",
                                                    borderRadius: isMobile ? "5px" : "10px",
                                                    height: isMobile ? "50px" : "60px",
                                                    width: isMobile ? "75px" : "100px",
                                                    ml: 0,
                                                    border: "none"
                                                }}
                                            />
                                        </Grid>
                                        <Grid item lg={8} xs={8} md={8} sx={{ width: '100%', wordWrap: 'break-word' }}>
                                            <MDBox
                                                component="span"
                                                sx={{ fontWeight: option.highlight ? 'bold' : 'regular' }}
                                                style={{fontFamily: "Itim"}}
                                            >
                                            <Typography variant="body3" color="text.secondary" style={{fontFamily: "Itim"}}>
                                                {option.name}<br/>
                                            </Typography>
                                            </MDBox>
                                            <Typography variant="caption" color="text.secondary" style={{fontFamily: "Itim"}}>
                                                {`${option.address_details.city}, ${option.address_details.state}, ${option.address_details.country}`}
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                </li>
                            )}
                            renderInput={(params) => (
                                <>
                                <TextField variant="standard"
                                    {...params}
                                    placeholder="Search for temples"
                                    // label="Search for temples"
                                    InputProps={{
                                        ...params.InputProps,
                                        style: {
                                            color: '#ED9121',
                                            height: 50,
                                            outline: "none",
                                            borderWidth: 0,
                                            '&:hover': {
                                                borderWidth: 0, // Adjust the styles for hover if needed
                                            },
                                            border: "none"
                                        },
                                    }}
                                    InputLabelProps={{
                                        style: { color: 'grey', outline: "none", variant: "standard" },
                                    }}
                                />
                                </>
                            )}
                        />
                    </MDBox>
                </MDBox>
            </Grid>
            {/* </MDBox> */}
        </Grid>
        </>
    );
}


export default MapSearch;
