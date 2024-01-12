
import * as React from 'react';
import { useEffect, useState } from "react";
import axios from "axios";
import TextField from '@mui/material/TextField';
import Grid from "@mui/material/Grid";
import MDTypography from "../../components/MDTypography";
import MDBox from "../../components/MDBox";
import MDButton from "../../components/MDButton"
import { Card, CardActionArea, CardContent, OutlinedInput, Typography } from "@mui/material";
import MDSnackbar from "../../components/MDSnackbar";
import MenuItem from '@mui/material/MenuItem';
// import { styled } from '@mui/material';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import { useNavigate, useLocation } from "react-router-dom";
import { apiUrl } from '../../constants/constants';
import Purpose from "./data/geography/geography";
import AddOtherName from "./data/addOtherName/addOtherName";
import Associate from './data/addAssociate/addAssociate'

const ITEM_HEIGHT = 30;
const ITEM_PADDING_TOP = 10;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};


function Index() {
  const location = useLocation();
  const prevDevData = location?.state?.data;
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [editing, setEditing] = useState(false)
  const [prevData, setPrevData] = useState(prevDevData)
  const navigate = useNavigate();
  const [newData, setNewData] = useState(null);
  const [devta, setDevta] = useState([]);
  // const [cetegories, setPortfolios] = useState([]);

  const [formState, setFormState] = useState({
    name: '' || prevDevData?.name,
    gender: '' || prevDevData?.gender,
    description: '' || prevDevData?.description,
    image: {
      name: '' || prevDevData?.image.name,
      url: '' || prevDevData?.image.url
    },
    status: '' || prevDevData?.status,
  });

  const [file, setFile] = useState(null);
  const [filepreview, setFilePreview] = useState(null);

  useEffect(() => {
    axios.get(`${apiUrl}devta/active`, { withCredentials: true })
      .then((res) => {
        setDevta(res?.data?.data);
      }).catch((err) => {
        return new Error(err)
      })
  }, [])

  const handleImage = (event) => {
    const file = event.target.files[0];
    setFile(event.target.files);
    const reader = new FileReader();
    reader.onload = () => {
      setFilePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };


  const handleUpload = async () => {

    if (!file) {
      openSuccessSB('error', 'Please select a image to upload');
      return;
    }

    try {
     
      const formData = new FormData();
      if (file) {
        formData.append("devImage", file[0]);
      }

      for (let elem in formState) {
        if (elem !== "devImage") {
          if (typeof (formState[elem]) === "object") {
            if(elem === "category")
            formData.append(`${"category"}`, formState[elem].id);

          } else {
            formData.append(`${elem}`, formState[elem]);
          }
        }
      }

      const res = await fetch(`${apiUrl}devta`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Access-Control-Allow-Credentials": true
        },
        body: formData
      });

      let data = await res.json()
      setPrevData(data.data);
      if (data.status === 'success') {
        setFile(null)
        setNewData(data.data);
        setIsSubmitted(true);
        setFilePreview(null)
        setEditing(false);
        openSuccessSB('success', data.message);
      }
    } catch (error) {
      openSuccessSB('error', error?.err);
    }
  };

  const edit = async () => {
    try {
      // const { name, slogan, route, event, address, status } = formState;
      const formData = new FormData();
      if (file) {
        formData.append("devImage", file[0]);
      }


      for (let elem in formState) {
        if (elem !== "devImage") {
          if (typeof (formState[elem]) === "object") {
            if(elem === "category")
            formData.append(`${"category"}`, formState[elem].id);
          } else {
            formData.append(`${elem}`, formState[elem]);
          }
        }
      }

      const res = await fetch(`${apiUrl}devta/${prevData?._id}`, {

        method: "PATCH",
        credentials: "include",
        headers: {
          "Access-Control-Allow-Credentials": true
        },
        body: formData
      });

      let data = await res.json()

      if (data.status === 'success') {
        setFile(null)
        setNewData(data.data);
        setFilePreview(null)
        setEditing(false)
        openSuccessSB('success', data.message);
      }
    } catch (error) {
      openSuccessSB('error', error?.err);
    }
  };

  const [successSB, setSuccessSB] = useState(false);
  const [messageObj, setMessageObj] = useState({
    color: '',
    icon: '',
    title: '',
    content: ''
  })
  const openSuccessSB = (value, content) => {
    if (value === "success") {
      messageObj.color = 'success'
      messageObj.icon = 'check'
      messageObj.title = "Success";
      messageObj.content = content;
      setSuccessSB(true);
    };
    if (value === "error") {
      messageObj.color = 'error'
      messageObj.icon = 'error'
      messageObj.title = "Error";
      messageObj.content = content;
    };

    setMessageObj(messageObj);
    setSuccessSB(true);
  }
  const closeSuccessSB = () => setSuccessSB(false);
  const renderSuccessSB = (
    <MDSnackbar
      color={messageObj.color}
      icon={messageObj.icon}
      title={messageObj.title}
      content={messageObj.content}
      open={successSB}
      onClose={closeSuccessSB}
      close={closeSuccessSB}
      bgWhite={messageObj.color}
      sx={{ borderLeft: `10px solid ${messageObj.color === "success" ? "#4CAF50" : messageObj.color === "error" ? "#F44335" : "#1A73E8"}`, borderRight: `10px solid ${messageObj.color === "success" ? "#4CAF50" : messageObj.color === "error" ? "#F44335" : "#1A73E8"}`, borderRadius: "15px", width: "auto" }}
    />
  );


  return (
    <>
      <MDBox pl={2} pr={2} mt={4} mb={2}>
        <MDBox display="flex" justifyContent="center" alignItems="center">
          <MDTypography variant="caption" fontWeight="bold" color="text" textTransform="uppercase">
            Fill Dev Details
          </MDTypography>
        </MDBox>
        <Grid container xs={12} md={12} xl={12} display="flex" justifyContent="center" alignItems="center">

          <Grid item spacing={2} mt={2} xs={12} md={8} xl={12} display="flex" justifyContent='center' alignItems='center'>
            
            <Grid container spacing={2} xs={12} md={12} xl={12} display="flex" justifyContent='center' alignItems='center'>

              <Grid item xs={12} md={6} xl={3}>
                <TextField
                  disabled={((newData || prevData) && (!editing))}
                  id="outlined-required"
                  label='Devi/Devta Name *'
                  fullWidth
                  value={formState?.name}
                  onChange={(e) => {
                    setFormState(prevState => ({
                      ...prevState,
                      name: e.target.value
                    }))
                  }} />
              </Grid>

              <Grid item xs={12} md={6} xl={3}>
                <FormControl sx={{ width: "100%" }}>
                  <InputLabel id="demo-simple-select-autowidth-label">Live Status *</InputLabel>
                  <Select
                    labelId="demo-simple-select-autowidth-label"
                    id="demo-simple-select-autowidth"
                    name='Live Status'
                    value={formState?.status}
                    disabled={((newData || prevData) && (!editing))}
                    onChange={(e) => {
                      setFormState(prevState => ({
                        ...prevState,
                        status: e.target.value
                      }))
                    }}
                    label="Status"
                    sx={{ minHeight: 43 }}
                  >
                    <MenuItem value="Active">Active</MenuItem>
                    <MenuItem value="Inactive">Inactive</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={6} xl={3}>
                <FormControl sx={{ width: "100%" }}>
                  <InputLabel id="demo-simple-select-autowidth-label">Gender *</InputLabel>
                  <Select
                    labelId="demo-simple-select-autowidth-label"
                    id="demo-simple-select-autowidth"
                    name='Live Status'
                    value={formState?.gender}
                    disabled={((newData || prevData) && (!editing))}
                    onChange={(e) => {
                      setFormState(prevState => ({
                        ...prevState,
                        gender: e.target.value
                      }))
                    }}
                    label="Gender"
                    sx={{ minHeight: 43 }}
                  >
                    <MenuItem value="Male">Male</MenuItem>
                    <MenuItem value="Female">Female</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={6} xl={3}>
                <MDButton variant="outlined" style={{ fontSize: 10 }} fullWidth color={(newData?.images?.length && !file) ? "warning" : ((newData?.images?.length && file) || file) ? "error" : "success"} component="label">
                  Upload Image
                  <input
                    hidden
                    disabled={((newData || prevData) && (!editing))}
                    accept="image/*"
                    type="file"
                    // multiple
                    onChange={handleImage}
                  />
                </MDButton>
              </Grid>

              <Grid item xs={12} md={6} xl={12}>
                <TextField
                  disabled={((newData || prevData) && (!editing))}
                  id="outlined-required"
                  label='About the Devi/Devta *'
                  fullWidth
                  multiline
                  rows={4}
                  type='text'
                  value={formState?.description}
                  onChange={(e) => {
                    setFormState(prevState => ({
                      ...prevState,
                      description: e.target.value
                    }))
                  }}
                />
              </Grid>

            </Grid>

            <Grid container spacing={2} xs={12} md={12} xl={4} display="flex" justifyContent='center' alignItems='center'>
            {filepreview ?

              <Grid item xs={12} md={12} xl={12} display='flex' justifyContent='center' alignItems='center'>
                <Grid container xs={12} md={12} xl={12} display='flex' justifyContent='center'>
                  <Grid item xs={12} md={12} xl={12} display='flex' justifyContent='center'>
                    <Card sx={{ width: "150px", height: "150px", maxWidth: "150px", maxHeight: "150px", cursor: 'pointer' }}>
                      <CardActionArea>
                        <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='center' >
                          <CardContent display='flex' justifyContent='center' alignContent='center' alignItems='center' >
                            {!filepreview && 
                              <MDBox display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{ width: '150px', height: '150px', borderBottomLeftRadius: 10, borderBottomRightRadius: 10 }}>
                                <Typography variant="caption" fontFamily='Segoe UI' fontWeight={600} style={{ textAlign: 'center' }}>
                                Image
                                </Typography>
                              </MDBox>}
                            <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='center' >
                              <img src={filepreview} style={{ width: "100px", height: "100px", borderBottomLeftRadius: 10, borderBottomRightRadius: 10 }} />
                            </Grid>
                          </CardContent>
                        </Grid>
                      </CardActionArea>
                    </Card>
                  </Grid>
                </Grid>
              </Grid>
              :
              <>
                {(newData || prevDevData) ?
                  <Grid item xs={12} md={12} xl={12} display='flex' justifyContent='center' alignItems='center'>
                    <Grid container xs={12} md={12} xl={12} display='flex' justifyContent='center' alignItems='center'>
                      <Grid item xs={12} md={12} xl={12} display='flex' justifyContent='center' alignItems='center'>
                        <Card sx={{ width: "150px", height: "150px", maxWidth: "150px", maxHeight: "150px", cursor: 'pointer' }}>
                          <CardActionArea>
                            <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='center'>
                              <CardContent display='flex' justifyContent='center' alignContent='center' alignItems='center'>
                                {(!newData && !prevDevData) && <MDBox display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{ width: '150px', height: '150px' }}>
                                  <Typography variant="caption" fontFamily='Segoe UI' fontWeight={600} style={{ textAlign: 'center' }}>
                                    Image
                                  </Typography>
                                </MDBox>}
                                <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='center'>
                                  <img src={newData?.image?.url || prevDevData?.image?.url} style={{ width: "150px", height: "150px", borderBottomLeftRadius: 10, borderBottomRightRadius: 10 }} />
                                </Grid>
                              </CardContent>
                            </Grid>
                          </CardActionArea>
                        </Card>
                      </Grid>
                    </Grid>
                  </Grid>
                  :
                  <Grid item xs={12} md={12} xl={12} display='flex' justifyContent='center' alignItems='center'>
                    <Grid container xs={12} md={12} xl={12} display='flex' justifyContent='center' alignItems='center'>
                      <Grid item xs={12} md={12} xl={12} display='flex' justifyContent='center' alignItems='center'>
                        <Card sx={{ width: "150px", height: "150px", maxWidth: "150px", maxHeight: "150px", cursor: 'pointer' }}>
                          <CardActionArea>
                            <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='center'>
                              <CardContent display='flex' justifyContent='center' alignContent='center' alignItems='center'>
                                <MDBox display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{ width: '150px', height: '150px' }}>
                                  <Typography variant="caption" fontFamily='Segoe UI' fontWeight={600} style={{ textAlign: 'center', alignContent:'center' }}>
                                    Image will show up here!
                                  </Typography>
                                </MDBox>
                              </CardContent>
                            </Grid>
                          </CardActionArea>
                        </Card>
                      </Grid>
                    </Grid>
                  </Grid>
                }
              </>
            }
            </Grid>

          </Grid>

        </Grid>


        <Grid container mt={2} xs={12} md={12} xl={12} >
          <Grid item display="flex" justifyContent="flex-end" xs={12} md={12} xl={12}>
            <MDButton
              variant="contained"
              color={(prevData && !editing) ? "warning" : (prevData && editing) ? "warning" : "success"}
              size="small"
              sx={{ mr: 1, ml: 1 }}
              // disabled={isfileSizeExceed}
              onClick={(prevData && !editing) ? () => { setEditing(true) } : (prevData && editing) ? edit : handleUpload}
            >
              {(prevData && !editing) ? "Edit" : (prevData && editing) ? "Save" : "Next"}
            </MDButton>
            {(isSubmitted || prevData) && !editing && <MDButton
              variant="contained"
              color="info"
              size="small"
              sx={{ mr: 1, ml: 1 }}
              onClick={() => { navigate('/devidevta') }}
            >
              Back
            </MDButton>}
            {(isSubmitted || prevData) && editing && <MDButton
              variant="contained"
              color="info"
              size="small"
              sx={{ mr: 1, ml: 1 }}
              // onClick={()=>{navigate('/allblogs')}}
              onClick={() => { setEditing(false) }}
            >
              Cancel
            </MDButton>}
            {!prevData && editing && <MDButton
              variant="contained"
              color="info"
              size="small"
              sx={{ mr: 1, ml: 1 }}
              onClick={() => { navigate('/devidevta') }}
            >
              Cancel
            </MDButton>}
          </Grid>
        </Grid>

        {(prevData || isSubmitted) && <Grid item xs={12} md={12} xl={12} mt={2}>
          <MDBox>
            <AddOtherName prevData={prevData != undefined ? prevData : newData} deviDev={devta} />
          </MDBox>
        </Grid>}

        {(prevData || isSubmitted) && <Grid item xs={12} md={12} xl={12} mt={2}>
          <MDBox>
            <Associate prevData={prevData != undefined ? prevData : newData} deviDev={devta} />
          </MDBox>
        </Grid>}

        {(prevData || isSubmitted) && <Grid item xs={12} md={12} xl={12} mt={2}>
          <MDBox>
            <Purpose prevData={prevData != undefined ? prevData : newData} />
          </MDBox>
        </Grid>}
        
        {renderSuccessSB}
      </MDBox>
    </>
  )
}
export default Index;
