import React ,{useEffect, useState, useRef} from "react";
import MDTypography from "../../components/MDTypography";
import MDBox from "../../components/MDBox";
import MDButton from "../../components/MDButton"
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
      latitude: prevData?.address_details?.location?.coordinates[0],
      longitude: prevData?.address_details?.location?.coordinates[1],
      address: prevData?.address_details?.address,
      locality: prevData?.address_details?.locality,
      landmark: prevData?.address_details?.landmark,
      pincode: prevData?.address_details?.pincode,
      city: prevData?.address_details?.city,
      state: prevData?.address_details?.state,
      country: prevData?.address_details?.country,
      morning_opening_time: dayjs(prevData?.morning_opening_time) || dayjs(new Date()).set('hour', 0).set('minute', 0).set('second', 0),
      morning_closing_time: dayjs(prevData?.morning_closing_time) || dayjs(new Date()).set('hour', 0).set('minute', 0).set('second', 0),
      evening_opening_time: dayjs(prevData?.evening_opening_time) || dayjs(new Date()).set('hour', 0).set('minute', 0).set('second', 0),
      evening_closing_time: dayjs(prevData?.evening_closing_time) || dayjs(new Date()).set('hour', 0).set('minute', 0).set('second', 0),
      morning_aarti_time: dayjs(prevData?.morning_aarti_time) || dayjs(new Date()).set('hour', 0).set('minute', 0).set('second', 0),
      evening_aarti_time: dayjs(prevData?.evening_aarti_time) || dayjs(new Date()).set('hour', 0).set('minute', 0).set('second', 0)
    }
    || {
      morning_opening_time: dayjs(new Date()).set('hour', 0).set('minute', 0).set('second', 0),
      morning_closing_time: dayjs(new Date()).set('hour', 0).set('minute', 0).set('second', 0),
      evening_opening_time: dayjs(new Date()).set('hour', 0).set('minute', 0).set('second', 0),
      evening_closing_time: dayjs(new Date()).set('hour', 0).set('minute', 0).set('second', 0),
      morning_aarti_time: dayjs(new Date()).set('hour', 0).set('minute', 0).set('second', 0),
      evening_aarti_time: dayjs(new Date()).set('hour', 0).set('minute', 0).set('second', 0),
    }
  )
  const [isfileSizeExceed, setIsFileExceed] = useState(false);
  const [file, setFile] = useState([]);
  const [deviDevtas, setDeviDevtas] = useState([]);
  const [value, setValue] = useState(prevData?.description || '');
  const editor = useRef(null);

  useEffect(() => {
    axios.get(`${apiUrl}devta/active`, {withCredentials: true})
      .then((res) => {
        setDeviDevtas(res?.data?.data);
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

  
  const handleFileChange = (event) => {
    setFile(prevFiles => [...prevFiles, ...event.target.files]);
  
    let previewUrls = [];
    const updatedFiles = [...file, ...event.target.files];
  
    for (const file of updatedFiles) {
      const reader = new FileReader();
      reader.onload = () => {
        // Add the preview URL to the array
        previewUrls.push(reader.result);
  
        // If all files have been processed, update the state with the array of preview URLs
        if (previewUrls.length === updatedFiles.length) {
          setImagesPreviewUrl(previewUrls);
          // console.log("Title Preview URLs:", previewUrls);
        }
      };
      reader.readAsDataURL(file);
    }
  };
  

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

      const res = await fetch(`${apiUrl}mandir`, {

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
    let data = deviDevtas?.filter((elem) => {
      return elem.name === value;
    })
    setFormState(prevState => ({
      ...prevState,
      devi_devta: {
        ...prevState.devi_devta,
        _id: data[0]?._id,
        name: data[0]?.name
      }
    }));
  };

  const config = React.useMemo(
    () => ({
      disabled: editing ? false : true,
      readonly: false,
      enableDragAndDropFileToEditor: false,
      toolbarAdaptive: false,
      toolbarSticky: true,
      addNewLine: false,
      useSearch: false,
      hidePoweredByJodit: true,
      placeholder: 'Write description...',
      // autofocus: false,
    }),
    [editing],
  )

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

            <Grid item xs={12} md={3} xl={3}>
              <TextField
                disabled={((imageData || prevData) && (!editing))}
                id="outlined-required"
                label='Name *'
                fullWidth
                value={formstate?.name}
                onChange={(e) => {
                  setFormState(prevState => ({
                    ...prevState,
                    name: e.target.value
                  }))
                }}
              />
            </Grid>

            <Grid item xs={12} md={3} xl={3} mt={-1} mb={1}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DemoContainer components={['MobileDateTimePicker']}>
                  <DemoItem>
                    <MobileDateTimePicker
                      label="Morning Open Time"
                      disabled={((imageData || prevData) && (!editing))}
                      value={dayjs(formstate?.morning_opening_time) || dayjs(prevData?.morning_opening_time)
                        }
                      onChange={(newValue) => {
                        if (newValue && newValue.isValid()) {
                          setFormState(prevState => ({ ...prevState, morning_opening_time: newValue }))
                        }
                      }}
                      // minDateTime={null}
                      minDateTime={dayjs(formstate?.morning_opening_time || prevData?.morning_opening_time).startOf('day')}
                      format="HH:mm"
                      ampm={true}
                      openTo="hours"
                      sx={{ width: '100%' }}
                    />
                  </DemoItem>
                </DemoContainer>
              </LocalizationProvider>
            </Grid>

            <Grid item xs={12} md={3} xl={3} mt={-1} mb={1}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DemoContainer components={['MobileDateTimePicker']}>
                  <DemoItem>
                    <MobileDateTimePicker
                      label="Morning Close Time"
                      disabled={((imageData || prevData) && (!editing))}
                      value={dayjs(formstate?.morning_closing_time) || dayjs(prevData?.morning_closing_time)}
                      onChange={(newValue) => {
                        if (newValue && newValue.isValid()) {
                          setFormState(prevState => ({ ...prevState, morning_closing_time: newValue }))
                        }
                      }}
                      // minDateTime={null}
                      minDateTime={dayjs(formstate?.morning_closing_time || prevData?.morning_closing_time).startOf('day')}
                      format="HH:mm"
                      ampm={true}
                      openTo="hours"
                      sx={{ width: '100%' }}
                    />
                  </DemoItem>
                </DemoContainer>
              </LocalizationProvider>
            </Grid>

            <Grid item xs={12} md={3} xl={3} mt={-1} mb={1}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DemoContainer components={['MobileDateTimePicker']}>
                  <DemoItem>
                    <MobileDateTimePicker
                      label="Evening Open Time"
                      disabled={((imageData || prevData) && (!editing))}
                      value={dayjs(formstate?.evening_opening_time) || dayjs(prevData?.evening_opening_time)}
                      onChange={(newValue) => {
                        if (newValue && newValue.isValid()) {
                          setFormState(prevState => ({ ...prevState, evening_opening_time: newValue }))
                        }
                      }}
                      // minDateTime={null}
                      minDateTime={dayjs(formstate?.evening_opening_time || prevData?.evening_opening_time).startOf('day')}
                      format="HH:mm"
                      ampm={true}
                      openTo="hours"
                      sx={{ width: '100%' }}
                    />
                  </DemoItem>
                </DemoContainer>
              </LocalizationProvider>
            </Grid>

            <Grid item xs={12} md={3} xl={3} mt={-1} mb={1}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DemoContainer components={['MobileDateTimePicker']}>
                  <DemoItem>
                    <MobileDateTimePicker
                      label="Evening Close Time"
                      disabled={((imageData || prevData) && (!editing))}
                      value={dayjs(formstate?.evening_closing_time) || dayjs(prevData?.evening_closing_time)}
                      onChange={(newValue) => {
                        if (newValue && newValue.isValid()) {
                          setFormState(prevState => ({ ...prevState, evening_closing_time: newValue }))
                        }
                      }}
                      // minDateTime={null}
                      minDateTime={dayjs(formstate?.evening_closing_time || prevData?.evening_closing_time).startOf('day')}
                      format="HH:mm"
                      ampm={true}
                      openTo="hours"
                      sx={{ width: '100%' }}
                    />
                  </DemoItem>
                </DemoContainer>
              </LocalizationProvider>
            </Grid>

            <Grid item xs={12} md={3} xl={3} mt={-1} mb={1}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DemoContainer components={['MobileDateTimePicker']}>
                  <DemoItem>
                    <MobileDateTimePicker
                      label="Morning Aarti Time"
                      disabled={((imageData || prevData) && (!editing))}
                      value={dayjs(formstate?.morning_aarti_time) || dayjs(prevData?.morning_aarti_time)}
                      onChange={(newValue) => {
                        if (newValue && newValue.isValid()) {
                          setFormState(prevState => ({ ...prevState, morning_aarti_time: newValue }))
                        }
                      }}
                      // minDateTime={null}
                      minDateTime={dayjs(formstate?.morning_aarti_time || prevData?.morning_aarti_time).startOf('day')}
                      format="HH:mm"
                      ampm={true}
                      openTo="hours"
                      sx={{ width: '100%' }}
                    />
                  </DemoItem>
                </DemoContainer>
              </LocalizationProvider>
            </Grid>

            <Grid item xs={12} md={3} xl={3} mt={-1} mb={1}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DemoContainer components={['MobileDateTimePicker']}>
                  <DemoItem>
                    <MobileDateTimePicker
                      label="Evening Aarti Time"
                      disabled={((imageData || prevData) && (!editing))}
                      value={dayjs(formstate?.evening_aarti_time) || dayjs(prevData?.evening_aarti_time)}
                      onChange={(newValue) => {
                        if (newValue && newValue.isValid()) {
                          setFormState(prevState => ({ ...prevState, evening_aarti_time: newValue }))
                        }
                      }}
                      // minDateTime={null}
                      minDateTime={dayjs(formstate?.evening_aarti_time || prevData?.evening_aarti_time).startOf('day')}
                      format="HH:mm"
                      ampm={true}
                      openTo="hours"
                      sx={{ width: '100%' }}
                    />
                  </DemoItem>
                </DemoContainer>
              </LocalizationProvider>
            </Grid>

            <Grid item xs={12} md={3} xl={3}>
              <TextField
                disabled={((imageData || prevData) && (!editing))}
                id="outlined-required"
                label='Construction Year *'
                fullWidth
                value={formstate?.construction_year}
                onChange={(e) => {
                  setFormState(prevState => ({
                    ...prevState,
                    construction_year: e.target.value
                  }))
                }}
              />
            </Grid>

            <Grid item xs={12} md={3} xl={3}>
              <TextField
                disabled={((imageData || prevData) && (!editing))}
                id="outlined-required"
                label='Mandir Pandit Name *'
                fullWidth
                value={formstate?.pandit_full_name}
                onChange={(e) => {
                  setFormState(prevState => ({
                    ...prevState,
                    pandit_full_name: e.target.value
                  }))
                }}
              />
            </Grid>

            <Grid item xs={12} md={3} xl={3}>
              <TextField
                disabled={((imageData || prevData) && (!editing))}
                id="outlined-required"
                label='Mandir Pandit Mobile *'
                fullWidth
                value={formstate?.pandit_mobile_number}
                onChange={(e) => {
                  setFormState(prevState => ({
                    ...prevState,
                    pandit_mobile_number: e.target.value
                  }))
                }}
              />
            </Grid>

            <Grid item xs={12} md={3} xl={3}>
              <FormControl sx={{ width: '100%' }}>
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
              </FormControl>
            </Grid>

            <Grid item xs={12} md={3} xl={3}>
              <FormControl sx={{ width: "100%" }}>
                <InputLabel id="demo-simple-select-autowidth-label">Accessibility *</InputLabel>
                <Select
                  labelId="demo-simple-select-autowidth-label"
                  id="demo-simple-select-autowidth"
                  name='accessibility'
                  value={formstate?.accessibility}
                  disabled={((imageData || prevData) && (!editing))}
                  onChange={(e) => {
                    setFormState(prevState => ({
                      ...prevState,
                      accessibility: e.target.value
                    }))
                  }}
                  label="Accessibility"
                  sx={{ minHeight: 43 }}
                >
                  <MenuItem value="Open to all">Open to all</MenuItem>
                  <MenuItem value="Members only">Members only</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={3} xl={3}>
              <FormControl sx={{ width: "100%" }}>
                <InputLabel id="demo-simple-select-autowidth-label">Status *</InputLabel>
                <Select
                  labelId="demo-simple-select-autowidth-label"
                  id="demo-simple-select-autowidth"
                  name='status'
                  value={formstate?.status}
                  disabled={((imageData || prevData) && (!editing))}
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
              <TextField
                disabled={((imageData || prevData) && (!editing))}
                id="outlined-required"
                label='Slug/Route *'
                fullWidth
                value={formstate?.slug}
                onChange={(e) => {
                  setFormState(prevState => ({
                    ...prevState,
                    slug: e.target.value
                  }))
                }}
              />
            </Grid>

            <Grid item xs={12} md={6} xl={6}>
              <TextField
                disabled={((imageData || prevData) && (!editing))}
                id="outlined-required"
                label='Tags *'
                fullWidth
                value={formstate?.tags}
                onChange={(e) => {
                  setFormState(prevState => ({
                    ...prevState,
                    tags: e.target.value
                  }))
                }}
              />
            </Grid>

            <Grid item xs={12} md={3} xl={3}>
              <FormGroup>
                <FormControlLabel
                  checked={(prevData?.dham !== undefined && !editing && formstate?.dham === undefined) ? prevData?.dham : formstate?.dham}
                  disabled={((imageData || prevData) && (!editing))}
                  control={<Checkbox />}
                  onChange={(e) => {
                    setFormState(prevState => ({
                      ...prevState,
                      dham: e.target.checked
                    }))
                  }}
                  label="Dham" />
              </FormGroup>
            </Grid>

            <Grid item xs={12} md={3} xl={3}>
              <FormGroup>
                <FormControlLabel
                  checked={(prevData?.popular !== undefined && !editing && formstate?.popular === undefined) ? prevData?.popular : formstate?.popular}
                  disabled={((imageData || prevData) && (!editing))}
                  control={<Checkbox />}
                  onChange={(e) => {
                    setFormState(prevState => ({
                      ...prevState,
                      popular: e.target.checked
                    }))
                  }}
                  label="Popular" />
              </FormGroup>
            </Grid>

            <Grid item xs={12} md={3} xl={3}>
              <MDButton variant="outlined" style={{ fontSize: 10 }} fullWidth color={((imageData || prevData) && (!editing)) ? "warning" : "dark"} component="label">
                {prevData?.cover_image || coverImage ? "Update Cover Image[2X1]" : "Upload Cover Image[2X1]"}
                <input
                  hidden
                  disabled={((imageData || prevData) && (!editing))}
                  accept="image/*"
                  type="file"
                  onChange={(e) => {
                    setFormState(prevState => ({
                      ...prevState,
                      coverImage: e.target.files
                    }));
                    handleCoverImage(e);
                  }}
                />
              </MDButton>
            </Grid>

            <Grid item xs={12} md={3} xl={3}>
              <MDButton variant="outlined" style={{ fontSize: 10 }} fullWidth color={((imageData || prevData) && (!editing)) ? "warning" : "dark"} component="label">
                {imageData?.images?.length ? "Upload More Images[2X1]" : "Upload Mandir Images[2X1]"}
                <input
                  hidden
                  disabled={((imageData || prevData) && (!editing))}
                  accept="image/*"
                  type="file"
                  multiple
                  onChange={handleFileChange}
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

        <Grid mt={2} container xs={12} md={12} xl={12} display="flex" flexDirection="row" justifyContent="space-between">
          <MDBox display="flex" justifyContent="space-between" alignItems="center">
            <MDTypography variant="caption" fontWeight="bold" color="text" textTransform="uppercase">
              Mandir Address Details
            </MDTypography>
          </MDBox>
          <Grid container spacing={2} mt={0.5} mb={0} xs={12} md={9} xl={12}>
              <Grid item xs={12} md={3} xl={3}>
                <TextField
                  disabled={((imageData || prevData) && (!editing))}
                  id="outlined-required"
                  label='Latitude *'
                  fullWidth
                  type='number'
                  value={formstate?.latitude}
                  onChange={(e) => {
                    setFormState(prevState => ({
                      ...prevState,
                      latitude: e.target.value
                    }))
                  }}
                />
              </Grid>

              <Grid item xs={12} md={3} xl={3}>
                <TextField
                  disabled={((imageData || prevData) && (!editing))}
                  id="outlined-required"
                  label='Longitude *'
                  fullWidth
                  type='number'
                  value={formstate?.longitude}
                  onChange={(e) => {
                    setFormState(prevState => ({
                      ...prevState,
                      longitude: e.target.value
                    }))
                  }}
                />
              </Grid>

              <Grid item xs={12} md={3} xl={3}>
                <TextField
                  disabled={((imageData || prevData) && (!editing))}
                  id="outlined-required"
                  label='Address *'
                  fullWidth
                  value={formstate?.address}
                  onChange={(e) => {
                    setFormState(prevState => ({
                      ...prevState,
                      address: e.target.value
                    }))
                  }}
                />
              </Grid>

              <Grid item xs={12} md={3} xl={3}>
                <TextField
                  disabled={((imageData || prevData) && (!editing))}
                  id="outlined-required"
                  label='Locality *'
                  fullWidth
                  value={formstate?.locality}
                  onChange={(e) => {
                    setFormState(prevState => ({
                      ...prevState,
                      locality: e.target.value
                    }))
                  }}
                />
              </Grid>

              <Grid item xs={12} md={3} xl={3}>
                <TextField
                  disabled={((imageData || prevData) && (!editing))}
                  id="outlined-required"
                  label='Landmark *'
                  fullWidth
                  value={formstate?.landmark}
                  onChange={(e) => {
                    setFormState(prevState => ({
                      ...prevState,
                      landmark: e.target.value
                    }))
                  }}
                />
              </Grid>

              <Grid item xs={12} md={3} xl={3}>
                <TextField
                  disabled={((imageData || prevData) && (!editing))}
                  id="outlined-required"
                  label='Pincode *'
                  fullWidth
                  value={formstate?.pincode}
                  onChange={(e) => {
                    setFormState(prevState => ({
                      ...prevState,
                      pincode: e.target.value
                    }))
                  }}
                />
              </Grid>

              <Grid item xs={12} md={3} xl={3}>
                <TextField
                  disabled={((imageData || prevData) && (!editing))}
                  id="outlined-required"
                  label='City *'
                  fullWidth
                  value={formstate?.city}
                  onChange={(e) => {
                    setFormState(prevState => ({
                      ...prevState,
                      city: e.target.value
                    }))
                  }}
                />
              </Grid>

              <Grid item xs={12} md={3} xl={3}>
                <TextField
                  disabled={((imageData || prevData) && (!editing))}
                  id="outlined-required"
                  label='State *'
                  fullWidth
                  value={formstate?.state}
                  onChange={(e) => {
                    setFormState(prevState => ({
                      ...prevState,
                      state: e.target.value
                    }))
                  }}
                />
              </Grid>

              <Grid item xs={12} md={3} xl={3}>
                <TextField
                  disabled={((imageData || prevData) && (!editing))}
                  id="outlined-required"
                  label='Country *'
                  fullWidth
                  value={formstate?.country}
                  onChange={(e) => {
                    setFormState(prevState => ({
                      ...prevState,
                      country: e.target.value
                    }))
                  }}
                />
              </Grid>

          </Grid>
        </Grid>

        <Grid mt={2} container xs={12} md={12} xl={12} display="flex" flexDirection="row" justifyContent="space-between">
            
            <MDBox display="flex" justifyContent="space-between" alignItems="center">
              <MDTypography variant="caption" fontWeight="bold" color="text" textTransform="uppercase">
                About the mandir
              </MDTypography>
            </MDBox>
            <Grid container spacing={2} mt={0.5} mb={0} xs={12} md={12} xl={12}>
              <Grid item xs={12} md={12} xl={12}>
                <JoditEditor
                  ref={editor}
                  config={config}
                  value={formstate.description}
                  onChange={(e) => {
                    setFormState(prevState => ({
                      ...prevState,
                      description: e
                    }))
                  }}
                  disabled={true}
                  style={{ maxWidth: '100%', height: "100%" }}
                />
              </Grid>
            </Grid>

        </Grid>

        <Grid mt={2} container xs={12} md={12} xl={12} display="flex" flexDirection="row" justifyContent="space-between">
            <MDBox display="flex" justifyContent="space-between" alignItems="center">
              <MDTypography variant="caption" fontWeight="bold" color="text" textTransform="uppercase">
                SEO Details
              </MDTypography>
            </MDBox>
            <Grid container spacing={2} mt={0.5} mb={0} xs={12} md={9} xl={12}>
                <Grid item xs={12} md={3} xl={3}>
                  <TextField
                    disabled={((imageData || prevData) && (!editing))}
                    id="outlined-required"
                    label='Meta Title *'
                    fullWidth
                    value={formstate?.meta_title}
                    onChange={(e) => {
                      setFormState(prevState => ({
                        ...prevState,
                        meta_title: e.target.value
                      }))
                    }}
                  />
                </Grid>

                <Grid item xs={12} md={9} xl={9}>
                  <TextField
                    disabled={((imageData || prevData) && (!editing))}
                    id="outlined-required"
                    label='Meta Keywords *'
                    fullWidth
                    value={formstate?.keywords}
                    onChange={(e) => {
                      setFormState(prevState => ({
                        ...prevState,
                        keywords: e.target.value
                      }))
                    }}
                  />
                </Grid>

                <Grid item xs={12} md={12} xl={12}>
                  <TextField
                    disabled={((imageData || prevData) && (!editing))}
                    id="outlined-required"
                    label='Meta Description *'
                    fullWidth
                    multiline
                    rows={5}
                    value={formstate?.meta_description}
                    onChange={(e) => {
                      setFormState(prevState => ({
                        ...prevState,
                        meta_description: e.target.value
                      }))
                    }}
                  />
                </Grid>
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

        <Grid container mt={2} xs={12} md={12} xl={12} display="flex" justifyContent='center' alignItems='center' style={{ maxWidth: '100%', height: 'auto' }}>
          <Grid item xs={12} md={12} xl={12} display="flex" justifyContent='center' alignItems='center'>
            <Grid container spacing={2} xs={12} md={12} xl={12} display="flex" justifyContent='flex-start' alignItems='center'>
            {imageData?.images?.map((elem) => {
              return (
                <>
                  <Grid item xs={12} md={12} xl={4} display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{ maxWidth: '100%', height: 'auto' }}>
                    <Grid container xs={12} md={12} display='flex' justifyContent='center' alignContent='center' alignItems='center' xl={12} style={{ maxWidth: '100%', height: 'auto' }}>
                      <Grid item xs={12} md={12} xl={12} style={{ maxWidth: '100%', height: 'auto' }}>
                        <Card sx={{ minWidth: '100%', cursor: 'pointer' }}>
                          <CardActionArea>
                            <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{ maxWidth: '100%', height: 'auto' }}>
                              <img src={elem?.url} style={{ maxWidth: '100%', height: 'auto', borderTopLeftRadius: 10, borderTopRightRadius: 10 }} />
                            </Grid>
                            <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{ maxWidth: '100%', height: 'auto' }}>
                              <CardContent>
                                <MDBox display='flex' flexDirection='column' justifyContent='space-between' alignContent='center' style={{ width: '100%', height: 'auto' }}>
                                  <MDTypography mb={-2} variant="caption" style={{ textAlign: 'center', display: "flex", justifyContent: "center", alignItems: 'center', alignContent: 'center' }} onClick={() => { removeImage(imageData?._id, elem?._id) }}>
                                    Delete <DeleteIcon />
                                  </MDTypography>
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
                  <Grid item xs={12} md={12} xl={4} display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{ maxWidth: '100%', height: 'auto' }}>
                    <Grid container display='flex' justifyContent='flex-start' alignContent='center' alignItems='center' xs={12} md={12} xl={12} style={{ maxWidth: '100%', height: 'auto' }}>
                      <Grid item xs={12} md={12} xl={12} style={{ maxWidth: '100%', height: 'auto' }}>
                        <Card sx={{ minWidth: '100%', cursor: 'pointer' }}>
                          <CardActionArea>
                            <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{ maxWidth: '100%', height: 'auto' }}>
                              <img src={elem} style={{ maxWidth: '100%', height: 'auto', borderTopLeftRadius: 10, borderTopRightRadius: 10 }} />
                            </Grid>
                            <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='space-between' alignContent='center' style={{ maxWidth: '100%', height: 'auto' }}>
                              <CardContent>
                                <MDBox display='flex' flexDirection='column' justifyContent='space-between' alignContent='center' style={{ width: '100%', height: 'auto' }}>
                                  <Divider />
                                  <MDTypography mb={-2} variant="caption" style={{ textAlign: 'center', display: "flex", justifyContent: "center", alignItems: 'center', alignContent: 'center' }} onClick={() => { setImagesPreviewUrl(imagesPreviewUrl.filter(item => item !== elem)) }}>
                                    Delete <DeleteIcon />
                                  </MDTypography>
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
        </Grid> 
          {renderSuccessSB}
      </MDBox>
    </>
  )
}
export default Index;
