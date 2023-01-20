import { useState, useEffect, useCallback } from 'react';
import Displayer from '../components/Displayer';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import { Stack, Switch, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import Grid from '@mui/material/Unstable_Grid2';
import ControlPanel from '../components/ControlPanel';

import images from "../resource/images"; // It should be loaded from api
import { preloadImage } from '../services/utils';

const Container = styled(Stack)({
    textAlign: 'center',
    width: '80%',
    maxWidth: '120vh',
    minWidth: '1000px',
    margin: 'auto'
});

const initStatus = {
    currentCamera: 0,
    currentIndex: 0,
    playSpeed: 30,
}

const initBoundary = {
    maxCamera: 0,
    maxIndex: 0
}

const initPlayParams = {
    indexSpeedMultiplier: 0,
    playDirection: 0, // -1 : prev, 0 : Current, 1 : next
    cameraMovingDirection: 0 // -1 : prev, 0 : Current, 1 : next
}

const initAnchorPoint = {
    px: -1,
    py: -1
}

const PlayPage = () => {
    const [playStatus, setPlayStatus] = useState(initStatus);
    const [loadedImages, setLoadedImages] = useState(null);
    const [boundary, setBoundary] = useState(initBoundary);
    const [loaded, setLoaded] = useState(false);
    const [indexIntervalId, setindexIntervalId] = useState(0);
    const [cameraIntervalId, setcameraIntervalId] = useState(0);
    const [title, setTitle] = useState(null);
    const [playerName, setPlayerName] = useState('FELIPE MORITA')
    const [joyStickParams, setjoyStickParams] = useState(initPlayParams)
    const [enableJoyStickMode, setenableJoyStickMode] = useState(false)
    const [anchorPoint, setAnchorPoint] = useState(initAnchorPoint)

    const preLoadImages = async (images) => {
        const imagesPromiseList = [];
        for (let cIdx = 0; cIdx < images.length; cIdx++) {
            for (let fIdx = 0; fIdx < images[cIdx].length; fIdx++) {
                imagesPromiseList.push(preloadImage(images[cIdx][fIdx]));
            }
        }
        await Promise.all(imagesPromiseList);

        console.log("All pictures are loaded");
    }

    const loadImages = useCallback(async () => {
        const responseImages = await Promise.resolve(images);
        const maxCamera = responseImages.length;
        const maxIndex = responseImages[0].length;
        setBoundary({ maxCamera, maxIndex });
        setLoadedImages(responseImages);
        // For preload the pictures only. It should be replaced by another better way to cache the images.
        await preLoadImages(responseImages);
    }, [])

    useEffect(() => {
        const init = async () => {
            await loadImages();
            setLoaded(true);
        }
        init();
    }, [loadImages])

    useEffect(() => {
        if (playStatus.currentIndex === boundary.maxIndex - 1 && indexIntervalId) {
            clearInterval(indexIntervalId);
            setindexIntervalId(0);
            setPlayStatus(initStatus)
        }
    }, [playStatus.currentIndex, boundary.maxIndex, indexIntervalId])

    const goToPrevIndex = (step = 1) => {
        setPlayStatus(prev => ({
            ...prev,
            currentIndex: prev.currentIndex - step < 0 ? 0 : prev.currentIndex - step,
        }));
    }

    const goToNextIndex = (step = 1) => {
        setPlayStatus(prev => ({
            ...prev,
            currentIndex: prev.currentIndex + step >= boundary.maxIndex ? boundary.maxIndex - 1 : prev.currentIndex + step,
        }));
    }

    const goToPrevCamera = () => {
        setPlayStatus(prev => ({
            ...prev,
            currentCamera: prev.currentCamera - 1 < 0 ? 0 : prev.currentCamera - 1,
        }))
    }

    const goToNextCamera = () => {
        setPlayStatus(prev => ({
            ...prev,
            currentCamera: prev.currentCamera + 1 >= boundary.maxCamera ? boundary.maxCamera - 1 : prev.currentCamera + 1,
        }))
    }

    const goPlay = () => {
        if (indexIntervalId) {
            clearInterval(indexIntervalId);
            setindexIntervalId(0);
            return;
        }
        setPlayStatus(prev => ({
            ...prev,
            currentIndex: 0
        }))
        const newIntervalId = setInterval(() => goToNextIndex(), playStatus.playSpeed);
        setindexIntervalId(newIntervalId);
    }

    const getCurrentImageUrl = () => {
        if (!loaded) {
            return null;
        }
        return images[playStatus.currentCamera][playStatus.currentIndex];
    }

    const canGoPrevIndex = () => {
        return playStatus.currentIndex === 0;
    }

    const canGoNextIndex = () => {
        return playStatus.currentIndex === boundary.maxIndex - 1;
    }

    const canGoPrevCamera = () => {
        return playStatus.currentCamera === 0;
    }

    const canGoNextCamera = () => {
        return playStatus.currentCamera === boundary.maxCamera - 1;
    }

    const handleKeyPress = useCallback((e) => {
        console.log(e.code)
        switch (e.code) {
            case 'ArrowRight':
                if (!enableJoyStickMode) {
                    goToNextCamera();
                }
                break;
            case 'ArrowLeft':
                if (!enableJoyStickMode) {
                    goToPrevCamera();
                }
                break;
            case 'ArrowUp':
                if (!enableJoyStickMode) {
                    goToPrevIndex();
                }
                break;
            case 'ArrowDown':
                if (!enableJoyStickMode) {
                    goToNextIndex();
                }
                break;
            case 'Space':
                if (!enableJoyStickMode) {
                    e.preventDefault();
                    goPlay();
                }
                break;
            case 'ShiftLeft':
            case 'ShiftRight':
                setenableJoyStickMode(prev => !prev);
                if (indexIntervalId) {
                    clearInterval(indexIntervalId);
                    setindexIntervalId(0);
                    setPlayStatus(initStatus);
                    return;
                }
                break;
            default:
                break;
        }
    }, [goToNextCamera, goToPrevCamera, goToPrevIndex, goToNextIndex, goPlay])

    const handleMouseDown = (e) => {
        console.log(e.type, e.button, e.clientX, e.clientY);
        setAnchorPoint({
            px: e.clientX,
            py: e.clientY
        })
    };

    const handleMouseUp = (e) => {
        setAnchorPoint(initAnchorPoint)
    };

    const handleMouseMove = (e) => {
        const nextMove = detectNextMove(e.clientX, e.clientY);
        if (nextMove.cameraMovingDirection !== joyStickParams.cameraMovingDirection ||
            nextMove.indexSpeedMultiplier !== joyStickParams.indexSpeedMultiplier ||
            nextMove.playDirection !== joyStickParams.playDirection) {
            setjoyStickParams(nextMove);
        }
    }

    const handleMouseOut = (e) => {
        setjoyStickParams(initPlayParams);
    }

    const calculateAngle = (cx, cy, ex, ey) => {
        const dy = ey - cy;
        const dx = ex - cx;
        let theta = Math.atan2(dy, dx); // range (-PI, PI]
        theta *= 180 / Math.PI; // rads to degs, range (-180, 180]
        //if (theta < 0) theta = 360 + theta; // range [0, 360)
        return theta;
    }

    const calculateDistance = (cx, cy, ex, ey) => {
        const dy = ey - cy;
        const dx = ex - cx;
        var dis = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
        return dis;
    }

    const detectNextMove = (x, y) => {
        if (anchorPoint.px < 0 || anchorPoint.py < 0) {
            return initPlayParams;
        }
        const dis = calculateDistance(anchorPoint.px, anchorPoint.py, x, y);
        if (dis < 100) {
            return initPlayParams;
        }
        let indexSpeedMultiplier = 0;
        let cameraMovingDirection = 0;
        let playDirection = 0;
        const angle = calculateAngle(anchorPoint.px, anchorPoint.py, x, y)
        if (angle >= -22.5 && angle < 22.5) {
            cameraMovingDirection = 1;
            playDirection = 0;
            indexSpeedMultiplier = 0;
        } else if (angle >= 22.5 && angle < 67.5) {
            cameraMovingDirection = 1;
            playDirection = -1;
            indexSpeedMultiplier = calculateIndexSpeedMultiplierByDistance(dis);
        } else if (angle >= 67.5 && angle < 112.5) {
            cameraMovingDirection = 0;
            playDirection = -1;
            indexSpeedMultiplier = calculateIndexSpeedMultiplierByDistance(dis);
        } else if (angle >= 112.5 && angle < 157.5) {
            cameraMovingDirection = -1;
            playDirection = -1;
            indexSpeedMultiplier = calculateIndexSpeedMultiplierByDistance(dis);
        } else if ((angle >= 157.5 && angle <= 180) || (angle >= -180 && angle < -157.5)) {
            cameraMovingDirection = -1;
            playDirection = 0;
            indexSpeedMultiplier = 0;
        } else if (angle >= -157.5 && angle < -112.5) {
            cameraMovingDirection = -1;
            playDirection = 1;
            indexSpeedMultiplier = calculateIndexSpeedMultiplierByDistance(dis);
        } else if (angle >= -112.5 && angle < -67.5) {
            cameraMovingDirection = 0;
            playDirection = 1;
            indexSpeedMultiplier = calculateIndexSpeedMultiplierByDistance(dis);
        } else {
            cameraMovingDirection = 1;
            playDirection = 1;
            indexSpeedMultiplier = calculateIndexSpeedMultiplierByDistance(dis);
        }
        return {
            indexSpeedMultiplier,
            cameraMovingDirection,
            playDirection
        };
    }

    const calculateIndexSpeedMultiplierByDistance = (dis) => {
        if (dis < 100) {
            return 0;
        }
        if (dis >= 100 && dis < 200) {
            return 1;
        }
        if (dis >= 200 && dis < 300) {
            return 2;
        }
        if (dis >= 300 && dis < 400) {
            return 4;
        }
        return 8;
    }

    useEffect(() => {
        if (indexIntervalId) {
            clearInterval(indexIntervalId);
            setindexIntervalId(0);
        }
        if (cameraIntervalId) {
            clearInterval(cameraIntervalId);
            setcameraIntervalId(0);
        }
        if (joyStickParams.playDirection === 1) {
            setindexIntervalId(setInterval(() => goToNextIndex(), Math.ceil(30 / joyStickParams.indexSpeedMultiplier)));
        } else if (joyStickParams.playDirection === -1) {
            setindexIntervalId(setInterval(() => goToPrevIndex(), Math.ceil(30 / joyStickParams.indexSpeedMultiplier)));
        }
        if (joyStickParams.cameraMovingDirection === 1) {
            setcameraIntervalId(setInterval(() => goToNextCamera(), 500));
        } else if (joyStickParams.cameraMovingDirection === -1) {
            setcameraIntervalId(setInterval(() => goToPrevCamera(), 500));
        }
    }, [joyStickParams])

    useEffect(() => {
        // attach the event listener
        document.addEventListener('keydown', handleKeyPress);
        // remove the event listener
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mousedown', handleMouseDown);
        document.addEventListener('mouseup', handleMouseUp);
        //document.addEventListener('mouseout', handleMouseOut);
        return () => {
            document.removeEventListener('keydown', handleKeyPress);
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mousedown', handleMouseDown);
            document.removeEventListener('mouseup', handleMouseUp);
            //document.removeEventListener('mouseout', handleMouseOut);
        };
    }, [handleKeyPress]);

    return (
        <>
            <Container onMouseOut={handleMouseOut}>
                <Header title={title} playerName={playerName} />
                <Grid container alignItems="center" spacing={2}>
                    <Grid item xs={3}>
                        <Sidebar setTitle={setTitle} />
                    </Grid>
                    <Grid item xs={9}>
                        <Displayer imageSrc={getCurrentImageUrl()} disableAll={enableJoyStickMode} />
                    </Grid>
                    <Grid xsOffset={3} xs={9}>
                        <ControlPanel
                            goToNextIndex={goToNextIndex}
                            goToPrevIndex={goToPrevIndex}
                            goToNextCamera={goToNextCamera}
                            goToPrevCamera={goToPrevCamera}
                            goPlay={goPlay}
                            isPlaying={!!indexIntervalId}
                            canGoNextCamera={canGoNextCamera}
                            canGoPrevCamera={canGoPrevCamera}
                            canGoNextIndex={canGoNextIndex}
                            canGoPrevIndex={canGoPrevIndex}
                            disableAll={enableJoyStickMode}
                        />
                    </Grid>
                </Grid>
                <Switch checked={enableJoyStickMode} />
                <Typography variant='h6' color='white'>
                    Multiplier: {joyStickParams.indexSpeedMultiplier}
                    <br />
                    CameraDirection: {joyStickParams.cameraMovingDirection}
                    <br />
                    PlayDirection: {joyStickParams.playDirection}
                </Typography>
            </Container>
        </>
    )
}

export default PlayPage