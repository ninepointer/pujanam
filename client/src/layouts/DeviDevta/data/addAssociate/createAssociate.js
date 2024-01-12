import * as React from 'react';
import { useContext, useState } from "react";
import TextField from '@mui/material/TextField';
import Grid from "@mui/material/Grid";
import MDTypography from "../../../../components/MDTypography";
import MDBox from "../../../../components/MDBox";
import MDButton from "../../../../components/MDButton"
// import { userContext } from "../../../../AuthContext";
// import axios from "axios";
import MenuItem from '@mui/material/MenuItem';

import { CircularProgress } from "@mui/material";
import MDSnackbar from "../../../../components/MDSnackbar";
import { apiUrl } from '../../../../constants/constants';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import OutlinedInput from '@mui/material/OutlinedInput';
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
export default function CreateOtherName({ setId, createForm, setCreateForm, prevData, prevName, deviDev }) {

    const [isSubmitted, setIsSubmitted] = useState(false);
    const [formState, setFormState] = useState({
        name: "" || prevName?.associated_devi_devta?.name,
        _id: "" || prevName?.associated_devi_devta?._id
    });
    const [isLoading, setIsLoading] = useState(false)

    async function onNext(e, formState) {
        e.preventDefault()

        if (!formState?.associated_devi_devta) {
            setTimeout(() => {  setIsSubmitted(false) }, 500)
            return openErrorSB("Missing Field", "Please fill all the mandatory fields")
        }

        const { associated_devi_devta} = formState;

        const res = await fetch(`${apiUrl}devta/associate/${prevData?._id}`, {
            method: "PATCH",
            credentials: "include",
            headers: {
                "content-type": "application/json",
                "Access-Control-Allow-Credentials": true
            },
            body: JSON.stringify({
                other_names: associated_devi_devta, prevPackage: prevName
            })
        });

        const data = await res.json();
        console.log(data.error, data);
        if (!data.error) {
            // setNewObjectId(data.data?._id)
            setTimeout(() => {  setIsSubmitted(true) }, 500)
            openSuccessSB(data.message, `Contest Reward Created with prize: ${data.data?.prize}`)
            setCreateForm(!createForm);
            setId("");
        } else {
            setTimeout(() => {  setIsSubmitted(false) }, 500)
            console.log("Invalid Entry");
            return openErrorSB("Couldn't Add Reward", data.error)
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

    const handleDevtaChange = (event) => {
        const {
          target: { value },
        } = event;
        let data = deviDev?.filter((elem) => {
          return elem.name === value;
        })
        setFormState(prevState => ({
          ...prevState,
          associated_devi_devta: {
            ...prevState.associated_devi_devta,
            _id: data[0]?._id,
            name: data[0]?.name
          }
        }));
        // console.log("portfolioId", portfolioId, formState)
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
                    <MDBox mt={4} p={3}>
                        <MDBox display="flex" justifyContent="space-between" alignItems="center">
                            <MDTypography variant="caption" fontWeight="bold" color="text" textTransform="uppercase">
                                Associate Details
                            </MDTypography>
                        </MDBox>

                        <Grid container spacing={1} mt={0.5} alignItems="center">

                            <Grid item xs={12} md={6} xl={5}>
                                <FormControl sx={{ width: '100%' }}>
                                    <InputLabel id="demo-multiple-name-label">Name</InputLabel>
                                    <Select
                                        labelId="demo-multiple-name-label"
                                        id="demo-multiple-name"
                                        name='name'
                                        disabled={isSubmitted}
                                        value={formState?.associated_devi_devta?.name || prevName?.name}
                                        onChange={handleDevtaChange}
                                        input={<OutlinedInput label="Portfolio" />}
                                        sx={{ minHeight: 45 }}
                                        MenuProps={MenuProps}
                                    >
                                        {deviDev?.map((elem) => (
                                            <MenuItem
                                                key={elem?.name}
                                                value={elem?.name}
                                            >
                                                {elem.name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>

                            <Grid item xs={12} md={8} xl={5}>
                              
                            </Grid>

                            {/* <Grid item xs={12} md={8} xl={4}> */}
                                {!isSubmitted && (
                                    <>
                                        <Grid item xs={12} md={2} xl={1} width="100%">
                                            <MDButton variant="contained" size="small" color="success" onClick={(e) => { onNext(e, formState) }}>Save</MDButton>
                                        </Grid>
                                        <Grid item xs={12} md={2} xl={1} width="100%">
                                            <MDButton variant="contained" size="small" color="warning" onClick={(e) => { setCreateForm(!createForm) }}>Back</MDButton>
                                        </Grid>
                                    </>
                                )}
                            {/* </Grid> */}

                        </Grid>
                        {renderSuccessSB}
                        {renderErrorSB}
                    </MDBox>
                )
            }
        </>
    )
}
