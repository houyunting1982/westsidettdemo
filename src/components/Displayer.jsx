import { CircularProgress } from "@mui/material";
import { Container, Stack } from "@mui/system";
import React, { } from "react";

const Displayer = ({ imageSrc }) => {

    // const handleSpeedChange = (event) => {
    //     if (intervalId) {
    //         clearInterval(intervalId);
    //         setIntervalId(0);
    //         const newIntervalId = setInterval(() => nextView(currentClip.currentCamera), event.target.value);
    //         setIntervalId(newIntervalId);
    //     }
    //     setplaySpeed(event.target.value);
    // };

    // const handleKeyPress = useCallback((e) => {
    //     switch (e.key) {
    //         case 'ArrowRight':
    //         case 'n':
    //             nextCamera();
    //             break;
    //         case 'ArrowLeft':
    //         case 'p':
    //             preCamera();
    //             break;
    //         case 'ArrowUp':
    //             if (!intervalId) {
    //                 nextFrame(3);
    //             }
    //             break;
    //         case 'ArrowDown':
    //             if (!intervalId) {
    //                 preFrame(3);
    //             }
    //             break;
    //         default:
    //             break;
    //     }
    // }, [intervalId])

    // useEffect(() => {
    //     // attach the event listener
    //     document.addEventListener('keydown', handleKeyPress);
    //     // remove the event listener
    //     return () => {
    //         document.removeEventListener('keydown', handleKeyPress);
    //     };
    // }, [handleKeyPress]);

    // useEffect(() => {
    //     if (currentClip.currentFrame === frameMax && intervalId) {
    //         clearInterval(intervalId);
    //         setIntervalId(0);
    //     }
    // }, [currentClip.currentFrame, intervalId])

    return (
        <Stack>
            <Container sx={{ p: 3 }}>
                {
                    imageSrc ?
                        <img id='img' src={imageSrc} alt="tabletennis" width="100%" />
                        : <CircularProgress color="success" />
                }
            </Container>

        </Stack>
    );
};

export default Displayer;
