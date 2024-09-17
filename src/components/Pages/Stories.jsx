import React, { useState } from "react";
import styled from "styled-components";
import { NavBar, Footer, ContentContainer } from "../../components";
import { Box } from "@mui/system";
import {Grid, Modal, Typography} from "@mui/material";
import { ArchiveSidebar } from "../Stories/ArchiveSidebar";
import { useStories } from "../../hooks/useStories";
import { StoryContainer } from "../Stories/StoryContainer";
import { ArchiveBody } from "../Stories/ArchiveBody";

const StoriesPage = styled.div`
  background: white;
`;

const modalStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "50vw",
    boxShadow: 24,
    maxHeight: "95vh",
    overflowY: "auto",
};

const ArchiveModal = ({ open, onClose, story }) => {
    return (
        <Modal open={open} onClose={() => onClose()}>
            <Box sx={modalStyle}>
                <StoryContainer story={story} />
            </Box>
        </Modal>
    );
};

export default function Stories() {
    const [filters, setFilters] = useState([]);
    const [activeStory, setActiveStory] = useState({});
    const {
        stories,
        counts,
        // relatedStories
    } = useStories({
        filters,
    });

    return (
        <StoriesPage>
            <NavBar light />
            <ContentContainer>
                <Grid container spacing={3}>
                    <Typography variant="h5" sx={{ pb: 3, pt: 1 }}>
                        Stories Showcase
                    </Typography>

                    {/*<ArchiveSidebar
                        counts={counts}
                        setFilters={setFilters}
                        filters={filters}
                    />
                    <ArchiveBody
                        stories={stories}
                        setActiveStory={setActiveStory}
                        title="Latest Stories"
                    />*/}
                </Grid>
                <Grid container spacing={3}>
                    <Typography>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
                        labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
                        laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in
                        voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat
                        non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                    </Typography>
                </Grid>
            </ContentContainer>
            <Footer />
            <ArchiveModal
                open={!!activeStory.id}
                onClose={() => setActiveStory({})}
                story={activeStory}
            />
        </StoriesPage>
    );
}
