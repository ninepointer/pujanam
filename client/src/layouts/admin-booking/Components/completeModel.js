import React, { useEffect, useState, useContext } from 'react';
import Modal from '@mui/material/Modal';
import { Checkbox, TextField } from '@mui/material';
import {Box} from '@mui/material';
import axios from 'axios';
import { apiUrl } from '../../../constants/constants';
import MDTypography from '../../../components/MDTypography';
// import {Grid} from '@mui/material';
// import {Select} from '@mui/material';
// import {FormControl} from '@mui/material';
// import {InputLabel} from '@mui/material';
// import {OutlinedInput} from '@mui/material';
import {MenuItem} from '@mui/material';
import MDButton from '../../../components/MDButton';
import MDBox from '../../../components/MDBox';
import DataTable from '../../../examples/Tables/DataTable';
import MDSnackbar from '../../../components/MDSnackbar';
import { userContext } from "../../../AuthContext";


const ApproveModal = ( {open, handleClose, user, withdrawalRequestDate, amount, withdrawalId, action, setAction}) => {
    const style = {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      // width: 400,
      bgcolor: 'background.paper',
      height: '80vh',
    //   border: '2px solid #000',
      borderRadius:2,
      boxShadow: 24,
      p: 4,
    };
    
    const getDetails = useContext(userContext);
    const [title,setTitle] = useState('')
    const [content,setContent] = useState('')
    const [settlementAccount,setSettlementAccount] = useState('');
    const [transactionId,setTransactionId] = useState('');
    const [recipientReference,setRecipientReference] = useState('');
    const [transactionDocument, setTransactionDocument]=useState('');
    const [formstate, setFormState] = useState({});
    const [successSB, setSuccessSB] = useState(false);
    const openSuccessSB = (title,content) => {
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
        const openErrorSB = (title,content) => {
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

    const handleSubmit = async() =>{
        if(!settlementMethod || !settlementAccount || !recipientReference || !transactionId|| !transactionDocument){
            return openErrorSB('error', 'Please fill the required fields');
        }
        const formData = new FormData();
        formData.append('settlementMethod', settlementMethod)
        formData.append('settlementAccount', settlementAccount)
        formData.append('recipientReference', recipientReference)
        formData.append('transactionId', transactionId)
        formData.append('transactionDocument', transactionDocument)
        const res = await axios.patch(`${apiUrl}withdrawals/approve/${withdrawalId}`, formData, {withCredentials:true});
        console.log(res.data);
        if(res.data.status == 'success'){
            openSuccessSB('Success', 'Withdrawal approved.');
            setAction(!action);
            handleClose();
        } else{
          openErrorSB('Error', res.data.message)
        }
    }
    const [settlementMethod, setSettlementMethod] = useState('');

    const handleChange = (event) => {
        setSettlementMethod(event.target.value);
    };        
    return (
      <>
     <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
     >
      <Box sx={style}>
        <MDTypography>Enter Transaction details</MDTypography>
        <MDBox mt={1} style={{height:'85vh', display:'flex', flexDirection:'column'}}>
          <MDTypography style={{fontSize:'14px', marginBottom:'12px'}}>Withdrawal request for {amount} by {user.first_name} {user.last_name}</MDTypography>  
          <MDTypography style={{fontSize:'14px', marginBottom:'24px'}}>Withdrawal request on: {withdrawalRequestDate}</MDTypography>  
          {/* <InputLabel id="demo-simple-select-filled-label">Payment Method</InputLabel> */}

          {/* external_transaction_id */}
          {/* payment_throw */}
          {/* payment_mode */}
          {/* payment_status */}
          booking_status
          transaction_date
            <TextField
                label='Payment Mode'
                hiddenLabel
                select
                value={formstate.payment_mode}
                onChange={handleChange}
                outerWidth='40%'
                sx={{marginBottom:'12px'}}
            >
                <MenuItem value="PAP">Pay After Pooja</MenuItem>
                <MenuItem value="Online">Online</MenuItem>
            </TextField>

            <TextField
                label='Payment Throw'
                hiddenLabel
                select
                value={formstate.payment_throw}
                onChange={handleChange}
                outerWidth='40%'
                sx={{marginBottom:'12px'}}
            >
                <MenuItem value="Cash">Cash</MenuItem>
                <MenuItem value="Internal Gateway">Internal Gateway</MenuItem>
                <MenuItem value="External App">External App</MenuItem>
            </TextField>

            <TextField
                label='Payment Status'
                hiddenLabel
                select
                value={formstate.payment_status}
                onChange={handleChange}
                outerWidth='40%'
                sx={{marginBottom:'12px'}}
            >
                <MenuItem value="Paid">Paid</MenuItem>
                <MenuItem value="UnPaid">UnPaid</MenuItem>
            </TextField>

          <TextField label='External Transaction Id' value={formstate.payment_status} onChange={handleChange}  sx={{marginBottom:'12px'}} outerWidth='40%'/>

          <MDTypography style={{fontSize:'14px', marginBottom:'8px'}}>Transaction Document(image/pdf)</MDTypography>
          <TextField type='file' onChange={(e)=>{setTransactionDocument(e.target.files[0])}}/>
          <MDBox sx={{display:'flex', justifyContent:'flex-end', marginTop:'12px' }}>
            <MDButton onClick={()=>{handleClose()}}>Cancel</MDButton>
            <MDButton color='success' onClick={()=>{handleSubmit()}}>Confirm</MDButton>
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