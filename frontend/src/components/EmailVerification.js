import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import React, { Component } from 'react';

export default class Home extends Component {
    render() {
        return (
            <>
                <Container component="main" maxWidth="xs" style={{ marginTop: 50 }}>
                    <Grid container spacing={1} alignItems="center" justify="center">
                        <Typography variant="h4" component="h1">
                            Thank you for signing up
                    </Typography>
                        <Typography variant="subtitle1" component="h2">
                            Verify your e-mail and <a href="/login">sign in</a> to start using ShareIt
                        </Typography>
                    </Grid>

                </Container>
            </>
        )
    }
}