import { Grid, CircularProgress } from '@mui/material'
import React, {useState, useContext, useEffect} from "react"
import ReactGA from "react-ga";
import axios from "axios";
import { apiUrl } from '../../../../constants/constants';
import MDBox from '../../../../components/MDBox';
import MandirCard from './MandirCard'
import {LocationContext} from "../../../../locationContext";

const About = () => {
    const [data,setData] = useState([]);
    const locationContextData = useContext(LocationContext);
    const lat = locationContextData.locationState.latitude;
    const long = locationContextData.locationState.longitude;
    const [page, setPage] = useState(1);
    const [count, setCount] = useState(2);
    const [loading, setLoading] = useState(false);
    const limit = 8;

    useEffect(()=>{
      axios.get(`${apiUrl}mandir/user/allhome?lat=${lat}&long=${long}&page=${page}&limit=${limit}`)
      .then((response)=>{
        const newData = response?.data?.data;
        setCount(response?.data?.count);
        setData(newData);
      })
    }, [])

    useEffect(()=>{
        ReactGA.pageview(window.location.pathname)
    })
  
    const fetchData = async () => {
      const check = page > 0 ? ((count/((page-1)*limit)) > 1) : true;
      if (check) {
        setLoading(true);
        try {

          const response = await axios.get(`${apiUrl}mandir/user/allhome?lat=${lat}&long=${long}&page=${page}&limit=${limit}`);
          const newData = response?.data?.data;
          setData((prevData) => [...prevData, ...newData]);

        } catch (error) {
          console.error('Error fetching data:', error);
        } finally {
          setTimeout(() => {
            setLoading(false);
          }, 2000)
        }
      }
    };
  
    useEffect(() => {
      fetchData();
    }, [page]); // Fetch data on initial mount
  
    const handleScroll = () => {
      
        if (
          window.innerHeight + document.documentElement.scrollTop ===
          document.documentElement.offsetHeight
        ) {
          // User has scrolled to the bottom
          setPage((prevPage) => prevPage + 1);
        }
    };
  
    useEffect(() => {

      window.addEventListener('scroll', handleScroll);
      return () => {
        window.removeEventListener('scroll', handleScroll);
      };
    }, [count]);
  
    return (
        <>
            {data?.length > 0 ?
                <Grid item xs={12} mt={2} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{ maxWidth: '100%', height: 'auto' }}>
                    <MDBox display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{ maxWidth: '100%', height: 'auto' }}>
                        <Grid container spacing={4} xs={12} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{ width: '100%', height: 'auto' }}>
                            {data?.map((elem) => {
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

            {loading && <CircularProgress color='light' sx={{mt: "20px"}} />}
        </>
    )
}

export default About;