import React from "react";
import { Box, Container, Paper, Typography } from "@mui/material";


const About = () => {
    return (
        <Box sx={{
            flexGrow: 1,
            backgroundColor: 'whitesmoke',
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
        }}>
            <Container maxWidth="xl">
                <Typography variant="h3">About</Typography>
                <Typography variant="subtitle1">About this app!</Typography>

                <Typography variant="body1" gutterBottom>
                    This site has been created using the following technologies:
                    - React <br />
                    - Material-UI <br />
                </Typography>

                <Typography variant="body2" gutterBottom>
                    This site has been created using the following cloud services:
                    - Azure App Service <br />
                    - Azure AI Search Service <br />
                    - Azure OpenAI Service<br />
                </Typography>
            </Container>
        </Box>
    );
};

export default About;
