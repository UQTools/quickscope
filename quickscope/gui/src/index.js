import * as React from "react";
import * as ReactDOM from "react-dom";
import App from "./components/App";
import { createMuiTheme } from '@material-ui/core/styles';
import grey from '@material-ui/core/colors/grey';
import green from '@material-ui/core/colors/green';
import {ThemeProvider} from "@material-ui/styles";
import { SnackbarProvider } from "notistack";

const theme = createMuiTheme({
    palette: {
        primary: {
            main: grey[900],
        },
        secondary: {
            main: green[500],
        },
    },
});


const Index = () => {
    return (
        <SnackbarProvider maxSnack={3}>
            <ThemeProvider theme={theme}>
                <App/>
            </ThemeProvider>
        </SnackbarProvider>
    )
};

ReactDOM.render(<Index/>, document.getElementById("root"));
