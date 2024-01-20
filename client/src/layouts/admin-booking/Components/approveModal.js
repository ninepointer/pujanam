import React, { useEffect, useState, useContext } from 'react';
import Modal from '@mui/material/Modal';
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
    p: 4,
  };

  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [open, setOpen] = useState(false);
  const [pandits, setPandit] = useState([]);
  const [formstate, setFormState] = useState({
    booking_date: '' || data?.booking_date,
    pandits: {
      _id: "" || data?.pandits?._id,
      pandit_name: "" || data?.pandits?.pandit_name
    },
  });
  const lat = data?.address_details?.location?.coordinates[0];
  const long = data?.address_details?.location?.coordinates[1];

  const handleClose = () => {
    setOpen(false);
  }

  useEffect(() => {
    axios.get(`${apiUrl}pandit/nearest?lat=${lat}&long=${long}`, {withCredentials: true})
      .then((res) => {
        setPandit(res?.data?.data);
      }).catch((err) => {
        return new Error(err)
      })
  }, [])

  const [successSB, setSuccessSB] = useState(false);
  const openSuccessSB = (title, content) => {
    console.log('status success')
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
    const {booking_date, pandits} = formstate
    if (!booking_date || !pandits) {
      return openErrorSB('error', 'Please fill the required fields');
    }

    const formData = {
      booking_date, pandits: pandits?._id
    }
    const res = await axios.patch(`${apiUrl}booking/confirm/${data?._id}`, formData, { withCredentials: true });
    console.log(res.data);
    if (res.data.status == 'success') {
      openSuccessSB('Success', 'Withdrawal approved.');
      setAction(!action);
      handleClose();
    } else {
      openErrorSB('Error', res.data.message)
    }
  }

  const handlePanditChange = (event) => {
    const {
      target: { value },
    } = event;
    let data = pandits?.filter((elem) => {
      return elem.pandit_name === value;
    })
    setFormState(prevState => ({
      ...prevState,
      pandits: {
        ...prevState.pandits,
        _id: data[0]?._id,
        pandit_name: data[0]?.pandit_name
      }
    }));
  };
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
          <MDTypography>Enter confirmation details</MDTypography>
          <MDBox mt={1} >
            <MDTypography style={{ fontSize: '14px' }}>Confirm booking for {data?.full_name}</MDTypography>

            <Grid item xs={12} md={12} xl={12} mt={1}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DemoContainer components={['MobileDateTimePicker']}>
                  <DemoItem>
                    <MobileDateTimePicker
                      label="Booking Date"
                      value={dayjs(formstate?.booking_date) || dayjs(data?.booking_date)}
                      onChange={(newValue) => {
                        if (newValue && newValue.isValid()) {
                          setFormState(prevState => ({ ...prevState, booking_date: newValue }))
                        }
                      }}
                      // minDateTime={null}
                      minDateTime={dayjs().startOf('day')}
                      // format="HH:mm"
                      // ampm={true}
                      // openTo="hours"
                      sx={{ width: '100%' }}
                    />
                  </DemoItem>
                </DemoContainer>
              </LocalizationProvider>
            </Grid>

            <Grid item xs={12} md={12} xl={12}  mt={1}>
              <FormControl sx={{ width: '100%' }}>
                <InputLabel id="demo-multiple-name-label">Pandit</InputLabel>
                <Select
                  labelId="demo-multiple-name-label"
                  id="demo-multiple-name"
                  name='pandit'
                  value={formstate?.pandits?.pandit_name || data?.pandits?.pandit_name}
                  onChange={handlePanditChange}
                  input={<OutlinedInput label="Pandit" />}
                  sx={{ minHeight: 45 }}
                  MenuProps={MenuProps}
                >
                  {pandits?.map((pandit) => (
                    <MenuItem
                      key={pandit?.pandit_name}
                      value={pandit?.pandit_name}
                    >
                      {pandit.pandit_name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
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