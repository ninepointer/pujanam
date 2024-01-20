import React, { useState, useEffect } from 'react'
import MDBox from '../../../components/MDBox';
import MDTypography from '../../../components/MDTypography';
import { apiUrl } from '../../../constants/constants';
import axios from 'axios';
import Card from './Card';

const Confirmed = () => {
  const [confirmed, setConfirmed] = useState([]);
  const [action, setAction] = useState(false);
  const getConfirmed = async () => {
    const res = await axios.get(`${apiUrl}booking/confirm`, { withCredentials: true });
    console.log(res.data.data)
    setConfirmed((prev) => res.data.data);
  }
  useEffect(() => {
    getConfirmed()
  }, [action])
  return (
    <MDBox sx={{ minHeight: '60vh' }}>
      {confirmed.length > 0 ?
        confirmed.map((elem) => <Card key={elem._id}
          data={elem}
          setAction={setAction}
          action={action}
        />) : <MDBox sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
          <MDTypography>
            No Confirmed Bookings
          </MDTypography>
        </MDBox>
      }
    </MDBox>
  )
}

export default Confirmed