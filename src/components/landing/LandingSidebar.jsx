import React from 'react'
import { Stack } from '@mui/system'
import { styled } from '@mui/material/styles';
import { Box, Button, Typography } from '@mui/material';
import { Link } from 'react-router-dom';

const Item = styled(Button)(({ theme }) => ({
    background: 'linear-gradient(0deg, #363636 0%, #b1b1b1 100%)',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: '#fff',
    fontWeight: 'bold',
    fontSize: '1em',
    textTransform: 'none',
    '&:hover': {
        background: 'linear-gradient(0deg, #363636 0%, #b1b1b1 100%)',
        filter: 'invert(0.85)'
    }
}));

const Holder = styled(Box)({
    width: '60%',
    height: '400px',
    overflow: 'auto',
    backgroundColor: '#1A2027',
    padding: '10px',
    margin: '10px auto',
    border: '2px solid #fff',
    cursor: 'pointer',
    '&::-webkit-scrollbar': {
        width: '20px',
    },
    '&::-webkit-scrollbar-track': {
        backgroundColor: 'lightgrey',
        boxShadow: 'inset 0 0 6px #eccaca4c;',
        borderRight: '3px solid #1A2027'
    },
    '&::-webkit-scrollbar-thumb': {
        backgroundColor: 'grey',
        boxShadow: 'inset 0 0 6px #eae2e27f',
        borderRight: '3px solid #1A2027'
    },
    '&::-webkit-scrollbar-thumb:hover': {
        backgroundColor: '#616060',
    }
})

const LandingSidebar = ({ title, content, disabled }) => {
    return (
        <>
            <Typography variant='h4' color='white'>
                {title}
            </Typography>
            <Holder>
                <Stack spacing={1}>
                    {
                        content.map(element => (
                            disabled ?
                                <Item value={element.id} key={element.id} >
                                    {element.name} - {element.techniques} techniques
                                </Item>
                                : <Item value={element.id} key={element.id} as={Link} to="/technique/felipe" >
                                    {element.name} - {element.techniques} techniques
                                </Item>
                        ))
                    }
                </Stack>
            </Holder>
        </>

    )
}

export default LandingSidebar