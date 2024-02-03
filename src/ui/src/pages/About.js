import React from "react";
import { Box, Container, Typography } from "@mui/material";


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
                <Typography variant="h2">About</Typography>
                <Typography variant="subtitle1">About this app!</Typography>                
            </Container>
        </Box>
    );
};

export default About;
