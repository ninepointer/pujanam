import { Container, Grid, Stack } from '@mui/material'
import { ThemeProvider } from 'styled-components';
import React, {useState, useContext, useEffect} from "react"
import ReactGA from "react-ga";
import axios from "axios";
import Title from '../components/Title/index'
import ServiceCard from '../components/Cards/ServiceCard'
import PageNavbar from '../components/Navbars/PageNavbar'
import theme from '../utils/theme/index'
import background from '../../../assets/images/background.jpg'
import logo from '../../../assets/images/logo.png'
import Footer from '../../authentication/components/Footer'
import { apiUrl } from '../../../constants/constants';
import MDBox from '../../../components/MDBox';
import MDTypography from '../../../components/MDTypography';
import {Typography, CardActionArea, CardContent, Card, Divider, CircularProgress} from '@mui/material';
import MandirCard from './MandirCard'
import { PowerInput } from '@mui/icons-material';


const LinkButton = ({ children, ...props }) => (
    <Stack
      direction="row"
      alignItems="center"
      spacing={0.2}
      sx={{
        cursor: "pointer",
        color: "#315c45",
        "&:hover": { color: '#65BA0D'},
      }}
      {...props}
    >
      {children}
    </Stack>
  );

const About = () => {
    console.log(theme);
    const [scrollPosition, setScrollPosition] = useState(0);
    const [data,setData] = useState([]);
    const [dham,setDham] = useState([]);
    const [popular,setPopular] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(()=>{
        let call1 = axios.get(`${apiUrl}usermandir/allhome`,{
                    withCredentials: false,
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json",
                        "Access-Control-Allow-Credentials": true
                      },
                    })
        let call2 = axios.get(`${apiUrl}usermandir/homedham`,{
          withCredentials: false,
          headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
              "Access-Control-Allow-Credentials": true
            },
          })
        let call3 = axios.get(`${apiUrl}usermandir/allhomepopular`,{
          withCredentials: false,
          headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
              "Access-Control-Allow-Credentials": true
            },
          })
        Promise.all([call1,call2,call3])
        .then(([api1Response1,api1Response2,api1Response3]) => {
          // Process the responses here
          setData(api1Response1?.data?.data)
          setDham(api1Response2?.data?.data)
          setPopular(api1Response3?.data?.data)
          setTimeout(()=>{
            setIsLoading(false)
          },200)
        })
        .catch((error) => {
          // Handle errors here
        });
      },[])

    useEffect(()=>{
        ReactGA.pageview(window.location.pathname)
    })

    useEffect(() => {
        const handleScroll = () => {
            setScrollPosition(window.scrollY);
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const handleOpenNewTab = async (elem) => {
    
        const newTab = window.open(`/mandir/${elem?.slug}`, '_blank');
        // await fetchDeviceDetail(elem?._id);
      };
    
    const backgroundColor = scrollPosition > 10 ? 'rgba(0, 0, 0, 0.8)' : 'transparent'
    const backdropFilter = scrollPosition > 10 ? 'blur(5px)' : 'none'
    
    console.log("Dham1:",dham)
    return (
        <>
      <MDBox mt={-1} display='flex' justifyContent='center' flexDirection='column' alignContent='center' alignItems='center' style={{ minHeight:'auto', width: 'auto', minWidth:'100vW', overflow: 'visible'}}>
        <ThemeProvider theme={theme}>
          <PageNavbar />
          
          <Grid container display='flex' justifyContent='center' alignContent='center' alignItems='center' xs={12} md={12} lg={12} 
            style={{ 
                justifyContent: 'center',
                alignContent: 'center',
                backgroundImage: `url(${background})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center center',
                height: '100vh',
                // flexDirection: 'column',
                textAlign: 'center',
                padding: '20px',
                position: 'fixed',
                top: 0,
                left: 0,
                // filter: backdropFilter,
                // backgroundColor: backgroundColor,
                overflow: 'visible'
                }}
          >

          </Grid>
          
          {!isLoading ?
            <>
            <Grid container mt={12} mb={2} display='flex' justifyContent='center' alignContent='center' alignItems='center' xs={12} md={12} lg={12} style={{ maxWidth: '100%', height: 'auto', flexGrow: 1, overflowY: 'auto', zIndex:3, overflow: 'visible' }}>

                <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{ maxWidth: '95%', height: 'auto' }}>
                    <Grid container spacing={2} xs={12} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='center'>

                        <Grid item mt={1} xs={12} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{ width: '100%' }}>
                        <Grid container xs={12} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{ maxWidth: '100%', height: 'auto' }}>
                            <Grid ml={2} item xs={12} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{ maxWidth: '100%', height: 'auto' }}>
                            <MDBox display='flex' justifyContent='center' alignContent='flext-start' alignItems='center' style={{ maxWidth: '100%', height: 'auto' }}>
                                <MDTypography variant="h5" color="dark">All About the Char Dham Mandir of India!</MDTypography>
                            </MDBox>
                            </Grid>

                            {dham?.length > 0 ?
                                <Grid item xs={12} mt={2} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{ maxWidth: '100%', height: 'auto' }}>

                                <MDBox display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{ maxWidth: '100%', height: 'auto' }}>
                                    <Grid container spacing={4} xs={12} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{ width: '100%', height: 'auto' }}>
                                    {dham?.map((elem) => {
                                        return (
                                        <Grid key={elem?._id} item xs={12} md={4} lg={3} display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{ width: '100%', height: 'auto' }}>
                                            <MandirCard elem={elem}/>
                                        </Grid>
                                        )
                                    })}
                                    </Grid>
                                </MDBox>

                                </Grid>
                                :
                                <>
                                {/* <img src={NoData} width='500px' height='500px' /> */}
                                </>
                            }

                        </Grid>
                        </Grid>

                        <Grid item mt={1} xs={12} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{ width: '100%' }}>
                        <Grid container xs={12} md={12} lg={12} display='flex' justifyContent='flex-start' alignContent='center' alignItems='center' style={{ maxWidth: '100%', height: 'auto' }}>
                            <Grid ml={2} item xs={12} md={12} lg={12} display='flex' justifyContent='flex-start' alignContent='center' alignItems='center' style={{ maxWidth: '100%', height: 'auto' }}>
                            <MDBox display='flex' justifyContent='center' alignContent='flext-start' alignItems='center' style={{ maxWidth: '100%', height: 'auto' }}>
                            <MDTypography variant="h5" color="dark">Popular Mandir near you!</MDTypography>
                            </MDBox>
                            </Grid>

                            {popular?.length > 0 ?
                                <Grid item xs={12} mt={2} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{ maxWidth: '100%', height: 'auto' }}>

                                <MDBox display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{ maxWidth: '100%', height: 'auto' }}>
                                    <Grid container spacing={4} xs={12} md={12} lg={12} display='flex' justifyContent='flex-start' alignContent='center' alignItems='center' style={{ width: '100%', height: 'auto' }}>
                                    {popular?.map((elem) => {
                                        return (
                                        <Grid key={elem?._id} item xs={12} md={4} lg={3} display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{ width: '100%', height: 'auto' }}>
                                            <MandirCard elem={elem}/>
                                        </Grid>
                                        )
                                    })}
                                    </Grid>
                                </MDBox>

                                </Grid>
                                :
                                <>
                                {/* <img src={NoData} width='500px' height='500px' /> */}
                                </>
                            }

                        </Grid>
                        </Grid>

                        <Grid item mt={1} xs={12} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{ width: '100%' }}>
                        <Grid container xs={12} md={12} lg={12} display='flex' justifyContent='flex-start' alignContent='center' alignItems='center' style={{ maxWidth: '100%', height: 'auto' }}>
                            <Grid ml={2} item xs={12} md={12} lg={12} display='flex' justifyContent='flex-start' alignContent='center' alignItems='center' style={{ maxWidth: '100%', height: 'auto' }}>
                            <MDBox display='flex' justifyContent='center' alignContent='flext-start' alignItems='center' style={{ maxWidth: '100%', height: 'auto' }}>
                            <MDTypography variant="h5" color="dark">All Mandir near you!</MDTypography>
                            </MDBox>
                            </Grid>

                            {data?.length > 0 ?
                                <Grid item xs={12} mt={2} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{ maxWidth: '100%', height: 'auto' }}>

                                <MDBox display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{ maxWidth: '100%', height: 'auto' }}>
                                    <Grid container spacing={4} xs={12} md={12} lg={12} display='flex' justifyContent='flex-start' alignContent='center' alignItems='center' style={{ width: '100%', height: 'auto' }}>
                                    {data?.map((elem) => {
                                        return (
                                        <Grid key={elem?._id} item xs={12} md={4} lg={3} display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{ width: '100%', height: 'auto' }}>
                                            <MandirCard elem={elem}/>
                                        </Grid>
                                        )
                                    })}
                                    </Grid>
                                </MDBox>

                                </Grid>
                                :
                                <>
                                {/* <img src={NoData} width='500px' height='500px' /> */}
                                </>
                            }

                        </Grid>
                        </Grid>

                    </Grid>
                </Grid>
            </Grid>
            </>
            :
            <MDBox mt={35} mb={35} display="flex" width="100%" justifyContent="center" alignItems="center">
                <CircularProgress color='success' />
            </MDBox>
         }
        </ThemeProvider>
      </MDBox>

      <MDBox display='flex' justifyContent='center' alignContent='center' alignItems='flex-end' >
        <Footer />
      </MDBox>
    </>
    )
}

export default About;



