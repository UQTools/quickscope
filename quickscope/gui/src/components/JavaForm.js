import React, {Component} from "react";
import axios from "axios";
import {
    withStyles,
    theme,
    Grid,
    Button,
    IconButton,
    Box,
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
    Divider,
    Typography,
    Checkbox,
    FormLabel,
    FormControl,
    FormGroup,
    FormHelperText,
    FormControlLabel,
    TextField,
} from "@material-ui/core";
import DescriptionIcon from '@material-ui/icons/Description';
import NotInterestedIcon from '@material-ui/icons/NotInterested';
import AddIcon from '@material-ui/icons/Add';
import {DropzoneArea} from "material-ui-dropzone";
import { withSnackbar } from "notistack";

const styles = {
    stage: {
        display: 'flex',
        justifyContent: 'space-between',
    },
    divider: {
        margin: '1em 0',
    },
}

class JavaForm extends Component {

    constructor(props) {
        super(props);

        this.state = {
            correctSolution: null,
            dependencies: [],
            conformance: {
                enabled: false,
                weighting: 0,
                violationPenalty: 1,
            },
            functionality: {
                enabled: false,
                weighting: 0,
            },
            junit: {
                enabled: false,
                weighting: 0,
                assessableTestClasses: [],
            },
            checkstyle: {
                enabled: false,
                weighting: 0,
                excluded: [],
                violationPenalty: 0.5,
            },
            excludedPathInput: "",
        };
    }

    send(component) {
        let formData = new FormData()

        formData.append("session", this.props.session);
        formData.append("component", component);
        formData.append("engine", this.props.engine)

        if (component === "linter_config") {
            let obj = this.state[component][0];
            console.log(obj)
            if (!obj || !obj.path) {
                console.log("Not a file")
            } else {
                let file = this.state[component][0]
                formData.append(file.path, file, file.path);
            }
        } else {
            this.state[component].forEach(file => {
                console.log(file);
                formData.append(file.path, file, file.path)
            });
        }

        axios({
            method: "POST",
            url: "/upload/" + component,
            data: formData,
            headers: {
                'Access-Control-Allow-Origin': '*',
                crossDomain: true,
            }
        }).then(() => {
                console.log("Success!")
            }
        ).catch((error) => {
            console.log(error)
        })
    }

    setAndSend(files, component) {
        // console.log(component, files);
        let newState = {}
        newState[component] = files;
        console.log(newState);
        this.setState(newState, () => {
            console.log(this.state);
            this.send(component);
        });
    }

    /* Passes the new stage configuration information to the parent form,
     * ready for submission */
    updateStages() {
        let newStages = {};
        newStages.conformance = this.state.conformance;
        newStages.functionality = this.state.functionality;
        newStages.junit = this.state.junit;
        newStages.checkstyle = this.state.checkstyle;
        this.props.onChangeStages(newStages);
    }

    handleStagesChange(event) {
        let newState = { ...this.state };
        newState[event.target.name].enabled = event.target.checked;
        // If unchecking a stage, set its weighting to 0
        if (!event.target.checked) {
            newState[event.target.name].weighting = 0;
        }
        this.setState(newState);
        this.updateStages();
    }

    handleWeightingChange(event) {
        let newState = { ...this.state };
        newState[event.target.name].weighting = Number(event.target.value);
        this.setState(newState);
        this.updateStages();
    }

    isValidWeighting(weighting) {
        return weighting >= 0 && weighting <= 100;
    }

    weightingErrorText(weighting) {
        if (!this.isValidWeighting(weighting)) {
            return "Must be between 0 and 100";
        }
        return "";
    }

    handlePenaltyChange(event) {
        let newState = { ...this.state };
        newState[event.target.name].violationPenalty = Number(event.target.value);
        this.setState(newState);
        this.updateStages();
    }

    isValidPenalty(penalty) {
        return penalty >= 0;
    }

    penaltyErrorText(penalty) {
        if (!this.isValidPenalty(penalty)) {
            return "Must be greater than 0";
        }
        return "";
    }

    handleClickSolutionFile(event) {
        console.log(event.target);
        let chip;
        if (event.target.classList.contains('MuiChip-label')) {
            chip = event.target;
        } else {
            chip = event.target.querySelector('.MuiChip-label');
        }
        console.log(chip);

        // Toggle whether the clicked class is assessable
        let newState = { ...this.state };
        if (newState.junit.assessableTestClasses.includes(chip.textContent)) {
            newState.junit.assessableTestClasses.splice(
                newState.junit.assessableTestClasses.indexOf(chip.textContent), 1);
        } else {
            newState.junit.assessableTestClasses.push(chip.textContent);
        }
        this.setState(newState);

        event.preventDefault();
    }

    handleExcludedPathChange(event) {
        let newState = { ...this.state };
        newState.excludedPathInput = event.target.value;
        this.setState(newState);
    }

