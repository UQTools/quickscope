import * as React from "react";
import * as ReactDOM from "react-dom";
import App from "./components/App";
import { createMuiTheme } from '@material-ui/core/styles';
import grey from '@material-ui/core/colors/grey';
import deepOrange from '@material-ui/core/colors/deepOrange';
import {ThemeProvider} from "@material-ui/styles";

const theme = createMuiTheme({
    palette: {
        primary: {
            main: grey[900],
        },
        secondary: {
            main: deepOrange[500],
        },
    },
});


const Index = () => {
    return (
        <ThemeProvider theme={theme}>
            <App/>
        </ThemeProvider>
    )
};

ReactDOM.render(<Index/>, document.getElementById("root"));