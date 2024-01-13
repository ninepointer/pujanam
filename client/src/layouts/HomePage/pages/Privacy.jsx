import { Box, Container, Grid, Stack, Typography } from '@mui/material'
import { ThemeProvider } from 'styled-components';
import Title from '../components/Title/index'
import React, {useEffect} from 'react'
import ReactGA from "react-ga"
import ServiceCard from '../components/Cards/ServiceCard'
import background from '../../../assets/images/background.jpg'

import useMeasure from 'react-use-measure'

import Footer from '../components/Footers/Footer'

import Navbar from '../components/Navbars/Navbar'
import theme from '../utils/theme/index'



const About = () => {
    
    useEffect(()=>{
        ReactGA.pageview(window.location.pathname)
      }, [])
   
      return (
        <ThemeProvider theme={theme}>

            <Navbar />
            <Box bgcolor="#06070A" sx={{mt:{xs:-10,lg:-15}}} style={{
                // display: 'flex',
                // justifyContent: 'center',
                // alignContent: 'center',
                // alignItems: 'stretch',
                backgroundImage: `url(${background})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center center',
                minHeight: '70vh', // Adjust the percentage as needed
                flexDirection: 'column',
                // textAlign: 'center',
                padding: '20px',
                }}>
                
                <Container style={{fontFamily:'Itim'}}>
                    <Grid container spacing={10} flexWrap="wrap-reverse" justifyContent="start" alignItems="center" sx={{ mt: { xs: 10, md: 15, } }} style={{fontFamily:'Itim'}}>
                        <Grid item xs={12} md={6} sx={{mt:2}}  >
                            <Stack spacing={2} sx={{ maxWidth: '100%' }}>
                                <Title variant={{ xs: 'h5', sm: 'h2', md: 'h2' }} sx={{ letterSpacing: "0.02em", mb: 1, p:0}} style={{ color: "white",fontFamily: "Itim" }} >Punyam Privacy Policy</Title>
                                <Title variant={{ xs: 'body2', sm: 'body2', md: "body2" }} style={{ fontFamily: "Itim" }} sx={{ fontWeight: 500, letterSpacing: "0.05em", mb: 6, color: "rgba(255, 255, 255, 0.6)" }} >Updated on 13 Jan, 2024</Title>
                                <Title variant={{ xs: 'body1', sm: 'body1', md: "body1" }} style={{ fontFamily: "Itim" }} sx={{ fontWeight: 500, letterSpacing: "0.05em", mb: 6, color: "#ffffff", fontWeight:"bold" }} >Your privacy is critically important to us.</Title>
                            </Stack>
                        </Grid>
                    </Grid>
                </Container>
                <Container>
                    <Grid item xs={12} md={6} sx={{mt:2, maxWidth:'1280px'}} style={{ fontFamily: "Itim" }} >
                        <Stack spacing={0} sx={{ width: "100%"}}>
                            <Typography color="#ffffff" style={{ fontFamily: "Itim" }}>
                                This document is published in accordance with the provisions of Rule 3 (1) of the Information Technology (Intermediaries Guidelines) Rules, 2011 which requires publishing the Privacy Policy for the access or usage of Punyam's website and Punyam App.
                            </Typography>
                        </Stack>
                    </Grid>
                    <Grid item xs={12} md={6} sx={{mt:2, maxWidth:'1280px'}}  >
                        <Stack spacing={0} sx={{ width: "100%"}}>
                            <Typography color="#ffffff" style={{ fontFamily: "Itim" }}>
                                This Privacy Policy covers the use of Punyam's website and app, including providing information on our policies regarding the collection, use, and disclosure of Personal Information when you use our service. Punyam ("we", "our team", "us") is concerned about the privacy of the users ("you", "your", "user") of our website and app and have provided this privacy policy to familiarize you with the manner in which we collect, use, and disclose your information.
                            </Typography>
                        </Stack>
                    </Grid>
                    <Grid item xs={12} md={6} sx={{mt:2, maxWidth:'1280px'}}  >
                        <Stack spacing={0} sx={{ width: "100%"}}>
                            <Typography color="#ffffff" style={{ fontFamily: "Itim" }}>
                                We will not use or share your information with anyone except as described in this Privacy Policy.
                            </Typography>
                        </Stack>
                    </Grid>
                    <Grid item xs={12} md={6} sx={{mt:2, maxWidth:'1280px'}}  >
                        <Stack spacing={0} sx={{ width: "100%"}}>
                            <Typography color="#ffffff" style={{ fontFamily: "Itim" }}>
                                We use your Personal Information for providing and improving the services offered by us. By using the service, you agree to the collection and use of information in accordance with this policy.
                            </Typography>
                        </Stack>
                    </Grid>
                </Container>
                
                <Container>
                <Grid item xs={12} md={6} sx={{mt:2, maxWidth:'1280px', mb:8}} style={{ fontFamily: "Itim" }} >
                            <Stack spacing={0} sx={{ width: "100%"}}>
                                <Typography color="#ffffff" style={{ fontFamily: "Itim" }}>
                                1. What information do we collect?<br/><br/>
                                We collect information from you when you register/login on the app/website. While registering, we may ask for your name, phone number, email, location or address, Date of Birth, Place of Birth. However, you may visit the app/website anonymously.<br/><br/>
                                When you create an account, you will provide information that could be personally identifiable. We may use your contact information to send you information about our services, but only in accordance with your contact preferences. We reserve the right to contact you for account recovery purposes.<br/><br/>
                                All information provided by you may be retained by us indefinitely, even after you terminate your Account.<br/><br/>
                                If you choose to share Punyam posts on social media, we may display our app install link on your channels.<br/><br/>
                                The app/website automatically collects usage information. We may use this data in aggregate form for service improvement.<br/><br/>
                                Some users, such as temple administrators and pandits, need to grant permission to the app/website to access photos, media, and files or access the camera on their devices.<br/><br/>
                                2. How do we use and share your information?<br/><br/>
                                We share your information with third parties when necessary to offer our services, or when legally required to do so. We use the information to provide, analyze, and improve our services and features, and to provide reliable customer support.<br/><br/>
                                We may contact you for feedback, notify you of new features, and send notifications of new content.<br/><br/>
                                To post content, some users need to grant permission to the app/website.<br/><br/>
                                3. How do we protect visitor information?<br/><br/>
                                We implement security measures to maintain the safety of your personal information, which is only accessible by a limited number of persons with special access rights.<br/><br/>
                                4. Public Information about your Activity on the Website/App<br/><br/>
                                Information provided using public features may be publicly available.<br/><br/>
                                5. Do we disclose the information we collect to outside parties?<br/><br/>
                                We do not sell, trade, or transfer your personally identifiable information to third parties, except as necessary for operating our app/website or when required by law.<br/><br/>
                                6. Third-party links<br/><br/>
                                Third-party links on our app/website have separate and independent privacy policies.<br/><br/>
                                7. Changes to our policy<br/><br/>
                                Changes will be posted on this page and will apply only to information collected after the date of the change.<br/><br/>
                                8. Online Policy only<br/><br/>
                                This Privacy Policy applies only to information collected through our app/website.<br/><br/>
                                9. Your consent<br/><br/>
                                By using our app/website, you consent to our Privacy Policy.<br/><br/>
                                Disclaimer<br/><br/>
                                The information in the app/website is for general information purposes only. We make no representations or warranties about the completeness, accuracy, reliability, suitability, or availability of the content. Any reliance you place on such information is at your own risk.<br/><br/>
                                Applicable Law and Jurisdiction:<br/><br/>
                                By visiting this Portal, you agree that the laws of India without regard to its conflict of laws principles, govern this Privacy Policy and any dispute arising in respect hereof shall be subject to and governed by the dispute resolution process set out in the Terms and Conditions.<br/><br/>
                                Updating Information:<br/><br/>
                                You will promptly notify Punyam if there are any changes, updates or modifications to your information. Further, you may also review, correct, update or modify your information and user preferences by logging into your Profile page on Punyam.
                                Contact Us:<br/><br/>
                                Any questions or clarifications with respect to this Policy or any complaints, comments, concerns or feedback can be sent to our Grievance Officer at:
                                Contact details:<br/><br/>
                                Email: pooja@punyam.app<br/><br/>
                                Physical mail addressed to: Attn: Punyam Team:<br/><br/>
                                S-77, NRI Colony, Sec-24, Pratap Nagar, Sanganer, Pratap Nagar Housing Board, Jaipur-302033
                                </Typography>
                            </Stack>
                        </Grid>
                </Container>

                {/* <Footer /> */}
            </Box>


        </ThemeProvider>
    )
}

export default About;



