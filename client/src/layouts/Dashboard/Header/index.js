import React, {useState, useEffect} from 'react';
import axios from "axios"
import MDBox from '../../../components/MDBox';
import MDButton from '../../../components/MDButton';
import {Grid, CircularProgress, Divider} from '@mui/material';
import MDTypography from '../../../components/MDTypography';
import { Link } from "react-router-dom";
import CachedIcon from '@mui/icons-material/Cached';
import LiveContest from '../data/infinityContests'

//data
import CompanySideContestDailyChart from '../data/companySideContestDailyChart'
import DailyContestUsers from '../data/dailyContestUsers'
import DailyPaidContestUsers from '../data/dailyPaidContestUsers'
import PnlOverviewMock from '../infinityContestComponent/pnlOverviewMock';
import PnlOverviewLive from '../infinityContestComponent/pnlOverviewLive';
import XTSOverview from '../infinityContestComponent/xtsOverview';

export default function LabTabs() {

  return (
    <MDBox bgColor="light" mt={2} mb={1} p={2} borderRadius={10} display='flex' flexDirection='column' justifyContent='center' alignItems='center' minHeight='auto' maxWidth='100%'>
        <MDBox display='flex' justifyContent='left'>
            <MDTypography ml={1} mb={1} color='light' fontSize={18} fontWeight='bold'>Dashboard</MDTypography>
        </MDBox>

        <Grid container spacing={1} xs={12} md={12} lg={12} mt={0.5} mb={0.5} display='flex' justifyContent='center' alignItems='center'>

           
        </Grid>


        <Grid container spacing={2} xs={12} md={12} lg={12} mt={1}>
            <Grid item lg={3}>
                <MDBox p={2} bgColor='text' borderRadius={5}>
                    <MDTypography color='light' fontSize={15} fontWeight='bold'>Quick Links</MDTypography>
                    <Grid container spacing={1}>
                        <Grid item fullWidth>
                            <MDButton 
                                variant="contained" 
                                color={"success"} 
                                size="small" 
                                component = {Link}
                                to={{
                                    pathname: `/pandit`,
                                  }}
                            >
                                Pandit
                            </MDButton>
                        </Grid>
                        <Grid item fullWidth>
                            <MDButton 
                                variant="contained" 
                                color={"success"} 
                                size="small" 
                                component = {Link}
                                to={{
                                    pathname: `/tier`,
                                  }}
                            >
                                Tiers
                            </MDButton>
                        </Grid>
                        <Grid item fullWidth>
                            <MDButton 
                                variant="contained" 
                                color={"dark"} 
                                size="small" 
                                component = {Link}
                                to={{
                                    pathname: `/pooja`,
                                  }}
                            >
                                Pooja
                            </MDButton>
                        </Grid>

                        <Grid item fullWidth>
                            <MDButton 
                                variant="contained" 
                                color={"error"} 
                                size="small" 
                                component = {Link}
                                to={{
                                    pathname: `/devidevta`,
                                  }}
                            >
                                Devi-Devta
                            </MDButton>
                        </Grid>

                        {/* <Grid item fullWidth>
                            <MDButton 
                                variant="contained" 
                                color={"warning"} 
                                size="small" 
                                component = {Link}
                                to={{
                                    pathname: `/mandir`,
                                  }}
                            >
                                Mandir
                            </MDButton>
                        </Grid> */}
                
                    </Grid>
                </MDBox>
                
            </Grid>
        </Grid>

    </MDBox>
  );
}