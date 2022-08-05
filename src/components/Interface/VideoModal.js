import React from "react";
import styled from "styled-components";
import { Button, Modal, Box } from "@mui/material";
import colors from "../../config/colors";

const VideoModalBox = styled(Box)`
	position:absolute;
	left: 50%;
	top: 50%;
	transform: translate(-50%, -50%);
	width: 50vw;
	background: ${colors.darkgray};
	border: 1px solid ${colors.black};
	box-shadow: 0px 0px 4px rgba(0, 0, 0, 0.35);
	padding:2em;
	iframe {
		width: 100%;
		max-width:100%;
		aspect-ratio:16/9;
	}
	@media (max-width: 900px) {
		width: 100vw;
	}
`
const VideoModalInner = styled.div`
	width:100%;
	height:100%;
	position:relative;
    color: white;
	h3 {
		margin:.5em 0;
        font-size:2rem;
	}
`

const CloseButton = styled(Button)`
	position:absolute !important;
	top:0;
	right:0;
	background: ${colors.darkgray};
	outline:none;
`

export const VideoModal = ({
    open,
    onClose,
    title,
    videoUrl,
}) => {
    
    return  <Modal
        open={open}
        onClose={onClose}
        aria-labelledby="video-modal"
        aria-describedby="video-modal-description"
        // className={styles.videoModal}
    >
        <VideoModalBox>
            <VideoModalInner>
            <CloseButton onClick={onClose}>
                &times;
            </CloseButton>
            <h3> 
                {title}
            </h3>
            <iframe
                src={videoUrl}
                title={title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
            />
            </VideoModalInner>
        </VideoModalBox>
    </Modal>
}