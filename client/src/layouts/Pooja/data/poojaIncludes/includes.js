import { useState, useEffect } from 'react';
import axios from "axios";
import DataTable from "../../../../examples/Tables/DataTable";
import MDButton from "../../../../components/MDButton"
import MDBox from "../../../../components/MDBox"
import MDTypography from "../../../../components/MDTypography"
import Card from "@mui/material/Card";
import { AiOutlineEdit } from 'react-icons/ai';
import { apiUrl } from '../../../../constants/constants';
import DeleteIcon from '@mui/icons-material/Delete';
import CreateIncludes from './createIncludes';

const Includes = ({ prevData }) => {
    const [data, setData] = useState(prevData);
    let columns = [
        { Header: "Delete", accessor: "delete", align: "center" },
        { Header: "Edit", accessor: "edit", align: "center" },
        { Header: "Include", accessor: "include", align: "center" },
    ];

    let rows = [];
    const [createForm, setCreateForm] = useState(false);
    const [id, setId] = useState();

    useEffect(() => {
        axios.get(`${apiUrl}pooja/${prevData?._id}`, {withCredentials: true})
            .then((res) => {
                setData(res.data.data);
            }).catch((err) => {
                return new Error(err);
            })
    }, [createForm])

    async function deleteBenefit(elem){
        const res = await fetch(`${apiUrl}pooja/deleteinclude/${data?._id}`, {
            method: "DELETE",
            credentials: "include",
            headers: {
                "content-type": "application/json",
                "Access-Control-Allow-Credentials": true
            },
            body: JSON.stringify({
                data: elem
            })
        });

        const docData = await res.json();
        console.log(docData.error, docData);
        if (!docData.error) {
            setData(docData?.data)
            // setCreateForm(!createForm)
        }
    }

    data?.includes?.map((elem) => {
        let infoData = {}

        infoData.edit = (
            <AiOutlineEdit cursor="pointer" onClick={() => { setCreateForm(true); setId(elem) }} />
        );
        infoData.delete = (
            <DeleteIcon cursor="pointer" onClick={() => { deleteBenefit(elem) }} />
        );
        infoData.include = (
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
                        Include Of Pooja
                    </MDTypography>
                    <MDButton hidden={true} variant="outlined" size="small" color="black" onClick={() => setCreateForm(true)}>
                        Create Include
                    </MDButton>
                </MDBox>
            </MDBox>
            {createForm && <>
                <CreateIncludes createForm={createForm} setCreateForm={setCreateForm} prevData={prevData} prevInfo={id} setId={setId}  />
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

export default Includes;


