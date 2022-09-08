// // Library import
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useGeoda } from "../../../contexts/Geoda";
import { nanoid } from "nanoid";

import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";

import styled from "styled-components";
import { Gutter } from "../..";
import colors from "../../../config/colors";

import { VariableEditor } from "./VariableEditor";
import { Steps, StepButtons } from "./Steps";
import { FileUploader } from "./FileUploader";
import { validateGeojson } from "./utils";
import { FormButton } from "./FormButton";
import { TextField, Typography } from "@mui/material";

const ModalInner = styled.div``;

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 1140,
  maxWidth: {
    xs: "95vw",
    sm: "75vw",
    md: "50vw",
    lg: "40vw",
    xl: "30vw",
  },
  bgcolor: colors.gray,
  border: "1px solid #000",
  fontFamily: "'Lato', sans-serif",
  color: "white",
  boxShadow: 0,
  p: {
    xs: 1,
    sm: 2,
    md: 2,
    lg: 4,
    xl: 4,
  },
};

const MessageText = styled.p`
  color: ${(props) =>
    props.type === "error"
      ? colors.red
      : props.type === "wait"
        ? colors.yellow
        : colors.lightblue};
  padding: 0.5em;
`;

const FileForm = styled.form`
  opacity: ${(props) => (props.complete ? 0.5 : 1)};
  transition: 250ms all;
  transition-delay: 3s all;
  display: block;
  
  .MuiOutlinedInput-notchedOutline {
    border-color: ${colors.white};
  }
  .MuiInputLabel-root {
    color: ${colors.white};
  }
`;

const CardContainer = styled(Grid)`
  max-height: 50vh;
  overflow-y: auto;
`;

const VariableCard = styled(Card)`
  color: ${colors.black};
  &.MuiPaper-root {
    background-color: ${colors.lightgray};
    button {
      font-size: 1rem;
      background: ${colors.lightgray};
      color: ${colors.darkgray};
      border: 1px solid ${colors.darkgray};
      padding: 0.5em;
      font-family: "Lato", sans-serif;
      cursor: pointer;
      margin: 0 auto;
    }
    p {
      font-size: 1rem;
    }
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 0;
  right: 0;
  padding: 0.5em;
  background:none;
  color:white;
  border:none;
  font-size:1.5rem;
  cursor:pointer;
`;

const steps = ["Load your GeoJSON", "Configure your Variables"];

