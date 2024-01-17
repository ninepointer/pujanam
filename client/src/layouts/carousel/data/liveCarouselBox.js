import React from 'react';
// import MDBox from '../../../components/MDBox';
import { Grid } from '@mui/material';
import { Link } from 'react-router-dom';
// import MDTypography from '../../../components/MDTypography';
import MDButton from '../../../components/MDButton';
// import { Navigate, useNavigate } from 'react-router-dom';
import moment from 'moment'
import MDBox from '../../../components/MDBox';
import MDTypography from '../../../components/MDTypography';
import {Card, CardActionArea, CardContent } from '@mui/material';

const CarouselBox = ({ image, elem }) => {

  function limitStringWithEllipsis(inputString, maxLength) {
    if (inputString.length > maxLength) {
      return inputString.slice(0, maxLength) + '...';
    }
    return inputString;
  }

  return (
    <Grid container lg={12} md={4} xs={12} spacing={1} display='flex' justifyContent='center' alignItems='center'>
      <Grid item lg={12} md={4} xs={12} display='flex' justifyContent='center'>
          <Card sx={{ 
                minWidth: '100%', 
                cursor: 'pointer',
                transition: 'transform 0.3s cubic-bezier(0.25, 0.1, 0.25, 1), box-shadow 0.3s cubic-bezier(0.25, 0.1, 0.25, 1)',
                '&:hover': {
                    transform: 'scale(1.025)',
                    boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)', // Adjust the box shadow as needed
                    }
                }} onClick={() => {}}>

            <CardActionArea 
              component={Link}
              to={{
                pathname: `/carouseldetails`,
              }}
              state={{data: elem}}>
              <Grid container lg={12} md={4} xs={12} display='flex' justifyContent='flex-start' alignItems='center' >
                <Grid item xs={12} md={4} lg={12} display='flex' justifyContent='flex-start' style={{ maxWidth: '100%', height: 'auto' }}>
                  <img src={image} style={{ maxWidth: '100%', height: 'auto', borderTopLeftRadius: 10, borderTopRightRadius: 10 }} />
                </Grid>
                <Grid item xs={12} md={4} lg={12} display='flex' justifyContent='flex-start' style={{ maxWidth: '100%', height: 'auto' }}>
                <CardContent display='flex' justifyContent='flex-start' style={{ maxWidth: '100%', height: 'auto' }}>
                    <MDBox display='flex' justifyContent='flex-start' style={{ width: '100%'}}>
                        <MDTypography variant="h6" style={{ textAlign: 'center', fontFamily: 'Itim' }}>
                            {elem?.carouselName}
                        </MDTypography>
                    </MDBox>
                    <MDBox display='flex' justifyContent='flex-start' style={{ maxWidth: '100%', height: 'auto' }}>
                        <MDTypography variant="caption" style={{ textAlign: 'justify', fontFamily: 'Itim' }}>
                            {limitStringWithEllipsis(elem?.description,70)}
                        </MDTypography>
                    </MDBox>
                    <MDBox display='flex' justifyContent='flex-start'>
                      <MDTypography variant="button" color='success' style={{ textAlign: 'center', fontFamily: 'Itim' }}>View Details</MDTypography>
                    </MDBox>
                </CardContent>
                </Grid>
              </Grid>
            </CardActionArea>
          </Card>
      </Grid>

    </Grid>
  );
};

export default CarouselBox;