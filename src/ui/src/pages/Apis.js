import React from "react";
import { Box } from "@mui/material";
import SwaggerUI from "swagger-ui-react";
import "swagger-ui-react/swagger-ui.css";

const Apis = () => {

    return (
        <Box sx={{ flexGrow: 1, backgroundColor: 'whitesmoke' }}>
            <SwaggerUI url="/.well-known/openapi.json" />
        </Box>
    );
}

export default Apis;