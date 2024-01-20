import React, {useState, useContext, useEffect} from "react"
import background from '../../../assets/images/mandirs.jpg'
import { useNavigate } from "react-router-dom"; 
// @mui material components
import Grid from "@mui/material/Grid";


// Material Dashboard 2 React components
import MDBox from "../../../components/MDBox";
import MDTypography from "../../../components/MDTypography";
import MDButton from "../../../components/MDButton";
import Card from '@mui/material/Card';
import { CardActionArea, Divider } from '@mui/material';
import CardContent from '@mui/material/CardContent';
import {settingContext} from '../../../settingContext';
import ReactGA from 'react-ga'

function HomeCard() {
    const setting = useContext(settingContext)
    const navigate = useNavigate();
    const handlePlaystoreNavigate = () => {
        navigate(`/mandir`)
      };
    
    useEffect(()=>{
    ReactGA.pageview(window.location.pathname)
    })

    return(
        <Grid item xs={12} md={4} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{ maxWidth: '100%', height: 'auto' }}>
            <Grid container xs={12} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{ maxWidth: '100%', height: 'auto' }}>
            <Card sx={{ 
                minWidth: '100%', 
                cursor: 'pointer',
                transition: 'transform 0.3s cubic-bezier(0.25, 0.1, 0.25, 1), box-shadow 0.3s cubic-bezier(0.25, 0.1, 0.25, 1)',
                '&:hover': {
                    transform: 'scale(1.10)',
                    boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)', // Adjust the box shadow as needed
                    }
                }} onClick={() => {handlePlaystoreNavigate()}}>

            <CardActionArea>
                <Grid item xs={12} md={4} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{ maxWidth: '100%', height: 'auto' }}>
                <img src={background} style={{ maxWidth: '100%', height: 'auto', borderTopLeftRadius: 10, borderTopRightRadius: 10 }} />
                </Grid>
                <Grid item xs={12} md={4} lg={12} display='flex' justifyContent='flex-start' alignContent='center' alignItems='center' style={{ maxWidth: '100%', height: 'auto' }}>
                <CardContent display='flex' justifyContent='flex-start' alignContent='center' alignItems='center' style={{ maxWidth: '100%', height: 'auto' }}>
                    <MDBox display='flex' justifyContent='flex-start' alignContent='center' alignItems='center' style={{ width: '100%'}}>
                        <MDTypography fontSize={20} fontWeight={300} style={{ textAlign: 'center', fontFamily: 'Itim' }}>
                            Mandir
                        </MDTypography>
                    </MDBox>
                    <MDBox display='flex' justifyContent='flex-start' alignContent='center' alignItems='center' style={{ width: '100%'}}>
                        <MDTypography fontSize={12} fontWeight={200} style={{ textAlign: 'justify', fontFamily: 'Itim' }}>
                            Discover the City's Spiritual Gems: Explore the mandir nearby
                        </MDTypography>
                    </MDBox>
                    <MDBox mt={0.5} mb={-1} display='flex' justifyContent='flex-start' alignContent='center' alignItems='center' style={{ width: '100%'}}>
                        <Grid container xs={12} md={12} lg={12} display='flex' justifyContent='space-between' alignContent='center' alignItems='center' style={{ minWidth: '100%'}}>
                            <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='flex-end' alignContent='center' alignItems='center'>
                                <MDTypography variant='caption' color='success'>Discover Now</MDTypography>
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