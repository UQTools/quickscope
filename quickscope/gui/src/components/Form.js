import React, {Component} from "react";
import {Button, FormControl, Grid} from "@material-ui/core";
import TextField from "@material-ui/core/TextField";
import {DropzoneArea} from "material-ui-dropzone";
import GetAppIcon from "@material-ui/icons/GetApp";
import {withStyles} from "@material-ui/core/styles";
import {green} from '@material-ui/core/colors';
import Select from "@material-ui/core/Select";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import axios from "axios";
import {v4 as uuid4} from "uuid";


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
            session: uuid4(),
            course: "",
            assignment_id: "",
            engine: "",
            dependencies: [],
            linter_config: null,
            resources: [],
            tests: [],
            correct: [],
            faulty: [],
        }
    }

    send(component) {
        let formData = new FormData()

        formData.append("session", this.state.session);
        formData.append("component", component);

        if (component === "linter_config") {
            if (typeof this.state[component] !== File) {

            } else {
                let file = this.state[component]
                formData.append(file.path, file, file.path);
            }
        } else {
            this.state[component].forEach(file => {
                console.log(file);
                formData.append(file.path, file, file.path)
            });
        }

        console.log(formData);

        axios({
            method: "POST",
            url: "http://0.0.0.0:5000/" + component,
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
        console.log(component, files);
        let newState = {}
        newState[component] = files;
        console.log(newState);
        this.setState(newState, () => {
            console.log(this.state);
            this.send(component);
        });
    }

    generate() {
        let formData = new FormData()

        formData.append("session", this.state.session);
        formData.append("course", this.state.course);
        formData.append("assignment_id", this.state.assignment_id);
        formData.append("engine", this.state.session);

        axios({
            method: "POST",
            url: "http://0.0.0.0:5000/generate",
            data: formData,
            crossDomain: true,
            headers: {
                'Content-Type': 'multipart/form-data',
                'Access-Control-Allow-Origin': '*',
                crossDomain: true,
            }
        }).then((response) => {
            console.log("Success!")
        })
    }

    render() {
        return (
            <div>
                <Grid container direction="row" justify="center" alignItems="center">
                    <Grid item style={styles.top} xs={12} md={6}>
                        <FormControl fullWidth>
                            <TextField id="outlined-basic" label="Course Code" variant="outlined"
                                       onChange={(event) => {
                                           this.setState({course: event.target.value})
                                       }}/>
                        </FormControl>
                    </Grid>
                </Grid>
                <Grid container direction="row" justify="center" alignItems="center">
                    <Grid item style={styles.drop} xs={12} md={6}>
                        <FormControl fullWidth>
                            <TextField id="outlined-basic2" label="Assignment ID" variant="outlined"
                                       onChange={(event) => {
                                           this.setState({assignmentId: event.target.value})
                                       }}/>
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
                                onChange={(event) => {
                                    this.setState({engine: event.target.value})
                                }}
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
                                          this.setAndSend(files, 'dependencies')}
                        />
                    </Grid>
                </Grid>
                <Grid container direction="row" justify="center" alignItems="center">
                    <Grid item style={styles.drop} xs={12} md={6}>
                        <DropzoneArea filesLimit={1} dropzoneText="Drop linter configuration file here..."
                                      onChange={(file) =>
                                          this.setAndSend(file, 'linter_config')}
                        />
                    </Grid>
                </Grid>
                <Grid container direction="row" justify="center" alignItems="center">
                    <Grid item style={styles.drop} xs={12} md={6}>
                        <DropzoneArea dropzoneText="Drop static resources here..."
                                      onChange={(files) =>
                                          this.setAndSend(files, 'resources')}
                        />
                    </Grid>
                </Grid>
                <Grid container direction="row" justify="center" alignItems="center">
                    <Grid item style={styles.drop} xs={12} md={6}>
                        <DropzoneArea dropzoneText="Drop test directory here..."
                                      onChange={(files) =>
                                          this.setAndSend(files, 'tests')}
                        />
                    </Grid>
                </Grid>
                <Grid container direction="row" justify="center" alignItems="center">
                    <Grid item style={{...styles.drop, ...styles.rightPad}} xs={6} md={3}>
                        <DropzoneArea dropzoneText="Drop correct solution directory here..."
                                      onChange={(files) =>
                                          this.setAndSend(files, 'correct')}
                        />
                    </Grid>
                    <Grid item style={{...styles.drop, ...styles.leftPad}} xs={6} md={3}>
                        <DropzoneArea dropzoneText="Drop faulty solutions directory here..."
                                      onChange={(files) =>
                                          this.setAndSend(files, 'faulty')}
                        />
                    </Grid>
                </Grid>
                <Grid container direction="row" justify="center" alignItems="center">
                    <Grid item style={styles.topAndBottom} xs={12} md={6}>
                        <ColorButton fullWidth={true} endIcon={<GetAppIcon/>} color="primary"
                                     onClick={this.generate.bind(this)}>
                            Generate Autograder Bundle
                        </ColorButton>
                    </Grid>

                </Grid>
            </div>
        )
    }
}

export default withStyles(styles)(Form);