import { Box, Button, CircularProgress, FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { Container, Stack } from "@mui/system";
import React, { useEffect, useState, useCallback } from "react";
import DemoImages from "../resource/images";
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import CropOriginalIcon from '@mui/icons-material/CropOriginal';
import LastPageIcon from '@mui/icons-material/LastPage';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import StopIcon from '@mui/icons-material/Stop';

function preloadImage(src) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = function () {
            resolve(img);
        };
        img.onerror = img.onabort = function () {
            reject(src);
        };
        img.src = src;
    });
}

const Displayer = ({ totalCamera }) => {
    const [imagesPreloaded, setImagesPreloaded] = useState(false);
    const [intervalId, setIntervalId] = useState(0);
    const [currentClip, setCurrentClip] = useState({
        currentFrame: 0,
        currentCamera: 0
    });
    const [playSpeed, setplaySpeed] = useState(20)
    const parsedTotalCamera = parseInt(totalCamera);
    const cameraMax = parsedTotalCamera > 24 ? 24 : parsedTotalCamera;
    const frameMax = 81;

    useEffect(() => {
        let isCancelled = false;

        async function effect() {
            if (isCancelled) {
                return;
            }

            const imagesPromiseList = [];
            for (let index = 0; index < cameraMax; index++) {
                for (const i of DemoImages["camera" + index]) {
                    imagesPromiseList.push(preloadImage(i));
                }
            }
            await Promise.all(imagesPromiseList);

            if (isCancelled) {
                return;
            }
            console.log("All pictures are loaded");
            setImagesPreloaded(true);
        }

        effect();

        return () => {
            isCancelled = true;
        };
    }, [cameraMax]);
    const preFrame = (step = 1) => {
        setCurrentClip(prev => ({
            ...prev,
            currentFrame: prev.currentFrame - step <= 0 ? 0 : prev.currentFrame - step,
        }));
    }
    const nextFrame = (step = 1) => {
        setCurrentClip(prev => ({
            ...prev,
            currentFrame: prev.currentFrame + step >= frameMax - 1 ? frameMax - 1 : prev.currentFrame + step,
        }));
    }

    const preCamera = () => {
        setCurrentClip(prev => ({
            ...prev,
            currentCamera: prev.currentCamera === 0 ? cameraMax - 1 : prev.currentCamera - 1,
        }));
    }
    const nextCamera = () => {
        setCurrentClip(prev => ({
            ...prev,
            currentCamera: prev.currentCamera === cameraMax - 1 ? 0 : prev.currentCamera + 1,
        }));
    }

    const nextView = (base = 1) => {
        setCurrentClip(prev => ({
            ...prev,
            currentFrame: prev.currentFrame === frameMax - 1 ? 0 : prev.currentFrame + 1,
        }));
    }
    const handleOnWheel = (e) => {
        if (intervalId) {
            return;
        }
        const { wheelDelta } = e.nativeEvent;
        wheelDelta > 0 ? preFrame() : nextFrame();
    }

    const getImgSrc = () => {
        const src = DemoImages["camera" + currentClip.currentCamera][currentClip.currentFrame]
        return src;
    }

    const handleSpeedChange = (event) => {
        if (intervalId) {
            clearInterval(intervalId);
            setIntervalId(0);
            const newIntervalId = setInterval(() => nextView(currentClip.currentCamera), event.target.value);
            setIntervalId(newIntervalId);
        }
        setplaySpeed(event.target.value);
    };

    const handleKeyPress = useCallback((e) => {
        switch (e.key) {
            case 'ArrowRight':
            case 'n':
                nextCamera();
                break;
            case 'ArrowLeft':
            case 'p':
                preCamera();
                break;
            case 'ArrowUp':
                if (!intervalId) {
                    nextFrame(3);
                }
                break;
            case 'ArrowDown':
                if (!intervalId) {
                    preFrame(3);
                }
                break;
            default:
                break;
        }
    }, [intervalId])

    useEffect(() => {
        // attach the event listener
        document.addEventListener('keydown', handleKeyPress);
        // remove the event listener
        return () => {
            document.removeEventListener('keydown', handleKeyPress);
        };
    }, [handleKeyPress]);

    useEffect(() => {
        if (currentClip.currentFrame === frameMax && intervalId) {
            clearInterval(intervalId);
            setIntervalId(0);
        }
    }, [currentClip.currentFrame, intervalId])

    const handleView = () => {
        if (intervalId) {
            clearInterval(intervalId);
            setIntervalId(0);
            return;
        }
        setCurrentClip(prev => ({
            ...prev,
            currentFrame: 0
        }))
        const newIntervalId = setInterval(() => nextView(currentClip.currentCamera), playSpeed);
        setIntervalId(newIntervalId);
    }

    return (
        <>
            <Container sx={{ p: 3, my: 3 }}
                onWheel={handleOnWheel}
            >
                {
                    imagesPreloaded ?
                        <img id='img' src={getImgSrc()} alt="tabletennis" width="90%" />
                        : <CircularProgress color="success" />
                }
            </Container>
            <Stack direction="row" spacing={2} justifyContent="center">
                <Button variant="outlined" color="success" onClick={preCamera} >
                    <ArrowBackIosNewIcon />
                    <CameraAltIcon />
                </Button>
                <Button variant="contained" onClick={() => preFrame()} disabled={intervalId || currentClip.currentFrame === 0}>
                    <FirstPageIcon />
                    <CropOriginalIcon />
                </Button>

                <Button variant="contained" onClick={() => nextFrame()} disabled={intervalId || currentClip.currentFrame === frameMax}>
                    <CropOriginalIcon />
                    <LastPageIcon />
                </Button>
                <Button variant="outlined" color="success" onClick={nextCamera}>
                    <CameraAltIcon />
                    <ArrowForwardIosIcon />
                </Button>
                <Button variant={intervalId ? "contained" : "outlined"} color="success" onClick={handleView}>
                    {
                        intervalId ? <StopIcon /> : <PlayCircleOutlineIcon />
                    }
                </Button>
                <Box sx={{ minWidth: 120 }}>
                    <FormControl fullWidth size="small">
                        <InputLabel id="play-speed-select-label">Speed</InputLabel>
                        <Select
                            labelId="play-speed-select-label"
                            id="play-speed-select"
                            value={playSpeed}
                            label="Speed"
                            onChange={handleSpeedChange}
                        >
                            <MenuItem value={10}>2x faster</MenuItem>
                            <MenuItem value={20}>normal</MenuItem>
                            <MenuItem value={40}>2x slower</MenuItem>
                            <MenuItem value={100}>5x slower</MenuItem>
                            <MenuItem value={1000}>Freezing...</MenuItem>
                        </Select>
                    </FormControl>
                </Box>
            </Stack>
        </>

    );
};

export default Displayer;
