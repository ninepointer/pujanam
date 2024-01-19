import React, {useState, useContext, useEffect} from "react"
// import { useMediaQuery } from '@mui/material'
// import theme from '../utils/theme/index'; 
// import { ThemeProvider } from 'styled-components';
// import background from '../../../assets/images/poojawaste.jpg'
// @mui material components
import Grid from "@mui/material/Grid";

// Material Dashboard 2 React components
import MDBox from "../../../components/MDBox";
import MDTypography from "../../../components/MDTypography";
// import MDButton from "../../../components/MDButton";
import Card from '@mui/material/Card';
import { CardActionArea, Divider, Typography } from '@mui/material';
import CardContent from '@mui/material/CardContent';
import moment from 'moment'
import { useNavigate } from "react-router-dom"; 

function HomeCard({elem, name, description}) {
    // const [pooja,setPooja] = useState([]);
    const navigate = useNavigate();
    function limitStringWithEllipsis(inputString, maxLength) {
        if (inputString.length > maxLength) {
          return inputString.slice(0, maxLength) + '...';
        }
        return inputString;
      }

    const handleOpenNewTab = async (elem) => {
        navigate(`/mandir/${elem?.slug}`)
    };
    return(
        <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{ maxWidth: '100%', height: 'auto' }}>
            <Grid container xs={12} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{ maxWidth: '100%', height: 'auto' }}>
            <Card sx={{ 
                minWidth: '100%', 
                cursor: 'pointer', 
                transition: 'transform 0.3s cubic-bezier(0.25, 0.1, 0.25, 1), box-shadow 0.3s cubic-bezier(0.25, 0.1, 0.25, 1)',
                '&:hover': {
                    transform: 'scale(1.05)',
                    boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)', // Adjust the box shadow as needed
                    }
                }} 
                onClick={() => { handleOpenNewTab(elem) }}>

            <CardActionArea>
                <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{ maxWidth: '100%', height: 'auto' }}>
                    <img src={elem?.cover_image?.url} style={{ maxWidth: '100%', height: 'auto', borderTopLeftRadius: 10, borderTopRightRadius: 10 }} />
                    {elem?.dham && <MDTypography color='success' variant="caption" style={{ position: 'absolute', top: 0, right: 0, margin: '8px', textAlign: 'center', backgroundColor: "lightgrey", borderRadius: "15px", padding: "2px 10px 2px 10px", marginTop: "10px", fontFamily: 'Itim' }}>
                        Dham
                    </MDTypography>}
                    {elem?.popular && <MDTypography color='dark' variant="caption" style={{ position: 'absolute', top: 0, right: elem?.dham ? 55 : 0, margin: '8px', textAlign: 'center', backgroundColor: "lightgrey", borderRadius: "15px", padding: "2px 10px 2px 10px", marginTop: "10px", fontFamily: 'Itim' }}>
                        Popular
                    </MDTypography>}
                </Grid>
                <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='flex-start' alignContent='center' alignItems='center' style={{ maxWidth: '100%', height: 'auto' }}>
                <CardContent display='flex' justifyContent='flex-start' alignContent='center' alignItems='center' style={{ minWidth: '100%', height: 'auto' }}>
                    
                    <MDBox display='flex' justifyContent='flex-start' alignContent='center' alignItems='center' style={{ width: '100%'}}>
                        <MDTypography variant='h6'>
                            {limitStringWithEllipsis(elem?.name,25)}
                        </MDTypography>
                    </MDBox>

                    <MDBox display='flex' justifyContent='flex-start' alignContent='center' alignItems='center' style={{ width: '100%'}}>
                        <MDTypography variant='caption'>
                            {limitStringWithEllipsis(`${elem?.address_details?.address + ', ' + elem?.address_details?.city + ', ' + elem?.address_details?.state + ', ' + elem?.address_details?.country}`,35)}
                        </MDTypography>
                    </MDBox>

                    <MDBox mt={0.5} display='flex' justifyContent='flex-start' alignContent='center' alignItems='center' style={{ width: '100%'}}>
                        <Grid container xs={12} md={12} lg={12} display='flex' justifyContent='space-between' alignContent='center' alignItems='center' style={{ minWidth: '100%'}}>
                            <Grid item xs={6} md={6} lg={6} display='flex' justifyContent='flex-start' alignContent='center' alignItems='center'>
                                <MDTypography variant='caption' color='success'>Opens at {moment.utc(elem?.morning_opening_time).utcOffset('+05:30').format('HH:mm a')}</MDTypography>
                            </Grid>
                            <Grid item xs={6} md={6} lg={6} display='flex' justifyContent='flex-end' alignContent='center' alignItems='center'>
                                <MDTypography variant='caption' color='success'>{elem?.devi_devta}</MDTypography>
                            </Grid>
                        </Grid>
                    </MDBox>

                    <MDBox mt={0.5} mb={-1} display='flex' justifyContent='flex-start' alignContent='center' alignItems='center' style={{ width: '100%'}}>
                        <Grid container xs={12} md={12} lg={12} display='flex' justifyContent='space-between' alignContent='center' alignItems='center' style={{ minWidth: '100%'}}>
                            <Grid item xs={8} md={8} lg={8} display='flex' justifyContent='flex-start' alignContent='center' alignItems='center'>
                                <MDTypography variant='caption' color='success'>Aarti Time: {moment.utc(elem?.morning_aarti_time).format('HH:mm a')}</MDTypography>
                            </Grid>
                            <Grid item xs={4} md={4} lg={4} display='flex' justifyContent='flex-end' alignContent='center' alignItems='center'>
                                <MDTypography variant='caption' color='success'>{(elem?.distance/1000)?.toFixed(2)} km</MDTypography>
                            </Grid>
                        </Grid>
                    </MDBox>

                </CardContent>
                </Grid>
            </CardActionArea>
            </Card>
            </Grid>
        </Grid>
    )}

export default HomeCard;