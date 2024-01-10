
import * as React from 'react';
import { useEffect, useState } from "react";
import axios from "axios";
import TextField from '@mui/material/TextField';
import Grid from "@mui/material/Grid";
import MDTypography from "../../components/MDTypography";
import MDBox from "../../components/MDBox";
import MDButton from "../../components/MDButton"
import { Card, CardActionArea, CardContent, Checkbox, CircularProgress, FormControlLabel, FormGroup, Typography, formLabelClasses } from "@mui/material";
import MDSnackbar from "../../components/MDSnackbar";
import MenuItem from '@mui/material/MenuItem';
import { styled } from '@mui/material';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import { useNavigate, useLocation } from "react-router-dom";
// import RegisteredUsers from "./data/registeredUsers";
import { IoMdAddCircle } from 'react-icons/io';
import OutlinedInput from '@mui/material/OutlinedInput';
import dayjs from 'dayjs';
import Autocomplete from '@mui/material/Autocomplete';
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { MobileDateTimePicker } from '@mui/x-date-pickers/MobileDateTimePicker';
import DefaultCarouselImage from '../../assets/images/defaultcarousel.png'
import { apiUrl } from '../../constants/constants';
import moment from 'moment';
import Purpose from "./data/purposeOfPooja/purpose";

const CustomAutocomplete = styled(Autocomplete)`
  .MuiAutocomplete-clearIndicator {
    color: white;
  }
`;

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
  const prevPoojaData = location?.state?.data;
  const [isSubmitted, setIsSubmitted] = useState(false);
  // let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5000/"
  // const [isLoading, setIsLoading] = useState(prevPoojaData ? true : false)
  const [editing, setEditing] = useState(false)
  // const [saving, setSaving] = useState(false)
  const [prevData, setPrevData] = useState(prevPoojaData)
  const navigate = useNavigate();
  // const [newObjectId, setNewObjectId] = useState("");
  // const [updatedDocument, setUpdatedDocument] = useState([]);
  // const [collegeData, setCollegeData] = useState([]);
  // const [notification, setNotification] = useState([]);
  const [newData, setNewData] = useState(null);
  // const [previewUrl, setPreviewUrl] = useState([]);
  // const [previousNotifications, setPreviousNotifications] = useState([]);
  // const [isSending, setIsSending] = useState(false);
  // const [featuredRegistrations, setFeaturedRegistrations] = useState([]);
  // // const [careers,setCareers] = useState([]);
  const [tier, setTier] = useState([]);
  // let Url = process.env.NODE_ENV === "production" ? "/" : "http://localhost:3000/"
  // const [type, setType] = useState(prevPoojaData?.notificationGroup?.notificationGroupName.includes('Workshop')?'Workshop':'Job');

  const [formState, setFormState] = useState({
    pooja_name: '' || prevPoojaData?.pooja_name,
    pooja_includes: '' || prevPoojaData?.pooja_includes,
    pooja_image: '' || prevPoojaData?.pooja_image.url,
    pooja_duration: '' || prevPoojaData?.pooja_duration,
    pooja_packages: '' || prevPoojaData?.pooja_packages,
    pooja_type: '' || prevPoojaData?.pooja_type,
    status: '' || prevPoojaData?.status,
  });


  // const [isfileSizeExceed, setIsFileExceed] = useState(false);
  // const editor = useRef(null);
  const [file, setFile] = useState(null);
  const [filepreview, setFilePreview] = useState(null);

  useEffect(() => {
    axios.get(`${apiUrl}tier/active`, {withCredentials: true})
      .then((res) => {
        // console.log("TestZone Portfolios :", res?.data?.data)
        setTier(res?.data?.data);
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

  const handleTierChange = (event) => {
    const {
      target: { value },
    } = event;
    let tierId = tier?.filter((elem) => {
      return elem.tier_name === value;
    })
    setFormState(prevState => ({
      ...prevState,
      pooja_packages: {
        ...prevState.pooja_packages,
        _id: tierId[0]?._id,
        tier_name: tierId[0]?.tier_name
      }
    }));
    // console.log("portfolioId", portfolioId, formState)
  };

  const handleUpload = async () => {

    if (!file) {
      openSuccessSB('error', 'Please select a image to upload');
      return;
    }

    try {
      // const {name, slogan, route, event, address, status} = formState;
      const formData = new FormData();
      if (file) {
        formData.append("poojaImage", file[0]);
      }

      for (let elem in formState) {
        if (elem !== "poojaImage"){
          if(typeof(formState[elem]) === "object"){

            for(let subelem in formState[elem]){
              formData.append(`${subelem}`, formState[elem][subelem]);
            }
            // Append the Blob to formData
            
          } else{
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
        if (elem !== "poojaImage"){
          if(typeof(formState[elem]) === "object"){

            for(let subelem in formState[elem]){
              formData.append(`${subelem}`, formState[elem][subelem]);
            }
            // Append the Blob to formData
            
          } else{
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
        <MDBox display="flex" justifyContent="space-between" alignItems="center">
          <MDTypography variant="caption" fontWeight="bold" color="text" textTransform="uppercase">
            Fill Pooja Details
          </MDTypography>
        </MDBox>
        <Grid container display="flex" flexDirection="row" justifyContent="space-between">

          <Grid container mb={2} xs={12} md={12} xl={8} mt={1} display="flex" justifyContent='flex-start' alignItems='center' style={{ width: "300px", height: "180px" }}>
            <Grid container spacing={2} mt={0.5} mb={0} xs={12} md={9} xl={12}>

              <Grid item xs={12} md={12} xl={6}>
                <TextField
                  disabled={((newData || prevData) && (!editing))}
                  id="outlined-required"
                  label='Pooja Name *'
                  fullWidth
                  value={formState?.pooja_name}
                  onChange={(e) => {
                    setFormState(prevState => ({
                      ...prevState,
                      pooja_name: e.target.value
                    }))
                  }} />
              </Grid>

              <Grid item xs={12} md={12} xl={6}>
                <TextField
                  disabled={((newData || prevData) && (!editing))}
                  id="outlined-required"
                  label='Pooja Include *'
                  fullWidth
                  value={formState?.pooja_includes}
                  onChange={(e) => {
                    setFormState(prevState => ({
                      ...prevState,
                      pooja_includes: e.target.value
                    }))
                  }}
                />
              </Grid>
            </Grid>

            <Grid container spacing={2} mt={0.5} mb={0} xs={12} md={9} xl={12}>

              <Grid item xs={12} md={8} xl={6}>
                <TextField
                  disabled={((newData || prevData) && (!editing))}
                  id="outlined-required"
                  label='Pooja Duration (Minutes) *'
                  fullWidth
                  type='number'
                  value={formState?.pooja_duration}
                  onChange={(e) => {
                    setFormState(prevState => ({
                      ...prevState,
                      pooja_duration: e.target.value
                    }))
                  }}
                />
              </Grid>

              <Grid item xs={12} md={4} xl={6}>
                <FormControl sx={{ width: "100%" }}>
                  <InputLabel id="demo-simple-select-autowidth-label">Status *</InputLabel>
                  <Select
                    labelId="demo-simple-select-autowidth-label"
                    id="demo-simple-select-autowidth"
                    name='pooja_type'
                    value={formState?.pooja_type}
                    disabled={((newData || prevData) && (!editing))}
                    onChange={(e) => {
                      setFormState(prevState => ({
                        ...prevState,
                        pooja_type: e.target.value
                      }))
                    }}
                    label="Status"
                    sx={{ minHeight: 43 }}
                  >
                    <MenuItem value="Home">Home</MenuItem>
                    <MenuItem value="Online">Online</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>

            <Grid container spacing={2} mt={0.5} mb={0} xs={12} md={9} xl={12}>

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

              <Grid item xs={12} md={6} xl={6}>
                <MDButton variant="outlined" style={{ fontSize: 10 }} fullWidth color={(newData?.images?.length && !file) ? "warning" : ((newData?.images?.length && file) || file) ? "error" : "success"} component="label">
                  Upload Logo
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
            </Grid>

            <Grid container spacing={2} mt={0.5} mb={0} xs={12} md={9} xl={12}>

              <Grid item xs={12} md={6} xl={6}>
                <FormControl sx={{ width: '100%' }}>
                  <InputLabel id="demo-multiple-name-label">Tier</InputLabel>
                  <Select
                    labelId="demo-multiple-name-label"
                    id="demo-multiple-name"
                    name='portfolio'
                    disabled={((isSubmitted || prevPoojaData) && (!editing))}
                    value={formState?.pooja_packages?.tier_name || prevPoojaData?.pooja_packages?.tier_name}
                    onChange={handleTierChange}
                    input={<OutlinedInput label="Portfolio" />}
                    sx={{ minHeight: 45 }}
                    MenuProps={MenuProps}
                  >
                    {tier?.map((elem) => (
                      <MenuItem
                        key={elem?.tier_name}
                        value={elem?.tier_name}
                      >
                        {elem.tier_name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={8} xl={6}>
                <TextField
                  disabled={((newData || prevData) && (!editing))}
                  id="outlined-required"
                  label='Pooja Price *'
                  type='number'
                  fullWidth
                  value={formState?.pooja_packages?.price}
                  onChange={(e) => {
                    setFormState(prevState => ({
                      ...prevState,
                      pooja_packages: {
                        ...prevState.pooja_packages,
                        price: e.target.value
                      }
                    }))
                  }}
                />
              </Grid>
            </Grid>
          </Grid>

         

          <Grid container mb={2} spacing={2} xs={12} md={12} xl={4} mt={1} display="flex" justifyContent='flex-start' alignItems='center' style={{ width: "300px", height: "180px" }}>
            {filepreview ?

              <Grid item xs={12} md={12} xl={3} >
                <Grid container xs={12} md={12} xl={12} >
                  <Grid item xs={12} md={12} xl={12} >
                    <Card sx={{ width: "300px", height: "180px", maxWidth: "300px", maxHeight: "180px", cursor: 'pointer' }}>
                      <CardActionArea>
                        <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='center' >
                          <CardContent display='flex' justifyContent='center' alignContent='center' alignItems='center' >
                            <MDBox mb={-2} display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{ width: '100%', height: 'auto' }}>
                              <Typography variant="caption" fontFamily='Segoe UI' fontWeight={600} style={{ textAlign: 'center' }}>
                                Image
                              </Typography>
                            </MDBox>
                            <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='center' >
                          <img src={filepreview} style={{ width: "180px", height: "180px", borderBottomLeftRadius: 10, borderBottomRightRadius: 10 }} />
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
                {(newData || prevPoojaData) ?
                  <Grid item xs={12} md={12} xl={3} style={{}}>
                    <Grid container xs={12} md={12} xl={12} >
                      <Grid item xs={12} md={12} xl={12} >
                        <Card sx={{ width: "300px", height: "180px", maxWidth: "300px", maxHeight: "180px", cursor: 'pointer' }}>
                          <CardActionArea>
                            <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{}}>
                              <CardContent display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{}}>
                                <MDBox mb={-2} display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{ width: '100%', height: 'auto' }}>
                                  <Typography variant="caption" fontFamily='Segoe UI' fontWeight={600} style={{ textAlign: 'center' }}>
                                    Image
                                  </Typography>
                                </MDBox>
                                <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{}}>
                                  <img src={newData?.pooja_image?.url || prevPoojaData?.pooja_image?.url} style={{ width: "180px", height: "180px", borderBottomLeftRadius: 10, borderBottomRightRadius: 10 }} />
                                </Grid>
                              </CardContent>
                            </Grid>
                          </CardActionArea>
                        </Card>
                      </Grid>
                    </Grid>
                  </Grid>
                  :
                  <Grid item xs={12} md={12} xl={3} style={{}}>
                    <Grid container xs={12} md={12} xl={12} >
                      <Grid item xs={12} md={12} xl={12} >
                        <Card sx={{ width: "300px", height: "180px", cursor: 'pointer' }}>
                          <CardActionArea>
                            <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{}}>
                              <CardContent display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{}}>
                                <MDBox mb={-2} mt={9} display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{ width: '100%', height: 'auto' }}>
                                  <Typography variant="caption" fontFamily='Segoe UI' fontWeight={600} style={{ textAlign: 'center' }}>
                                    Image will show up here!
                                  </Typography>
                                </MDBox>
                                {/* <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{}}>
                              <img src={newData?.logo?.url || prevPoojaData?.logo?.url} style={{ width: "300px", height: "180px", borderBottomLeftRadius: 10, borderBottomRightRadius: 10 }} />
                            </Grid> */}
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
                <Purpose prevData={prevData!=undefined ? prevData : newData}/>
                </MDBox>
              </Grid>}


        {renderSuccessSB}
      </MDBox>
    </>
  )
}
export default Index;