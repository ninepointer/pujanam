
import * as React from 'react';
import { useEffect, useState } from "react";
import axios from "axios";
import ListItemText from '@mui/material/ListItemText';
import TextField from '@mui/material/TextField';
import Grid from "@mui/material/Grid";
import MDTypography from "../../components/MDTypography";
import MDBox from "../../components/MDBox";
import MDButton from "../../components/MDButton"
import { Checkbox, CircularProgress } from "@mui/material";
import MDSnackbar from "../../components/MDSnackbar";
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import { useNavigate, useLocation } from "react-router-dom";
import OutlinedInput from '@mui/material/OutlinedInput';
import dayjs from 'dayjs';
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
// import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { MobileDateTimePicker } from '@mui/x-date-pickers/MobileDateTimePicker';
// import User from './users';
// import PotentialUser from "./data/potentialUsers";
// import Leaderboard from "./data/contestWiseLeaderboard"
// import CollegeRegistrations from "./data/contestRegistrations";
// import FeaturedRegistrations from "./data/featuredRegistrations";
// import Shared from "./data/shared";
// import CreateRewards from './data/reward/createReward';
import AdditionalInfo from './data/addAdditionalInfo/additionalInfo';
import {apiUrl} from  '../../constants/constants';

// const CustomAutocomplete = styled(Autocomplete)`
//   .MuiAutocomplete-clearIndicator {
//     color: white;
//   }
// `;

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
  const panditPrevDetail = location?.state?.data;
  console.log("panditPrevDetail", panditPrevDetail)
  const [selectedLanguage, setSelectedLanguage] = useState(panditPrevDetail?.language ? panditPrevDetail?.language : []);
  const [isSubmitted, setIsSubmitted] = useState(false);
  // let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5000/"
  const [isLoading, setIsLoading] = useState(panditPrevDetail ? true : false)
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [creating, setCreating] = useState(false)
  const navigate = useNavigate();
  // const [newObjectId, setNewObjectId] = useState("");
  const [updatedDocument, setUpdatedDocument] = useState([]);
  const [dailyContest, setDailyContest] = useState([]);
  const [language, setLanguage] = useState([]);
  // const [college, setCollege] = useState([]);
  // const [contestRegistrations, setContestRegistrations] = useState([]);
  // const [featuredRegistrations, setFeaturedRegistrations] = useState([]);
  // const [careers,setCareers] = useState([]);
  // const [action, setAction] = useState(false);

  const [formState, setFormState] = useState({
    pandit_name: '' || panditPrevDetail?.pandit_name,
    dob: dayjs(panditPrevDetail?.dob) || dayjs(new Date()),
    mobile: '' || panditPrevDetail?.mobile,
    email: '' || panditPrevDetail?.email,
    experience_in_year: '' || panditPrevDetail?.experience_in_year,
    dob: '' || panditPrevDetail?.dob,
    description: '' || panditPrevDetail?.description,
    pincode: '' || panditPrevDetail?.address_details?.pincode,
    address: '' || panditPrevDetail?.address_details?.address,
    city: '' || panditPrevDetail?.address_details?.city,
    state: '' || panditPrevDetail?.address_details?.state,
    longitude: '' || panditPrevDetail?.address_details?.location?.coordinates[1],
    latitude: '' || panditPrevDetail?.address_details?.location?.coordinates[0],
  });

  useEffect(() => {
    setTimeout(() => {
      panditPrevDetail && setUpdatedDocument(panditPrevDetail)
      setIsLoading(false);
    }, 500)
  }, [])


  useEffect(() => {
    // axios.get(`${apiUrl}language`, {withCredentials: true})
    //   .then((res) => {
    //     setLanguage(res?.data?.data);
    //   }).catch((err) => {
    //     return new Error(err)
    //   })
    setLanguage([{
      _id: "659d6f9a30fa1324fb3d2674",
      language_name: "English"
    }])
  }, [])


  async function onSubmit(e, formState) {
    e.preventDefault()
    console.log(formState)

    setTimeout(() => { setCreating(false); setIsSubmitted(true) }, 500)
    const {pincode, address, city, state, longitude, latitude, pandit_name, mobile, email, experience_in_year, dob, description, language} = formState;
    const address_details = {
      location: {
        type: "Point",
        coordinates: [latitude, longitude]
      },
      address,
      pincode,
      city,
      state
    }
    const res = await fetch(`${apiUrl}pandit`, {
      method: "POST",
      credentials: "include",
      headers: {
        "content-type": "application/json",
        "Access-Control-Allow-Credentials": true
      },
      body: JSON.stringify({
        address_details, pandit_name, mobile, email, experience_in_year, dob, description, language
      })
    });


    const data = await res.json();
    console.log(data, res.status);
    if (res.status !== 201) {
      setTimeout(() => { setCreating(false); setIsSubmitted(false) }, 500)
      openErrorSB("Pandit Ji not saved", data?.message)
    } else {
      openSuccessSB("Pandit Ji Saved", data?.message)
      // setNewObjectId(data?.data?._id)
      setIsSubmitted(true)
      setDailyContest(data?.data);
      setTimeout(() => { setCreating(false); setIsSubmitted(true) }, 500)
    }
  }

  async function onEdit(e, formState) {
    e.preventDefault()
    setSaving(true)

    const {pincode, address, city, state, longitude, latitude, pandit_name, mobile, email, experience_in_year, dob, description, language} = formState;
    const address_details = {
      location: {
        type: "Point",
        coordinates: [latitude, longitude]
      },
      address,
      pincode,
      city,
      state
    }
    const res = await fetch(`${apiUrl}pandit/${panditPrevDetail?._id}`, {
      method: "PUT",
      credentials: "include",
      headers: {
        "content-type": "application/json",
        "Access-Control-Allow-Credentials": true
      },
      body: JSON.stringify({
        address_details, pandit_name, mobile, email, experience_in_year, dob, description, language
      })
    });

    const data = await res.json();
    console.log(data);
    if (data.status === 500 || data.status == 400 || data.status==401 || data.status == 'error' || data.error || !data) {
      openErrorSB("Error", data.error)
      setTimeout(() => { setSaving(false); setEditing(true) }, 500)
    } else if(data.status == 'success') {
      openSuccessSB("Pandit Ji details Edited", "Edited Successfully")
      setTimeout(() => { setSaving(false); setEditing(false) }, 500)
      console.log("entry succesfull");
    }else{
      openErrorSB("Error", data.message);
      setTimeout(() => { setSaving(false); setEditing(true) }, 500)
    }
  }


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
  const openErrorSB = (title, content) => {
    setTitle(title)
    setContent(content)
    setErrorSB(true);
  }
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (!formState[name]?.includes(e.target.value)) {
      setFormState(prevState => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  const handleLanguageChange = (event) => {
    const selectedIds = event.target.value;
    setSelectedLanguage(selectedIds);

    setFormState(prevState => ({
      ...prevState,
      language: selectedIds
    }));
  };

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
                Fill Pandit Ji Details
              </MDTypography>
            </MDBox>

            <Grid container display="flex" flexDirection="row" justifyContent="space-between">
              <Grid container spacing={2} mt={0.5} mb={0} xs={12} md={12} xl={12}>
                <Grid item xs={12} md={6} xl={3}>
                  <TextField
                    disabled={((isSubmitted || panditPrevDetail) && (!editing || saving))}
                    id="outlined-required"
                    label='Pandit Name *'
                    name='pandit_name'
                    fullWidth
                    defaultValue={editing ? formState?.pandit_name : panditPrevDetail?.pandit_name}
                    onChange={(e) => {
                      setFormState(prevState => ({
                        ...prevState,
                        pandit_name: e.target.value
                      }))
                    }}
                  />
                </Grid>

                <Grid item xs={12} md={6} xl={3} mt={-1} mb={1}>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DemoContainer components={['MobileDateTimePicker']}>
                      <DemoItem>
                        <MobileDateTimePicker
                          label="DOB"
                          disabled={((isSubmitted || panditPrevDetail) && (!editing || saving))}
                          value={formState?.dob 
                            // || dayjs(dailyContest?.dob)
                          }
                          onChange={(newValue) => {
                            if (newValue && newValue.isValid()) {
                              setFormState(prevState => ({ ...prevState, dob: newValue }))
                            }
                          }}
                          minDateTime={null}
                          sx={{ width: '100%' }}
                        />
                      </DemoItem>
                    </DemoContainer>
                  </LocalizationProvider>
                </Grid>
                
                <Grid item xs={12} md={6} xl={3} mb={2}>
                  <TextField
                    disabled={((isSubmitted || panditPrevDetail) && (!editing || saving))}
                    id="outlined-required"
                    label='Mobile *'
                    name='mobile'
                    fullWidth
                    type='number'
                    defaultValue={editing ? formState?.mobile : panditPrevDetail?.mobile}
                    // onChange={handleChange}
                    onChange={(e) => {
                      setFormState(prevState => ({
                        ...prevState,
                        mobile: parseInt(e.target.value, 10)
                      }))
                    }}
                  />
                </Grid>

                <Grid item xs={12} md={6} xl={3} mb={2}>
                  <TextField
                    disabled={((isSubmitted || panditPrevDetail) && (!editing || saving))}
                    id="outlined-required"
                    label='Email *'
                    name='email'
                    fullWidth
                    type='email'
                    defaultValue={editing ? formState?.email : panditPrevDetail?.email}
                    // onChange={handleChange}
                    onChange={(e) => {
                      setFormState(prevState => ({
                        ...prevState,
                        email: e.target.value
                      }))
                    }}
                  />
                </Grid>

                {/* <Grid item xs={12} md={6} xl={3}>
                  <FormControl sx={{ width: "100%" }}>
                    <InputLabel id="demo-simple-select-autowidth-label">Payout Type *</InputLabel>
                    <Select
                      labelId="demo-simple-select-autowidth-label"
                      id="demo-simple-select-autowidth"
                      name='payoutType'
                      value={formState?.payoutType || panditPrevDetail?.payoutType}
                      disabled={((isSubmitted || panditPrevDetail) && (!editing || saving))}
                      onChange={(e) => {
                        setFormState(prevState => ({
                          ...prevState,
                          payoutType: e.target.value
                        }))
                      }}
                      label="Payout Type"
                      sx={{ minHeight: 43 }}
                    >
                      <MenuItem value="Percentage">Percentage</MenuItem>
                      <MenuItem value="Reward">Reward</MenuItem>
                    </Select>
                  </FormControl>
                </Grid> */}

                <Grid item xs={12} md={6} xl={4} mb={2}>
                  <TextField
                    disabled={((isSubmitted || panditPrevDetail) && (!editing || saving))}
                    id="outlined-required"
                    label='Experience (Year) *'
                    name='experience_in_year'
                    fullWidth
                    type='number'
                    defaultValue={editing ? formState?.experience_in_year : panditPrevDetail?.experience_in_year}
                    // onChange={handleChange}
                    onChange={(e) => {
                      setFormState(prevState => ({
                        ...prevState,
                        experience_in_year: (e.target.value)
                      }))
                    }}
                  />
                </Grid>

                <Grid item xs={12} md={6} xl={3} mb={2}>
                  <TextField
                    disabled={((isSubmitted || panditPrevDetail) && (!editing || saving))}
                    id="outlined-required"
                    label='Description *'
                    name='description'
                    fullWidth
                    defaultValue={editing ? formState?.description : panditPrevDetail?.description}
                    onChange={handleChange}
                  />
                </Grid>

                <Grid item xs={12} md={6} xl={4} mt={-1} mb={1}>
                  <FormControl sx={{ m: 1, width: '100%' }}>
                    <InputLabel id="demo-multiple-checkbox-label">Language</InputLabel>
                    <Select
                      labelId="demo-multiple-checkbox-label"
                      id="demo-multiple-checkbox"
                      multiple
                      disabled={((isSubmitted || panditPrevDetail) && (!editing || saving))}
                      value={selectedLanguage}
                      onChange={handleLanguageChange}
                      input={<OutlinedInput label="Tag" />}
                      renderValue={(selectedIds) =>
                        selectedIds.map(id => language.find(prod => prod._id === id)?.language_name).join(', ')
                      }
                      sx={{ minHeight: "44px" }}
                      MenuProps={MenuProps}
                    >
                      {language?.map((elem) => (
                        <MenuItem key={elem?._id} value={elem?._id}>
                          <Checkbox checked={selectedLanguage.indexOf(elem?._id) > -1} />
                          <ListItemText primary={elem?.language_name} />
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid> 

                <Grid item xs={12} md={6} xl={4} mb={2}>
                  <TextField
                    disabled={((isSubmitted || panditPrevDetail) && (!editing || saving))}
                    id="outlined-required"
                    label='Address *'
                    name='address'
                    fullWidth
                    type='text'
                    defaultValue={editing ? formState?.address : panditPrevDetail?.address}
                    // onChange={handleChange}
                    onChange={(e) => {
                      setFormState(prevState => ({
                        ...prevState,
                        address: (e.target.value)
                      }))
                    }}
                  />
                </Grid>

                <Grid item xs={12} md={6} xl={4} mb={2}>
                  <TextField
                    disabled={((isSubmitted || panditPrevDetail) && (!editing || saving))}
                    id="outlined-required"
                    label='City *'
                    name='city'
                    fullWidth
                    type='text'
                    defaultValue={editing ? formState?.city : panditPrevDetail?.city}
                    // onChange={handleChange}
                    onChange={(e) => {
                      setFormState(prevState => ({
                        ...prevState,
                        city: (e.target.value)
                      }))
                    }}
                  />
                </Grid>

                <Grid item xs={12} md={6} xl={4} mb={2}>
                  <TextField
                    disabled={((isSubmitted || panditPrevDetail) && (!editing || saving))}
                    id="outlined-required"
                    label='Pincode *'
                    name='pincode'
                    fullWidth
                    type='number'
                    defaultValue={editing ? formState?.pincode : panditPrevDetail?.pincode}
                    // onChange={handleChange}
                    onChange={(e) => {
                      setFormState(prevState => ({
                        ...prevState,
                        pincode: (e.target.value)
                      }))
                    }}
                  />
                </Grid>

                <Grid item xs={12} md={6} xl={4} mb={2}>
                  <TextField
                    disabled={((isSubmitted || panditPrevDetail) && (!editing || saving))}
                    id="outlined-required"
                    label='State *'
                    name='state'
                    fullWidth
                    type='text'
                    defaultValue={editing ? formState?.state : panditPrevDetail?.state}
                    // onChange={handleChange}
                    onChange={(e) => {
                      setFormState(prevState => ({
                        ...prevState,
                        state: (e.target.value)
                      }))
                    }}
                  />
                </Grid>

                <Grid item xs={12} md={6} xl={4} mb={2}>
                  <TextField
                    disabled={((isSubmitted || panditPrevDetail) && (!editing || saving))}
                    id="outlined-required"
                    label='Longitude *'
                    name='longitude'
                    fullWidth
                    type='number'
                    defaultValue={editing ? formState?.longitude : panditPrevDetail?.longitude}
                    // onChange={handleChange}
                    onChange={(e) => {
                      setFormState(prevState => ({
                        ...prevState,
                        longitude: (e.target.value)
                      }))
                    }}
                  />
                </Grid>

                <Grid item xs={12} md={6} xl={4} mb={2}>
                  <TextField
                    disabled={((isSubmitted || panditPrevDetail) && (!editing || saving))}
                    id="outlined-required"
                    label='Latitude *'
                    name='latitude'
                    fullWidth
                    type='number'
                    defaultValue={editing ? formState?.latitude : panditPrevDetail?.latitude}
                    // onChange={handleChange}
                    onChange={(e) => {
                      setFormState(prevState => ({
                        ...prevState,
                        latitude: (e.target.value)
                      }))
                    }}
                  />
                </Grid>

                <Grid item xs={12} md={6} xl={3}>
                  <FormControl sx={{ width: "100%" }}>
                    <InputLabel id="demo-simple-select-autowidth-label">Status *</InputLabel>
                    <Select
                      labelId="demo-simple-select-autowidth-label"
                      id="demo-simple-select-autowidth"
                      name='status'
                      value={formState?.status || panditPrevDetail?.status}
                      disabled={((isSubmitted || panditPrevDetail) && (!editing || saving))}
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
              </Grid>

            </Grid>

            <Grid container mt={2} xs={12} md={12} xl={12} >
              <Grid item display="flex" justifyContent="flex-end" xs={12} md={6} xl={12}>
                {!isSubmitted && !panditPrevDetail && (
                  <>
                    <MDButton
                      variant="contained"
                      color="success"
                      size="small"
                      sx={{ mr: 1, ml: 2 }}
                      disabled={creating}
                      onClick={(e) => { onSubmit(e, formState) }}
                    >
                      {creating ? <CircularProgress size={20} color="inherit" /> : "Save"}
                    </MDButton>
                    <MDButton variant="contained" color="error" size="small" disabled={creating} onClick={() => { navigate("/dashboard/dailycontest") }}>
                      Cancel
                    </MDButton>
                  </>
                )}
                {(isSubmitted || panditPrevDetail) && !editing && (
                  <>
                    <MDButton variant="contained" color="warning" size="small" sx={{ mr: 1, ml: 2 }} onClick={() => { setEditing(true) }}>
                      Edit
                    </MDButton>
                    <MDButton variant="contained" color="info" size="small" onClick={() => { navigate('/dashboard/dailycontest') }}>
                      Back
                    </MDButton>
                  </>
                )}
                {(isSubmitted || panditPrevDetail) && editing && (
                  <>
                    <MDButton
                      variant="contained"
                      color="warning"
                      size="small"
                      sx={{ mr: 1, ml: 2 }}
                      disabled={saving}
                      onClick={(e) => { onEdit(e, formState) }}
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

              {(panditPrevDetail || isSubmitted) && <Grid item xs={12} md={12} xl={12} mt={2}>
                <MDBox>
                <AdditionalInfo panditPrevDetail={panditPrevDetail!=undefined ? panditPrevDetail : dailyContest}/>
                </MDBox>
              </Grid>}
              

              {/* {(isSubmitted || panditPrevDetail) && <Grid item xs={12} md={12} xl={12} mt={2}>
                <MDBox>
                  <AllowedUsers saving={saving} dailyContest={panditPrevDetail?._id ? panditPrevDetail : dailyContest} updatedDocument={updatedDocument} setUpdatedDocument={setUpdatedDocument} action={action} setAction={setAction} />
                </MDBox>
              </Grid>} */}

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