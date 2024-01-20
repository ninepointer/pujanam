import React, {useState, useEffect} from 'react'
import MDBox from '../../../components/MDBox';
import MDTypography from '../../../components/MDTypography';
import { apiUrl } from '../../../constants/constants';
import axios from 'axios';
import Card from './Card';

const Pending = () => {
  const [pending, setPending] = useState([]); 
  const [action, setAction] = useState(false); 
  const getPendingData = async() =>{
    const res = await axios.get(`${ apiUrl}booking/pending`, {withCredentials: true});
    console.log(res.data.data)
    setPending((prev)=>res.data.data);
  }
  useEffect(()=>{
    getPendingData()
  },[action])  
  return (
   <MDBox sx={{minHeight:'60vh'}}>
    {pending.length>0?
        pending.map((doc)=><Card key={doc._id} 
            data={doc}  action={action} setAction={setAction}
        />):<MDBox sx={{display:'flex', justifyContent:'center', alignItems:'center', height:'60vh'}}>
        <MDTypography>
            No Pending Bookings
            </MDTypography> 
    </MDBox>
    }
   </MDBox>
  )
}

export default Pending