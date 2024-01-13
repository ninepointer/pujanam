import { AppBar, Box, Container, IconButton, List, ListItemButton, ListItemText, Stack, Typography, useMediaQuery } from '@mui/material'
import React, { useState } from 'react'

import useScrollPosition from '../../hooks/useScrollPosition'

import logo from '../../../../assets/images/punyamapp.png'
import background from '../../../../assets/images/background.jpg'
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { CallMade, Language, Menu } from '@mui/icons-material'
import LaunchButton from '../Buttons/LaunchButton'
import { useTheme } from 'styled-components'
import MDTypography from '../../../../components/MDTypography';
import theme from '../../utils/theme/index';
import { Link } from 'react-router-dom';
import { MdOutlineTempleHindu } from "react-icons/md";
import { LiaPrayingHandsSolid } from "react-icons/lia";
import { GrBlog } from "react-icons/gr";
import { CgOrganisation } from "react-icons/cg";

const NAVBAR_HIEGHT = 80;
const LinkButton = ({ children, ...props }) => (
  <Stack
    direction="row"
    alignItems="center"
    spacing={0.2}
    sx={{
      cursor: "pointer",
      color: "#9c4722",
      // color: "white",
      // "&:hover": { color: '#fff'},
      "&:hover": { color: '#FFFFFF'},
    }}
    {...props}
  >
    {children}
  </Stack>
);


const Navbar = () => {

  const scrollPosition = useScrollPosition();

  const theme = useTheme();

  const isMobile = useMediaQuery(theme.breakpoints.down("lg"))

  const[open,setOpen] = useState(false);

  const Handle = (e)=>{
    if(isMobile){
      setOpen(true)
    }  
  }

  return (
    <AppBar 
        elevation={0} 
        sx={{ height: NAVBAR_HIEGHT, bgcolor: scrollPosition > 10 ? "white" : "white", 
        backdropFilter: scrollPosition > 10 && "blur(60px)", 
        marginBottom: "50px"
        }}
    >

      <Container sx={{ [theme?.breakpoints?.down("lg")]: {maxWidth: "1300!important"}, marginBottom:1  }}>
        <Stack direction='row' justifyContent='space-between' alignItems="center" flexWrap="wrap"  alignContent='center' >
          {/* Logo */}

          <a href="/"><img src={logo} style={{ objectFit: "contain", height: "50px", marginTop: "6px" }} /></a>


          {!isMobile && (
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="flex-end"
            spacing={5}
            marginRight={4}
            sx={{ flex: 1 }}
            flexWrap="wrap"
            color="white"
          >
            <a href="/careers">
            <LinkButton>
              <MdOutlineTempleHindu fontSize="small" />
              <Typography fontWeight="bold" variant="body2" style={{fontFamily:'Itim'}}>Mandirs</Typography>
            </LinkButton>
            </a>

            <a href="/workshops">
            <LinkButton>
              <LiaPrayingHandsSolid fontSize="small" />
              <Typography fontWeight="bold" variant="body2" style={{fontFamily:'Itim'}}>Pooja Service</Typography>
            </LinkButton>
            </a>

            <a href="/workshops">
            <LinkButton>
              <LiaPrayingHandsSolid fontSize="small" />
              <Typography fontWeight="bold" variant="body2" style={{fontFamily:'Itim'}}>Pooja Samagri</Typography>
            </LinkButton>
            </a>

            <a href="/blogs">
            <LinkButton>
              <GrBlog fontSize="small" />
              <Typography fontWeight="bold" variant="body2" style={{fontFamily:'Itim'}}>Blogs</Typography>
            </LinkButton>
            </a>

            <a href="/about">
            <LinkButton spacing={0.5}>
              <CgOrganisation fontSize="small" />
              <Typography fontWeight="bold" variant="body2" style={{fontFamily:'Itim'}}>About Us</Typography>
            </LinkButton>
            </a>

          </Stack>)}

          {open&& (
            
            <Stack
              direction="column"
              alignItems="center"
              justifyContent="flex-start"
              spacing={4}
              sx={{
                flex: 1,
                backgroundImage: `url(${background})`, // Replace with the actual path to your image
                backgroundSize: 'cover',
                backgroundPosition: 'center center',
                width: '100%',
                height: '100vh',
                position: 'absolute',
                top: 0,
                right: 0,
              }}
              flexWrap="wrap"
            >
            < img src ="https://icon-library.com/images/x-button-icon/x-button-icon-3.jpg" style={{height:"40px",position:"absolute",top:"8px",color:"#fff", right:"14px", zIndex:999}} sx={{fontSize:"100px"}} onClick={()=>setOpen(false)}/>

            <a href="/careers">
            <LinkButton>
              <MDTypography variant="body2" style={{fontFamily:'Itim', color: "#9c4722"}}>Mandirs</MDTypography>
              
            </LinkButton>
            </a>

            <a href="/workshops">
            <LinkButton>
              <MDTypography variant="body2" style={{fontFamily:'Itim', color: "#9c4722"}}>Pooja Service</MDTypography>
              
            </LinkButton>
            </a>

            <a href="/workshops">
            <LinkButton>
              <MDTypography variant="body2" style={{fontFamily:'Itim', color: "#9c4722"}}>Pooja Samagri</MDTypography>
              
            </LinkButton>
            </a>


            <a href="/blogs">
            <LinkButton>
              <MDTypography variant="body2" style={{fontFamily:'Itim', color: "#9c4722"}}>Blogs</MDTypography>
              
            </LinkButton>
            </a>

            <a href="/about">
            <LinkButton spacing={0.5}>
              <MDTypography variant="body2" style={{fontFamily:'Itim', color: "#9c4722"}}>About us</MDTypography>
            </LinkButton>
            </a>

            <a href="/about">
            <LinkButton spacing={0.5}>
              <Language fontSize="small" />
              <MDTypography variant="body2" style={{fontFamily:'Itim', color: "#9c4722"}}>Hindi</MDTypography>
            </LinkButton>
            </a>

            </Stack>
          )}

          {/* Action buttons */}


          {isMobile ? (
            <IconButton style={{color:'#9c4722'}}>
              <Menu onClick={Handle} sx={{ color: "#9c4722" }} />
            </IconButton>
          ) : (
          <Stack direction="row" spacing={5} alignItems="center">
            <LinkButton spacing={1} sx={{color: scrollPosition >10 ? '#9c4722' : '#9c4722'}}>
              <Language fontSize="small" />
              <Typography variant="body2" style={{fontFamily:'Itim',}}>Hindi</Typography>
            </LinkButton>

            <a href="https://play.google.com/store/apps/details?id=com.stoxhero.app" target='_blank'>
              <LaunchButton sx={{ borderRadius: 3, color: 'light' }} />
            </a>
          </Stack>)
          }


        </Stack>
      </Container>

    </AppBar>
  )
}

export default Navbar