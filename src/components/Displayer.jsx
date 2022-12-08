import { Button } from "@mui/material";
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
        currentCamera: 1
    });
    const parsedTotalCamera = parseInt(totalCamera)
    const cameraMax = parsedTotalCamera > 24 ? 24 : parsedTotalCamera;
    const frameMax = 80;

    useEffect(() => {
        let isCancelled = false;

        async function effect() {
            if (isCancelled) {
                return;
            }

            const imagesPromiseList = [];
            for (let index = 1; index < cameraMax; index++) {
                for (const i of DemoImages["camera" + index]) {
                    imagesPromiseList.push(preloadImage(i));
                }
            }
            await Promise.all(imagesPromiseList);

            if (isCancelled) {
                return;
            }
            console.log("Loaded");
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
            currentFrame: prev.currentFrame + step >= frameMax ? frameMax : prev.currentFrame + step,
        }));
    }

    const preCamera = () => {
        setCurrentClip(prev => ({
            ...prev,
            currentCamera: prev.currentCamera === 1 ? cameraMax : prev.currentCamera - 1,
        }));
    }
    const nextCamera = () => {
        setCurrentClip(prev => ({
            ...prev,
            currentCamera: prev.currentCamera === cameraMax ? 1 : prev.currentCamera + 1,
        }));
    }

    const nextView = () => {
        setCurrentClip(prev => ({
            currentCamera: (Math.floor(prev.currentFrame / 8)) % cameraMax + 1,
            currentFrame: prev.currentFrame === frameMax ? frameMax : prev.currentFrame + 1,
        }));
    }
    const handleOnWheel = (e) => {
        const { wheelDelta } = e.nativeEvent;
        wheelDelta > 0 ? preFrame() : nextFrame();
    }

    const getImgSrc = () => {
        const src = DemoImages["camera" + currentClip.currentCamera][currentClip.currentFrame]
        return src;
    }

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
                nextFrame(3);
                break;
            case 'ArrowDown':
                preFrame(3);
            default:
                break;
        }
    }, [])

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
        setCurrentClip({
            currentCamera: 1,
            currentFrame: 0
        })
        const newIntervalId = setInterval(nextView, 100);
        setIntervalId(newIntervalId);
    }


    return (
        <>
            <Container sx={{ p: 3, my: 3 }}
                onWheel={handleOnWheel}
            >
                {imagesPreloaded && (
                    <img id='img' src={getImgSrc()} alt="tabletennis" width="90%" />
                )}
            </Container>
            <Stack direction="row" spacing={2} justifyContent="center">
                <Button variant="outlined" color="success" onClick={preCamera} >
                    <ArrowBackIosNewIcon />
                    <CameraAltIcon />
                </Button>
                <Button variant="contained" onClick={() => preFrame()} disabled={currentClip.currentFrame === 0}>
                    <FirstPageIcon />
                    <CropOriginalIcon />
                </Button>

                <Button variant="contained" onClick={() => nextFrame()} disabled={currentClip.currentFrame === frameMax}>
                    <CropOriginalIcon />
                    <LastPageIcon />
                </Button>
                <Button variant="outlined" color="success" onClick={nextCamera}>
                    <CameraAltIcon />
                    <ArrowForwardIosIcon />
                </Button>
                <Button variant={intervalId ? "contained" : "outlined"} color="success" onClick={handleView}>
                    <PlayCircleOutlineIcon />
                </Button>
            </Stack>
        </>

    );
};

export default Displayer;
