import React, {useState, useEffect} from 'react'
import MDBox from '../../../components/MDBox';
import MDTypography from '../../../components/MDTypography';
import { apiUrl } from '../../../constants/constants';
import axios from 'axios';
import Card from './Card';

const Approved = () => {
  const [approved, setApproved] = useState([]); 
  const [action, setAction] = useState(false); 
  const getApproved = async() =>{
    const res = await axios.get(`${ apiUrl}consultation/approve`, {withCredentials: true});
    console.log(res.data.data)
    setApproved((prev)=>res.data.data);
  }
  useEffect(()=>{
    getApproved()
  },[action])  
  return (
   <MDBox sx={{minHeight:'60vh'}}>
    {approved.length>0?
        approved.map((elem)=>
        <Card key={elem._id} 
           data={elem}
           setAction={setAction}
           action={action}
        />):
        <MDBox sx={{display:'flex', justifyContent:'center', alignItems:'center', height:'60vh'}}>
          <MDTypography>
            No Approved Consultations
          </MDTypography> 
        </MDBox>
    }
   </MDBox>
  )
}

export default Approved