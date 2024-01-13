import { KeyboardArrowRight } from '@mui/icons-material'
import { Button } from '@mui/material'
import React from 'react'
import MDTypography from '../../../../components/MDTypography'
import MDButton from '../../../../components/MDButton'
import MDBox from '../../../../components/MDBox'

const LaunchButton = ({sx={}, ...props}) => {
  return (
    <MDButton variant='contained' style={{backgroundColor:'#9c4722', color:'white'}} sx={{borderRadius:4,...sx}} {...props}>
      <MDBox display='flex' justifyContent='center' alignItems='center' alignContent='center'>
        <MDBox display='flex' justifyContent='center' alignItems='center' alignContent='center'>
          <MDTypography fontSize={13} fontWeight='bold' color='light' style={{fontFamily:'Itim', alignText:'center'}}>Download App</MDTypography>
        </MDBox>
        <MDBox display='flex' justifyContent='center' alignItems='center' alignContent='center'>
          <KeyboardArrowRight color='white' style={{fontFamily:'Itim'}}/>
        </MDBox>
      </MDBox>
    </MDButton>
  )
}

export default LaunchButton