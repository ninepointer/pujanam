import React, { useState, useEffect } from 'react'
import MDBox from '../../../components/MDBox';
import MDTypography from '../../../components/MDTypography';
import { apiUrl } from '../../../constants/constants';
import axios from 'axios';
import Card from './Card';
import MDButton from '../../../components/MDButton';
import { CircularProgress } from '@mui/material';

const Rejected = () => {
  const [skip, setSkip] = useState(0);
  const limitSetting = 10;
  const [count, setCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const [rejected, setRejected] = useState([]);
  const [action, setAction] = useState(false);
  const getRejected = async () => {
    const res = await axios.get(`${apiUrl}booking/reject?skip=${skip}&limit=${limitSetting}`, { withCredentials: true });
    console.log(res.data.data)
    setRejected((prev) => res.data.data);
    setCount(res.data.count)
    setTimeout(() => {
      setIsLoading(false)
    }, 100)
  }
  useEffect(() => {
    getRejected()
  }, [action])

  async function backHandler() {
    if (skip <= 0) {
      return;
    }
    setSkip(prev => prev - limitSetting);
    setRejected([]);
    setIsLoading(true)

    await getRejected();

  }

  async function nextHandler() {
    if (skip + limitSetting >= count) {
      return;
    }
    setSkip(prev => prev + limitSetting);
    setRejected([]);
    setIsLoading(true)
    await getRejected();

  }
  return (
    <MDBox sx={{ minHeight: '60vh' }}>
      {
        !isLoading ?
          rejected.length > 0 ?
            rejected.map((doc) => <Card key={doc._id}
              data={doc} action={action} setAction={setAction}
            />) : <MDBox sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
              <MDTypography>
                No Rejected Bookings
              </MDTypography>
            </MDBox>
          :
          <MDBox sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
            <CircularProgress color='dark' sx={{ alignContent: 'center', alignItems: 'center' }} />
          </MDBox>
      }

      {!isLoading && count !== 0 &&
        <MDBox mt={1} display="flex" justifyContent="space-between" alignItems='center' width='100%'>
          <MDButton variant='outlined' color='text' disabled={(skip + limitSetting) / limitSetting === 1 ? true : false} size="small" onClick={backHandler}>Back</MDButton>
          <MDTypography color="dark" fontSize={15} fontWeight='bold'>Total Bookings: {!count ? 0 : count} | Page {(skip + limitSetting) / limitSetting} of {!count ? 1 : Math.ceil(count / limitSetting)}</MDTypography>
          <MDButton variant='outlined' color='text' disabled={Math.ceil(count / limitSetting) === (skip + limitSetting) / limitSetting ? true : !count ? true : false} size="small" onClick={nextHandler}>Next</MDButton>
        </MDBox>
      }
    </MDBox>
  )
}

export default Rejected