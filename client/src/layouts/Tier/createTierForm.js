
import * as React from 'react';
import { useEffect, useState } from "react";
import axios from "axios";
import ListItemText from '@mui/material/ListItemText';
// import { useForm } from "react-hook-form";
// import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Grid from "@mui/material/Grid";
import MDTypography from "../../components/MDTypography";
import MDBox from "../../components/MDBox";
import MDButton from "../../components/MDButton"
import { Checkbox, CircularProgress, FormControlLabel, FormGroup, formLabelClasses } from "@mui/material";
import MDSnackbar from "../../components/MDSnackbar";
import MenuItem from '@mui/material/MenuItem';
// import { styled } from '@mui/material';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import { useNavigate, useLocation } from "react-router-dom";
// import RegisteredUsers from "./data/registeredUsers";
// import AllowedUsers from './data/notifyUsers';
// import { IoMdAddCircle } from 'react-icons/io';
import OutlinedInput from '@mui/material/OutlinedInput';
import dayjs from 'dayjs';
// import Autocomplete from '@mui/material/Autocomplete';
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
import ContestRewards from './data/reward/contestReward';
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
    tier_name: '' || panditPrevDetail?.tier_name,
    min_pandit_experience: '' || panditPrevDetail?.min_pandit_experience,
    max_pandit_experience: '' || panditPrevDetail?.max_pandit_experience,
    number_of_main_pandit: '' || panditPrevDetail?.number_of_main_pandit,
    number_of_assistant_pandit: '' || panditPrevDetail?.number_of_assistant_pandit,
    status: '' || panditPrevDetail?.status,
    pooja_items_included: false || panditPrevDetail?.address_details?.pooja_items_included,
    post_pooja_cleanUp_included: false || panditPrevDetail?.address_details?.post_pooja_cleanUp_included,
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
    const {pooja_items_included, post_pooja_cleanUp_included, city, state, longitude, latitude, tier_name, min_pandit_experience, max_pandit_experience, number_of_main_pandit, number_of_assistant_pandit, status, language} = formState;
    const address_details = {
      location: {
        type: "Point",
        coordinates: [latitude, longitude]
      },
      post_pooja_cleanUp_included,
      pooja_items_included,
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
        address_details, tier_name, min_pandit_experience, max_pandit_experience, number_of_main_pandit, number_of_assistant_pandit, status, language
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

    const {pooja_items_included, post_pooja_cleanUp_included, city, state, longitude, latitude, tier_name, min_pandit_experience, max_pandit_experience, number_of_main_pandit, number_of_assistant_pandit, status, language} = formState;
    const address_details = {
      location: {
        type: "Point",
        coordinates: [latitude, longitude]
      },
      post_pooja_cleanUp_included,
      pooja_items_included,
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
        address_details, tier_name, min_pandit_experience, max_pandit_experience, number_of_main_pandit, number_of_assistant_pandit, status, language
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
                Fill Tier Details
              </MDTypography>
            </MDBox>

            <Grid container display="flex" flexDirection="row" justifyContent="space-between">
              <Grid container spacing={2} mt={0.5} mb={0} xs={12} md={12} xl={12}>
                <Grid item xs={12} md={6} xl={3}>
                  <TextField
                    disabled={((isSubmitted || panditPrevDetail) && (!editing || saving))}
                    id="outlined-required"
                    label='Tier *'
                    name='tier_name'
                    fullWidth
                    defaultValue={editing ? formState?.tier_name : panditPrevDetail?.tier_name}
                    onChange={(e) => {
                      setFormState(prevState => ({
                        ...prevState,
                        tier_name: e.target.value
                      }))
                    }}
                  />
                </Grid>

                
                <Grid item xs={12} md={6} xl={3} mb={2}>
                  <TextField
                    disabled={((isSubmitted || panditPrevDetail) && (!editing || saving))}
                    id="outlined-required"
                    label='Min Pandit Experience(years) *'
                    name='min_pandit_experience'
                    fullWidth
                    type='number'
                    defaultValue={editing ? formState?.min_pandit_experience : panditPrevDetail?.min_pandit_experience}
                    // onChange={handleChange}
                    onChange={(e) => {
                      setFormState(prevState => ({
                        ...prevState,
                        min_pandit_experience: parseInt(e.target.value, 10)
                      }))
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={6} xl={3} mb={2}>
                  <TextField
                    disabled={((isSubmitted || panditPrevDetail) && (!editing || saving))}
                    id="outlined-required"
                    label='Max Pandit Experience(years) *'
                    name='max_pandit_experience'
                    fullWidth
                    type='number'
                    defaultValue={editing ? formState?.max_pandit_experience : panditPrevDetail?.max_pandit_experience}
                    // onChange={handleChange}
                    onChange={(e) => {
                      setFormState(prevState => ({
                        ...prevState,
                        max_pandit_experience: parseInt(e.target.value, 10)
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

                <Grid item xs={12} md={6} xl={3} mb={2}>
                  <TextField
                    disabled={((isSubmitted || panditPrevDetail) && (!editing || saving))}
                    id="outlined-required"
                    label='Number of main pandits'
                    name='number_of_main_pandit'
                    fullWidth
                    type='number'
                    defaultValue={editing ? formState?.number_of_main_pandit : panditPrevDetail?.number_of_main_pandit}
                    // onChange={handleChange}
                    onChange={(e) => {
                      setFormState(prevState => ({
                        ...prevState,
                        number_of_main_pandit: (e.target.value)
                      }))
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={6} xl={3} mb={2}>
                  <TextField
                    disabled={((isSubmitted || panditPrevDetail) && (!editing || saving))}
                    id="outlined-required"
                    label='Number of assistant pandits'
                    name='number_of_assistant_pandit'
                    fullWidth
                    type='number'
                    defaultValue={editing ? formState?.number_of_assistant_pandit : panditPrevDetail?.number_of_assistant_pandit}
                    // onChange={handleChange}
                    onChange={(e) => {
                      setFormState(prevState => ({
                        ...prevState,
                        number_of_assistant_pandit: (e.target.value)
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
              <Grid item xs={12} md={6} xl={3}>
                  <FormGroup>
                    <FormControlLabel
                      checked={(panditPrevDetail?.pooja_items_included !== undefined && !editing && formState?.pooja_items_included === undefined) ? panditPrevDetail?.pooja_items_included : formState?.pooja_items_included}
                      disabled={((isSubmitted || panditPrevDetail) && (!editing || saving))}
                      control={<Checkbox />}
                      onChange={(e) => {
                        setFormState(prevState => ({
                          ...prevState,
                          actions: ""
                        }))
                        setFormState(prevState => ({
                          ...prevState,
                          pooja_items_included: e.target.checked
                        }))
                      }}
                      label="Pooja Items Included" />
                  </FormGroup>
                </Grid>
              <Grid item xs={12} md={6} xl={3}>
                  <FormGroup>
                    <FormControlLabel
                      checked={(panditPrevDetail?.post_pooja_cleanUp_included !== undefined && !editing && formState?.post_pooja_cleanUp_included === undefined) ? panditPrevDetail?.post_pooja_cleanUp_included : formState?.post_pooja_cleanUp_included}
                      disabled={((isSubmitted || panditPrevDetail) && (!editing || saving))}
                      control={<Checkbox />}
                      onChange={(e) => {
                        setFormState(prevState => ({
                          ...prevState,
                          actions: ""
                        }))
                        setFormState(prevState => ({
                          ...prevState,
                          post_pooja_cleanUp_included: e.target.checked
                        }))
                      }}
                      label="Post Pooja Cleanup Included" />
                  </FormGroup>
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

              {(panditPrevDetail?.payoutType === "Reward" || (isSubmitted && formState?.payoutType === "Reward")) && <Grid item xs={12} md={12} xl={12} mt={2}>
                <MDBox>
                <ContestRewards panditPrevDetail={panditPrevDetail!=undefined ? panditPrevDetail?._id : dailyContest?._id}/>
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