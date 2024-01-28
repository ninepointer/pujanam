import React ,{useEffect, useState, useRef} from "react";
import MDTypography from "../../components/MDTypography";
import MDBox from "../../components/MDBox";
import { Box } from "@mui/material";
import MDButton from "../../components/MDButton"
import Autocomplete from '@mui/material/Autocomplete';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { CardActionArea, Divider, Grid } from '@mui/material';
import {apiUrl} from "../../constants/constants.js"
import TextField from '@mui/material/TextField';
import { useNavigate, useLocation } from "react-router-dom";
import { FormControl, InputLabel, MenuItem, Select, Typography } from "@mui/material";
import MDSnackbar from '../../components/MDSnackbar';
import DeleteIcon from '@mui/icons-material/Delete';
import dayjs from 'dayjs';
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { MobileDateTimePicker } from '@mui/x-date-pickers/MobileDateTimePicker';
import { Checkbox, FormControlLabel, FormGroup } from "@mui/material";
import OutlinedInput from '@mui/material/OutlinedInput';
import axios from "axios";
import JoditEditor from 'jodit-react';

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
  const [prevData, setPrevData]  = useState(location?.state?.data);
  const navigate = useNavigate();
  const [isSubmitted,setIsSubmitted] = useState(false);
  const [editing,setEditing] = useState(prevData ? false : true)
  const [coverPreviewUrl, setTitlePreviewUrl] = useState('');
  const [imagesPreviewUrl, setImagesPreviewUrl] = useState(null);
  const [imageData, setImageData] = useState(prevData || null);
  const [coverImage, setTitleImage] = useState(null);
  // const [editing,setEditingBlogData] = useState(prevData ? false : true)

  const [formstate, setFormState] = useState(
    {
      ...prevData,
    }
  )
  const [isfileSizeExceed, setIsFileExceed] = useState(false);
  const [file, setFile] = useState([]);
  const [mandirs, setMandirs] = useState([]);
  const [value, setValue] = useState(prevData?.description || '');
  const editor = useRef(null);

  useEffect(() => {
    axios.get(`${apiUrl}mandir/active`, {withCredentials: true})
      .then((res) => {
        setMandirs(res?.data?.data);
      }).catch((err) => {
        return new Error(err)
      })

  }, [])

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
  

  const handleCoverImage = (event) => {
    const file = event.target.files[0];
    setTitleImage(event.target.files);
    // console.log("Title File:",file)
    // Create a FileReader instance
    const reader = new FileReader();
    reader.onload = () => {
      setTitlePreviewUrl(reader.result);
      // console.log("Title Preview Url:",reader.result)
    };
    reader.readAsDataURL(file);
  };

  const handleUpload = async () => {
    if (!coverImage) {
      openSuccessSB('error', 'Please select a file to upload');
      return;
    }
  
    try {
      const formData = new FormData();
      if (coverImage) {
        formData.append("photo", coverImage[0]);
      }
  
      // Append each file in the file array to the "files" array
      if(file){
        for (let i = 0; i < file.length; i++) {
          formData.append("files", file[i]);
        }
      }

      for(let elem in formstate){
        if(elem === "mandir"){
          formData.append(`${elem}`, formstate[elem]?._id);
        } else{
          formData.append(`${elem}`, formstate[elem]);
        }
      }

      const res = await fetch(`${apiUrl}mandirpost`, {

        method: "POST",
        credentials: "include",
        headers: {
          "Access-Control-Allow-Credentials": true
        },
        body: formData
      });

      let data = await res.json()
      setPrevData(data.data);
      if(data.status==='success'){
        setFile(null)
        setImageData(data.data);
        setIsSubmitted(true);
        setImagesPreviewUrl(null)
        setEditing(false);
        openSuccessSB('success', data.message);
      }
    } catch (error) {
      openSuccessSB('error', error?.err);
    }
  };

  const edit = async () => {
    try {
      const formData = new FormData();
      if (coverImage) {
        formData.append("coverFiles", coverImage[0]);
      }
  
      // Append each file in the file array to the "files" array
      if(file){
        for (let i = 0; i < file.length; i++) {
          formData.append("files", file[i]);
        }
      }

      for(let elem in formstate){
        if(elem === "devi_devta"){
          formData.append(`${elem}`, formstate[elem]?._id);
        } else{
          formData.append(`${elem}`, formstate[elem]);
        }
      }

      const res = await fetch(`${apiUrl}mandir/${prevData?._id}`, {

        method: "PATCH",
        credentials: "include",
        headers: {
          "Access-Control-Allow-Credentials": true
        },
        body: formData
      });

      let data = await res.json()
  
      if(data.status==='success'){
        setFile(null)
        setImageData(data.data);
        setImagesPreviewUrl(null)
        setEditing(false)
        openSuccessSB('success', data.message);
      }
    } catch (error) {
      openSuccessSB('error', error?.err);
    }
  };

  const removeImage = async (id, docId) => {
    try {
      const res = await fetch(`${apiUrl}mandir/removeimage/${id}/${docId}`, {

        method: "PATCH",
        credentials: "include",
        headers: {
          "Access-Control-Allow-Credentials": true
        },
        
      });

      let data = await res.json()
  
      if(data.status==='success'){
        setImageData(data.data);
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
      sx={{ borderLeft: `10px solid ${messageObj.color==="success" ? "#4CAF50" : messageObj.color==="error" ? "#F44335" : "#1A73E8"}`, borderRight: `10px solid ${messageObj.color==="success" ? "#4CAF50" : messageObj.color==="error" ? "#F44335" : "#1A73E8"}`, borderRadius: "15px", width: "auto" }}
    />
  );

  const handleDevtaChange = (event) => {
    const {
      target: { value },
    } = event;
    let data = mandirs?.filter((elem) => {
      console.log(value)
      console.log(elem?.name)
      return elem.name === value;
    })
    console.log("mandir:",data)
    setFormState(prevState => ({
      ...prevState,
      mandir: {
        ...prevState.mandir,
        _id: data[0]?._id,
        name: data[0]?.name
      }
    }));
  };

  return (
    <>
      <MDBox pl={2} pr={2} mt={2} mb={2}>
        <MDBox display="flex" justifyContent="space-between" alignItems="center">
          <MDTypography variant="caption" fontWeight="bold" color="text" textTransform="uppercase">
            Fill Mandir Details
          </MDTypography>
        </MDBox>
        <Grid mt={2} container xs={12} md={12} xl={12} display="flex" flexDirection="row" justifyContent="space-between">
          <Grid container spacing={2} mt={0.5} mb={0} xs={12} md={9} xl={12}>

            <Grid item xs={12} md={12} xl={12}>
              {/* <FormControl sx={{ width: '100%' }}>
                <InputLabel id="demo-multiple-name-label">Devi Devta</InputLabel>
                <Select
                  labelId="demo-multiple-name-label"
                  id="demo-multiple-name"
                  name='devi_devta'
                  disabled={((isSubmitted || prevData) && (!editing))}
                  value={formstate?.devi_devta?.name || imageData?.devi_devta?.name || prevData?.devi_devta?.name}
                  onChange={handleDevtaChange}
                  input={<OutlinedInput label="Devi Devta" />}
                  sx={{ minHeight: 45 }}
                  MenuProps={MenuProps}
                >
                  {deviDevtas?.map((devi_devta) => (
                    <MenuItem
                      key={devi_devta?.name}
                      value={devi_devta?.name}
                    >
                      {devi_devta.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl> */}
              <Autocomplete
                id="country-select-demo"
                sx={{ width: '100%' }}
                name='mandir'
                options={mandirs}
                autoHighlight
                value={value}
                onChange={handleDevtaChange}
                getOptionLabel={(option) =>`${option?.name}`}
                renderOption={(props, option) => (
                  <Box
                    component="li"
                    sx={{
                      '& > img': { mr: 2, flexShrink: 0 },
                      minHeight: 40, // Adjust the minHeight as needed
                    }}
                    {...props}
                  >
                    <img
                      loading="lazy"
                      width="20"
                      srcSet={`${option?.cover_image?.url}`}
                      src={`${option?.cover_image?.url}`}
                      alt=""
                    />
                    {option?.name} ({option?.address_details?.city}) {option.address_details?.state}
                  </Box>
                )}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Choose a country"
                    sx={{
                      minHeight: 30, // Adjust the minHeight as needed
                      '& input': {
                        padding: '5px', // Adjust padding as needed
                      },
                    }}
                    inputProps={{
                      ...params.inputProps,
                      autoComplete: 'new-password', // disable autocomplete and autofill
                    }}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} md={3} xl={3}>
              <TextField
                disabled={((prevData && !editing))}
                id="outlined-required"
                label='Video Url *'
                fullWidth
                value={formstate?.videoUrl}
                onChange={(e) => {
                  setFormState(prevState => ({
                    ...prevState,
                    videoUrl: e.target.value
                  }))
                }}
              />
            </Grid>

            <Grid item xs={12} md={3} xl={3}>
              <FormControl sx={{ width: "100%" }}>
                <InputLabel id="demo-simple-select-autowidth-label">Status *</InputLabel>
                <Select
                  labelId="demo-simple-select-autowidth-label"
                  id="demo-simple-select-autowidth"
                  name='status'
                  value={formstate?.status}
                  disabled={((prevData && !editing))}
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
                  <MenuItem value="Draft">Draft</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={3} xl={3}>
              <MDButton variant="outlined" style={{ fontSize: 10 }} fullWidth color={((imageData || prevData) && (!editing)) ? "warning" : "dark"} component="label">
                {prevData?.photo || coverImage ? "Update Cover Image[2X1]" : "Upload Cover Image[2X1]"}
                <input
                  hidden
                  disabled={((prevData && !editing))}
                  accept="image/*"
                  type="file"
                  onChange={(e) => {
                    setFormState(prevState => ({
                      ...prevState,
                      photo: e.target.files
                    }));
                    handleCoverImage(e);
                  }}
                />
              </MDButton>
            </Grid>

          </Grid>
        </Grid>

        <Grid mt={2} container xs={12} md={12} xl={12} display="flex" flexDirection="row" justifyContent="space-between">
          <Grid item display="flex" justifyContent="flex-end" xs={12} md={12} xl={12}>
            <MDButton
              variant="contained"
              color= {(prevData && !editing) ? "dark" : (prevData && editing) ? "dark" : "success"}
              size="small"
              sx={{mr:1, ml:1}} 
              disabled={isfileSizeExceed}
              onClick={(prevData && !editing) ? ()=>{setEditing(true)} : (prevData && editing) ? edit : handleUpload}
            >
              {(prevData && !editing) ? "Edit" : (prevData && editing) ? "Save" : "Next"}
            </MDButton>
            {(isSubmitted || prevData) && !editing && 
            <MDButton 
              variant="contained" 
              color="info" 
              size="small" 
              sx={{mr:1, ml:1}} 
              onClick={()=>{navigate('/mandir')}}
            >
                Back
            </MDButton>}
            {(isSubmitted || prevData) && editing && 
            <MDButton 
              variant="contained" 
              color="info" 
              size="small" 
              sx={{mr:1, ml:1}} 
              onClick={()=>{setEditing(false)}}
            >
                Cancel
            </MDButton>}
            {!prevData && editing && 
            <MDButton 
              variant="contained" 
              color="info" 
              size="small" 
              sx={{mr:1, ml:1}} 
              onClick={()=>{navigate('/mandir')}}
            >
                Cancel
            </MDButton>}
          </Grid>
        </Grid>

        <Grid mt={2} container xs={12} md={12} xl={12} display="flex" justifyContent='flex-start' alignItems='center' style={{ maxWidth: '100%', height: 'auto' }}>
          {coverPreviewUrl ?

            <Grid item xs={12} md={12} xl={12} style={{ maxWidth: '100%', height: 'auto' }}>
              <Grid container xs={12} md={12} xl={12} style={{ maxWidth: '100%', height: 'auto' }}>
                <Grid item xs={12} md={12} xl={12} style={{ maxWidth: '100%', height: 'auto' }}>
                  <Card sx={{ minWidth: '100%', cursor: 'pointer' }}>
                    <CardActionArea>
                      <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{ maxWidth: '100%', height: 'auto' }}>
                        <CardContent display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{ maxWidth: '100%', height: 'auto' }}>
                          <MDBox display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{ width: '100%', height: 'auto' }}>
                            <Typography variant="caption" fontFamily='Segoe UI' fontWeight={600} style={{ textAlign: 'center' }}>
                              Cover Image
                            </Typography>
                          </MDBox>
                        </CardContent>
                      </Grid>
                      <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{ maxWidth: '100%', height: 'auto' }}>
                        <img src={coverPreviewUrl} style={{ maxWidth: '100%', height: 'auto', borderBottomLeftRadius: 10, borderBottomRightRadius: 10 }} />
                      </Grid>
                    </CardActionArea>
                  </Card>
                </Grid>
              </Grid>
            </Grid>
            :
            <Grid item xs={12} md={12} xl={12} style={{ maxWidth: '100%', height: 'auto' }}>
              <Grid container xs={12} md={12} xl={12} style={{ maxWidth: '100%', height: 'auto' }}>
                <Grid item xs={12} md={12} xl={12} style={{ maxWidth: '100%', height: 'auto' }}>
                  <Card sx={{ minWidth: '100%', cursor: 'pointer' }}>
                    <CardActionArea>
                      <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{ maxWidth: '100%', height: 'auto' }}>
                        <CardContent display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{ maxWidth: '100%', height: 'auto' }}>
                          <MDBox mb={-2} display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{ width: '100%', height: 'auto' }}>
                            <Typography variant="caption" fontFamily='Segoe UI' fontWeight={600} style={{ textAlign: 'center' }}>
                              Cover Image
                            </Typography>
                          </MDBox>
                        </CardContent>
                      </Grid>
                      <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{ maxWidth: '100%', height: 'auto' }}>
                        <img src={imageData?.cover_image?.url} style={{ maxWidth: '100%', height: 'auto', borderBottomLeftRadius: 10, borderBottomRightRadius: 10 }} />
                      </Grid>
                    </CardActionArea>
                  </Card>
                </Grid>
              </Grid>
            </Grid>
          }
        </Grid>

          {renderSuccessSB}
      </MDBox>
    </>
  )
}
export default Index;
