import React from 'react'
import { Stack } from '@mui/system'
import { styled } from '@mui/material/styles';
import { Box, Button } from '@mui/material';

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
    width: '260px',
    height: '320px',
    overflow: 'auto',
    backgroundColor: '#1A2027',
    padding: '10px',
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

const Sidebar = ({ setCurrentTechnique }) => {
    const handleClick = (e) => {
        setCurrentTechnique(e.target.value)
    }
    return (
        <Holder>
            <Stack spacing={1}>
                <Item onClick={handleClick} value='fhLoopOffBlock' >FH Loop Off Block</Item>
                <Item onClick={handleClick} value='bhLoopOffPush' >BH Loop Off Push</Item>
                <Item onClick={handleClick} value='bhLoopOffPush'>FH Counter</Item>
                <Item onClick={handleClick} value='fhLoopOffBlock'>FH Push</Item>
                <Item onClick={handleClick} value='bhLoopOffPush'>FH Passive Block</Item>
                <Item onClick={handleClick} value='bhLoopOffPush'>FH Active Block</Item>
                <Item onClick={handleClick} value='bhLoopOffPush'>FH Lob</Item>
                <Item onClick={handleClick} value='bhLoopOffPush'>BH Loop off topspin</Item>
                <Item onClick={handleClick} value='bhLoopOffPush'>BH Loop off underspin</Item>
                <Item onClick={handleClick} value='bhLoopOffPush'>BH Counter</Item>
                <Item onClick={handleClick} value='bhLoopOffPush'>BH Push</Item>
                <Item onClick={handleClick} value='bhLoopOffPush'>BH Passive Block</Item>
                <Item onClick={handleClick} value='bhLoopOffPush'>BH Active Block</Item>
                <Item onClick={handleClick} value='bhLoopOffPush'>BH Lob</Item>
            </Stack>
        </Holder>
    )
}

export default Sidebar