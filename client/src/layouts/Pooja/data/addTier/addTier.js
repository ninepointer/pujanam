import { useState, useEffect } from 'react';
import axios from "axios";
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
import { apiUrl } from '../../../../constants/constants';
import DeleteIcon from '@mui/icons-material/Delete';
// import battleRewardData from "../data/battleRewardData";
// import createForm from "./createReward"
import CreateTier from './createTier';

const AddTier = ({ prevData, tier }) => {
    const [data, setData] = useState(prevData);
    let columns = [
        { Header: "Delete", accessor: "delete", align: "center" },
        { Header: "Edit", accessor: "edit", align: "center" },
        { Header: "Tier", accessor: "tier", align: "center" },
        { Header: "Price", accessor: "price", align: "center" },
    ];

    let rows = [];
    const [createForm, setCreateForm] = useState(false);
    // const [update, setUpdate] = useState()
    const [id, setId] = useState();

    useEffect(() => {
        axios.get(`${apiUrl}pooja/${prevData?._id}`, {withCredentials: true})
            .then((res) => {
                setData(res.data.data);
            }).catch((err) => {
                return new Error(err);
            })
    }, [createForm])


    async function deleteTier(id){
        const res = await fetch(`${apiUrl}pooja/deletetier/${data?._id}`, {
            method: "DELETE",
            credentials: "include",
            headers: {
                "content-type": "application/json",
                "Access-Control-Allow-Credentials": true
            },
            body: JSON.stringify({
                docId: id
            })
        });

        const docData = await res.json();
        console.log(docData.error, docData);
        if (!docData.error) {
            setData(docData?.data)
            // setCreateForm(!createForm)
        }
    }

    data?.pooja_packages?.map((elem) => {
        let infoData = {}

        infoData.edit = (
            <AiOutlineEdit cursor="pointer" onClick={() => { setCreateForm(true); setId(elem) }} />
        );
        infoData.delete = (
            <DeleteIcon cursor="pointer" onClick={() => { deleteTier(elem?._id) }} />
        );
        infoData.tier = (
            <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
                {elem?.tier?.tier_name}
            </MDTypography>
        );
        infoData.price = (
            <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
                {elem?.price}
            </MDTypography>
        );

        rows.push(infoData)
    })

    return (

        <Card>
            <MDBox display="flex" justifyContent="space-between" alignItems="left">
                <MDBox width="100%" display="flex" justifyContent="space-between" alignItems="center" sx={{ backgroundColor: "lightgrey", borderRadius: "2px" }} p={1}>
                    <MDTypography variant="text" fontSize={12} color="black" mt={0.7} alignItems="center" gutterBottom>
                        Tier
                    </MDTypography>
                    <MDButton hidden={true} variant="outlined" size="small" color="black" onClick={() => setCreateForm(true)}>
                        Create Tier
                    </MDButton>
                </MDBox>
            </MDBox>
            {createForm && <>
                <CreateTier createForm={createForm} setCreateForm={setCreateForm} prevData={prevData} prevTier={id} tier={tier} setId={setId}/>
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

export default AddTier;