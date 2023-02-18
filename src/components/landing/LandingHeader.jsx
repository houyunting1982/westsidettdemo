import { Grid, Typography } from '@mui/material'
import { Stack } from '@mui/system';
import React from 'react'
import KillerspinLogo from '../../asserts/images/killerspin-logo.svg';

const LandingHeader = () => {
    return (
        <Grid container spacing={2} sx={{
            marginTop: '20px',
            alignItems: 'center'
        }}>
            <Grid item xs={6} sx={{ textAlign: 'left' }}>
                <Stack direction='row' alignItems='center'>
                    <img src={KillerspinLogo} alt="Killerspin Logo" width={100} heigh={100} />
                    <Typography variant="h2" color={'white'}>4D</Typography>
                </Stack>
            </Grid>
            <Grid item xs={6}>
                <Stack direction='row' alignItems='center' justifyContent='flex-end' spacing={6}>
                    <Typography variant="h5" color={'white'}>
                        Account: Diego Schaaf
                    </Typography>
                    <Typography variant="h5" color={'white'}>
                        Log Out
                    </Typography>
                </Stack>
            </Grid>
        </Grid>
    )
}
export default LandingHeader