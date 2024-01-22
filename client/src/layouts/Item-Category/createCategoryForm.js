
import * as React from 'react';
import { useEffect, useState } from "react";
import axios from "axios";
import TextField from '@mui/material/TextField';
import Grid from "@mui/material/Grid";
import MDTypography from "../../components/MDTypography";
import MDBox from "../../components/MDBox";
import MDButton from "../../components/MDButton"
import { Checkbox, CircularProgress, FormControlLabel, FormGroup } from "@mui/material";
import MDSnackbar from "../../components/MDSnackbar";
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import { useNavigate, useLocation } from "react-router-dom";
import OutlinedInput from '@mui/material/OutlinedInput';
import {apiUrl} from  '../../constants/constants';
import MDAvatar from '../../components/MDAvatar';

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
  const itemPrevDetail = location?.state?.data;
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(itemPrevDetail ? true : false)
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [creating, setCreating] = useState(false)
  const navigate = useNavigate();
  const [newData, setNewData] = useState(null);
  const [prevData, setPrevData] = useState(itemPrevDetail)
  // const [category, setCategory] = useState([]);

  const [formState, setFormState] = useState({
    name: '' || itemPrevDetail?.name,
    description: '' || itemPrevDetail?.description,
    image: {
      url: '' || itemPrevDetail?.image?.url,
      name: '' || itemPrevDetail?.image?.name
    },
    status: '' || itemPrevDetail?.status,
  });

  const [isfileSizeExceed, setIsFileExceed] = useState(false);
  const [file, setFile] = useState(null);
  const [filepreview, setFilePreview] = useState(null);

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

    const {name, description, status} = formState;

    if(!name || !description || !status){
      openSuccessSB('error', 'Please fill all feilds');
    }

    try {
      const formData = new FormData();
      if (file) {
        formData.append("photo", file[0]);
      }

      for (let elem in formState) {
        if (elem !== "image") {
          formData.append(`${elem}`, formState[elem]);
        }
      }

      const res = await fetch(`${apiUrl}itemcategory`, {
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
        setCreating(true)
        openSuccessSB('success', data.message);
      }
    } catch (error) {
      openSuccessSB('error', error?.err);
    }
  };

  const edit = async () => {
    try {
      const {name, description, status} = formState;

      if(!name || !description || !status){
        openSuccessSB('error', 'Please fill all feilds');
      }

      const formData = new FormData();
      if (file) {
        formData.append("photo", file[0]);
      }

      for (let elem in formState) {
        if (elem !== "image") {
          formData.append(`${elem}`, formState[elem]);
        }
      }

      const res = await fetch(`${apiUrl}itemcategory/${prevData?._id}`, {

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


  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')

  const [successSB, setSuccessSB] = useState(false);
  const openSuccessSB = (title, content) => {
    setTitle(title)
    setContent(content)
    setSuccessSB(true);
  }
  const closeSuccessSB = () => setSuccessSB(false);

  const renderSuccessSB = (
    <MDSnackbar
      color="success"
      icon="check"
      title={title}
      content={content}
      open={successSB}
      onClose={closeSuccessSB}
      close={closeSuccessSB}
      bgWhite="info"
    />
  );

  const [errorSB, setErrorSB] = useState(false);

  const closeErrorSB = () => setErrorSB(false);

  const renderErrorSB = (
    <MDSnackbar
      color="error"
      icon="warning"
      title={title}
      content={content}
      open={errorSB}
      onClose={closeErrorSB}
      close={closeErrorSB}
      bgWhite
    />
  );

  const imagetoshow = () => {
    if(filepreview){
      return filepreview
    }
    if(newData?.image?.url) {
      return newData?.image?.url
    }
    if(prevData?.image?.url) {
      return prevData?.image?.url
    }
    else {
      // return DefaultPoojaUpload
    }
  }

  return (
    <>
      <MDBox pl={2} pr={2} mt={4}>
        <MDBox display="flex" justifyContent="space-between" alignItems="center">
          <MDTypography variant="caption" fontWeight="bold" color="text" textTransform="uppercase">
            Fill Item Category Details
          </MDTypography>
        </MDBox>

        <Grid container spacing={2} mt={0.5} xs={12} md={12} xl={12} display="flex" justifyContent="flex-start" alignContent="center" alignItems="center">
          <Grid item xs={12} md={6} xl={3} display="flex" justifyContent="center" alignContent="center" alignItems="center">
            <TextField
              disabled={((isSubmitted || itemPrevDetail) && (!editing || saving))}
              id="outlined-required"
              label='Name *'
              name='name'
              fullWidth
              defaultValue={editing ? formState?.name : itemPrevDetail?.name}
              onChange={(e) => {
                setFormState(prevState => ({
                  ...prevState,
                  name: e.target.value
                }))
              }}
            />
          </Grid>

          <Grid item xs={12} md={6} xl={3} display="flex" justifyContent="center" alignContent="center" alignItems="center">
            <TextField
              disabled={((isSubmitted || itemPrevDetail) && (!editing || saving))}
              id="outlined-required"
              label='Description *'
              name='description'
              fullWidth
              defaultValue={editing ? formState?.description : itemPrevDetail?.description}
              // onChange={handleChange}
              onChange={(e) => {
                setFormState(prevState => ({
                  ...prevState,
                  description: parseInt(e.target.value, 10)
                }))
              }}
            />
          </Grid>

          <Grid item xs={12} md={3} xl={3} display="flex" justifyContent="center" alignContent="center" alignItems="center">
            <FormControl sx={{ width: "100%" }}>
              <InputLabel id="demo-simple-select-autowidth-label">Status *</InputLabel>
              <Select
                labelId="demo-simple-select-autowidth-label"
                id="demo-simple-select-autowidth"
                name='status'
                value={formState?.status || itemPrevDetail?.status}
                disabled={((isSubmitted || itemPrevDetail) && (!editing || saving))}
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

          <Grid item xs={12} md={3} xl={3} display="flex" justifyContent="center" alignContent="center" alignItems="center">
            <MDButton variant="outlined" style={{ fontSize: 10 }} fullWidth color={((newData || prevData) && (!editing)) ? "warning" : "dark"} component="label">
              Upload Category Photo (512 X 512)
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

          <Grid item xs={12} md={12} xl={12} display="flex" justifyContent="flex-end" alignContent="center" alignItems="center">
            <img style={{height: "100px", width: "100px"}} src={imagetoshow()} />
          </Grid>

        </Grid>

        <Grid container mt={2} xs={12} md={12} xl={12} >
          <Grid item display="flex" justifyContent="flex-end" xs={12} md={6} xl={12}>
            {!isSubmitted && !itemPrevDetail && (
              <>
                <MDButton
                  variant="contained"
                  color="success"
                  size="small"
                  sx={{ mr: 1, ml: 2 }}
                  disabled={creating}
                  onClick={(prevData && !editing) ? () => { setEditing(true) } : (prevData && editing) ? edit : handleUpload}
                >
                  {creating ? <CircularProgress size={20} color="inherit" /> : "Save"}
                </MDButton>
                <MDButton variant="contained" color="error" size="small" disabled={creating} onClick={() => { navigate("/category") }}>
                  Cancel
                </MDButton>
              </>
            )}
            {(isSubmitted || itemPrevDetail) && !editing && (
              <>
                <MDButton variant="contained" color="dark" size="small" sx={{ mr: 1, ml: 2 }} onClick={() => { setEditing(true) }}>
                  Edit
                </MDButton>
                <MDButton variant="contained" color="info" size="small" onClick={() => { navigate('/category') }}>
                  Back
                </MDButton>
              </>
            )}
            {(isSubmitted || itemPrevDetail) && editing && (
              <>
                <MDButton
                  variant="contained"
                  color="dark"
                  size="small"
                  sx={{ mr: 1, ml: 2 }}
                  disabled={saving}
                  onClick={(prevData && !editing) ? () => { setEditing(true) } : (prevData && editing) ? edit : handleUpload}
                >
                  {saving ? <CircularProgress size={20} color="inherit" /> : "Save"}
                </MDButton>
                <MDButton
                  variant="contained"
                  color="error"
                  size="small"
                  disabled={saving}
                  onClick={() => { setEditing(false) }}
                >
                  Cancel
                </MDButton>
              </>
            )}
          </Grid>

        </Grid>

        {renderSuccessSB}
        {renderErrorSB}
      </MDBox>
    </>
  )
}
export default Index;