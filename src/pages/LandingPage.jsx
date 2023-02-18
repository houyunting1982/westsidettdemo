import { useState, useEffect, useCallback } from 'react';

import { Stack, Switch } from '@mui/material';
import { styled } from '@mui/material/styles';
import Grid from '@mui/material/Unstable_Grid2';
import LandingHeader from '../components/landing/LandingHeader';
import { myContent, availableContent } from '../resource/techniques'
import LandingSidebar from '../components/landing/LandingSidebar';

const Container = styled(Stack)({
    textAlign: 'center',
    maxWidth: '1600px',
    minWidth: '1200px',
    margin: '100px auto',
    padding: '0 50px'
});
const LandingPage = () => {
    return (
        <Container>
            <LandingHeader />
            <Grid container spacing={2} sx={{
                marginTop: '20px',
                alignItems: 'center'
            }}>
                <Grid item xs={6}>
                    <LandingSidebar title={'My Content:'} content={myContent} />
                </Grid>
                <Grid item xs={6}>
                    <LandingSidebar title={'Available Content:'} content={availableContent} disabled={true} />
                </Grid>
            </Grid>
        </Container>
    )
}

export default LandingPage