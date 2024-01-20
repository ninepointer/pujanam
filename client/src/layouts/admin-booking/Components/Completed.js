import React, {useState, useEffect} from 'react'
import MDBox from '../../../components/MDBox';
import MDTypography from '../../../components/MDTypography';
import { apiUrl } from '../../../constants/constants';
import axios from 'axios';
import Card from './Card';

const Approved = () => {
  const [completed, setCompleted] = useState([]); 
  const [action, setAction] = useState(false); 
  const getCompleted = async() =>{
    const res = await axios.get(`${ apiUrl}booking/complete`, {withCredentials: true});
    console.log(res.data.data)
    setCompleted((prev)=>res.data.data);
  }
  useEffect(()=>{
    getCompleted()
  },[action])  
  return (
   <MDBox sx={{minHeight:'60vh'}}>
    {completed.length>0?
        completed.map((elem)=><Card key={elem._id} 
           data={elem}
        />):<MDBox sx={{display:'flex', justifyContent:'center', alignItems:'center', height:'60vh'}}>
        <MDTypography>
            No Completed Bookings
            </MDTypography> 
    </MDBox>
    }
   </MDBox>
  )
}

export default Approved