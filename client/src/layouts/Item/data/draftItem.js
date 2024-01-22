import React, {useState, useEffect} from 'react'
import Grid from "@mui/material/Grid";
import axios from "axios";
// Material Dashboard 2 React components
import MDBox from "../../../components/MDBox";
import MDButton from "../../../components/MDButton";
import MDTypography from "../../../components/MDTypography";
import { Link, useLocation } from "react-router-dom";
import { apiUrl } from '../../../constants/constants';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { CardActionArea } from '@mui/material';
import DefaultPanditImage from '../../../assets/images/defaultpanditimage.png'
import MDAvatar from '../../../components/MDAvatar';

const Draft = () => {
let [skip, setSkip] = useState(0);
const limitSetting = 10;
const [count, setCount] = useState(0);
const [isLoading,setIsLoading] = useState(false);
const [data,setData] = useState([]);

  useEffect(()=>{
    let call1 = axios.get(`${apiUrl}items/draft/?skip=${skip}&limit=${limitSetting}`,{
                withCredentials: true,
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Credentials": true
                  },
                })
    Promise.all([call1])
    .then(([api1Response]) => {
      // Process the responses here
      setData(api1Response.data.data)
      setCount(api1Response.data.count)
      setTimeout(()=>{
        setIsLoading(false)
      },100)
    })
    .catch((error) => {
      // Handle errors here
    });
  },[])

  function backHandler(){
    if(skip <= 0){
        return;
    }
    setSkip(prev => prev-limitSetting);
    setData([]);
    setIsLoading(true)
    axios.get(`${apiUrl}items/active/?skip=${skip}&limit=${limitSetting}`,{
        withCredentials: true,
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "Access-Control-Allow-Credentials": true
        },
    })
    .then((res) => {
        setData(res.data.data)
        setCount(res.data.count)
        setTimeout(()=>{
            setIsLoading(false)
          },500)
    }).catch((err) => {
        setIsLoading(false)
        return new Error(err);
    })
  }

  function nextHandler(){
    if(skip+limitSetting >= count){
      return;
    }
    setSkip(prev => prev+limitSetting);
    setData([]);
    setIsLoading(true)
    axios.get(`${apiUrl}items/active/?skip=${skip}&limit=${limitSetting}`,{
        withCredentials: true,
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "Access-Control-Allow-Credentials": true
        },
    })
    .then((res) => {
        setData(res.data.data)
        console.log(res.data.data)
        setCount(res.data.count)
        setTimeout(()=>{
            setIsLoading(false)
          },500)
    }).catch((err) => {
        setIsLoading(false)
        return new Error(err);
    })
  }

  
    return (
      <>
      {data.length > 0 ?
        
          <MDBox>
            <Grid container spacing={2} bgColor="light" display="flex" justifyContent="flex-start" alignItems='center'>
              {data?.map((elem, index)=>{

                    return (

                      <Grid key={elem?._id} item xs={12} md={4} lg={4} display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{width: '100%',height: 'auto'}}>
                      
                          <Card sx={{ 
                            minWidth: '100%', 
                            cursor: 'pointer',
                            transition: 'transform 0.3s cubic-bezier(0.25, 0.1, 0.25, 1), box-shadow 0.3s cubic-bezier(0.25, 0.1, 0.25, 1)',
                            '&:hover': {
                                transform: 'scale(1.025)',
                                boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)', // Adjust the box shadow as needed
                                }
                            }} onClick={() => {}}
                          >

                            <CardActionArea 
                              component={Link}
                              to={{
                                pathname: `/itemdetails`,
                              }}
                              state={{data: elem}}>
                              <Grid container lg={12} md={4} xs={12} display='flex' justifyContent='center' alignItems='center' >
                                <Grid item xs={12} md={4} lg={4} display='flex' justifyContent='center' style={{ maxWidth: '100%', height: 'auto' }}>
                                  <MDAvatar
                                      src={elem?.image?.url ? elem?.image?.url : DefaultPanditImage}
                                      alt={elem?.pandit_name}
                                      size="lg"
                                      sx={({ borders: { borderWidth }, palette: { white } }) => ({
                                        border: `${borderWidth[2]} solid ${white.main}`,
                                        cursor: "pointer",
                                        position: "relative",
                                        ml:2,

                                        "&:hover, &:focus": {
                                          zIndex: "10",
                                        },
                                      })}
                                  />
                                </Grid>
                                <Grid item xs={12} md={4} lg={8} display='flex' justifyContent='flex-start' style={{ maxWidth: '100%', height: 'auto' }}>
                                <CardContent display='flex' justifyContent='flex-start' style={{ maxWidth: '100%', height: 'auto' }}>
                                    <MDBox display='flex' justifyContent='flex-start' style={{ width: '100%'}}>
                                        <MDTypography variant="h6" style={{ textAlign: 'center', fontFamily: 'Itim' }}>
                                            {elem?.name}
                                        </MDTypography>
                                    </MDBox>
                                    <MDBox display='flex' justifyContent='flex-start' style={{ maxWidth: '100%', height: 'auto' }}>
                                        <MDTypography variant="caption" style={{ textAlign: 'justify', fontFamily: 'Itim' }}>
                                            MOQ: {elem?.min_order_quantity}
                                        </MDTypography>
                                    </MDBox>
                                    <MDBox display='flex' justifyContent='flex-start' style={{ maxWidth: '100%', height: 'auto' }}>
                                        <MDTypography variant="caption" style={{ textAlign: 'justify', fontFamily: 'Itim' }}>
                                        Price: {elem?.price}
                                        </MDTypography>
                                    </MDBox>
                                    <MDBox mb={-1.5} display='flex' justifyContent='flex-start'>
                                      <MDTypography variant="button" color='success' style={{ textAlign: 'center', fontFamily: 'Itim' }}>View Details</MDTypography>
                                    </MDBox>
                                </CardContent>
                                </Grid>
                              </Grid>
                            </CardActionArea>
                          </Card>

                      </Grid>   
                    )
              })}
            </Grid>
            {!isLoading && count !== 0 &&
            <MDBox mt={2} display="flex" justifyContent="space-between" alignItems='center' width='100%'>
              <MDButton variant='outlined' color='success' disabled={(skip + limitSetting) / limitSetting === 1 ? true : false} size="small" onClick={backHandler}>Back</MDButton>
              <MDTypography color="success" fontSize={15} fontWeight='bold'>Total Count: {!count ? 0 : count} | Page {(skip + limitSetting) / limitSetting} of {!count ? 1 : Math.ceil(count / limitSetting)}</MDTypography>
              <MDButton variant='outlined' color='success' disabled={Math.ceil(count / limitSetting) === (skip + limitSetting) / limitSetting ? true : !count ? true : false} size="small" onClick={nextHandler}>Next</MDButton>
            </MDBox>
            }
          </MDBox>
          :
         <Grid container spacing={1} xs={12} md={6} lg={12}>
          <Grid item mt={2} xs={6} md={3} lg={12} display="flex" justifyContent="center">
            <MDTypography color="dark">No Draft Item(s)</MDTypography>
          </Grid>
         </Grid>
         } 

      </>
)}



export default Draft;