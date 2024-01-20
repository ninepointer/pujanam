import { Grid } from '@mui/material'
import React, {useState, useContext, useEffect} from "react"
import ReactGA from "react-ga";
import axios from "axios";
import { apiUrl } from '../../../../constants/constants';
import MDBox from '../../../../components/MDBox';
import MandirCard from './MandirCard'
import {LocationContext} from "../../../../locationContext";

const About = () => {
    const [value, setValue] = React.useState(0);
    const [scrollPosition, setScrollPosition] = useState(0);
    const [popular,setPopular] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const locationContextData = useContext(LocationContext);
    const lat = locationContextData.locationState.latitude;
    const long = locationContextData.locationState.longitude;

  

  
    useEffect(()=>{
        let call3 = axios.get(`${apiUrl}mandir/user/allhomepopular?lat=${lat}&long=${long}`,{
          withCredentials: false,
          headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
              "Access-Control-Allow-Credentials": true
            },
          })
        Promise.all([call3])
        .then(([api1Response3]) => {
          // Process the responses here
          setPopular(api1Response3?.data?.data)
          setTimeout(()=>{
            setIsLoading(false)
          },500)
        })
        .catch((error) => {
          // Handle errors here
        });
      },[locationContextData.locationState])

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
    return (
        <>
            {popular?.length > 0 ?
                <Grid item xs={12} mt={2} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{ maxWidth: '100%', height: 'auto' }}>
                    <MDBox display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{ maxWidth: '100%', height: 'auto' }}>
                        <Grid container spacing={4} xs={12} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{ width: '100%', height: 'auto' }}>
                            {popular?.map((elem) => {
                                return (
                                    <Grid key={elem?._id} item xs={12} md={4} lg={3} display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{ width: '100%', height: 'auto' }}>
                                        <MandirCard elem={elem} />
                                    </Grid>
                                )
                            })}
                        </Grid>
                    </MDBox>

                </Grid>
                :
                <>
                </>
            }
        </>
    )
}

export default About;



