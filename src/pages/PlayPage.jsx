import { useState, useEffect, useCallback } from 'react';
import Displayer from '../components/Displayer';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import { Stack } from '@mui/material';
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

const PlayPage = () => {
    const [playStatus, setPlayStatus] = useState(initStatus);
    const [loadedImages, setLoadedImages] = useState(null);
    const [boundary, setBoundary] = useState({
        maxCamera: 0,
        maxIndex: 0
    });
    const [loaded, setLoaded] = useState(false);
    const [intervalId, setIntervalId] = useState(0);
    const [title, setTitle] = useState(null);
    const [playerName, setPlayerName] = useState('FELIPE MORITA')

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
        if (playStatus.currentIndex === boundary.maxIndex - 1 && intervalId) {
            clearInterval(intervalId);
            setIntervalId(0);
        }
    }, [playStatus.currentIndex, boundary.maxIndex, intervalId])

    const goToPrevIndex = () => {
        setPlayStatus(prev => ({
            ...prev,
            currentIndex: prev.currentIndex - 1 < 0 ? 0 : prev.currentIndex - 1,
        }));
    }

    const goToNextIndex = () => {
        setPlayStatus(prev => ({
            ...prev,
            currentIndex: prev.currentIndex + 1 >= boundary.maxIndex ? boundary.maxIndex - 1 : prev.currentIndex + 1,
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
        if (intervalId) {
            clearInterval(intervalId);
            setIntervalId(0);
            return;
        }
        setPlayStatus(prev => ({
            ...prev,
            currentIndex: 0
        }))
        const newIntervalId = setInterval(() => goToNextIndex(), playStatus.playSpeed);
        setIntervalId(newIntervalId);
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
                goToNextCamera();
                break;
            case 'ArrowLeft':
                goToPrevCamera();
                break;
            case 'ArrowUp':
                goToPrevIndex();
                break;
            case 'ArrowDown':
                goToNextIndex();
                break;
            case 'Space':
                goPlay();
                break;
            default:
                break;
        }
    }, [goToNextCamera, goToPrevCamera, goToPrevIndex, goToNextIndex, goPlay])

    useEffect(() => {
        // attach the event listener
        document.addEventListener('keydown', handleKeyPress);
        // remove the event listener
        return () => {
            document.removeEventListener('keydown', handleKeyPress);
        };
    }, [handleKeyPress]);

    return (
        <>
            <Container>
                <Header title={title} playerName={playerName} />
                <Grid container alignItems="center" spacing={2}>
                    <Grid item xs={3}>
                        <Sidebar setTitle={setTitle} />
                    </Grid>
                    <Grid item xs={9}>
                        <Displayer imageSrc={getCurrentImageUrl()} />
                    </Grid>
                    <Grid xsOffset={3} xs={9}>
                        <ControlPanel
                            goToNextIndex={goToNextIndex}
                            goToPrevIndex={goToPrevIndex}
                            goToNextCamera={goToNextCamera}
                            goToPrevCamera={goToPrevCamera}
                            goPlay={goPlay}
                            isPlaying={!!intervalId}
                            canGoNextCamera={canGoNextCamera}
                            canGoPrevCamera={canGoPrevCamera}
                            canGoNextIndex={canGoNextIndex}
                            canGoPrevIndex={canGoPrevIndex}
                        />
                    </Grid>
                </Grid>
            </Container>
        </>
    )
}

export default PlayPage