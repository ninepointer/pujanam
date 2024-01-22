import React, { useEffect, useState, useContext } from 'react';
import Modal from '@mui/material/Modal';
import { Box, TextField } from '@mui/material';
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
import MDSnackbar from '../../../components/MDSnackbar';
import dayjs from 'dayjs';
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { MobileDateTimePicker } from '@mui/x-date-pickers/MobileDateTimePicker';

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
const ApproveModal = ({ data, action, setAction }) => {
  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    bgcolor: 'background.paper',
    borderRadius: 2,
    boxShadow: 24,
    // paddingLeft: 4,
    // paddingRight: 4,
    p: "10px 15px 10px 15px"
  };

  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [open, setOpen] = useState(false);
  const [formstate, setFormState] = useState({
    expected_deliver_time: '' || data?.expected_deliver_time,
  });

  const handleClose = () => {
    setOpen(false);
  }

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

  const handleSubmit = async () => {
    const {expected_deliver_time} = formstate
    if (!expected_deliver_time ) {
      return openErrorSB('error', 'Please fill the required fields');
    }

    const formData = {
      expected_deliver_time
    }
    const res = await axios.patch(`${apiUrl}order/dispatch/${data?._id}`, formData, { withCredentials: true });
    console.log(res.data);
    if (res.data.status == 'success') {
      openSuccessSB('Success', 'Withdrawal approved.');
      setAction(!action);
      handleClose();
    } else {
      openErrorSB('Error', res.data.message)
    }
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
          <MDTypography>Enter Dispatch details</MDTypography>
          <MDBox mt={1} >

          <Grid item xs={12} md={12} xl={12} mt={1}>
              <TextField label='Expected Deliver Time(Minutes)'
                value={formstate.expected_deliver_time}
                name='expected_deliver_time'
                onChange={(e) => setFormState(prev => ({ ...prev, expected_deliver_time: e.target.value }))}
                sx={{ marginBottom: '12px' ,width: '100%' }}
                // outerWidth='40%' 
                />
            </Grid>

            <Grid item xs={12} md={12} xl={12} mt={3} display={'flex'} justifyContent={'flex-end'}>
              <MDButton onClick={() => { handleClose() }}>Cancel</MDButton>
              <MDButton color='success' onClick={() => { handleSubmit() }}>Confirm</MDButton>
            </Grid>

          </MDBox>
        </Box>
      </Modal>
      {renderSuccessSB}
      {renderErrorSB}
    </>
  )
}

export default ApproveModal