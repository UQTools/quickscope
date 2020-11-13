import {withStyles} from "@material-ui/core/styles";
import React, {Component} from "react";
import axios from "axios";
import {Typography, Grid, FormControl, TextField} from "@material-ui/core";
import {DropzoneArea} from "material-ui-dropzone";


const styles = {}

class PythonForm extends Component {

    constructor(props) {
        super(props);

        this.state = {
            fileName: '',
            expectedExtension: '',
            runner: null,
            formatter: null,
            included: [],
        }
    }

    send(component) {
        let formData = new FormData()

        formData.append("session", this.props.session);
        formData.append("component", component);
        formData.append("engine", this.props.engine)
        formData.append("runner", this.state.runner)

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

        console.log(formData);
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
                    <Typography variant="h4">Python Engine Configuration</Typography>
                </Grid>
                <Grid item>
                    <FormControl fullWidth>
                        <TextField
                            label="File Name"
                            variant="outlined"
                            helperText="Name of submitted file (without extension, e.g. a1)"
                            autoFocus
                            onChange={(event) => {
                                this.setState({fileName: event.target.value})
                            }}
                        />
                    </FormControl>
                </Grid>
                <Grid item>
                    <FormControl fullWidth>
                        <TextField
                            label="Test Runner Name"
                            variant="outlined"
                            helperText="(Just the) Name of the test file (with extension, e.g. test_a1.py). This should be included in the `included` directory."
                            autoFocus
                            onChange={(event) => {
                                this.setState({runner: event.target.value})
                            }}
                        />
                    </FormControl>
                </Grid>
                <Grid item>
                    <DropzoneArea
                        filesLimit={1000}
                        dropzoneText="Drop included directory here..."
                        onChange={(files) => this.setAndSend(files, 'included')}
                    />
                </Grid>
                <Grid item>
                    <DropzoneArea
                        filesLimit={1}
                        dropzoneText="Drop visible tests file here..."
                        onChange={(files) => this.setAndSend(files, 'visible')}
                    />
                </Grid>
                <Grid item>
                    <DropzoneArea
                        filesLimit={1}
                        dropzoneText="Drop JSON formatter here..."
                        onChange={(files) => this.setAndSend(files, 'formatter')}
                    />
                </Grid>
            </Grid>
        )
    }
}


export default withStyles(styles)(PythonForm);


