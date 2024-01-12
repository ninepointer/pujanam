
import React, {useState, useEffect} from 'react'
import Grid from "@mui/material/Grid";
import axios from "axios";
// Material Dashboard 2 React components
import MDBox from "../../../components/MDBox";
import MDAvatar from "../../../components/MDAvatar";
import MDButton from "../../../components/MDButton";
import MDTypography from "../../../components/MDTypography";
import money from "../../../assets/images/money.png"
import { Link, useLocation } from "react-router-dom";
import moment from 'moment';
import { apiUrl } from '../../../constants/constants';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';

const ActivePooja = () => {
let [skip, setSkip] = useState(0);
const limitSetting = 10;
const [count, setCount] = useState(0);
const [isLoading,setIsLoading] = useState(false);
const [data,setData] = useState([]);

  useEffect(()=>{
    let call1 = axios.get(`${apiUrl}pooja/active/?skip=${skip}&limit=${limitSetting}`,{
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
    axios.get(`${apiUrl}pooja/active/?skip=${skip}&limit=${limitSetting}`,{
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
    axios.get(`${apiUrl}pooja/active/?skip=${skip}&limit=${limitSetting}`,{
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
  function limitStringWithEllipsis(inputString, maxLength) {
    if (inputString.length > maxLength) {
      return inputString.slice(0, maxLength) + '...';
    }
    return inputString;
  }

  
    return (
      <>
      {data.length > 0 ?
        
          <MDBox>
            <Grid container spacing={4} bgColor="light" display="flex" justifyContent="flex-start" alignItems='center'>
              {data?.map((elem, index)=>{

                    return (

                      <Grid key={elem?._id} item xs={12} md={4} lg={3} display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{width: '100%',height: 'auto'}}>
                      

                      <Card sx={{minWidth:'100%',minHeight:360, maxHeight:360}}>
                        <CardMedia
                          sx={{ minHeight: 200, maxHeight:200 }}
                          image={elem?.image?.url}
                          title={elem?.name}
                        />
                        <CardContent sx={{ minHeight: 90, maxHeight:90}}>
                          <MDTypography gutterBottom variant="h5" component="div">
                            {elem?.name}
                          </MDTypography>
                          <MDTypography variant="body2" color="text.secondary">
                            {limitStringWithEllipsis(elem?.description,45)}
                          </MDTypography>
                        </CardContent>
                        <CardActions sx={{ minHeight: 50, maxHeight:50}}>
                          <MDButton component={Link} to={{pathname:`/poojadetails`}} state={{ data: elem }} size="small">View Details</MDButton>
                          {/* <MDButton component={Link} to={{pathname:`/poojadetails`}} state={{ data: elem }} size="small">Share</MDButton> */}
                        </CardActions>
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
            <MDTypography color="light">No Published Pooja Service(s)</MDTypography>
          </Grid>
         </Grid>
         } 

      </>
)}



export default ActivePooja;