
import * as React from 'react';
import { useEffect, useState } from "react";
import axios from "axios";
import TextField from '@mui/material/TextField';
import {Grid, Divider} from "@mui/material";
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
import Purpose from "./data/purposeOfPooja/purpose";
import AddTier from "./data/addTier/addTier";
import Benefit from "./data/benefitOfPooja/benefit";
import Description from "./data/poojaDescription/description";
import Item from "./data/poojaItem/item";
import Faq from "./data/faq/faq";
import Include from "./data/poojaIncludes/includes";
import DeleteIcon from '@mui/icons-material/Delete';
import dayjs from 'dayjs';

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

const TimeInput = React.forwardRef(({ value, onClick }, ref) => (
  <input
    readOnly
    value={value ? dayjs(value).format('HH:mm') : ''}
    onClick={onClick}
    ref={ref}
    style={{ width: '100%' }}
  />
));


function Index() {
  const location = useLocation();
  const prevPoojaData = location?.state?.data;
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [editing, setEditing] = useState(false)
  const [prevData, setPrevData] = useState(prevPoojaData)
  const navigate = useNavigate();
  const [newData, setNewData] = useState(prevPoojaData);
  const [tier, setTier] = useState([]);
  const [cetegories, setCategories] = useState([]);
  const [imagesPreviewUrl, setImagesPreviewUrl] = useState(null);

  const [formState, setFormState] = useState({
    name: '' || prevPoojaData?.name,
    description: '' || prevPoojaData?.description,
    image: '' || prevPoojaData?.image.url,
    duration: '' || prevPoojaData?.duration,
    packages: '' || prevPoojaData?.packages,
    type: '' || prevPoojaData?.type,
    status: '' || prevPoojaData?.status,
    sub_category: '' || prevPoojaData?.sub_category,
    category: {
      id: "" || prevPoojaData?.category?._id,
      name: "" || prevPoojaData?.category?.product_name
    },
  });

  const [file, setFile] = useState(null);
  const [filepreview, setFilePreview] = useState(null);
  const [isfileSizeExceed, setIsFileExceed] = useState(false);

  useEffect(()=>{
    setIsFileExceed(false)
    if(file){
      for(let elem of file){
        if(elem?.size > 5*1024*1024){
          setIsFileExceed(true);
          openSuccessSB('error', 'Image size should be less then 5 MB.');

        }
      }
    }
  },[file])

  useEffect(() => {
    axios.get(`${apiUrl}tier/active`, { withCredentials: true })
      .then((res) => {
        setTier(res?.data?.data);
      }).catch((err) => {
        return new Error(err)
      })

      axios.get(`${apiUrl}product`, {withCredentials: true})
      .then((res) => {
        // console.log("TestZone Portfolios :", res?.data?.data)
        setCategories(res?.data?.data);
      }).catch((err) => {
        return new Error(err)
      })
  }, [])

  const handleImage = (event) => {
    setFile(event.target.files);
    let previewUrls = [];
    const files = event.target.files;
    for (const file of files) {
      const reader = new FileReader();
      reader.onload = () => {
        // Add the preview URL to the array
        previewUrls.push(reader.result);
  
        // If all files have been processed, update the state with the array of preview URLs
        if (previewUrls.length === files.length) {
          setImagesPreviewUrl(previewUrls);
          // console.log("Title Preview URLs:", previewUrls);
        }
      };
      reader.readAsDataURL(file);
    }
  };


  const handleUpload = async () => {

    if (!file) {
      openSuccessSB('error', 'Please select a image to upload');
      return;
    }

    try {
      // const {name, slogan, route, event, address, status} = formState;
      const formData = new FormData();
      if(file){
        for (let i = 0; i < file.length; i++) {
          formData.append("files", file[i]);
        }
      }

      for (let elem in formState) {
        if (elem !== "poojaImage") {
          if (typeof (formState[elem]) === "object") {
            if(elem === "category")
            formData.append(`${"category"}`, formState[elem].id);

          } else {
            formData.append(`${elem}`, formState[elem]);
          }
        }
      }

      const res = await fetch(`${apiUrl}pooja`, {
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
        formData.append("poojaImage", file[0]);
      }


      for (let elem in formState) {
        if (elem !== "poojaImage") {
          if (typeof (formState[elem]) === "object") {
            if(elem === "category")
            formData.append(`${"category"}`, formState[elem].id);
            // for (let subelem in formState[elem]) {
            //   formData.append(`${subelem}`, formState[elem][subelem]);
            // }
            // Append the Blob to formData

          } else {
            formData.append(`${elem}`, formState[elem]);
          }
        }
      }

      const res = await fetch(`${apiUrl}pooja/${prevData?._id}`, {

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

  const removeImage = async (id, docId) => {
    try {
      const res = await fetch(`${apiUrl}blogs/removeImage/${id}/${docId}`, {

        method: "PATCH",
        credentials: "include",
        headers: {
          "Access-Control-Allow-Credentials": true
        },
        
      });

      let data = await res.json()
  
      if(data.status==='success'){
        setNewData(data.data);
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

  const handleCetegoryChange = (event) => {
    const {
      target: { value },
    } = event;
    let data = cetegories?.filter((elem) => {
      return elem.product_name === value;
    })
    setFormState(prevState => ({
      ...prevState,
      category: {
        ...prevState.category,
        id: data[0]?._id,
        name: data[0]?.product_name
      }
    }));
  };

  return (
    <>
      <MDBox pl={2} pr={2} mt={4} mb={2}>
        <MDBox display="flex" justifyContent="space-between" alignItems="center">
          <MDTypography variant="caption" fontWeight="bold" color="text" textTransform="uppercase">
            Fill Mandir Details
          </MDTypography>
        </MDBox>
        <Grid container display="flex" flexDirection="row" justifyContent="space-between">

          <Grid container mb={2} xs={12} md={12} xl={8} mt={1} display="flex" justifyContent='flex-start' alignItems='center' style={{ width: "300px", height: "180px" }}>
            <Grid container spacing={2} mt={0.5} mb={0} xs={12} md={9} xl={12}>
              <Grid item xs={12} md={12} xl={6}>
                <TextField
                  disabled={((newData || prevData) && (!editing))}
                  id="outlined-required"
                  label='Name *'
                  fullWidth
                  value={formState?.name}
                  onChange={(e) => {
                    setFormState(prevState => ({
                      ...prevState,
                      name: e.target.value
                    }))
                  }} />
              </Grid>

              <Grid item xs={12} md={8} xl={6}>
                <TextField
                  disabled={((newData || prevData) && (!editing))}
                  id="outlined-required"
                  label='Description *'
                  fullWidth
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

              {/* <Grid item xs={12} md={6} xl={3} mt={-1} mb={1}>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DemoContainer components={['MobileDateTimePicker']}>
                      <DemoItem>
                        <MobileDateTimePicker
                          label="Morning Open Time"
                          disabled={((isSubmitted || prevData) && (!editing))}
                          value={formState?.contestLiveTime || dayjs(dailyContest?.contestLiveTime)}
                          onChange={(newValue) => {
                            if (newValue && newValue.isValid()) {
                              setFormState(prevState => ({ ...prevState, contestLiveTime: newValue }))
                            }
                          }}
                          minDateTime={null}
                          renderInput={(props) => <TimeInput {...props} />}
                          sx={{ width: '100%' }}
                        />
                      </DemoItem>
                    </DemoContainer>
                  </LocalizationProvider>
                </Grid> */}
            </Grid>

            <Grid container spacing={2} mt={0.5} mb={0} xs={12} md={9} xl={12}>
              <Grid item xs={12} md={4} xl={6}>
                <FormControl sx={{ width: "100%" }}>
                  <InputLabel id="demo-simple-select-autowidth-label">Type *</InputLabel>
                  <Select
                    labelId="demo-simple-select-autowidth-label"
                    id="demo-simple-select-autowidth"
                    name='type'
                    value={formState?.type}
                    disabled={((newData || prevData) && (!editing))}
                    onChange={(e) => {
                      setFormState(prevState => ({
                        ...prevState,
                        type: e.target.value
                      }))
                    }}
                    label="Type"
                    sx={{ minHeight: 43 }}
                  >
                    <MenuItem value="Home">Home</MenuItem>
                    <MenuItem value="Online">Online</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={4} xl={6}>
                <FormControl sx={{ width: "100%" }}>
                  <InputLabel id="demo-simple-select-autowidth-label">Status *</InputLabel>
                  <Select
                    labelId="demo-simple-select-autowidth-label"
                    id="demo-simple-select-autowidth"
                    name='status'
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
                    <MenuItem value="Published">Published</MenuItem>
                    <MenuItem value="Unpublished">Unpublished</MenuItem>
                    <MenuItem value="Draft">Draft</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>

            <Grid container spacing={2} mt={0.5} mb={0} xs={12} md={9} xl={12}>

              <Grid item xs={12} md={4} xl={6}>
                <FormControl sx={{ width: "100%" }}>
                  <InputLabel id="demo-simple-select-autowidth-label">Sub Cetegory *</InputLabel>
                  <Select
                    labelId="demo-simple-select-autowidth-label"
                    id="demo-simple-select-autowidth"
                    name='sub_category'
                    value={formState?.sub_category}
                    disabled={((newData || prevData) && (!editing))}
                    onChange={(e) => {
                      setFormState(prevState => ({
                        ...prevState,
                        sub_category: e.target.value
                      }))
                    }}
                    label="Sub Cetegory"
                    sx={{ minHeight: 43 }}
                  >
                    <MenuItem value="General Pooja">General Pooja</MenuItem>
                    <MenuItem value="Jaap">Jaap</MenuItem>
                    <MenuItem value="Paath">Paath</MenuItem>
                    <MenuItem value="Havan">Havan</MenuItem>
                    <MenuItem value="Kundli Dosh Pooja">Kundli Dosh Pooja</MenuItem>
                    <MenuItem value="Festival Pooja">Festival Pooja</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={6} xl={6}>
                <FormControl sx={{ width: '100%' }}>
                  <InputLabel id="demo-multiple-name-label">Cetegory</InputLabel>
                  <Select
                    labelId="demo-multiple-name-label"
                    id="demo-multiple-name"
                    name='category'
                    disabled={((isSubmitted || prevPoojaData) && (!editing))}
                    value={formState?.category?.name || prevPoojaData?.category?.product_name || prevPoojaData?.category?.product_name}
                    onChange={handleCetegoryChange}
                    input={<OutlinedInput label="Portfolio" />}
                    sx={{ minHeight: 45 }}
                    MenuProps={MenuProps}
                  >
                    {cetegories?.map((category) => (
                      <MenuItem
                        key={category?.product_name}
                        value={category?.product_name}
                      >
                        {category.product_name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>

            <Grid container spacing={2} mt={8} mb={0} xs={12} md={9} xl={12}>
              <Grid item xs={12} md={6} xl={12}>
                <MDButton variant="outlined" style={{ fontSize: 10 }} fullWidth color={(newData?.images?.length && !file) ? "warning" : ((newData?.images?.length && file) || file) ? "error" : "success"} component="label">
                  Upload Mandir's Image
                  <input
                    hidden
                    disabled={((newData || prevData) && (!editing))}
                    accept="image/*"
                    type="file"
                    multiple
                    onChange={handleImage}
                  />
                </MDButton>
              </Grid>
            </Grid>

          </Grid>

          <Grid container mb={2} spacing={2} xs={12} md={12} xl={12} mt={1} display="flex" justifyContent='flex-start' alignItems='center' style={{ maxWidth: '100%', height: 'auto' }}>
          {newData?.images?.map((elem) => {
            return (
              <>
                <Grid item xs={12} md={12} xl={2} style={{ maxWidth: '100%', height: 'auto' }}>
                  <Grid container xs={12} md={12} xl={12} style={{ maxWidth: '100%', height: 'auto' }}>
                    <Grid item xs={12} md={12} xl={12} style={{ maxWidth: '100%', height: 'auto' }}>
                      <Card sx={{ minWidth: '100%', cursor: 'pointer' }} >
                        <CardActionArea>
                          <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{ maxWidth: '100%', height: 'auto' }}>
                            <img src={elem?.url} style={{ maxWidth: '100%', height: 'auto', borderTopLeftRadius: 10, borderTopRightRadius: 10 }} />
                          </Grid>
                          <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{ maxWidth: '100%', height: 'auto' }}>

                            <CardContent
                            //  display='flex' justifyContent='space-between' alignContent='center' style={{maxWidth: '100%',height: 'auto'}}
                            >
                              <MDBox
                                mb={-2}
                                display='flex' flexDirection='column' justifyContent='space-between' alignContent='center' style={{ width: '100%', height: 'auto' }}
                              >
                                <Typography
                                  mb={-1.5} variant="caption" fontFamily='Segoe UI' fontWeight={400} style={{ textAlign: 'center' }}
                                >
                                  Click to copy URL
                                </Typography>
                                <Divider />
                                <Typography
                                  mt={-1.5} variant="caption" fontFamily='Segoe UI' fontWeight={400} style={{ textAlign: 'center', display: "flex", justifyContent: "center", alignItems: 'center', alignContent: 'center' }}
                                  onClick={() => { removeImage(newData?._id, elem?._id) }}
                                >
                                  Delete <DeleteIcon />
                                </Typography>
                              </MDBox>
                            </CardContent>
                          </Grid>
                        </CardActionArea>
                      </Card>
                    </Grid>
                  </Grid>
                </Grid>
              </>
            )
          })}
          {imagesPreviewUrl?.map((elem) => {
            return (
              <>
                <Grid item xs={12} md={12} xl={2} style={{ maxWidth: '100%', height: 'auto' }}>
                  <Grid container xs={12} md={12} xl={12} style={{ maxWidth: '100%', height: 'auto' }}>
                    <Grid item xs={12} md={12} xl={12} style={{ maxWidth: '100%', height: 'auto' }}>
                      <Card sx={{ minWidth: '100%', cursor: 'pointer' }} >
                        <CardActionArea>
                          <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{ maxWidth: '100%', height: 'auto' }}>
                            <img src={elem} style={{ maxWidth: '100%', height: 'auto', borderTopLeftRadius: 10, borderTopRightRadius: 10 }} />
                          </Grid>
                          <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='space-between' alignContent='center' style={{ maxWidth: '100%', height: 'auto' }}>
                            <CardContent
                            //  display='flex' justifyContent='space-between' alignContent='center' style={{maxWidth: '100%',height: 'auto'}}
                            >
                              <MDBox
                                mb={-2}
                                display='flex' flexDirection='column' justifyContent='space-between' alignContent='center' style={{ width: '100%', height: 'auto' }}
                              >
                                <Typography
                                  mb={-1.5} variant="caption" fontFamily='Segoe UI' fontWeight={400} style={{ textAlign: 'center' }}
                                >
                                  Click to copy URL
                                </Typography>
                                <Divider />
                                <Typography
                                  mt={-1.5} variant="caption" fontFamily='Segoe UI' fontWeight={400} style={{ textAlign: 'center', display: "flex", justifyContent: "center", alignItems: 'center', alignContent: 'center' }}
                                  onClick={() => { setImagesPreviewUrl(imagesPreviewUrl.filter(item => item !== elem)) }}
                                >
                                  Delete <DeleteIcon />
                                </Typography>
                              </MDBox>
                            </CardContent>
                          </Grid>

                        </CardActionArea>
                      </Card>
                    </Grid>
                  </Grid>
                </Grid>
              </>
            )
          })}
        </Grid> 

        </Grid>

        <Grid item xs={12} md={12} xl={12} mt={2}>
          <TextField
            disabled={((newData || prevData) && (!editing))}
            id="outlined-required"
            label='Description *'
            fullWidth
            multiline
            value={formState?.description}
            onChange={(e) => {
              setFormState(prevState => ({
                ...prevState,
                description: e.target.value
              }))
            }}
          />
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
              onClick={() => { navigate('/pooja') }}
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
              onClick={() => { navigate('/pooja') }}
            >
              Cancel
            </MDButton>}
          </Grid>
        </Grid>

        {(prevData || isSubmitted) && <Grid item xs={12} md={12} xl={12} mt={2}>
          <MDBox>
            <AddTier prevData={prevData != undefined ? prevData : newData} tier={tier} />
          </MDBox>
        </Grid>}

        {(prevData || isSubmitted) && <Grid item xs={12} md={12} xl={12} mt={2}>
          <MDBox>
            <Purpose prevData={prevData != undefined ? prevData : newData} />
          </MDBox>
        </Grid>}
        
        {(prevData || isSubmitted) && <Grid item xs={12} md={12} xl={12} mt={2}>
          <MDBox>
            <Benefit prevData={prevData != undefined ? prevData : newData} />
          </MDBox>
        </Grid>}

        {(prevData || isSubmitted) && <Grid item xs={12} md={12} xl={12} mt={2}>
          <MDBox>
            <Include prevData={prevData != undefined ? prevData : newData} />
          </MDBox>
        </Grid>}

        {(prevData || isSubmitted) && <Grid item xs={12} md={12} xl={12} mt={2}>
          <MDBox>
            <Item prevData={prevData != undefined ? prevData : newData} />
          </MDBox>
        </Grid>}

        {(prevData || isSubmitted) && <Grid item xs={12} md={12} xl={12} mt={2}>
          <MDBox>
            <Faq prevData={prevData != undefined ? prevData : newData} faq={tier} />
          </MDBox>
        </Grid>}


        {renderSuccessSB}
      </MDBox>
    </>
  )
}
export default Index;
