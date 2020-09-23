import React, {Component} from "react";
import {Button, FormControl, Grid} from "@material-ui/core";
import TextField from "@material-ui/core/TextField";
import {DropzoneArea} from "material-ui-dropzone";
import GetAppIcon from "@material-ui/icons/GetApp";
import {withStyles} from "@material-ui/core/styles";
import { green } from '@material-ui/core/colors';
import Select from "@material-ui/core/Select";



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
    render() {
        return (
            <div>
                <Grid container direction="row" justify="center" alignItems="center">
                    <Grid item style={styles.top} xs={12} md={6}>
                        <FormControl fullWidth>
                            <TextField id="outlined-basic" label="Course Code" variant="outlined" />
                        </FormControl>
                    </Grid>
                </Grid>
                <Grid container direction="row" justify="center" alignItems="center">
                    <Grid item style={styles.drop} xs={12} md={6}>
                        <FormControl fullWidth>
                            <TextField id="outlined-basic" label="Assignment ID" variant="outlined" />
                        </FormControl>
                    </Grid>
                </Grid>
                <Grid container direction="row" justify="center" alignItems="center">
                    <Grid item style={styles.drop} xs={12} md={6}>
                        <FormControl fullWidth variant="outlined">
                            <Select native>
                                <option value={"Java"}>Java</option>
                                <option value={"Python"}>Python</option>
                            </Select>
                        </FormControl>
                    </Grid>
                </Grid>
                <Grid container direction="row" justify="center" alignItems="center">
                    <Grid item style={styles.drop} xs={12} md={6}>
                        <FormControl fullWidth>
                            <TextField id="outlined-basic" label="Submission Path" variant="outlined" />
                        </FormControl>
                    </Grid>
                </Grid>
                <Grid container direction="row" justify="center" alignItems="center">
                    <Grid item style={styles.drop} xs={12} md={6}>
                        <FormControl fullWidth>
                            <TextField id="outlined-basic" label="Output Path" variant="outlined" />
                        </FormControl>
                    </Grid>
                </Grid>
                <Grid container direction="row" justify="center" alignItems="center">
                    <Grid item style={styles.drop} xs={12} md={6}>
                        <DropzoneArea dropzoneText="Drop dependency libraries here..."
                                      onChange={(files) => console.log('Files:', files)}
                        />
                    </Grid>
                </Grid>
                <Grid container direction="row" justify="center" alignItems="center">
                    <Grid item style={styles.drop} xs={12} md={6}>
                        <DropzoneArea filesLimit={1} dropzoneText="Drop linter configuration file here..."
                                      onChange={(files) => console.log('Files:', files)}
                        />
                    </Grid>
                </Grid>
                <Grid container direction="row" justify="center" alignItems="center">
                    <Grid item style={styles.drop} xs={12} md={6}>
                        <DropzoneArea dropzoneText="Drop static resources here..."
                                      onChange={(files) => console.log('Files:', files)}
                        />
                    </Grid>
                </Grid>
                <Grid container direction="row" justify="center" alignItems="center">
                    <Grid item style={styles.drop} xs={12} md={6}>
                        <DropzoneArea dropzoneText="Drop test directory here..."
                                      onChange={(files) => console.log('Files:', files)}
                        />
                    </Grid>
                </Grid>
                <Grid container direction="row" justify="center" alignItems="center">
                    <Grid item style={styles.drop} xs={6} md={3}>
                        <DropzoneArea dropzoneText="Drop correct solution directory here..."
                                      onChange={(files) => console.log('Files:', files)}
                        />
                    </Grid>
                    <Grid item style={styles.drop} xs={6} md={3}>
                        <DropzoneArea dropzoneText="Drop faulty solutions directory here..."
                                      onChange={(files) => console.log('Files:', files)}
                        />
                    </Grid>
                </Grid>
                <Grid container direction="row" justify="center" alignItems="center">
                    <Grid item style={styles.topAndBottom} xs={12} md={6}>
                        <ColorButton fullWidth={true} endIcon={<GetAppIcon/>} color="primary">
                            Generate Autograder Bundle
                        </ColorButton>
                    </Grid>

                </Grid>
            </div>
        )
    }
}

export default withStyles(styles)(Form);