import React, { useState } from "react";
import styled from "styled-components";
import { NavBar, Footer, ContentContainer } from "../../components";
import { Box } from "@mui/system";
import { Grid, Modal } from "@mui/material";
import { ArchiveSidebar } from "../Stories/ArchiveSidebar";
import { useStories } from "../../hooks/useStories";
import { StoryContainer } from "../Stories/StoryContainer";
import { ArchiveBody } from "../Stories/ArchiveBody";

const ArchivePage = styled.div`
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

export default function Archive() {
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
    <ArchivePage>
      <NavBar light />
      <ContentContainer>
        <Grid container spacing={3}>
          <ArchiveSidebar
            counts={counts}
            setFilters={setFilters}
            filters={filters}
          />
          <ArchiveBody 
            stories={stories} 
            setActiveStory={setActiveStory} 
            title="Story Archive" 
            />
        </Grid>
      </ContentContainer>
      <Footer />
      <ArchiveModal
        open={!!activeStory.id}
        onClose={() => setActiveStory({})}
        story={activeStory}
      />
    </ArchivePage>
  );
}