export default function DataLoader() {
  const dispatch = useDispatch();
  const open = useSelector(({ ui }) => ui.panelState.dataLoader);
  const handleClose = () =>
    dispatch({ type: "TOGGLE_PANEL", payload: "dataLoader" });

  const addIndex = (geojson) => ({
    ...geojson,
    features: geojson.features.map((feature, idx) => ({
      ...feature,
      properties: { ...feature.properties, idx },
    })),
  });

  const [uploadTab, setUploadTab] = useState(true);
  const [selectedFile, setSelectedFile] = useState("");
  const [remoteUrl, setRemoteUrl] = useState("");
  const [fileMessage, setFileMessage] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [variables, setVariables] = useState([]);
  const [editor, setEditor] = useState({ open: false, idx: false });

  const [currentGeojson, setCurrentGeojson] = useState({});
  const {
    geoda,
    // geodaReady
  } = useGeoda();

  let fileReader;
  const loadArrayBuffer = async (content) => {
    const ab = new TextEncoder().encode(JSON.stringify(content));
    const mapId = await geoda.readGeoJSON(ab);
    setCurrentGeojson((prev) => {
      return {
        ...prev,
        mapId,
      };
    });
  };

  const handleFileRead = (data = false) => {
    const content = data ? data : JSON.parse(fileReader.result);
    const [error, validGeojson] = validateGeojson(content);
    if (validGeojson) {
      const indexedGeoJson = addIndex(content);
      setCurrentGeojson({
        data: { ...indexedGeoJson },
        columns: Object.keys(indexedGeoJson.features[0].properties),
      });
      // setSelectedId(Object.keys(content.features[0].properties)[0])

      setFileMessage({
        type: "validation",
        body: `Basic validation complete 🎉 Continue to configure your variables. `,
      });

      loadArrayBuffer(content);
    } else {
      setFileMessage({
        type: "error",
        body: `Error! GeoJSON is invalid: ${error}`,
      });
    }
  };

  const fetchRemoteData = async (url) => {
    const data = await fetch(url)
      .then((response) => {
        setFileMessage({
          type: "wait",
          body: `Data loaded, validating...`,
        });
        return response.json();
      })
      .catch((error) => {
        console.log(error);
        return false;
      });
    if (data) {
      handleFileRead(data);
      setSelectedFile({
        name: url.split("/").pop(),
      });
    } else {
      setFileMessage({
        type: "error",
        body: `Error! Unable to fetch data. Please ensure your data source allows remote access.`,
      });
    }
  };

  const handleFileSubmission = (e) => {
    e.preventDefault();
    try {
      if (uploadTab) {
        fileReader = new FileReader();
        fileReader.onloadend = () => handleFileRead();
        fileReader.readAsText(selectedFile);
      } else {
        setFileMessage({
          type: "wait",
          body: `Please wait, fetching your data...`,
        });
        fetchRemoteData(remoteUrl);
      }
    } catch {
      console.log(e);
    }
  };

  const handleUploadTab = (e) => {
    e.preventDefault();
    setUploadTab(e.target.getAttribute("data-id") === "file-upload");
  };

  const handleOpenEditor = (idx) => {
    setEditor({ open: true, idx: idx });
  };

  const handleCloseEditor = () => setEditor({ open: false, idx: false });

  const handleLoadData = () => {
    const tempId = nanoid(4);

    dispatch({
      type: "LOAD_GEOJSON",
      payload: {
        [`customdata-${tempId}`]: currentGeojson,
      },
    });
    dispatch({
      type: "ADD_CUSTOM_DATA_SPECS",
      payload: {
        selectedFile,
        currentGeojson,
        variables,
        dataName: `customdata-${tempId}`,
      },
    });
    handleClose();
    handleCloseEditor();
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="loader-modal-modal-title"
      aria-describedby="loader-modal-modal-description"
    >
      <Box sx={style}>
        <ModalInner>
          <Typography variant="h3">Atlas Data Loader</Typography>
          <Typography variant="body1">
            The Atlas Data Loader helps you to visualize and analyze your data
            by loading it in the Atlas web interface. You must use a GeoJSON
            data file in the WGS84 projection.
          </Typography>
          <Gutter h={15} />
          <Steps
            activeStep={activeStep}
            setActiveStep={setActiveStep}
            steps={steps}
            currentGeojson={currentGeojson}
          />
          <Gutter h={15} />
          {activeStep === 0 && (
            <FileForm onSubmit={handleFileSubmission}>
              <Typography variant="body1" id="filename-label">
                {uploadTab
                  ? "Select your GeoJSON for Upload"
                  : "Enter a valid GeoJSON URL"}
              </Typography>
              <Gutter h={15} />
              <Typography variant="body1">
                For more information on formatting your data and privacy, click{" "}
                <a href="/data-loading">here</a>.
              </Typography>
              <Typography variant="body1">
                You can load your file directly, or select a remote link to
                fetch data from.
              </Typography>
              <Gutter h={15} />
              <Box sx={{ display: 'flex', flexDirection:'column', width:"100%"}}>
                <Box sx={{pb: 2, margin: '0 auto'}}>
                  <FormButton
                    onClick={handleUploadTab}
                    data-id={"file-upload"}
                    active={uploadTab}
                  >
                    File Upload
                  </FormButton>
                  <FormButton
                    onClick={handleUploadTab}
                    data-id={"file-link"}
                    active={!uploadTab}
                  >
                    File Link
                  </FormButton>
                </Box>
                {uploadTab && (
                  <FileUploader
                    onFileSelectSuccess={(file) => {
                      setFileMessage(false);
                      setSelectedFile(file);
                    }}
                    onFileSelectError={({ error }) =>
                      setFileMessage({
                        type: "error",
                        body: error,
                      })
                    }
                  />
                )}
                {!uploadTab && (
                  <>
                  <TextField
                    id="remoteUrl"
                    label="Remote Data URL"
                    onChange={(event) => setRemoteUrl(event.target.value)}
                    aria-describedby="remote-data-helper"
                    value={remoteUrl}
                    placeholder="eg https://raw.githubusercontent.com/..."
                  />
                  <label>
                    * must be <a style={{color:'white'}} href="https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS" target="_blank" rel="noreferrer">Cross-Origin Accessible</a>
                  </label>
                  </>
                )}
                <input type="submit" value="Validate" style={{marginTop:'1em'}} />
              </Box>
              {fileMessage && (
                <MessageText type={fileMessage.type}>
                  {fileMessage.body}
                </MessageText>
              )}
            </FileForm>
          )}
          {/* {activeStep === 1 && <>
                    <label for="idSelect">Select your data's ID column</label>
                    <Gutter h={15}/>
                    <HelperText>Choose a column that represents your data's featured ID, <br/>such as GEOID or FIPS code, ZIP code, or other geographic identifier.</HelperText>                   
                    <Gutter h={15}/>
                    <FormDropDownContainer>
                        <StyledDropDown id="idSelect">
                            <InputLabel htmlFor="idSelect">ID Column</InputLabel>
                            <Select
                                value={selectedId}
                                onChange={(event) => setSelectedId(event.target.value)}
                                >
                                {currentGeojson.columns.map(col =>  <MenuItem value={col} key={'id-col-select-'+col}>{col}</MenuItem> )}
                                
                            </Select>
                        </StyledDropDown>
                    </FormDropDownContainer>
                </>} */}
          {activeStep === 1 && (
            <>
              <label for="idSelect">Configure your variables</label>
              <Gutter h={15} />
              <CardContainer
                container
                spacing={2}
                justify="center"
                alignItems="flex-start"
              >
                {variables.map((variable, idx) => (
                  <Grid item xs={12} md={6} lg={4}>
                    <VariableCard>
                      <CardContent>
                        <p>{variable.variableName}</p>
                      </CardContent>
                      <CardActions>
                        <button onClick={() => handleOpenEditor(idx)}>
                          Edit
                        </button>
                      </CardActions>
                    </VariableCard>
                  </Grid>
                ))}
                <Grid item xs={12} md={6} lg={4}>
                  <VariableCard>
                    <CardActions>
                      <button
                        onClick={() => setEditor({ open: true, idx: false })}
                      >
                        Add a variable
                      </button>
                    </CardActions>
                  </VariableCard>
                </Grid>
              </CardContainer>
              {!!editor.open && (
                <VariableEditor
                  fileName={selectedFile.name}
                  columns={currentGeojson.columns}
                  idx={editor.idx}
                  variables={variables}
                  setVariables={setVariables}
                  handleClose={handleCloseEditor}
                />
              )}
              {!!variables.length && (
                <FormButton onClick={handleLoadData}>Load Data</FormButton>
              )}
            </>
          )}
          <Gutter h={30} />
          <StepButtons
            activeStep={activeStep}
            setActiveStep={setActiveStep}
            currentGeojson={currentGeojson}
            steps={steps}
          />
          <Gutter h={15} />
        </ModalInner>
        <CloseButton onClick={handleClose} title="Close Report Builder">
          ×
        </CloseButton>
      </Box>
    </Modal>
  );
}
