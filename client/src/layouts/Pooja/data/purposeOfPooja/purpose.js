import { useState, useEffect } from 'react';
// import axios from "axios";
// import Box from '@mui/material/Box';
import DataTable from "../../../../examples/Tables/DataTable";
import MDButton from "../../../../components/MDButton"
import MDBox from "../../../../components/MDBox"
import MDTypography from "../../../../components/MDTypography"
// import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import { AiOutlineEdit } from 'react-icons/ai';
// import { CircularProgress } from "@mui/material";
// import TabContext from '@material-ui/lab/TabContext';


// import battleRewardData from "../data/battleRewardData";
// import createForm from "./createReward"
import CreatePurpose from './createPurpose';

const Purpose = ({ prevData }) => {

    // const [reRender, setReRender] = useState(true);
    let columns = [
        { Header: "Edit", accessor: "edit", align: "center" },
        { Header: "Purpose", accessor: "purpose", align: "center" },
    ];

    let rows = [];
    const [createForm, setCreateForm] = useState(false);
    // const [additionalInfo, setAdditionalInfo] = useState([]);
    // const { columns, rows } = battleRewardData();
    const [id, setId] = useState();

    // let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5000/"

    // useEffect(() => {

    //     axios.get(`${baseUrl}api/v1/dailycontest/${contest}/rewards`)
    //         .then((res) => {
    //             setAdditionalInfo(res.data.data);
    //             // console.log(res.data.data);
    //         }).catch((err) => {
    //             return new Error(err);
    //         })
    // }, [createForm])

    prevData?.purpose_of_pooja?.map((elem) => {
        let infoData = {}

        infoData.edit = (
            // <MDButton variant="text" color="info" size="small" sx={{fontSize:10}} fontWeight="medium">
            <AiOutlineEdit onClick={() => { setCreateForm(true); setId(elem) }} />
            // </MDButton>
        );
        infoData.info = (
            <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
                {elem}
            </MDTypography>
        );

        rows.push(infoData)
    })

    return (

        <Card>
            <MDBox display="flex" justifyContent="space-between" alignItems="left">
                <MDBox width="100%" display="flex" justifyContent="space-between" alignItems="center" sx={{ backgroundColor: "lightgrey", borderRadius: "2px" }} p={1}>
                    <MDTypography variant="text" fontSize={12} color="black" mt={0.7} alignItems="center" gutterBottom>
                        Purpose Of Pooja
                    </MDTypography>
                    <MDButton hidden={true} variant="outlined" size="small" color="black" onClick={() => setCreateForm(true)}>
                        Create Purpose
                    </MDButton>
                </MDBox>
            </MDBox>
            {createForm && <>
                <CreatePurpose createForm={createForm} setCreateForm={setCreateForm} prevData={prevData} info={id}  />
            </>
            }
            <MDBox mt={1}>
                <DataTable
                    table={{ columns, rows }}
                    isSorted={false}
                    entriesPerPage={false}
                    showTotalEntries={false}
                    noEndBorder
                />
            </MDBox>
        </Card>
    );
}

export default Purpose;