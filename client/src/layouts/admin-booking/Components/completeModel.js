import React, { useEffect, useState, useContext } from 'react';
import Modal from '@mui/material/Modal';
import { Checkbox, TextField } from '@mui/material';
import { Box } from '@mui/material';
import axios from 'axios';
import { apiUrl } from '../../../constants/constants';
import MDTypography from '../../../components/MDTypography';
import { Grid } from '@mui/material';
import { Select } from '@mui/material';
import { FormControl } from '@mui/material';
import { InputLabel } from '@mui/material';
import { OutlinedInput } from '@mui/material';
import { MenuItem } from '@mui/material';
import MDButton from '../../../components/MDButton';
import MDBox from '../../../components/MDBox';
import DataTable from '../../../examples/Tables/DataTable';
import MDSnackbar from '../../../components/MDSnackbar';
import { userContext } from "../../../AuthContext";

const ITEM_HEIGHT = 30;
const ITEM_PADDING_TOP = 10;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};
const ApproveModal = ({ data, withdrawalRequestDate, amount, withdrawalId, action, setAction }) => {
  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    // width: 400,
    bgcolor: 'background.paper',
    height: '80vh',
    //   border: '2px solid #000',
    borderRadius: 2,
    boxShadow: 24,
    p: 4,
  };
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [transactionDocument, setTransactionDocument] = useState('');
  const [formstate, setFormState] = useState({});
  const [successSB, setSuccessSB] = useState(false);
  const openSuccessSB = (title, content) => {
    setTitle(title)
    setContent(content)
    setSuccessSB(true);
  }
  const handleClose = () => {
    setOpen(false);
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

  const handleSubmit = async () => {
    const { payment_mode, payment_throw, payment_status, external_transaction_id } = formstate;

    if (!payment_mode || !payment_throw || !payment_status || !external_transaction_id) {
      return openErrorSB('error', 'Please fill the required fields');
    }
    const formData = new FormData();

    for (let elem in formstate) {
      formData.append(`${elem}`, formstate[elem])
    }
    formData.append('transactionDocument', transactionDocument)
    formData.append('paymentId', data.payment_details?._id)

    const res = await axios.patch(`${apiUrl}booking/complete/${data?._id}`, formData, { withCredentials: true });
    console.log(res.data);
    if (res.data.status == 'success') {
      openSuccessSB('Success', 'Booking Completed.');
      setAction(!action);
      handleClose();
    } else {
      openErrorSB('Error', res.data.message)
    }
  }

  const handleChange = async (e) => {
    setFormState(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  }


  return (
    <>
      <MDButton onClick={() => { setOpen(true) }} color='success' sx={{ marginRight: '6px' }}>Confirm</MDButton>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <MDTypography>Enter Transaction details</MDTypography>
          <MDBox mt={1} >
            <MDTypography style={{ fontSize: '14px', marginBottom: '12px' }}>Booking compliting for {data.full_name}</MDTypography>

            <Grid item xs={12} md={12} xl={12} mt={1}>
              <FormControl sx={{ width: '100%' }}>
                <InputLabel id="demo-multiple-name-label">Payment Mode</InputLabel>
                <Select
                  labelId="demo-multiple-name-label"
                  id="demo-multiple-name"
                  name='payment_mode'
                  value={formstate.payment_mode}
                  onChange={handleChange}
                  input={<OutlinedInput label="Payment Mode" />}
                  sx={{ minHeight: 45 }}
                  MenuProps={MenuProps}
                >
                  <MenuItem value="PAP">Pay After Pooja</MenuItem>
                  <MenuItem value="Online">Online</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={12} xl={12} mt={1}>
              <FormControl sx={{ width: '100%' }}>
                <InputLabel id="demo-multiple-name-label">Payment Throw</InputLabel>
                <Select
                  labelId="demo-multiple-name-label"
                  id="demo-multiple-name"
                  name='payment_throw'
                  value={formstate.payment_throw}
                  onChange={handleChange}
                  input={<OutlinedInput label="Payment Throw" />}
                  sx={{ minHeight: 45 }}
                  MenuProps={MenuProps}
                >
                  <MenuItem value="Cash">Cash</MenuItem>
                  <MenuItem value="Internal Gateway">Internal Gateway</MenuItem>
                  <MenuItem value="External App">External App</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={12} xl={12} mt={1}>
              <FormControl sx={{ width: '100%' }}>
                <InputLabel id="demo-multiple-name-label">Payment Status</InputLabel>
                <Select
                  labelId="demo-multiple-name-label"
                  id="demo-multiple-name"
                  name='payment_status'
                  value={formstate.payment_status}
                  onChange={handleChange}
                  input={<OutlinedInput label="Payment Status" />}
                  sx={{ minHeight: 45 }}
                  MenuProps={MenuProps}
                >
                  <MenuItem value="Paid">Paid</MenuItem>
                  <MenuItem value="UnPaid">UnPaid</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={12} xl={12} mt={1}>
              <TextField label='External Transaction Id'
                value={formstate.external_transaction_id}
                name='external_transaction_id'
                onChange={handleChange}
                sx={{ marginBottom: '12px' ,width: '100%' }}
                // outerWidth='40%' 
                />
            </Grid>


            <MDTypography style={{ fontSize: '14px', marginBottom: '8px' }}>Transaction Document(image/pdf)</MDTypography>
            <TextField type='file' onChange={(e) => { setTransactionDocument(e.target.files[0]) }} />
            <MDBox sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: '12px' }}>
              <MDButton onClick={() => { handleClose() }}>Cancel</MDButton>
              <MDButton color='success' onClick={() => { handleSubmit() }}>Confirm</MDButton>
            </MDBox>
          </MDBox>
        </Box>
      </Modal>
      {renderSuccessSB}
      {renderErrorSB}
    </>
  )
}

export default ApproveModal