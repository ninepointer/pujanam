import React, { useState, useEffect } from 'react'
import MDBox from '../../../components/MDBox';
import MDTypography from '../../../components/MDTypography';
import { apiUrl } from '../../../constants/constants';
import axios from 'axios';
import Card from './Card';
import MDButton from '../../../components/MDButton';
import { CircularProgress } from '@mui/material';

const Pending = () => {
  const [skip, setSkip] = useState(0);
  const limitSetting = 10;
  const [count, setCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const [pending, setPending] = useState([]);
  const [action, setAction] = useState(false);
  const getPendingData = async () => {
    const res = await axios.get(`${apiUrl}booking/pending?skip=${skip}&limit=${limitSetting}`, { withCredentials: true });
    console.log(res.data.data)
    setPending((prev) => res.data.data);
    setCount(res.data.count)
    setTimeout(() => {
      setIsLoading(false)
    }, 100)
  }
  useEffect(() => {
    getPendingData()
  }, [action])

  async function backHandler() {
    if (skip <= 0) {
      return;
    }
    setSkip(prev => prev - limitSetting);
    setPending([]);
    setIsLoading(true)

    await getPendingData();

  }

  async function nextHandler() {
    if (skip + limitSetting >= count) {
      return;
    }
    setSkip(prev => prev + limitSetting);
    setPending([]);

    await getPendingData();

  }

  return (
    <MDBox sx={{ minHeight: '60vh' }}>
      {
      !isLoading ?
      pending.length > 0 ?
        pending.map((doc) => <Card key={doc._id}
          data={doc} action={action} setAction={setAction}
        />) : <MDBox sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
          <MDTypography>
            No Pending Bookings
          </MDTypography>
        </MDBox>
        :
        <MDBox sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <CircularProgress color='dark' sx={{alignContent: 'center', alignItems: 'center'}}/>
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

export default Pending