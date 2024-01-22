import React, {useState, useEffect} from 'react'
import MDBox from '../../../components/MDBox';
import MDTypography from '../../../components/MDTypography';
import { apiUrl } from '../../../constants/constants';
import axios from 'axios';
import Card from './Card';

const Rejected = () => {
  const [rejected, setRejected] = useState([]); 
  const [action, setAction] = useState(false); 
  const getRejected = async() =>{
    const res = await axios.get(`${ apiUrl}order/reject`, {withCredentials: true});
    console.log(res.data.data)
    setRejected((prev)=>res.data.data);
  }
  useEffect(()=>{
    getRejected()
  },[action])  
  return (
   <MDBox sx={{minHeight:'60vh'}}>
    {rejected.length>0?
        rejected.map((doc)=><Card key={doc._id} 
            data={doc} action={action} setAction={setAction}
        />):<MDBox sx={{display:'flex', justifyContent:'center', alignItems:'center', height:'60vh'}}>
        <MDTypography>
            No Rejected Bookings
            </MDTypography> 
    </MDBox>
    }
   </MDBox>
  )
}

export default Rejected