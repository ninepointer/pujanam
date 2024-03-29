import React, { useContext } from 'react'
import { useState, useEffect } from 'react';
import ReactGA from "react-ga";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import OtpInput from 'react-otp-input';
import MDSnackbar from "../../../components/MDSnackbar";

// @mui material components
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import { InputAdornment, TextField } from '@mui/material';

// Material Dashboard 2 React components
import MDBox from "../../../components/MDBox";
import MDTypography from "../../../components/MDTypography";
import MDInput from "../../../components/MDInput";
// import MDIconButton from "../../../components/MDIn";
import MDButton from "../../../components/MDButton";


// Authentication layout components
import BasicLayout from "../components/BasicLayout";


// Images
import bgImage from "../../../assets/images/trading.jpg";
import bgImage1 from "../../../assets/images/bgBanner1.jpg";
import backgroundImage from "../../../layouts/HomePage/assets/images/section1/backgroud.jpg";
import { userContext } from '../../../AuthContext';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { adminRole } from '../../../variables';
import { userRole } from '../../../variables';
import { InfinityTraderRole,Affiliate } from '../../../variables';

function AdminLogin() {
  // console.log('Rendering sign in');
  // const [rememberMe, setRememberMe] = useState(false);
  const [userId, setEmail] = useState(false);
  const [pass, setPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  let [invalidDetail, setInvalidDetail] = useState();
  const [formType, setFormType] = useState('mobile');
  const[mobile, setMobile] = useState('');
  const[otpGen, setOtpGen] = useState(false);
  const [resendTimer, setResendTimer] = useState(30); // Resend timer in seconds
  const [timerActive, setTimerActive] = useState(false);
  const [mobileOtp, setMobileOtp]=useState('');
  const [messageObj, setMessageObj] = useState({
    color: '',
    icon: '',
    title: '',
    content: ''
  })

  const setDetails = useContext(userContext);
  // console.log(setDetails.userDetails);

  // const handleSetRememberMe = () => setRememberMe(!rememberMe);
  const handleEmailChange = (e) => setEmail(e.target.value);
  const handlePasswordChange = (e) => setPassword(e.target.value);

  function handleTogglePasswordVisibility() {
    setShowPassword(!showPassword);
  }

  useEffect(()=>{
    ReactGA.pageview(window.location.pathname)
  },[])

  let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5000/"

    const navigate = useNavigate();
    const location = useLocation();
    
    console.log("location", location)

    useEffect(() => {
      let countdownTimer = null;
        // If the timer is active, decrement the resendTimer every second
        if (timerActive && resendTimer > 0) {
          countdownTimer = setTimeout(() => {
            setResendTimer(prevTime => prevTime - 1);
          }, 1000);
        }
  
        // If the timer reaches 0, stop the countdown and set the timerActive flag to false
        if (resendTimer === 0) {
          clearTimeout(countdownTimer);
          setTimerActive(false);
        }
  
        // Cleanup function to clear the timeout when the component unmounts
        return () => {
          clearTimeout(countdownTimer);
        };
      }, [resendTimer, timerActive]);
  

    const userDetail = async ()=>{
      try{
          const res = await axios.get(`${baseUrl}api/v1/loginDetail`, {
              withCredentials: true,
              headers: {
                  Accept: "application/json",
                  "Content-Type": "application/json",
                  "Access-Control-Allow-Credentials": true
              },
          });
                   
          setDetails.setUserDetail(res.data);
          
          //console.log("this is data of particular user", res.data);
  
          if(!res.status === 200){
              throw new Error(res.error);
          }
          return res.data;
      } catch(err){
          //console.log("Fail to fetch data of user");
          //console.log(err);
      }
    }

    function handleKeyPress(event) {
      if (event.key === "Enter") {
        logInButton(event);
      }
    }

    async function logInButton(e){
        e.preventDefault();
        //console.log(userId, pass);
        
        const res = await fetch(`${baseUrl}api/v1/login`, {
            method: "POST",
            credentials:"include",
            headers: {
                "content-type" : "application/json",
                "Access-Control-Allow-Credentials": true
            },
            body: JSON.stringify({
                userId, pass
            })
        });
        
        const data = await res.json();
        //console.log(data);
        if(data.status === 422 || data.error || !data){
            // window.alert(data.error);
            if(data.error === "deactivated"){
              setInvalidDetail(data?.message)
            } else{
              setInvalidDetail(`Email or Password is incorrect`);
            }
        }else{

            // this function is extracting data of user who is logged in
            let userData = await userDetail();

            if(userData.role?.roleName === adminRole){
              const from = location.state?.from || "/contestdashboard";
              navigate(from);
            }
          
            
        }
    }

    async function phoneLogin(e){
      e.preventDefault();
      if(mobile.length<10){
        return setInvalidDetail(`Mobile number incorrect`);
      }
      const res = await fetch(`${baseUrl}api/v1/phonelogin`, {
        method: "POST",
        credentials:"include",
        headers: {
            "content-type" : "application/json",
            "Access-Control-Allow-Credentials": true
        },
        body: JSON.stringify({
            mobile
        })
    });
    const data = await res.json();
        //console.log(data);
        if(data.status === 422 || data.error || !data){
            // window.alert(data.error);
            if(data.error === "deactivated"){
              setInvalidDetail(data?.message)
            } else{
              setInvalidDetail(`Mobile number incorrect`);
            }

        }else{
          // console.log(res.status);
          if(res.status == 200 || res.status == 201){
              openSuccessSB("otp sent", data.message);
              setOtpGen(true);

            }
            else{
              openSuccessSB("error", data.message);
            }
        }

    }

    async function handleMobileChange(e){
      setMobile(e.target.value);
    }

    async function signUpButton(e){
      e.preventDefault();
      navigate("/signup");
    }

    async function forgotPasswordButton(e){
      e.preventDefault();
      navigate("/resetpassword");
    }

    async function otpConfirmation(e){
      e.preventDefault();
      if(mobile.length<10){
        return setInvalidDetail(`Mobile number incorrect`);
      }
      const res = await fetch(`${baseUrl}api/v1/verifyphonelogin`, {
        method: "POST",
        credentials:"include",
        headers: {
            "content-type" : "application/json",
            "Access-Control-Allow-Credentials": true
        },
        body: JSON.stringify({
            mobile, mobile_otp:mobileOtp
        })
    });
    const data = await res.json();
        //console.log(data);
        if(data.status === 422 || data.error || !data){
            // window.alert(data.error);
            setInvalidDetail(`OTP incorrect`);
        }else{
          let userData = await userDetail();
          // console.log(userData)
          if(userData?.role?.roleName === adminRole){
            const from = location.state?.from || "/contestdashboard";
            navigate(from);
          }
         
        }

    }

    async function resendOTP(type){
      setTimerActive(true);
      // console.log("Active timer set to true")
      setResendTimer(30);
    
      const res = await fetch(`${baseUrl}api/v1/resendmobileotp`, {
        
        method: "POST",
        // credentials:"include",
        headers: {
            "content-type" : "application/json",
            "Access-Control-Allow-Credentials": false
        },
        body: JSON.stringify({
          mobile:mobile,
        })
      })
      const data = await res.json();
      // console.log(data.status);
      if(data.status === 200 || data.status === 201){ 
          // openSuccessSB("OTP Sent",data.message);
      }else{

        openSuccessSB('resent otp', data.message)
          // openInfoSB("Something went wrong",data.mesaage);
      }
    }


  const [successSB, setSuccessSB] = useState(false);
  const openSuccessSB = (value,content) => {
    // console.log("Value: ",value)
    if(value === "otp sent"){
        messageObj.color = 'info'
        messageObj.icon = 'check'
        messageObj.title = "OTP Sent";
        messageObj.content = content;

    };
    if(value === "error"){
      messageObj.color = 'error'
      messageObj.icon = 'error'
      messageObj.title = "Error";
      messageObj.content = content;

  }
    if(value === "resent otp"){
      messageObj.color = 'info'
      messageObj.icon = 'check'
      messageObj.title = "OTP Resent";
      messageObj.content = content;
    };

    setMessageObj(messageObj);
    setSuccessSB(true);
  }
  const closeSuccessSB = () => setSuccessSB(false);

  const renderSuccessSB = (
    <MDSnackbar
      color= {messageObj.color}
      icon= {messageObj.icon}
      title={messageObj.title}
      content={messageObj.content}
      open={successSB}
      onClose={closeSuccessSB}
      close={closeSuccessSB}
      bgWhite="info"
      sx={{ borderLeft: `10px solid ${"blue"}`, borderRadius: "15px"}}
    />
  );

  return ( 
    <BasicLayout image={bgImage1}>
      <Card>
        <MDBox
          variant="gradient"
          bgColor="dark"
          borderRadius="lg"
          coloredShadow="info"
          mx={2}
          mt={-3}
          p={2}
          mb={1}
          textAlign="center"
        >
          <MDTypography variant="h4" fontWeight="medium" color="white" mt={1}>
            Welcome to StoxHero!
          </MDTypography>
          <MDTypography variant="h4" fontWeight="medium" color="white" mt={1}>
            Sign In
          </MDTypography>
 
        </MDBox>
        <MDBox pt={4} pb={3} px={3}>
          <MDBox component="form" role="form">
            {formType == 'email' ? <><MDBox mb={2}>
              <MDInput type="email" label="Email" onChange={handleEmailChange} fullWidth />
            </MDBox>
            <MDBox mb={2}>
              <MDInput 
                type={showPassword ? "text" : "password"} 
                label="Password" 
                onChange={handlePasswordChange} 
                fullWidth
                onKeyPress={handleKeyPress}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end" sx={{cursor:"pointer"}}>
                      <div onClick={handleTogglePasswordVisibility} >
                        {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                      </div>
                    </InputAdornment>
                  )
                }}
              />
            </MDBox>

            <MDBox mt={3} mb={1} textAlign="center">
              <MDTypography variant="button" color={invalidDetail && "error"}>
              {invalidDetail && invalidDetail}

              </MDTypography>
            </MDBox>
            <MDBox mt={2} mb={1}>
              <MDButton variant="gradient" color="dark" onClick={logInButton} fullWidth>
                sign in
              </MDButton>
              <MDButton variant="text" color="dark" onClick={forgotPasswordButton} fullWidth>
                forgot password?
              </MDButton>
            </MDBox></>:
            <>
          <MDBox mb={2}>
            <MDInput type="text" label="Mobile Number" onChange={handleMobileChange} fullWidth />
          </MDBox>
          <MDBox mt={3} mb={1} textAlign="center">
              <MDTypography variant="button" color={invalidDetail && "error"}>
              {invalidDetail && invalidDetail}

              </MDTypography>
            </MDBox>
          {!otpGen&&<MDButton variant="gradient" color="dark" onClick={phoneLogin} fullWidth>
          Send OTP
        </MDButton>}
        {otpGen && <><Grid item xs={12} md={12} xl={12} width="100%" display="flex" justifyContent="center">
                  <MDBox mt={1}>
                  <TextField
                    value={mobileOtp}
                    onChange={(e)=>{setMobileOtp(e.target.value)}}
                    // onChange={(e)=>{console.log(e)}}
                    // numInputs={6}
                    // renderSeparator={<span>-</span>}
                    // renderInput={(props) => <input {...props} />}
                    // inputStyle={{width:40, height:50}}
                  />

                  {/* <OtpInput
                    value={mobileOtp}
                    onChange={(e)=>{setMobileOtp(e)}}
                    // onChange={(e)=>{console.log(e)}}
                    numInputs={6}
                    renderSeparator={<span>-</span>}
                    renderInput={(props) => <input {...props} />}
                    inputStyle={{width:40, height:50}}
                  /> */}
                  </MDBox>
                  </Grid>
                  <Grid item xs={12} md={6} xl={12} mt={1} display="flex" justifyContent="flex-start">
                  <MDButton style={{padding:'0rem', margin:'0rem', minHeight:20, width: '40%', display: 'flex', justifyContent: 'center', margin: 'auto'}} disabled={timerActive} variant="text" color="dark" fullWidth onClick={()=>{resendOTP('mobile')}}>
                    {timerActive ? `Resend Mobile OTP in ${resendTimer} seconds` : 'Resend Mobile OTP'}
                  </MDButton>
                  </Grid>
                  <MDBox mt={2.5} mb={1} display="flex" justifyContent="space-around">
                    <MDButton variant="gradient" color="dark" fullWidth onClick={otpConfirmation}>
                      Confirm
                    </MDButton>
                  </MDBox>
                  </>}
          </> 
            }
            {formType == 'email' && <MDBox mt={-1}>
              <MDTypography color = 'dark' style={{
                width:'fit-content', margin: 'auto', fontSize:14, cursor:'pointer', fontWeight:700
                }} onClick={()=>{setFormType('mobile')}}>Login with Mobile</MDTypography>
            </MDBox>}
            {formType == 'mobile' && <MDBox mt={1}>
              <MDTypography color = 'dark'  style={{
                width:'fit-content', margin: 'auto', fontSize:14, cursor:'pointer', fontWeight:700
                }} onClick={()=>{setFormType('email')}}>Login with Email</MDTypography>
            </MDBox>}
            <MDBox mt={2} mb={1}>
              <MDTypography variant="h6" fontWeight="medium" color="black" mt={1} mb={1} textAlign="center">
                Learn and earn from stock market trading. Claim your free account now!
              </MDTypography>
              <MDButton variant="gradient" sx={{backgroundColor: '#afafaf', color:'#ffffff'}} onClick={signUpButton} fullWidth>
                sign up
              </MDButton>
            </MDBox>
                {renderSuccessSB}
          </MDBox>
        </MDBox>
      </Card>
    </BasicLayout>
  );
}

export default AdminLogin;
