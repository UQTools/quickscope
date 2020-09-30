import {withStyles} from "@material-ui/core/styles";
import React, {Component} from "react";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import AppBar from "@material-ui/core/AppBar";


const styles = {
}

class JavaForm extends Component {
    render() {
        return (
            <div>
              <Typography variant="h4">Java Form</Typography>
            </div>
        )
    }
}


export default withStyles(styles)(JavaForm);

