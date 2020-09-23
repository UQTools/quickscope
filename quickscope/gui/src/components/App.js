import React, {Component} from 'react';
import {withStyles} from '@material-ui/core/styles';
import {Grid} from "@material-ui/core";
import Header from "./Header";
import Form from "./Form";


let styles = {

}

class App extends Component {
    render() {

        return (
            <div>
                <Header/>
                <Grid container direction="column">
                    <Form/>
                </Grid>
            </div>)
    }
}

export default withStyles(styles)(App);
