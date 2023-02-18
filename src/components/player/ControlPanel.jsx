import { Button, styled, Typography } from '@mui/material'
import { Stack } from '@mui/system'
import React, { useState, useEffect } from 'react'

import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import ArrowLeftIcon from '@mui/icons-material/ArrowLeft';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import ReplayIcon from '@mui/icons-material/Replay';

const ControlButton = styled(Button)(({
    variant: 'outlined',
    width: "140px",
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

const ActionLabel = styled(Typography)(({
    color: '#a4a4a4',
    width: '140px'
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
    enableJoyStickMode,
    joyStickParams
}) => {
    const [playStatus, setplayStatus] = useState(null);
    const [cameraIndicator, setcameraIndicator] = useState(0);
    // indexSpeedMultiplier: 0,
    //     playDirection: 0, // -1 : prev, 0 : Current, 1 : next
    //         cameraMovingDirection: 0 // -1

    useEffect(() => {
        if (!enableJoyStickMode) {
            return;
        }

        if (!joyStickParams.playDirection) {
            setplayStatus(null);
        } else {
            const percentage = `${100 * joyStickParams.indexSpeedMultiplier}%`
            if (joyStickParams.playDirection > 0) {
                setplayStatus(`FORWARD ${percentage}`)
            } else {
                setplayStatus(`REVERSE ${percentage}`)
            }
        }
        setcameraIndicator(joyStickParams.cameraMovingDirection);

    }, [joyStickParams, enableJoyStickMode])

    return (
        <>
            <Stack direction="row" spacing={2} justifyContent="space-evenly" alignItems="flex-end" sx={{ height: '2.5em' }}>
                <Stack>
                    {enableJoyStickMode && cameraIndicator < 0 && !canGoPrevCamera() && <ActionLabel variant='subtitle1' display={false}>ROTATE LEFT</ActionLabel>}
                    <ControlButton color='inherit' onClick={() => goToPrevCamera()} disabled={canGoPrevCamera() || enableJoyStickMode}>
                        <ArrowBackIosNewIcon />
                        <CameraAltIcon />
                    </ControlButton>
                </Stack>

                <Stack>
                    <ControlButton color='inherit' onClick={() => goToPrevIndex()} disabled={canGoPrevIndex() || enableJoyStickMode}>
                        <ArrowLeftIcon />
                    </ControlButton>
                </Stack>

                <Stack>
                    {enableJoyStickMode && playStatus && isPlaying && <ActionLabel variant='subtitle1'>{playStatus}</ActionLabel>}
                    <ControlButton variant={isPlaying ? "contained" : "outlined"} color='inherit' onClick={() => goPlay()}>
                        {
                            isPlaying ? <ReplayIcon sx={{ color: '#363636' }} /> :
                                <PlayCircleOutlineIcon />
                        }
                    </ControlButton>
                </Stack>

                <Stack>
                    <ControlButton color='inherit' onClick={() => goToNextIndex()} disabled={canGoNextIndex() || enableJoyStickMode}>
                        <ArrowRightIcon />
                    </ControlButton>
                </Stack>

                <Stack>
                    {enableJoyStickMode && cameraIndicator > 0 && !canGoNextCamera() && <ActionLabel variant='subtitle1'>ROTATE RIGHT</ActionLabel>}
                    <ControlButton color='inherit' onClick={() => goToNextCamera()} disabled={canGoNextCamera() || enableJoyStickMode}>
                        <CameraAltIcon />
                        <ArrowForwardIosIcon />
                    </ControlButton>
                </Stack>
            </Stack>
        </>
    )
}

export default ControlPanel