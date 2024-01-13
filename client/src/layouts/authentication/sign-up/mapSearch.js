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
import MDAvatar from "../../../components/MDAvatar";
import logo from "../../../assets/images/logo.png";
import { styled } from '@mui/material';

const CustomAutocomplete = styled(Autocomplete)`
  .MuiAutocomplete-clearIndicator {
    color: white;
    border: none !important;
  }
`;

function MapSearch() {
    const [value, setValue] = React.useState(null);
    const [inputValue, setInputValue] = React.useState('');
    const [templeValue, setTempleValue] = useState();
    const [options, setOptions] = React.useState([]);
    const [templeData, setTempleData] = useState([]);
    const [coordinates, setCoordinates] = React.useState({
        lat: 0,
        long: 0
    })

    async function getCoordinates(){
        if(value?.place_id){
            const data = await axios(`${apiUrl}location/placedetails?place_id=${value.place_id}`);
            setCoordinates({
                lat: data.data.data.geometry.location.lat,
                long: data.data.data.geometry.location.lng,
            })
        }
    }

    useEffect(()=>{
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

    useEffect(()=>{
        templeDataFetch()
    }, [coordinates])

    async function templeDataFetch(){
        const templeData = await axios(`${apiUrl}mandir/user/bydistance?lat=${coordinates.lat}&long=${coordinates.long}`,
                            {withCredentials: true});
        
        setTempleData(templeData?.data?.data);
    }
    return (
        <MDBox mb={2} display='flex' justifyContent='center'>
            <Autocomplete
                id="google-map-demo"
                sx={{ width: 300, textAlign: 'center', backgroundColor: "whitesmoke" }}
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

            <CustomAutocomplete
                id="mandirs"
                sx={{ width: 500, textAlign: 'center', backgroundColor: "whitesmoke", border: "none",
                borderTopRightRadius: "10px",
                borderBottomRightRadius: "10px",
            }}
                getOptionLabel={(option) =>
                    typeof option === 'string' ? option : option.name
                }
                filterOptions={(x) => x}
                options={templeData}
                autoComplete
                includeInputInList
                filterSelectedOptions
                value={templeValue}
                noOptionsText="search temples"
                onChange={(event, newValue) => {
                    // setOptions(newValue ? [newValue, ...templeData] : templeData);
                    setTempleValue(newValue);
                }}

                
                renderOption={(props, option) => {
                    return (
                        <li {...props}>
                            <Grid container 
                                lg={12} xs={12} md={12}
                                display='flex' flexDirection={'row'} justifyContent={'center'} alignContent={'center'}
                                alignItems='center' 
                            >
                                <Grid item lg={3} xs={3} md={3} sx={{ display: 'flex', width: "100%" }}>
                                    <MDAvatar
                                        src={option.cover_image.url || logo}
                                        alt={"Stock"}
                                        size="lg"
                                        sx={({ borders: { borderWidth }, palette: { white } }) => ({
                                            // border: `${borderWidth[2]} solid ${white.main}`,
                                            cursor: "pointer",
                                            borderRadius: "10px",
                                            height: "60px",
                                            width: "100px",
                                            // position: "relative",
                                            ml: 0,
                                            "&:hover, &:focus": {
                                                // zIndex: "10",
                                            },
                                        })}
                                    />
                                </Grid>
                                <Grid item lg={9} xs={9} md={9} sx={{ width: '100%', wordWrap: 'break-word' }}>
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
                    );
                }}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        label="Temples"
                        InputProps={{
                            ...params.InputProps,
                            style: {
                                color: 'grey',
                                height: 50,
                            },
                        }}
                        InputLabelProps={{
                            style: { color: 'grey' },
                        }}
                    />
                )}
                
            />
        </MDBox>
    );
}


export default MapSearch;
