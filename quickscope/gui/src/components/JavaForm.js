import React, {Component} from "react";
import axios from "axios";
import {
    withStyles,
    Button,
    FormControl,
    Grid,
    Toolbar,
    Typography,
    AppBar,
    TextField,
    FormHelperText
} from "@material-ui/core";
import {DropzoneArea} from "material-ui-dropzone";


const styles = {
}

class JavaForm extends Component {

    constructor(props) {
        super(props);

        this.state = {
            correctSolution: null,
            dependencies: [],
            conformance: {
                weighting: 0,
                expectedStructure: null,
                violationPenalty: 1,
            },
            functionality: {
                weighting: 0,
                testDirectory: null,
                included: null,
            },
            junit: {
                weighting: 0,
                faultySolutions: null,
                assessableTestClasses: '',
            },
            checkstyle: {
                weighting: 0,
                config: null,
                jar: null,
                excluded: '',
            },
        };
    }

    send(component) {
        let formData = new FormData()

        formData.append("session", this.props.session);
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

    render() {
        return (
            <Grid item container direction="column" spacing={3}>
                <Grid item>
                    <Typography variant="h4">Java Engine Configuration</Typography>
                </Grid>
                <Grid item>
                    <DropzoneArea
                        dropzoneText="Drop dependency libraries here..."
                        onChange={(files) => this.setAndSend(files, 'dependencies')}
                    />
                </Grid>
                <Grid item>
                    <DropzoneArea
                        filesLimit={1}
                        dropzoneText="Drop linter configuration file here..."
                        onChange={(file) => this.setAndSend(file, 'linter_config')}
                    />
                </Grid>
                <Grid item>
                    <DropzoneArea
                        dropzoneText="Drop static resources here..."
                        onChange={(files) => this.setAndSend(files, 'resources')}
                    />
                </Grid>
                <Grid item>
                    <DropzoneArea
                        dropzoneText="Drop test directory here..."
                        onChange={(files) => this.setAndSend(files, 'tests')}
                    />
                </Grid>
                <Grid item>
                    <DropzoneArea
                        dropzoneText="Drop correct solution directory here..."
                        onChange={(files) => this.setAndSend(files, 'correct')}
                    />
                </Grid>
                <Grid item>
                    <DropzoneArea
                        dropzoneText="Drop faulty solutions directory here..."
                        onChange={(files) => this.setAndSend(files, 'faulty')}
                    />
                </Grid>
            </Grid>
        )
    }
}


export default withStyles(styles)(JavaForm);

