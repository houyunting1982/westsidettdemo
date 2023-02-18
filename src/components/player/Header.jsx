import { Grid, Typography } from '@mui/material'
import React from 'react'
import KillerspinLogo from '../../asserts/images/killerspin-logo.svg';

const Header = ({ title, playerName }) => {
    return (
        <Grid container spacing={2} sx={{
            marginTop: '20px'
        }}>
            <Grid item xs={3} sx={{ textAlign: 'left' }}>
                <img src={KillerspinLogo} alt="Killerspin Logo" width={100} heigh={100} />
            </Grid>
            <Grid item xs={9}>
                <Typography variant="h4" color={'white'}>
                    {playerName}
                </Typography>
                <Typography variant="h6" color={'white'}>
                    {title}
                </Typography>
            </Grid>
        </Grid>
    )
}

export default Header