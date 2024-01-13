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
import { styled } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { Divider } from '@mui/material';
import { Box } from '@mui/system';


function MapSearch() {
    const [value, setValue] = React.useState(null);
    const [inputValue, setInputValue] = React.useState('');
    const [templeValue, setTempleValue] = useState();
    const [options, setOptions] = React.useState([]);
    const [templeData, setTempleData] = useState([]);
    const [templeInputValue, setTempleInputValue] = useState([]);
    const [coordinates, setCoordinates] = React.useState({
        lat: 0,
        long: 0
    })

    async function getCoordinates() {
        if (value?.place_id) {
            const data = await axios(`${apiUrl}location/placedetails?place_id=${value.place_id}`);
            setCoordinates({
                lat: data.data.data.geometry.location.lat,
                long: data.data.data.geometry.location.lng,
            })
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


    return (
        <>
            <MDBox mb={2} display='flex' justifyContent='center' backgroundColor="#FFFFFF">
                <MDBox sx={{
                    display: "flex", justifyContent: "space-between", alignContent: "center", alignItems: "center", backgroundColor: "#FFFFFF",
                    borderTopLeftRadius: "10px",
                    borderBottomLeftRadius: "10px",
                }}>
                    <MDBox style={{ alignContent: 'center' }}>
                        <LocationOnIcon sx={{ color: '#9C4722' }} backgroundColor="#FFFFFF" />
                    </MDBox>
                    <MDBox>
                        <Autocomplete
                            id="google-map-demo"
                            sx={{
                                width: 250, textAlign: 'center', backgroundColor: "#FFFFFF",

                            }}
                            getOptionLabel={(option) =>
                                typeof option === 'string' ? option : option.description
                            }
                            filterOptions={(x) => x}
                            options={options}
                            autoComplete
                            includeInputInList
                            filterSelectedOptions
                            value={value}
                            noOptionsText="Search your location"
                            onChange={(event, newValue) => {
                                setOptions(newValue ? [newValue, ...options] : options);
                                setValue(newValue);
                            }}
                            onInputChange={(event, newInputValue) => {
                                setInputValue(newInputValue);
                            }}
                            renderInput={(params) => (
                                <TextField {...params} label="Select your location" fullWidth
                                    InputProps={{
                                        ...params.InputProps,
                                        style: {
                                            color: '#ED9121',
                                            height: 52,
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
                                        <Grid container alignItems="center">
                                            <Grid item sx={{ display: 'flex', width: "100%" }}>
                                                <LocationOnIcon sx={{ color: 'text.secondary' }} />
                                            </Grid>
                                            <Grid item sx={{ width: '100%', wordWrap: 'break-word' }}>
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
                </MDBox>

                {/* <Divider orientation="vertical" color='black' backgroundColor='#FFFFFF' /> */}
                
                <MDBox sx={{
                    display: "flex", justifyContent: "space-between", alignContent: "center", alignItems: "center", backgroundColor: "#FFFFFF",
                    borderTopRightRadius: "10px",
                    borderBottomRightRadius: "10px",
                }}>
                    <MDBox style={{ backgroundColor: "#FFFFFF" }}>
                        <SearchIcon sx={{ color: '#9C4722' }} backgroundColor="#FFFFFF" />
                    </MDBox>
                    <MDBox>
                        <Autocomplete
                            id="mandirs"
                            sx={{
                                width: 400,
                                textAlign: 'center',
                                backgroundColor: "#FFFFFF",
                                border: "none",
                                borderTopRightRadius: "20px",
                                borderBottomRightRadius: "20px",
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
                                                    borderRadius: "10px",
                                                    height: "60px",
                                                    width: "100px",
                                                    ml: 0,
                                                    border: "none"
                                                }}
                                            />
                                        </Grid>
                                        <Grid item lg={8} xs={8} md={8} sx={{ width: '100%', wordWrap: 'break-word' }}>
                                            <MDBox
                                                component="span"
                                                sx={{ fontWeight: option.highlight ? 'bold' : 'regular' }}
                                            >
                                                {option.name}
                                            </MDBox>
                                            <Typography variant="body2" color="text.secondary">
                                                {`${option.address_details.city}, ${option.address_details.state}, ${option.address_details.country}`}
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                </li>
                            )}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Search for temples"
                                    InputProps={{
                                        ...params.InputProps,
                                        style: {
                                            color: '#ED9121',
                                            height: 52,
                                            outline: "none",
                                            borderWidth: 0,
                                            border: "none"
                                        },
                                    }}
                                    InputLabelProps={{
                                        style: { color: 'grey', outline: "none" },
                                    }}
                                />
                            )}
                        />
                    </MDBox>
                </MDBox>
            </MDBox>
        </>
    );
}


export default MapSearch;