    addExcludedPath() {
      let newState = { ...this.state };
      newState.checkstyle.excluded.push("/autograder/submission/" + this.state.excludedPathInput);
      newState.excludedPathInput = "";
      this.setState(newState);
    }

    render() {
        return (
            <Grid item container direction="column" spacing={2}>
                <Grid item>
                    <Typography variant="h4">Java Engine Configuration</Typography>
                </Grid>
                <Grid item>
                    <FormControl component="fieldset">
                        <FormLabel component="legend">Choose stages to run</FormLabel>
                        <FormGroup>
                            <Grid container spacing={2}>
                                <Grid item xs={12} style={styles.stage}>
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={this.state.conformance.enabled}
                                                onChange={event => this.handleStagesChange(event)}
                                                name="conformance"
                                            />
                                        }
                                        label="Conformance"
                                    />
                                    <Box>
                                        <TextField
                                            label="Violation Penalty"
                                            type="number"
                                            name="conformance"
                                            size="small"
                                            shrink
                                            value={this.state.conformance.violationPenalty}
                                            onChange={event => this.handlePenaltyChange(event)}
                                            error={!this.isValidPenalty(this.state.conformance.violationPenalty)}
                                            helperText={this.penaltyErrorText(this.state.conformance.violationPenalty)}
                                            disabled={!this.state.conformance.enabled}
                                            style={{ marginRight: '1em' }}
                                        />
                                        <TextField
                                            label="Weighting"
                                            type="number"
                                            name="conformance"
                                            size="small"
                                            shrink
                                            value={this.state.conformance.weighting}
                                            onChange={event => this.handleWeightingChange(event)}
                                            error={!this.isValidWeighting(this.state.conformance.weighting)}
                                            helperText={this.weightingErrorText(this.state.conformance.weighting)}
                                            disabled={!this.state.conformance.enabled}
                                        />
                                    </Box>
                                </Grid>
                                <Grid item xs={12} style={styles.stage}>
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={this.state.functionality.enabled}
                                                onChange={event => this.handleStagesChange(event)}
                                                name="functionality"
                                            />
                                        }
                                        label="Functionality"
                                    />
                                    <TextField
                                        label="Weighting"
                                        type="number"
                                        name="functionality"
                                        size="small"
                                        shrink
                                        value={this.state.functionality.weighting}
                                        onChange={event => this.handleWeightingChange(event)}
                                        error={!this.isValidWeighting(this.state.functionality.weighting)}
                                        helperText={this.weightingErrorText(this.state.functionality.weighting)}
                                        disabled={!this.state.functionality.enabled}
                                    />
                                </Grid>
                                <Grid item xs={12} style={styles.stage}>
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={this.state.junit.enabled}
                                                onChange={event => this.handleStagesChange(event)}
                                                name="junit"
                                            />
                                        }
                                        label="JUnit"
                                    />
                                    <TextField
                                        label="Weighting"
                                        type="number"
                                        name="junit"
                                        size="small"
                                        shrink
                                        value={this.state.junit.weighting}
                                        onChange={event => this.handleWeightingChange(event)}
                                        error={!this.isValidWeighting(this.state.junit.weighting)}
                                        helperText={this.weightingErrorText(this.state.junit.weighting)}
                                        disabled={!this.state.junit.enabled}
                                    />
                                </Grid>
                                <Grid item xs={12} style={styles.stage}>
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={this.state.checkstyle.enabled}
                                                onChange={event => this.handleStagesChange(event)}
                                                name="checkstyle"
                                            />
                                        }
                                        label="Checkstyle"
                                    />
                                    <Box>
                                        <TextField
                                            label="Violation Penalty"
                                            type="number"
                                            name="checkstyle"
                                            size="small"
                                            shrink
                                            value={this.state.checkstyle.violationPenalty}
                                            onChange={event => this.handlePenaltyChange(event)}
                                            error={!this.isValidPenalty(this.state.checkstyle.violationPenalty)}
                                            helperText={this.penaltyErrorText(this.state.checkstyle.violationPenalty)}
                                            disabled={!this.state.checkstyle.enabled}
                                            style={{ marginRight: '1em' }}
                                        />
                                        <TextField
                                            label="Weighting"
                                            type="number"
                                            name="checkstyle"
                                            size="small"
                                            shrink
                                            value={this.state.checkstyle.weighting}
                                            onChange={event => this.handleWeightingChange(event)}
                                            error={!this.isValidWeighting(this.state.checkstyle.weighting)}
                                            helperText={this.weightingErrorText(this.state.checkstyle.weighting)}
                                            disabled={!this.state.checkstyle.enabled}
                                        />
                                    </Box>
                                </Grid>
                            </Grid>
                        </FormGroup>
                        {/* <FormHelperText>Hello world</FormHelperText> */}
                    </FormControl>
                </Grid>
                <Grid item>
                    <DropzoneArea
                        filesLimit={1000}
                        maxFileSize={100000000}
                        useChipsForPreview={true}
                        showAlerts={false}
                        onDrop={e => {
                            this.props.enqueueSnackbar(`Added ${e.length} files`, { variant: 'success' });
                        }}
                        dropzoneText="Drop dependency libraries here..."
                        onChange={(files) => this.setAndSend(files, 'dependencies')}
                    />
                </Grid>
                <Grid item id="solutionChips">
                    <DropzoneArea
                        filesLimit={1000}
                        maxFileSize={100000000}
                        showPreviews={true}
                        showPreviewsInDropzone={false}
                        useChipsForPreview={true}
                        previewChipProps={{
                            clickable: true,
                            onClick: (event) => this.handleClickSolutionFile(event),
                        }}
                        showAlerts={false}
                        onDrop={e => {
                            this.props.enqueueSnackbar(`Added ${e.length} files`, { variant: 'success' });
                        }}
                        dropzoneText="Drop correct solution directory here..."
                        onChange={(files) => this.setAndSend(files, 'correct')}
                    />
                </Grid>
                {this.state.junit.enabled &&
                <div>
                    <Divider variant="middle" style={styles.divider} />
                    <Grid item>
                        <Typography variant="h5" gutterBottom>JUnit</Typography>
                        <Typography variant="body1">Assessable Test Classes</Typography>
                        <Typography variant="body2" color="textSecondary">Select classes by clicking on files above</Typography>
                        <List>
                            {this.state.junit.assessableTestClasses.map((c, i) =>
                            <ListItem key={i}>
                                <ListItemIcon>
                                    <DescriptionIcon />
                                </ListItemIcon>
                                <ListItemText primary={c} />
                            </ListItem>
                            )}
                        </List>
                        <DropzoneArea
                            filesLimit={1000}
                            maxFileSize={100000000}
                            useChipsForPreview={true}
                            showAlerts={false}
                            onDrop={e => {
                                this.props.enqueueSnackbar(`Added ${e.length} files`, { variant: 'success' });
                            }}
                            dropzoneText="Drop faulty solutions directory here..."
                            onChange={(files) => this.setAndSend(files, 'faulty')}
                        />
                    </Grid>
                </div>
                }
                {this.state.conformance.enabled &&
                <div>
                    <Divider variant="middle" style={styles.divider} />
                    <Grid item>
                        <Typography variant="h5" gutterBottom>Conformance</Typography>
                        <DropzoneArea
                            filesLimit={1000}
                            maxFileSize={100000000}
                            useChipsForPreview={true}
                            showAlerts={false}
                            onDrop={e => {
                                this.props.enqueueSnackbar(`Added ${e.length} files`, { variant: 'success' });
                            }}
                            dropzoneText="Drop expected structure directory here..."
                            onChange={(files) => this.setAndSend(files, 'structure')}
                        />
                    </Grid>
                </div>
                }
                {this.state.checkstyle.enabled &&
                <div>
                    <Divider variant="middle" style={styles.divider} />
                    <Grid item>
                        <Typography variant="h5" gutterBottom>Checkstyle</Typography>
                        <Typography variant="body1">Excluded Paths</Typography>
                        <List>
                            {this.state.checkstyle.excluded.map((path, i) =>
                            <ListItem key={i}>
                                <ListItemIcon>
                                    <NotInterestedIcon />
                                </ListItemIcon>
                                <ListItemText primary={path} />
                            </ListItem>
                            )}
                            {this.state.checkstyle.excluded.length == 0 &&
                            <Typography variant="subtitle1" color="textSecondary">None</Typography>
                            }
                        </List>
                        <TextField
                            label="Add excluded path"
                            type="text"
                            name="excluded_path"
                            variant="outlined"
                            shrink
                            value={this.state.excludedPathInput}
                            onChange={event => this.handleExcludedPathChange(event)}
                            onKeyPress={event => {
                                if (event.key === 'Enter') {
                                    this.addExcludedPath();
                                    event.preventDefault();
                                }
                            }}
                            helperText="Relative to submission directory, e.g. src/tms/display/"
                            style={{ marginBottom: '1em' }}
                            InputProps={{ endAdornment:
                                <IconButton
                                    onClick={event => this.addExcludedPath()}
                                >
                                    <AddIcon />
                                </IconButton>
                            }}
                        />
                        <DropzoneArea
                            filesLimit={1}
                            useChipsForPreview={true}
                            showAlerts={false}
                            onDrop={e => {
                                this.props.enqueueSnackbar(`Added ${e.length} files`, { variant: 'success' });
                            }}
                            dropzoneText="Drop Checkstyle configuration file here..."
                            onChange={(file) => this.setAndSend(file, 'linter_config')}
                        />
                    </Grid>
                </div>
                }
            </Grid>
        )
    }
}


export default withSnackbar(withStyles(styles)(JavaForm));

