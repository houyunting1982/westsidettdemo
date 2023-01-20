import { Button, styled } from '@mui/material'
import { Stack } from '@mui/system'
import React from 'react'

import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import ArrowLeftIcon from '@mui/icons-material/ArrowLeft';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import ReplayIcon from '@mui/icons-material/Replay';

const ControlButton = styled(Button)(({
    variant: 'outlined',
    width: "100px",
    opacity: 0.7,
    color: "#fff",
    border: 'solid 1px #fff',
    borderRadius: '0',
    padding: '6px 16px',
    "&:hover": {
        border: 'solid 1px #7a7676',
        backgroundColor: '#a4a4a4',
    },
    "&:disabled": {
        color: '#b1b1b1',
        border: 'solid 1px #b1b1b1',
        backgroundColor: '#363636',
        opacity: 0.5
    }
}));

const ControlPanel = ({
    goToNextIndex,
    goToPrevIndex,
    goToNextCamera,
    goToPrevCamera,
    goPlay,
    isPlaying,
    canGoNextCamera,
    canGoPrevCamera,
    canGoNextIndex,
    canGoPrevIndex,
    disableAll
}) => {
    return (
        <>
            <Stack direction="row" spacing={2} justifyContent="space-evenly">
                <ControlButton color='inherit' onClick={() => goToPrevCamera()} disabled={canGoPrevCamera() || disableAll}>
                    <ArrowBackIosNewIcon />
                    <CameraAltIcon />
                </ControlButton>
                <ControlButton color='inherit' onClick={() => goToPrevIndex()} disabled={canGoPrevIndex() || disableAll}>
                    <ArrowLeftIcon />
                </ControlButton>
                <ControlButton variant={isPlaying ? "contained" : "outlined"} color='inherit' onClick={() => goPlay()} disabled={disableAll}>
                    {
                        isPlaying ? <ReplayIcon sx={{ color: '#363636' }} /> :
                            <PlayCircleOutlineIcon />
                    }
                </ControlButton>
                <ControlButton color='inherit' onClick={() => goToNextIndex()} disabled={canGoNextIndex() || disableAll}>
                    <ArrowRightIcon />
                </ControlButton>
                <ControlButton color='inherit' onClick={() => goToNextCamera()} disabled={canGoNextCamera() || disableAll}>
                    <CameraAltIcon />
                    <ArrowForwardIosIcon />
                </ControlButton>
            </Stack>
        </>
    )
}

export default ControlPanel