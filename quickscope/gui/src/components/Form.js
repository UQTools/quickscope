import React, {Component} from "react";
import {Button, FormControl, Grid} from "@material-ui/core";
import TextField from "@material-ui/core/TextField";
import {DropzoneArea} from "material-ui-dropzone";
import GetAppIcon from "@material-ui/icons/GetApp";
import {withStyles} from "@material-ui/core/styles";
import { green } from '@material-ui/core/colors';
import Select from "@material-ui/core/Select";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import { cloneDeep } from "lodash";
import axios from "axios";


const styles = {
    title: {
        marginLeft: '20px',
    },
    drop: {
        marginTop: '24px',
    },
    top: {
        marginTop: '120px',
    },
    bottom: {
        marginBottom: '60px',
    },
    topAndBottom: {
        marginTop: '24px',
        marginBottom: '60px',
    },
    leftPad: {
        paddingLeft: '12px',
    },
    rightPad: {
        paddingRight: '12px',
    }
}


const ColorButton = withStyles((theme) => ({
    root: {
        color: '#FFFFFF',
        backgroundColor: green[500],
        '&:hover': {
            backgroundColor: green[700],
        },
    },
}))(Button);


class Form extends Component {

    constructor(props) {
        super(props);
        this.state = {
            course: "",
            assignmentId: "",
            engine: "",
            dependencies: [],
            linterConfig: null,
            resources: [],
            tests: [],
            correct: [],
            faulty: [],
        }
    }

    send() {
        let content = this.state;
        let formData = new FormData()
        for (let key in content) {
            formData.append(key, content[key])
        }
        axios.post("/upload", formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }}).then(() => {console.log("Success!")})
    }

    render() {
        return (
            <div>
                <Grid container direction="row" justify="center" alignItems="center">
                    <Grid item style={styles.top} xs={12} md={6}>
                        <FormControl fullWidth>
                            <TextField id="outlined-basic" label="Course Code" variant="outlined"
                            onChange={(event) =>
                            {this.setState({course: event.target.value})}}/>
                        </FormControl>
                    </Grid>
                </Grid>
                <Grid container direction="row" justify="center" alignItems="center">
                    <Grid item style={styles.drop} xs={12} md={6}>
                        <FormControl fullWidth>
                            <TextField id="outlined-basic" label="Assignment ID" variant="outlined"
                            onChange={(event) =>
                            {this.setState({assignmentId: event.target.value})}}/>
                        </FormControl>
                    </Grid>
                </Grid>
                <Grid container direction="row" justify="center" alignItems="center">
                    <Grid item style={styles.drop} xs={12} md={6}>
                        <FormControl fullWidth variant="outlined">
                            <InputLabel id="demo-simple-select-outlined-label">Engine</InputLabel>
                            <Select
                                labelId="demo-simple-select-outlined-label"
                                id="demo-simple-select-outlined"
                                value={this.state.engine}
                                label="Engine"
                                onChange={(event) =>
                                {this.setState({engine: event.target.value})}}
                            >
                                <MenuItem value="">
                                    <em>None</em>
                                </MenuItem>
                                <MenuItem value={10}>Java</MenuItem>
                                <MenuItem value={20}>Python</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                </Grid>
                <Grid container direction="row" justify="center" alignItems="center">
                    <Grid item style={styles.drop} xs={12} md={6}>
                        <DropzoneArea dropzoneText="Drop dependency libraries here..."
                                      onChange={(files) =>
                                          this.setState({dependencies: files})}
                        />
                    </Grid>
                </Grid>
                <Grid container direction="row" justify="center" alignItems="center">
                    <Grid item style={styles.drop} xs={12} md={6}>
                        <DropzoneArea filesLimit={1} dropzoneText="Drop linter configuration file here..."
                                      onChange={(files) =>
                                          this.setState({linterConfig: files})}
                        />
                    </Grid>
                </Grid>
                <Grid container direction="row" justify="center" alignItems="center">
                    <Grid item style={styles.drop} xs={12} md={6}>
                        <DropzoneArea dropzoneText="Drop static resources here..."
                                      onChange={(files) =>
                                          this.setState({resources: files})}
                        />
                    </Grid>
                </Grid>
                <Grid container direction="row" justify="center" alignItems="center">
                    <Grid item style={styles.drop} xs={12} md={6}>
                        <DropzoneArea dropzoneText="Drop test directory here..."
                                      onChange={(files) =>
                                          this.setState({tests: files})}
                        />
                    </Grid>
                </Grid>
                <Grid container direction="row" justify="center" alignItems="center">
                    <Grid item style={{...styles.drop, ...styles.rightPad}} xs={6} md={3}>
                        <DropzoneArea dropzoneText="Drop correct solution directory here..."
                                      onChange={(files) =>
                                          this.setState({correct: files})}
                        />
                    </Grid>
                    <Grid item style={{...styles.drop, ...styles.leftPad}} xs={6} md={3}>
                        <DropzoneArea dropzoneText="Drop faulty solutions directory here..."
                                      onChange={(files) =>
                                          this.setState({faulty: files})}
                        />
                    </Grid>
                </Grid>
                <Grid container direction="row" justify="center" alignItems="center">
                    <Grid item style={styles.topAndBottom} xs={12} md={6}>
                        <ColorButton fullWidth={true} endIcon={<GetAppIcon/>} color="primary" onClick={this.send.bind(this)}>
                            Generate Autograder Bundle
                        </ColorButton>
                    </Grid>

                </Grid>
            </div>
        )
    }
}

export default withStyles(styles)(Form);