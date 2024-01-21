import React, { useState } from 'react'
import MDBox from '../../../components/MDBox'
import MDButton from '../../../components/MDButton'
import MDTypography from '../../../components/MDTypography';
import axios from 'axios';
import { apiUrl } from '../../../constants/constants';
import ApproveModal from './approveModal';
import RejectModal from './rejectModal';
import MDSnackbar from '../../../components/MDSnackbar';
import moment from 'moment';
import ConfirmModel from "./completeModel"

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


  const approve = async () => {
    try {
      const res = await axios.patch(`${apiUrl}booking/approve/${data?._id}`, {},
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

  return (
    <>
      <MDBox style={{ display: 'flex', justifyContent: 'space-between', flexDirection: 'column', marginBottom: '12px', padding: '12px', borderRadius: '16px', boxShadow: "0px 4px 6px -2px rgba(0, 0, 0, 0.5)" }}>
        <MDBox sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <MDBox>
            <MDTypography style={{ fontSize: '14px', marginBottom: '12px' }} >Booking For: {`${data?.full_name}`}</MDTypography>
            <MDTypography style={{ fontSize: '14px', marginBottom: '12px' }} >Booking By: {`${data?.user_id?.full_name}`}</MDTypography>
            <MDTypography style={{ fontSize: '14px', marginBottom: '12px' }} >Booking Date: {data?.booking_date ? moment.utc(data?.booking_date).utcOffset('+05:30').format('DD-MMM-YYYY') : "N/A"}</MDTypography>
            <MDTypography style={{ fontSize: '14px', marginBottom: '12px' }} >Booking For Phone: {data?.mobile}</MDTypography>
            <MDTypography style={{ fontSize: '14px', marginBottom: '12px' }} >Booking By Phone: {data?.user_id?.mobile}</MDTypography>
            <MDTypography style={{ fontSize: '14px', marginBottom: '12px' }} >Booking Amount: {data?.booking_amount}</MDTypography>
          </MDBox>

          <MDBox>
            <MDTypography style={{ fontSize: '14px', marginBottom: '12px' }} >Product: {`${data?.product_id?.product_name}`}</MDTypography>
            <MDTypography style={{ fontSize: '14px', marginBottom: '12px' }}>Pandit Name: {data?.pandits?.pandit_name || 'N/A'}</MDTypography>
            <MDTypography style={{ fontSize: '14px', marginBottom: '12px' }}>Pandit Mobile: {data?.pandits?.mobile || 'N/A'}</MDTypography>
            <MDTypography style={{ fontSize: '14px', marginBottom: '12px' }}>Package:{data?.tier?.tier_name}</MDTypography>
            <MDTypography style={{ fontSize: '14px', marginBottom: '12px' }}>Address:{data?.address_details?.address || 'N/A'}</MDTypography>
            <MDTypography style={{ fontSize: '14px', marginBottom: '12px' }}>City:{data?.address_details?.city || 'N/A'}</MDTypography>

          </MDBox>

          <MDBox>
            <MDTypography style={{ fontSize: '14px', marginBottom: '12px' }}>State:{data?.address_details?.state  || 'N/A'}</MDTypography>
            <MDTypography style={{ fontSize: '14px', marginBottom: '12px' }}>Pincode:{data?.address_details?.pincode  || 'N/A'}</MDTypography>
            <MDTypography style={{ fontSize: '14px', marginBottom: '12px' }}>Booking Status:{data?.status}</MDTypography>
            <MDTypography style={{ fontSize: '14px', marginBottom: '12px' }}>Payment Status:{data?.payment_details?.payment_status  || 'N/A'}</MDTypography>
            <MDTypography style={{ fontSize: '14px', marginBottom: '12px' }} >Transaction Date: {data?.transaction_date ? moment.utc(data?.transaction_date).utcOffset('+05:30').format('DD-MMM-YYYY') : "N/A"}</MDTypography>
            <MDTypography style={{ fontSize: '14px', marginBottom: '12px' }} >Reject Status: {data?.reject_message || "N/A"}</MDTypography>
          </MDBox>
        </MDBox>

        {(data?.status == 'Pending') && <MDBox>
          <MDButton onClick={approve} color='success' sx={{ marginRight: '6px' }}>Approve</MDButton>
          <MDButton onClick={() => { setOpenReject(true) }} sx={{ marginRight: '6px' }} color='error'>Reject</MDButton>
        </MDBox>}
        {data?.status == 'Approved' && <MDBox>
          <ApproveModal data={data} action={action} setAction={setAction} />
        </MDBox>}

        {data?.status == 'Confirmed' && <MDBox>
          <ConfirmModel data={data} action={action} setAction={setAction} />
        </MDBox>}
        {openReject && <RejectModal open={openReject} handleClose={handleCloseReject} data={data} action={action} setAction={setAction} />}
        {renderSuccessSB}
        {renderErrorSB}
      </MDBox>


    </>
  )
}

export default Card;