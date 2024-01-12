import * as React from 'react';
import { useState } from "react";
import TextField from '@mui/material/TextField';
import Grid from "@mui/material/Grid";
import MDTypography from "../../../../components/MDTypography";
import MDBox from "../../../../components/MDBox";
import MDButton from "../../../../components/MDButton"
import { CircularProgress } from "@mui/material";
import MDSnackbar from "../../../../components/MDSnackbar";
import { apiUrl } from '../../../../constants/constants';

export default function CreateBenefit({ setId, createForm, setCreateForm, prevData, prevInfo }) {

    const [isSubmitted, setIsSubmitted] = useState(false);
    const [formState, setFormState] = useState({
        info: "" || prevInfo,
    });
    const [isLoading, setIsLoading] = useState(false)


    async function onNext(e, formState) {
        e.preventDefault()
        // setCreating(true)
        console.log("Reward Form State: ", formState)

        if (!formState?.info) {
            setTimeout(() => {  setIsSubmitted(false) }, 500)
            return openErrorSB("Missing Field", "Please fill all the mandatory fields")
        }

        const { info} = formState;

        const res = await fetch(`${apiUrl}pandit/additionalinfo/${prevData?._id}`, {
            method: "PATCH",
            credentials: "include",
            headers: {
                "content-type": "application/json",
                "Access-Control-Allow-Credentials": true
            },
            body: JSON.stringify({
                data:info, prevData: prevInfo
            })
        });

        const data = await res.json();
        console.log(data.error, data);
        if (!data.error) {
            // setNewObjectId(data.data?._id)
            setTimeout(() => {  setIsSubmitted(true) }, 500)
            openSuccessSB(data.message, `Contest Reward Created with prize: ${data.data?.prize}`)
            setCreateForm(!createForm);
            setFormState({});
            setId("")
            prevInfo = "";

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
                                Info Details
                            </MDTypography>
                        </MDBox>

                        <Grid container spacing={1} mt={0.5} alignItems="center" justifyContent={"space-between"}>

                            <Grid item xs={12} md={5} xl={9}>
                                <TextField
                                    disabled={((isSubmitted))}
                                    id="outlined-required"
                                    label='Info *'
                                    inputMode='text'
                                    fullWidth
                                    value={formState?.info}
                                    onChange={(e) => {
                                        setFormState(prevState => ({
                                            ...prevState,
                                            info: e.target.value
                                        }))
                                    }}
                                />
                            </Grid>

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

                        </Grid>
                        {renderSuccessSB}
                        {renderErrorSB}
                    </MDBox>
                )
            }
        </>
    )
}