import React, {useEffect, useState} from 'react';
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


function MapSearch() {
    const [value, setValue] = React.useState(null);
    const [inputValue, setInputValue] = React.useState('');
    const [options, setOptions] = React.useState([]);
    const [templeData, setTempleData] = useState([]);
    const [coordinates, setCoordinates] = React.useState({
        lat: 0,
        long: 0
    })
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

    useEffect(()=>{
        templeDataFetch()
    }, [coordinates])

    async function templeDataFetch(){
        const templeData = await axios(`${apiUrl}mandir/bydistance?lat=${coordinates.lat}&long=${coordinates.long}`,
                            {withCredentials: true});
        
        setTempleData(templeData?.data?.data);
    }

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


    return (
        <MDBox mb={2} display='flex' justifyContent='center'>
            <Autocomplete
                id="google-map-demo"
                sx={{ width: 300, textAlign: 'center' }}
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
                    if (newValue) {
                        // Create a PlacesService instance
                        const placesService = new window.google.maps.places.PlacesService(document.createElement('div'));

                        // Use getDetails method to retrieve detailed information about the selected place
                        placesService.getDetails({ placeId: newValue.place_id }, (place, status) => {
                            if (status === window.google.maps.places.PlacesServiceStatus.OK) {
                                // Extract the coordinates from the place object
                                const { lat, lng } = place.geometry.location;
                                setCoordinates({
                                    lat: lat(),
                                    long: lng()
                                })
                                // console.log('Coordinates:', { lat: lat(), lng: lng() });
                            }
                        });
                    }
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

            <Autocomplete
                id="google-map-demo"
                sx={{ width: 300, textAlign: 'center' }}
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
                    if (newValue) {
                        // Create a PlacesService instance
                        const placesService = new window.google.maps.places.PlacesService(document.createElement('div'));

                        // Use getDetails method to retrieve detailed information about the selected place
                        placesService.getDetails({ placeId: newValue.place_id }, (place, status) => {
                            if (status === window.google.maps.places.PlacesServiceStatus.OK) {
                                // Extract the coordinates from the place object
                                const { lat, lng } = place.geometry.location;
                                setCoordinates({
                                    lat: lat(),
                                    long: lng()
                                })
                                // console.log('Coordinates:', { lat: lat(), lng: lng() });
                            }
                        });
                    }
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
    );
}


export default MapSearch;
