import {withStyles} from "@material-ui/core/styles";
import React, {Component} from "react";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import AppBar from "@material-ui/core/AppBar";
import {Button} from "@material-ui/core";
import Grid from "@material-ui/core/Grid";


const styles = {
    title: {
        marginLeft: '20px',
    }
}

class Header extends Component {
    render() {
        return (
            <React.Fragment>
                <AppBar>
                    <Toolbar>
                        <Grid
                            justify="space-between" // Add it here :)
                            container
                            spacing={24}
                        >
                            <Grid item>
                                <Button color="inherit" href="/">
                                    <img src="public/dark_landscape.png" alt="logo" height={"40px"}/>
                                </Button>
                            </Grid>
                            <Grid item>
                                <Button color="inherit" href="https://quickscope.readthedocs.io/en/latest/">
                                    <img src="public/rtd.png" alt="rtd" height={"34px"}/>
                                </Button>
                            </Grid>
                        </Grid>
                    </Toolbar>
                </AppBar>
                <Toolbar /> {/* adds spacing for the fixed appbar */}
            </React.Fragment>
        )
    }
}


export default withStyles(styles)(Header);
