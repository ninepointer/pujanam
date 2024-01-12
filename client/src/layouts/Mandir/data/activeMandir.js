
import React, { useState, useEffect } from 'react'
import Grid from "@mui/material/Grid";
import axios from "axios";
// Material Dashboard 2 React components
import MDBox from "../../../components/MDBox";
import MDAvatar from "../../../components/MDAvatar";
import MDButton from "../../../components/MDButton";
import MDTypography from "../../../components/MDTypography";
import { Link, useLocation } from "react-router-dom";
import moment from 'moment';
import { apiUrl } from '../../../constants/constants';

const ActiveMandir = () => {
  let [skip, setSkip] = useState(0);
  const limitSetting = 10;
  const [count, setCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState([]);

  useEffect(() => {
    let call1 = axios.get(`${apiUrl}mandir/active/?skip=${skip}&limit=${limitSetting}`, {
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
        setTimeout(() => {
          setIsLoading(false)
        }, 100)
      })
      .catch((error) => {
        // Handle errors here
      });
  }, [])

  function backHandler() {
    if (skip <= 0) {
      return;
    }
    setSkip(prev => prev - limitSetting);
    setData([]);
    setIsLoading(true)
    axios.get(`${apiUrl}mandir/active/?skip=${skip}&limit=${limitSetting}`, {
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
        setTimeout(() => {
          setIsLoading(false)
        }, 500)
      }).catch((err) => {
        setIsLoading(false)
        return new Error(err);
      })
  }

  function nextHandler() {
    if (skip + limitSetting >= count) {
      return;
    }
    setSkip(prev => prev + limitSetting);
    setData([]);
    setIsLoading(true)
    axios.get(`${apiUrl}mandir/active/?skip=${skip}&limit=${limitSetting}`, {
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
        setTimeout(() => {
          setIsLoading(false)
        }, 500)
      }).catch((err) => {
        setIsLoading(false)
        return new Error(err);
      })
  }


  return (
    <>
      {data.length > 0 ?

        <MDBox>
          <Grid container spacing={2} bgColor="dark">
            {data?.map((e) => {
              return (

                <Grid key={e._id} item xs={12} md={12} lg={12} bgColor="dark">
                  <MDBox padding={0} style={{ borderRadius: 4 }}>
                    <MDButton
                      variant="contained"
                      color={"light"}
                      size="small"
                      component={Link}
                      style={{ minWidth: '100%' }}
                      to={{
                        pathname: `/mandirdetails`,
                      }}
                      state={{ data: e }}
                    >
                      <Grid container>

                        <Grid item xs={12} md={6} lg={12} mt={1} mb={1} display="flex" justifyContent="left" >
                          <MDTypography fontSize={15} style={{ color: "black", paddingRight: 4, fontWeight: 'bold' }}>Name: {e?.name}</MDTypography>
                        </Grid>

                        <Grid item xs={12} md={6} lg={12} display={"flex"} justifyContent={"center"} alignItems={"center"}>
                          <Grid item xs={12} md={6} lg={2} mb={1} display="flex" justifyContent="center">
                            <MDTypography fontSize={9} style={{ color: "black" }}>Dham: <span style={{ fontSize: 9, fontWeight: 700 }}>{e?.dham ? "Yes" : "No"}</span></MDTypography>
                          </Grid>

                          <Grid item xs={12} md={6} lg={2} mb={1} display="flex" justifyContent="center">
                            <MDTypography fontSize={9} style={{ color: "black" }}>Popular: <span style={{ fontSize: 9, fontWeight: 700 }}>{e?.popular ? "Yes" : "No"}</span></MDTypography>
                          </Grid>

                          <Grid item xs={12} md={6} lg={2} mb={1} display="flex" justifyContent="center">
                            <MDTypography fontSize={9} style={{ color: "black" }}>God: <span style={{ fontSize: 9, fontWeight: 700 }}>{e?.devi_devta?.name}</span></MDTypography>
                          </Grid>

                          <Grid item xs={12} md={6} lg={2} mb={1} display="flex" justifyContent="center">
                            <MDTypography fontSize={9} style={{ color: "black" }}>City: <span style={{ fontSize: 9, fontWeight: 700 }}>{e?.address_details?.city}</span></MDTypography>
                          </Grid>

                          <Grid item xs={12} md={6} lg={2} mb={1} display="flex" justifyContent="center">
                            <MDTypography fontSize={9} style={{ color: "black" }}>Status: <span style={{ fontSize: 9, fontWeight: 700 }}>{e?.status}</span></MDTypography>
                          </Grid>
                        </Grid>

                        <Grid item xs={12} md={6} lg={12} display={"flex"} justifyContent={"center"} alignItems={"center"}>

                          <Grid item xs={12} md={6} lg={2} mb={1} display="flex" justifyContent="center">
                            <MDTypography fontSize={9} style={{ color: "black" }}>Morning Open Time: <span style={{ fontSize: 9, fontWeight: 700 }}>{moment(e?.morning_opening_time).format("HH:mm")}</span></MDTypography>
                          </Grid>

                          <Grid item xs={12} md={6} lg={2} mb={1} display="flex" justifyContent="center">
                            <MDTypography fontSize={9} style={{ color: "black" }}>Morning Close Time: <span style={{ fontSize: 9, fontWeight: 700 }}>{moment(e?.morning_closing_time).format("HH:mm")}</span></MDTypography>
                          </Grid>

                          <Grid item xs={12} md={6} lg={2} mb={1} display="flex" justifyContent="center">
                            <MDTypography fontSize={9} style={{ color: "black" }}>Evening Open Time: <span style={{ fontSize: 9, fontWeight: 700 }}>{moment(e?.evening_opening_time).format("HH:mm")}</span></MDTypography>
                          </Grid>

                          <Grid item xs={12} md={6} lg={2} mb={1} display="flex" justifyContent="center">
                            <MDTypography fontSize={9} style={{ color: "black" }}>Evening Close Time: <span style={{ fontSize: 9, fontWeight: 700 }}>{moment(e?.evening_closing_time).format("HH:mm")}</span></MDTypography>
                          </Grid>
                        </Grid>
                      </Grid>
                    </MDButton>
                  </MDBox>
                </Grid>

              )
            })}
          </Grid>
          {!isLoading && count !== 0 &&
            <MDBox mt={1} display="flex" justifyContent="space-between" alignItems='center' width='100%'>
              <MDButton variant='outlined' color='warning' disabled={(skip + limitSetting) / limitSetting === 1 ? true : false} size="small" onClick={backHandler}>Back</MDButton>
              <MDTypography color="light" fontSize={15} fontWeight='bold'>Total Mandir: {!count ? 0 : count} | Page {(skip + limitSetting) / limitSetting} of {!count ? 1 : Math.ceil(count / limitSetting)}</MDTypography>
              <MDButton variant='outlined' color='warning' disabled={Math.ceil(count / limitSetting) === (skip + limitSetting) / limitSetting ? true : !count ? true : false} size="small" onClick={nextHandler}>Next</MDButton>
            </MDBox>
          }
        </MDBox>
        :
        <Grid container spacing={1} xs={12} md={6} lg={12}>
          <Grid item mt={2} xs={6} md={3} lg={12} display="flex" justifyContent="center">
            <MDTypography color="light">No Mandir(s)</MDTypography>
          </Grid>
        </Grid>
      }

    </>
  )
}



export default ActiveMandir;