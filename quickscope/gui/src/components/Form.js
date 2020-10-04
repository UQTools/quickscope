import React, {Component} from "react";
import JavaForm from "./JavaForm";
import PythonForm from "./PythonForm";
import {Button, FormControl, Grid} from "@material-ui/core";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import FormHelperText from "@material-ui/core/FormHelperText";
import GetAppIcon from "@material-ui/icons/GetApp";
import {withStyles} from "@material-ui/core/styles";
import Select from "@material-ui/core/Select";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import axios from "axios";
import {v4 as uuid4} from "uuid";
import { saveAs } from 'file-saver';

const styles = {}

class Form extends Component {

    constructor(props) {
        super(props);
        this.state = {
            session: uuid4(),
            course: "",
            assignmentId: "",
            engine: "",
            javaStages: null,
        }
    }

    generate() {
        let formData = new FormData()

        formData.append("session", this.state.session);
        formData.append("course", this.state.course);
        formData.append("assignment_id", this.state.assignmentId);
        formData.append("engine", this.state.engine);
        
        if (this.state.engine === 'JavaEngine') {
            formData.append("java_stages", JSON.stringify(this.state.javaStages));
            console.log(JSON.stringify(this.state.javaStages));
        }

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
            saveAs(response.data, "autograder.zip");
        })
    }

    getEngineForm() {
      switch (this.state.engine) {
        case 'JavaEngine':
          return <JavaForm
              session={this.state.session}
              onChangeStages={(newStages) => this.handleChangeJavaStages(newStages)}
            />;
        case 'PythonEngine':
          return <PythonForm session={this.state.session} />;
        default:
          return '';
      }
    }

    handleChangeJavaStages(newStages) {
        let newState = { ...this.state };
        newState.javaStages = newStages;
        this.setState(newState);
    }

    render() {
        return (
            <Grid container direction="column" spacing={3}>
                <Grid item>
                    <Typography variant="h2">Create Autograder</Typography>
                </Grid>
                <Grid item>
                    <FormControl fullWidth>
                        <TextField
                            label="Course Code"
                            variant="outlined"
                            helperText="Course code of this assignment, e.g. CSSE2002"
                            autoFocus
                            onChange={(event) => {
                                this.setState({course: event.target.value})
                            }}
                        />
                    </FormControl>
                </Grid>
                <Grid item>
                    <FormControl fullWidth>
                        <TextField
                            label="Assignment ID"
                            variant="outlined"
                            helperText="Human readable identifer, e.g. ass1"
                            onChange={(event) => {
                                this.setState({assignmentId: event.target.value})
                            }}
                        />
                    </FormControl>
                </Grid>
                <Grid item>
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
                            <MenuItem value="JavaEngine">JavaEngine</MenuItem>
                            <MenuItem value="PythonEngine">PythonEngine</MenuItem>
                        </Select>
                        <FormHelperText>ChalkBox engine to use when processing submission</FormHelperText>
                    </FormControl>
                </Grid>
                {this.getEngineForm()}
                <Grid item>
                    <Button
                        fullWidth={true}
                        endIcon={<GetAppIcon/>}
                        disabled={this.state.engine === ''}
                        variant="contained"
                        color="secondary"
                        onClick={this.generate.bind(this)}
                    >
                        Generate Autograder Bundle
                    </Button>
                </Grid>
            </Grid>
        )
    }
}

export default withStyles(styles)(Form);
