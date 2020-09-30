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
                        <Typography variant="h6" color="inherit" style={styles.title}>
                            Quickscope
                        </Typography>
                    </Toolbar>
                </AppBar>
                <Toolbar /> {/* adds spacing for the fixed appbar */}
            </React.Fragment>
        )
    }
}


export default withStyles(styles)(Header);
