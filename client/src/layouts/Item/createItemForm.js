
import * as React from 'react';
import { useEffect, useState } from "react";
import axios from "axios";
import ListItemText from '@mui/material/ListItemText';
import TextField from '@mui/material/TextField';
import Grid from "@mui/material/Grid";
import MDTypography from "../../components/MDTypography";
import MDBox from "../../components/MDBox";
import MDButton from "../../components/MDButton"
import { Checkbox, CircularProgress, FormControlLabel, FormGroup } from "@mui/material";
import MDSnackbar from "../../components/MDSnackbar";
import MenuItem from '@mui/material/MenuItem';
// import { Card, CardActionArea, CardContent, } from "@mui/material";
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import { useNavigate, useLocation } from "react-router-dom";
import OutlinedInput from '@mui/material/OutlinedInput';
import dayjs from 'dayjs';
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { MobileDateTimePicker } from '@mui/x-date-pickers/MobileDateTimePicker';
import DefaultPoojaUpload from "../../assets/images/defaultpanditimage.png"
// import AdditionalInfo from './data/addAdditionalInfo/additionalInfo';
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
  const [category, setCategory] = useState([]);

  const [formState, setFormState] = useState({
    name: '' || itemPrevDetail?.name,
    min_order_quantity: '' || itemPrevDetail?.min_order_quantity,
    unit: '' || itemPrevDetail?.unit,
    price: '' || itemPrevDetail?.price,
    image: {
      url: '' || itemPrevDetail?.image?.url,
      name: '' || itemPrevDetail?.image?.name
    },
    description: '' || itemPrevDetail?.description,
    featured: false || itemPrevDetail?.featured,
    sponsored: false || itemPrevDetail?.sponsored,
    category: {
      _id: '' || itemPrevDetail?.category?._id,
      name: '' || itemPrevDetail?.category?.name,
    },
    status: '' || itemPrevDetail?.status,
  });

  const [isfileSizeExceed, setIsFileExceed] = useState(false);
  const [file, setFile] = useState(null);
  const [filepreview, setFilePreview] = useState(null);


  useEffect(() => {
    axios.get(`${apiUrl}itemcategory`, {withCredentials: true})
      .then((res) => {
        setCategory(res?.data?.data);
        setIsLoading(false)
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

    const {name, min_order_quantity, unit, price, description, status} = formState;

    if(!name || !min_order_quantity || !unit || !price || !description || !status){
      openSuccessSB('error', 'Please fill all feilds');
    }

    try {
      const formData = new FormData();
      if (file) {
        formData.append("photo", file[0]);
      }

      for (let elem in formState) {
        if (elem !== "image") {
          if(elem === 'category'){
            formData.append(`category`, formState[elem]._id);
          } else{
            formData.append(`${elem}`, formState[elem]);
          }
        }
      }

      const res = await fetch(`${apiUrl}items`, {
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
      const formData = new FormData();
      if (file) {
        formData.append("photo", file[0]);
      }

      for (let elem in formState) {
        if (elem !== "image") {
          if(elem === 'category'){
            formData.append(`category`, formState[elem]._id);
          } else{
            formData.append(`${elem}`, formState[elem]);
          }
        }
      }

      const res = await fetch(`${apiUrl}items/${prevData?._id}`, {

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

  const handleCategoryChange = (event) => {
    const {
      target: { value },
    } = event;
    let data = category?.filter((elem) => {
      return elem.name === value;
    })
    setFormState(prevState => ({
      ...prevState,
      category: {
        ...prevState.category,
        _id: data[0]?._id,
        name: data[0]?.name
      }
    }));
  };

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
      {isLoading ? (
        <MDBox display="flex" justifyContent="center" alignItems="center" mt={5} mb={5}>
          <CircularProgress color="info" />
        </MDBox>
      )
        :
        (
          <MDBox pl={2} pr={2} mt={4}>
            <MDBox display="flex" justifyContent="space-between" alignItems="center">
              <MDTypography variant="caption" fontWeight="bold" color="text" textTransform="uppercase">
                Fill Item Details
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
                    label='Minimum Order Quantity *'
                    name='min_order_quantity'
                    fullWidth
                    type='number'
                    defaultValue={editing ? Math.abs(formState?.min_order_quantity) : itemPrevDetail?.min_order_quantity}
                    // onChange={handleChange}
                    onChange={(e) => {
                      setFormState(prevState => ({
                        ...prevState,
                        min_order_quantity: parseInt(e.target.value, 10)
                      }))
                    }}
                  />
                </Grid>

                <Grid item xs={12} md={3} xl={3} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                  <FormControl sx={{ width: "100%" }}>
                    <InputLabel id="demo-simple-select-autowidth-label">Unit *</InputLabel>
                    <Select
                      labelId="demo-simple-select-autowidth-label"
                      id="demo-simple-select-autowidth"
                      name='unit'
                      value={formState?.unit || itemPrevDetail?.unit}
                      disabled={((isSubmitted || itemPrevDetail) && (!editing || saving))}
                      onChange={(e) => {
                        setFormState(prevState => ({
                          ...prevState,
                          unit: e.target.value
                        }))
                      }}
                      label="Unit"
                      sx={{ minHeight: 43 }}
                    >
                      <MenuItem value="ml">ml</MenuItem>
                      <MenuItem value="Piece">Piece</MenuItem>
                      <MenuItem value="Gms">Gms</MenuItem>
                      <MenuItem value="Kg">Kg</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} md={6} xl={3} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                  <TextField
                    disabled={((isSubmitted || itemPrevDetail) && (!editing || saving))}
                    id="outlined-required"
                    label='Price *'
                    name='price'
                    type='number'
                    fullWidth
                    defaultValue={editing ? Math.abs(formState?.price) : itemPrevDetail?.price}
                    onChange={(e) => {
                      setFormState(prevState => ({
                        ...prevState,
                        price: e.target.value
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
                    multiline
                    defaultValue={editing ? formState?.description : itemPrevDetail?.description}
                    onChange={(e) => {
                      setFormState(prevState => ({
                        ...prevState,
                        description: (e.target.value)
                      }))
                    }}
                  />
                </Grid>

                <Grid item xs={12} md={6} xl={3}>
                  <FormControl sx={{ width:'100%' }}>
                    <InputLabel id="demo-multiple-name-label">Category</InputLabel>
                    <Select
                      labelId="demo-multiple-name-label"
                      id="demo-multiple-name"
                      name='category'
                      disabled={((isSubmitted || itemPrevDetail) && (!editing || saving))}
                      value={formState?.category?.name || itemPrevDetail?.category?.name}
                      onChange={handleCategoryChange}
                      input={<OutlinedInput label="category" />}
                      sx={{ minHeight: 45 }}
                      MenuProps={MenuProps}
                    >
                      {category?.map((elem) => (
                        <MenuItem
                          key={elem?._id}
                          value={elem?.name}
                        >
                          {elem.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
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

                <Grid item xs={12} md={6} xl={3}>
                  <FormGroup>
                    <FormControlLabel 
                      checked={(itemPrevDetail?.featured !== undefined && !editing && formState?.featured === undefined) ? itemPrevDetail?.featured : formState?.featured}
                      disabled={((isSubmitted || itemPrevDetail) && (!editing || saving))}
                      control={<Checkbox />} 
                      onChange={(e) => {
                        setFormState(prevState => ({
                          ...prevState,
                          featured: e.target.checked
                        }))
                      }}
                      label="Featured" />
                  </FormGroup>
                </Grid>

                <Grid item xs={12} md={6} xl={3}>
                  <FormGroup>
                    <FormControlLabel
                      checked={(itemPrevDetail?.sponsored !== undefined && !editing && formState?.sponsored === undefined) ? itemPrevDetail?.sponsored : formState?.sponsored}
                      disabled={((isSubmitted || itemPrevDetail) && (!editing || saving))}
                      control={<Checkbox />} 
                      onChange={(e) => {
                        setFormState(prevState => ({
                          ...prevState,
                          sponsored: e.target.checked
                        }))
                      }}
                      label="Sponsered" />
                  </FormGroup>
                </Grid>


                <Grid item xs={12} md={3} xl={3} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                  <MDButton variant="outlined" style={{ fontSize: 10 }} fullWidth color={((newData || prevData) && (!editing)) ? "warning" : "dark"} component="label">
                    Upload Item Photo (512 X 512)
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
                <img style={{ height: "100px", width: "100px" }} src={imagetoshow()} />
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
                    <MDButton variant="contained" color="error" size="small" disabled={creating} onClick={() => { navigate("/item") }}>
                      Cancel
                    </MDButton>
                  </>
                )}
                {(isSubmitted || itemPrevDetail) && !editing && (
                  <>
                    <MDButton variant="contained" color="dark" size="small" sx={{ mr: 1, ml: 2 }} onClick={() => { setEditing(true) }}>
                      Edit
                    </MDButton>
                    <MDButton variant="contained" color="info" size="small" onClick={() => { navigate('/item') }}>
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
        )
      }
    </>
  )
}
export default Index;