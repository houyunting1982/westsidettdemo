import Cursor from "../../asserts/images/Cusors/cursor-1.png";
import { CircularProgress, styled } from "@mui/material";
import { Container, Stack } from "@mui/system";
import React, { useEffect, useRef, useCallback } from "react";

const JoyStickCursor = styled('img')(({
    pointerEvents: 'none',
    /* doing this makes sure .elementFromPoint
    do not acquires the image cursor object */
    position: 'absolute',
}));

const Screen = styled('img')(({
    width: '100%',
    userSelect: 'none'
}));

const Displayer = ({
    imageSrc,
    enableJoyStickMode,
    setjoyStickParams,
    resetjoyStickParams
}) => {
    const imageRef = useRef(null);
    const cursorRef = useRef(null);
    const setSpeedAndCamera = useCallback((top, left, height, width) => {
        const widthStep = width / 7;
        const heightStep = height / 10;
        let indexSpeedMultiplier = 0;
        let playDirection = 0;
        let cameraMovingDirection = 0;

        if (left <= widthStep * 3) {
            cameraMovingDirection = -1;
        } else if (left <= widthStep * 4) {
            cameraMovingDirection = 0;
        } else {
            cameraMovingDirection = 1;
        }

        if (top <= heightStep * 1) {
            indexSpeedMultiplier = 1;
            playDirection = 1;
        } else if (top <= heightStep * 2) {
            indexSpeedMultiplier = 0.5;
            playDirection = 1;
        } else if (top <= heightStep * 3) {
            indexSpeedMultiplier = 0.25;
            playDirection = 1;
        } else if (top <= heightStep * 4) {
            indexSpeedMultiplier = 0.1;
            playDirection = 1;
        } else if (top <= heightStep * 5) {
            indexSpeedMultiplier = 0;
            playDirection = 0;
        } else if (top <= heightStep * 7) {
            indexSpeedMultiplier = 0.1;
            playDirection = -1;
        } else if (top <= heightStep * 8) {
            indexSpeedMultiplier = 0.25;
            playDirection = -1;
        } else if (top <= heightStep * 9) {
            indexSpeedMultiplier = 0.5;
            playDirection = -1;
        } else {
            indexSpeedMultiplier = 1;
            playDirection = -1;
        }

        setjoyStickParams({
            indexSpeedMultiplier,
            playDirection,
            cameraMovingDirection
        })
    }, [setjoyStickParams]);

    useEffect(() => {
        if (enableJoyStickMode && imageRef?.current && cursorRef?.current) {
            const { clientHeight, clientWidth } = imageRef.current;
            console.log(`Image: H ${clientHeight}, W ${clientWidth}`)
            const { height, width } = cursorRef.current.style
            cursorRef.current.style.display = 'flex';
            cursorRef.current.style.top = clientHeight / 2 + height + 'px';
            cursorRef.current.style.left = clientWidth / 2 + width + 'px';
        }
        if (!enableJoyStickMode) {
            cursorRef.current.style.display = 'none';
        }
        // lack of auto adjustment once zoom in/out
    }, [enableJoyStickMode])

    const handleMouseMove = useCallback((e) => {
        const imageHeight = imageRef.current.clientHeight;
        const imageWidth = imageRef.current.clientWidth;

        const top = parseFloat(cursorRef.current.style.top.replace('px', ''));
        const left = parseFloat(cursorRef.current.style.left.replace('px', ''));
        let nextTop = top + e.movementY;
        let nextLeft = left + e.movementX;

        // Just a rough size to represent the cursor rectangle.
        if (nextTop < 25) {
            nextTop = 25;
        }
        if (nextTop > imageHeight) {
            nextTop = imageHeight;
        }

        if (nextLeft < 25) {
            nextLeft = 25;
        }
        if (nextLeft > imageWidth + 10) {
            nextLeft = imageWidth + 10;
        }
        cursorRef.current.style.top = nextTop + 'px';
        cursorRef.current.style.left = nextLeft + 'px';
        setSpeedAndCamera(nextTop, nextLeft, imageHeight, imageWidth + 10);
    }, [setSpeedAndCamera]);

    useEffect(() => {
        if (enableJoyStickMode) {
            window.addEventListener("mousemove", handleMouseMove);
        } else {
            window.removeEventListener('mousemove', handleMouseMove);
            resetjoyStickParams();
        }
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, [enableJoyStickMode, resetjoyStickParams, handleMouseMove]);

    return (
        <Stack>
            <Container sx={{ p: 3, position: 'relative' }}>
                <JoyStickCursor
                    id="cursor"
                    src={Cursor}
                    width="16"
                    height="20"
                    ref={cursorRef}
                />
                {
                    imageSrc ?
                        <Screen
                            type='image'
                            id='img'
                            src={imageSrc}
                            alt="tabletennis"
                            ref={imageRef}
                            sx={{ cursor: 'none' }}
                        />
                        : <CircularProgress color="success" />
                }
            </Container>
        </Stack>
    );
};

export default Displayer;
