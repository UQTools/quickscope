import {withStyles} from "@material-ui/core/styles";
import React, {Component} from "react";
import axios from "axios";
import {
    Toolbar,
    Typography,
    AppBar,
    Grid,
    FormControl,
    TextField,
} from "@material-ui/core";
import {DropzoneArea} from "material-ui-dropzone";

const styles = {
}

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

        if (component === "included") {
            this.state[component].forEach(file => {
                console.log(file);
                if (typeof file !== File) {
                    return;
                }
                formData.append(file.path, file, file.path)
            });
        } else {
            if (!(this.state[component][0] instanceof File)) {
                return;
            } else {
                let file = this.state[component][0]
                formData.append(file.path, file, file.path);
            }
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
                    <Typography variant="h4">Python Engine Configuration</Typography>
                </Grid>
                <Grid item>
                    <FormControl fullWidth>
                        <TextField
                            label="File Name"
                            variant="outlined"
                            helperText="Name of submitted file without extension, e.g. a1"
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
                            label="Expected Extension"
                            variant="outlined"
                            helperText="Expected file extension of submitted file, e.g. .py"
                            autoFocus
                            onChange={(event) => {
                                this.setState({expectedExtension: event.target.value})
                            }}
                        />
                    </FormControl>
                </Grid>
                <Grid item>
                    <DropzoneArea
                        filesLimit={1}
                        dropzoneText="Drop test runner here..."
                        onChange={(files) => this.setAndSend(files, 'runner')}
                    />
                </Grid>
                <Grid item>
                    <DropzoneArea
                        filesLimit={1}
                        dropzoneText="Drop JSON formatter here..."
                        onChange={(files) => this.setAndSend(files, 'formatter')}
                    />
                </Grid>
                <Grid item>
                    <DropzoneArea
                        dropzoneText="Drop included directory here..."
                        onChange={(files) => this.setAndSend(files, 'included')}
                    />
                </Grid>
            </Grid>
        )
    }
}


export default withStyles(styles)(PythonForm);


