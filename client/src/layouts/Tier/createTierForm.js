
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
// import ContestRewards from './data/reward/contestReward';
import { apiUrl } from '../../constants/constants';

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
  const tierPrevDetail = location?.state?.data;
  const [selectedPandit, setSelectedPandit] = useState(tierPrevDetail?.pandits ? tierPrevDetail?.pandits : []);
  const [isSubmitted, setIsSubmitted] = useState(false);
  // let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5001/"
  const [isLoading, setIsLoading] = useState(tierPrevDetail ? true : false)
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [creating, setCreating] = useState(false)
  const navigate = useNavigate();
  // const [newObjectId, setNewObjectId] = useState("");
  const [updatedDocument, setUpdatedDocument] = useState([]);
  const [tier, setTier] = useState([]);
  const [pandit, setPandit] = useState([]);
  // const [college, setCollege] = useState([]);
  // const [contestRegistrations, setContestRegistrations] = useState([]);
  // const [featuredRegistrations, setFeaturedRegistrations] = useState([]);
  // const [careers,setCareers] = useState([]);

  const [formState, setFormState] = useState({
    tier_name: '' || tierPrevDetail?.tier_name,
    min_pandit_experience: '' || tierPrevDetail?.min_pandit_experience,
    max_pandit_experience: '' || tierPrevDetail?.max_pandit_experience,
    number_of_main_pandit: '' || tierPrevDetail?.number_of_main_pandit,
    number_of_assistant_pandit: '' || tierPrevDetail?.number_of_assistant_pandit,
    status: '' || tierPrevDetail?.status,
    pooja_items_included: false || tierPrevDetail?.pooja_items_included,
    post_pooja_cleanUp_included: false || tierPrevDetail?.post_pooja_cleanUp_included,
  });

  useEffect(() => {
    setTimeout(() => {
      tierPrevDetail && setUpdatedDocument(tierPrevDetail)
      setIsLoading(false);
    }, 500)
  }, [])


  useEffect(() => {
    axios.get(`${apiUrl}pandit/active`, { withCredentials: true })
      .then((res) => {
        setPandit(res?.data?.data);
      }).catch((err) => {
        return new Error(err)
      })
  }, [])


  async function onSubmit(e, formState) {
    e.preventDefault()
    console.log(formState)

    setTimeout(() => { setCreating(false); setIsSubmitted(true) }, 500)
    const {
      pooja_items_included,
      post_pooja_cleanUp_included,
      tier_name, min_pandit_experience,
      max_pandit_experience,
      number_of_main_pandit,
      number_of_assistant_pandit, status, pandits } = formState;

    const res = await fetch(`${apiUrl}tier`, {
      method: "POST",
      credentials: "include",
      headers: {
        "content-type": "application/json",
        "Access-Control-Allow-Credentials": true
      },
      body: JSON.stringify({
        pooja_items_included,
        post_pooja_cleanUp_included,
        tier_name, min_pandit_experience,
        max_pandit_experience,
        number_of_main_pandit,
        number_of_assistant_pandit, status, pandits
      })
    });


    const data = await res.json();
    console.log(data, res.status);
    if (res.status !== 201) {
      setTimeout(() => { setCreating(false); setIsSubmitted(false) }, 500)
      openErrorSB("Tier not saved", data?.message)
    } else {
      openSuccessSB("Tier Saved", data?.message)
      // setNewObjectId(data?.data?._id)
      setIsSubmitted(true)
      setTier(data?.data);
      setTimeout(() => { setCreating(false); setIsSubmitted(true) }, 500)
    }
  }

  async function onEdit(e, formState) {
    e.preventDefault()
    setSaving(true)

    const { pooja_items_included,
      post_pooja_cleanUp_included,
      tier_name, min_pandit_experience,
      max_pandit_experience,
      number_of_main_pandit,
      number_of_assistant_pandit, status, pandits } = formState;

    const res = await fetch(`${apiUrl}tier/${tierPrevDetail?._id}`, {
      method: "PATCH",
      credentials: "include",
      headers: {
        "content-type": "application/json",
        "Access-Control-Allow-Credentials": true
      },
      body: JSON.stringify({
        pooja_items_included,
        post_pooja_cleanUp_included,
        tier_name, min_pandit_experience,
        max_pandit_experience,
        number_of_main_pandit,
        number_of_assistant_pandit, status, pandits
      })
    });

    const data = await res.json();
    console.log(data);
    if (data.status === 500 || data.status == 400 || data.status == 401 || data.status == 'error' || data.error || !data) {
      openErrorSB("Error", data.error)
      setTimeout(() => { setSaving(false); setEditing(true) }, 500)
    } else if (data.status == 'success') {
      openSuccessSB("Tier details Edited", "Edited Successfully")
      setTimeout(() => { setSaving(false); setEditing(false) }, 500)
      console.log("entry succesfull");
    } else {
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

  const handlePanditChange = (event) => {
    const selectedIds = event.target.value;
    setSelectedPandit(selectedIds);

    setFormState(prevState => ({
      ...prevState,
      pandits: selectedIds
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
                <Grid item xs={12} md={6} xl={4}>
                  <TextField
                    disabled={((isSubmitted || tierPrevDetail) && (!editing || saving))}
                    id="outlined-required"
                    label='Tier *'
                    name='tier_name'
                    fullWidth
                    defaultValue={editing ? formState?.tier_name : tierPrevDetail?.tier_name}
                    onChange={(e) => {
                      setFormState(prevState => ({
                        ...prevState,
                        tier_name: e.target.value
                      }))
                    }}
                  />
                </Grid>

                <Grid item xs={12} md={6} xl={4} mb={2}>
                  <TextField
                    disabled={((isSubmitted || tierPrevDetail) && (!editing || saving))}
                    id="outlined-required"
                    label='Min Pandit Experience(years) *'
                    name='min_pandit_experience'
                    fullWidth
                    type='number'
                    defaultValue={editing ? formState?.min_pandit_experience : tierPrevDetail?.min_pandit_experience}
                    // onChange={handleChange}
                    onChange={(e) => {
                      setFormState(prevState => ({
                        ...prevState,
                        min_pandit_experience: parseInt(e.target.value, 10)
                      }))
                    }}
                  />
                </Grid>

                <Grid item xs={12} md={6} xl={4} mb={2}>
                  <TextField
                    disabled={((isSubmitted || tierPrevDetail) && (!editing || saving))}
                    id="outlined-required"
                    label='Max Pandit Experience(years) *'
                    name='max_pandit_experience'
                    fullWidth
                    type='number'
                    defaultValue={editing ? formState?.max_pandit_experience : tierPrevDetail?.max_pandit_experience}
                    // onChange={handleChange}
                    onChange={(e) => {
                      setFormState(prevState => ({
                        ...prevState,
                        max_pandit_experience: parseInt(e.target.value, 10)
                      }))
                    }}
                  />
                </Grid>

                <Grid item xs={12} md={6} xl={4}  mb={1}>
                  <FormControl sx={{ width: '100%' }}>
                    <InputLabel id="demo-multiple-checkbox-label">Pandit</InputLabel>
                    <Select
                      labelId="demo-multiple-checkbox-label"
                      id="demo-multiple-checkbox"
                      multiple
                      disabled={((isSubmitted || tierPrevDetail) && (!editing || saving))}
                      value={selectedPandit}
                      onChange={handlePanditChange}
                      input={<OutlinedInput label="Tag" />}
                      renderValue={(selectedIds) =>
                        selectedIds.map(id => pandit.find(prod => prod._id === id)?.pandit_name).join(', ')
                      }
                      sx={{ minHeight: "44px" }}
                      MenuProps={MenuProps}
                    >
                      {pandit?.map((elem) => (
                        <MenuItem key={elem?._id} value={elem?._id}>
                          <Checkbox checked={selectedPandit.indexOf(elem?._id) > -1} />
                          <ListItemText primary={elem?.pandit_name} />
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} md={6} xl={4} mb={2}>
                  <TextField
                    disabled={((isSubmitted || tierPrevDetail) && (!editing || saving))}
                    id="outlined-required"
                    label='Number of main pandits'
                    name='number_of_main_pandit'
                    fullWidth
                    type='number'
                    defaultValue={editing ? formState?.number_of_main_pandit : tierPrevDetail?.number_of_main_pandit}
                    // onChange={handleChange}
                    onChange={(e) => {
                      setFormState(prevState => ({
                        ...prevState,
                        number_of_main_pandit: (e.target.value)
                      }))
                    }}
                  />
                </Grid>

                <Grid item xs={12} md={6} xl={4} mb={2}>
                  <TextField
                    disabled={((isSubmitted || tierPrevDetail) && (!editing || saving))}
                    id="outlined-required"
                    label='Number of assistant pandits'
                    name='number_of_assistant_pandit'
                    fullWidth
                    type='number'
                    defaultValue={editing ? formState?.number_of_assistant_pandit : tierPrevDetail?.number_of_assistant_pandit}
                    // onChange={handleChange}
                    onChange={(e) => {
                      setFormState(prevState => ({
                        ...prevState,
                        number_of_assistant_pandit: (e.target.value)
                      }))
                    }}
                  />
                </Grid>

                <Grid item xs={12} md={6} xl={4}>
                  <FormControl sx={{ width: "100%" }}>
                    <InputLabel id="demo-simple-select-autowidth-label">Status *</InputLabel>
                    <Select
                      labelId="demo-simple-select-autowidth-label"
                      id="demo-simple-select-autowidth"
                      name='status'
                      value={formState?.status || tierPrevDetail?.status}
                      disabled={((isSubmitted || tierPrevDetail) && (!editing || saving))}
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

                <Grid item xs={12} md={6} xl={4}>
                  <FormGroup>
                    <FormControlLabel
                      checked={(tierPrevDetail?.pooja_items_included !== undefined && !editing && formState?.pooja_items_included === undefined) ? tierPrevDetail?.pooja_items_included : formState?.pooja_items_included}
                      disabled={((isSubmitted || tierPrevDetail) && (!editing || saving))}
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

                <Grid item xs={12} md={6} xl={4}>
                  <FormGroup>
                    <FormControlLabel
                      checked={(tierPrevDetail?.post_pooja_cleanUp_included !== undefined && !editing && formState?.post_pooja_cleanUp_included === undefined) ? tierPrevDetail?.post_pooja_cleanUp_included : formState?.post_pooja_cleanUp_included}
                      disabled={((isSubmitted || tierPrevDetail) && (!editing || saving))}
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
            </Grid>

            <Grid container mt={2} xs={12} md={12} xl={12} >
              <Grid item display="flex" justifyContent="flex-end" xs={12} md={6} xl={12}>
                {!isSubmitted && !tierPrevDetail && (
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
                    <MDButton variant="contained" color="error" size="small" disabled={creating} onClick={() => { navigate("/tier") }}>
                      Cancel
                    </MDButton>
                  </>
                )}
                {(isSubmitted || tierPrevDetail) && !editing && (
                  <>
                    <MDButton variant="contained" color="warning" size="small" sx={{ mr: 1, ml: 2 }} onClick={() => { setEditing(true) }}>
                      Edit
                    </MDButton>
                    <MDButton variant="contained" color="info" size="small" onClick={() => { navigate('/tier') }}>
                      Back
                    </MDButton>
                  </>
                )}
                {(isSubmitted || tierPrevDetail) && editing && (
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