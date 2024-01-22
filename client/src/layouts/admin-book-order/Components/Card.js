import React, { useState } from 'react'
import MDBox from '../../../components/MDBox'
import MDButton from '../../../components/MDButton'
import MDTypography from '../../../components/MDTypography';
import axios from 'axios';
import { apiUrl } from '../../../constants/constants';
import ApproveModal from './acceptModal';
import RejectModal from './rejectModal';
import MDSnackbar from '../../../components/MDSnackbar';
import moment from 'moment';
import DispatchModel from "./dispatchModel"
// import { Divider } from '@mui/material';
import ItemTable from './itemTable'

const Card = ({ data, action, setAction }) => {
  const [openReject, setOpenReject] = useState(false);
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [successSB, setSuccessSB] = useState(false);
  const openSuccessSB = (title, content) => {
    setTitle(title)
    setContent(content)
    setSuccessSB(true);
  }
  const closeSuccessSB = () => setSuccessSB(false);

  const renderSuccessSB = (
    <MDSnackbar
      color="success"
      icon="check"
      title={title}
      content={content}
      open={successSB}
      onClose={closeSuccessSB}
      close={closeSuccessSB}
      bgWhite="info"
    />
  );

  const [errorSB, setErrorSB] = useState(false);
  const openErrorSB = (title, content) => {
    setTitle(title)
    setContent(content)
    setErrorSB(true);
  }
  const closeErrorSB = () => setErrorSB(false);

  const renderErrorSB = (
    <MDSnackbar
      color="error"
      icon="warning"
      title={title}
      content={content}
      open={errorSB}
      onClose={closeErrorSB}
      close={closeErrorSB}
      bgWhite
    />
  );

  const handleCloseReject = () => {
    setOpenReject(false);
  }


  const accept = async () => {
    try {
      const res = await axios.patch(`${apiUrl}order/accept/${data?._id}`, {},
        { withCredentials: true });
      if (res.data.status == 'success') {
        openSuccessSB('Success', res.data.message);
        setAction(!action);
      }
    } catch (e) {
      console.log(e);
      openErrorSB('Error', e.response.data.message);
    }
  }

  const headingColor = "#7B3F00";
  const address = `
  ${data?.address_details?.house_or_flat_no && (`House/Flat No. ${data?.address_details?.house_or_flat_no}, `)}
  ${data?.address_details?.floor && (`Floor - ${data?.address_details?.floor}, `)}
  ${data?.address_details?.locality && (`${data?.address_details?.locality}, `)}
  ${data?.address_details?.landmark && (`${data?.address_details?.landmark}, `)}
  ${data?.address_details?.city && (`${data?.address_details?.city}, `)}
  ${data?.address_details?.state && (`${data?.address_details?.state} (${data?.address_details?.pincode})`)}
  `

  return (
    <>
      <MDBox style={{ display: 'flex', justifyContent: 'space-between', flexDirection: 'column', marginBottom: '12px', padding: '12px', borderRadius: '16px', boxShadow: "0px 4px 6px -2px rgba(0, 0, 0, 0.5)" }}>
        <MDBox sx={{ display: 'flex', flexDirection: "column" }}>
          <MDBox sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <MDBox>
            <MDTypography style={{ fontSize: '14px', marginBottom: '12px' }} >Order Number: <span style={{fontWeight: 600}}>{`${data?.order_no}`}</span></MDTypography>
              <MDTypography style={{ fontSize: '14px', marginBottom: '12px' }} >Name: <span style={{fontWeight: 600}}>{`${data?.user_id?.full_name}`}</span></MDTypography>
              <MDTypography style={{ fontSize: '14px', marginBottom: '12px' }} >Mobile: <span style={{fontWeight: 600}}>{`${data?.user_id?.mobile}`}</span></MDTypography>
              {data?.status == 'Rejected' ?
              <MDTypography style={{ fontSize: '14px', marginBottom: '12px' }} >Rejection Reason: <span style={{fontWeight: 600}}>{data?.reject_message}</span></MDTypography>
              :
              <MDTypography style={{ fontSize: '14px', marginBottom: '12px' }} >Order Date: <span style={{fontWeight: 600}}>{moment.utc(data?.order_date).utcOffset('+05:30').format('DD-MMM-YYYY') || 'N/A'}</span></MDTypography>
              }
            </MDBox>

            <MDBox>
              {(data?.status == 'Pending') && <MDBox>
                <MDButton onClick={accept} color='success' sx={{ marginRight: '6px' }}>Accept</MDButton>
                <MDButton onClick={() => { setOpenReject(true) }} sx={{ marginRight: '6px' }} color='error'>Reject</MDButton>
              </MDBox>}

              {data?.status == 'Accepted' && <MDBox>
                <ApproveModal data={data} action={action} setAction={setAction} />
              </MDBox>}

              {data?.status == 'Dispatched' && <MDBox>
                <DispatchModel data={data} action={action} setAction={setAction} />
              </MDBox>}
              {openReject && <RejectModal open={openReject} handleClose={handleCloseReject} data={data} action={action} setAction={setAction} />}

            </MDBox>
          </MDBox>
          <MDTypography style={{ fontSize: '14px', marginBottom: '12px', fontWeight: 600, color: headingColor }} >Address Details</MDTypography>
          <MDBox sx={{ display: 'flex', justifyContent: 'center', flexDirection: "column" }}>
            <MDBox sx={{ display: 'flex', gap: 5 }}>
              <MDTypography style={{ fontSize: '14px', marginBottom: '12px' }} >Address: <span style={{fontWeight: 600}}>{`${address}`}</span></MDTypography>
              <MDTypography style={{ fontSize: '14px', marginBottom: '12px' }} >Mobile: <span style={{fontWeight: 600}}>{`${data?.mobile}`}</span></MDTypography>
            </MDBox>
          </MDBox>

          <MDTypography style={{ fontSize: '14px', marginBottom: '12px', fontWeight: 600, color: headingColor }} >Item Details</MDTypography>
          <MDBox sx={{ display: 'flex', justifyContent: 'center', flexDirection: "column" }}>
            <ItemTable items={data.item_details} />
          </MDBox>

          <MDTypography style={{ fontSize: '14px', margin: '10px 0px 12px 0px', fontWeight: 600, color: headingColor }} >Payment Details</MDTypography>
          <MDBox sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <MDTypography style={{ fontSize: '14px', marginBottom: '12px' }} >TxnId: <span style={{ fontWeight: 600 }}>{`${data?.payment_details?.transaction_id}`}</span></MDTypography>
            <MDTypography style={{ fontSize: '14px', marginBottom: '12px' }} >Mode: <span style={{ fontWeight: 600 }}>{`${data?.payment_details?.payment_status}`}</span></MDTypography>
            <MDTypography style={{ fontSize: '14px', marginBottom: '12px' }} >Status: <span style={{ fontWeight: 600 }}>{`${data?.payment_details?.payment_mode}`}</span></MDTypography>
            
          </MDBox>
        </MDBox>


        {renderSuccessSB}
        {renderErrorSB}
      </MDBox>


    </>
  )
}

export default Card;