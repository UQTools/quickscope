import React, {Component} from 'react';
import {withStyles} from '@material-ui/core/styles';
import {Container} from "@material-ui/core";
import Header from "./Header";
import Form from "./Form";


const styles = {
    container: {
        marginTop: '2em',
    },
}

class App extends Component {
    render() {
        return (
            <div>
                <Header/>
                <Container maxWidth="sm" style={styles.container}>
                    <Form/>
                </Container>
            </div>)
    }
}

export default withStyles(styles)(App);
