import {withStyles} from "@material-ui/core/styles";
import React, {Component} from "react";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import AppBar from "@material-ui/core/AppBar";


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
                        <img src="public/dark_landscape.png" alt="logo" height={"40px"}/>
                    </Toolbar>
                </AppBar>
                <Toolbar /> {/* adds spacing for the fixed appbar */}
            </React.Fragment>
        )
    }
}


export default withStyles(styles)(Header);
