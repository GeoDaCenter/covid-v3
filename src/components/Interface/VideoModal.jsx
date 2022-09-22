import React, {useState} from "react";
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
/**
 * 
 * @component
 * @category Components/Interface
 * @subcategory Interface
 * 
 * @param {Object} props 
 * @param {boolean} props.open - Whether the modal is open or not
 * @param {function} props.onClose - Function to close the modal
 * @param {string} props.title - Title of the modal
 * @param {string} props.videoUrl - Youtube video embed URL
 * 
 * @returns {JSX.Element}
 * @example
 * function myComponent() {
 *  const [open, setOpen] = useState(false);
 *  return (
        <VideoModal
            open={open}
            onClose={() => setOpen(false)}
            title="Intro Video"
            videoUrl="https://www.youtube.com/embed/pjswdUvwbFE"
        />
    )
  }
 */
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

export const SelfContainedVideoModal = ({
    buttonText="Watch Video",
    title="Tutorial video",
    videoUrl
}) => {
    const [open, setOpen] = useState(false);
    const toggleOpen = () => setOpen(open => !open);
    return <>
        <Button onClick={toggleOpen}
            sx={{
                textTransform: "none",
                fontWeight: "bold",
                background: colors.yellow,
                fontSize: '24px',
                margin: '.5em 0',
                padding: '0.25em 0.5em',
                color: 'black',
                '&:hover': {
                    background: colors.orange,
                }
            }}
            >
            <span style={{fontSize:32, lineHeight:0, marginRight: 6}}>&#9656;</span> {buttonText}
        </Button>
        <VideoModal
            open={open}
            onClose={toggleOpen}
            title={title}
            videoUrl={videoUrl}
        />
    </>

}
