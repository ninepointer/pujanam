import React, {useState, useContext, useEffect} from "react"
import { useMediaQuery } from '@mui/material'
import theme from '../../HomePage/utils/theme/index'; 
import { ThemeProvider } from 'styled-components';
import background from '../../../assets/images/poojawaste.jpg'
// @mui material components
import Grid from "@mui/material/Grid";

// Material Dashboard 2 React components
import MDBox from "../../../components/MDBox";
import MDTypography from "../../../components/MDTypography";
import MDButton from "../../../components/MDButton";
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import { CardActionArea, Divider } from '@mui/material';
import CardContent from '@mui/material/CardContent';

function HomeCard({elem}) {
    // const [pooja,setPooja] = useState([]);
    function limitStringWithEllipsis(inputString, maxLength) {
        if (inputString.length > maxLength) {
          return inputString.slice(0, maxLength) + '...';
        }
        return inputString;
      }
    return(
        <Grid item xs={12} md={4} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{ maxWidth: '100%', height: 'auto' }}>
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
                onClick={() => {}}>

            <CardActionArea>
                <Grid item xs={12} md={4} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{ maxWidth: '100%', height: 'auto' }}>
                    <img src={elem?.cover_image?.url} style={{ maxWidth: '100%', height: 'auto', borderTopLeftRadius: 10, borderTopRightRadius: 10 }} />
                    <MDTypography variant="h6" fontSize={10} fontWeight={400} style={{ position: 'absolute', top: 0, right: 0, margin: '8px', textAlign: 'center', color: 'black', backgroundColor: "white", borderRadius: "15px", padding: "2px 10px 2px 10px", marginTop: "10px", fontFamily: 'Itim' }}>
                        {elem?.address_details?.city}, {elem?.address_details?.state}
                    </MDTypography>
                </Grid>
                <Grid item xs={12} md={4} lg={12} display='flex' justifyContent='flex-start' alignContent='center' alignItems='center' style={{ maxWidth: '100%', height: 'auto' }}>
                <CardContent display='flex' justifyContent='flex-start' alignContent='center' alignItems='center' style={{ maxWidth: '100%', height: 'auto' }}>
                    <MDBox display='flex' justifyContent='flex-start' alignContent='center' alignItems='center' style={{ width: '100%'}}>
                        <MDTypography fontSize={20} fontWeight={300} style={{ textAlign: 'center', fontFamily: 'Itim' }}>
                            {limitStringWithEllipsis(elem?.name,20)}
                        </MDTypography>
                    </MDBox>
                    <MDBox display='flex' justifyContent='flex-start' alignContent='center' alignItems='center' style={{ width: '100%'}}>
                        <MDTypography fontSize={12} fontWeight={200} style={{ textAlign: 'justify', fontFamily: 'Itim' }}>
                            {limitStringWithEllipsis(elem?.description,70)}
                        </MDTypography>
                    </MDBox>
                    <MDBox mb={-2} display='flex' justifyContent='flex-end' alignContent='center' alignItems='center' style={{ width: '100%'}}>
                        <MDButton size='small' variant='contained' style={{fontFamily:'Itim'}}>Discover Now</MDButton>
                    </MDBox>
                </CardContent>
                </Grid>
            </CardActionArea>
            </Card>
            </Grid>
        </Grid>
    )}

export default HomeCard;