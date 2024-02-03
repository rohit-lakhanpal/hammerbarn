import React, { useState, useEffect } from "react";
import { Box, Container, Typography, Card, CardContent, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Divider, Button } from "@mui/material";
import { useParams } from "react-router-dom";
import { getProductAsync } from "../services/searchService";

const Product = () => {
    const { uid } = useParams();
    const [product, setProduct] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const result = await getProductAsync(uid);
                if (result) {
                    setProduct(result);
                } else {
                    setError('Product not found');
                }
            } catch (err) {
                setError('An error occurred while fetching the product');
            }
        };

        fetchProduct();
    }, [uid]);

    if (error) {
        return <Typography variant="h6" color="error">{error}</Typography>;
    }

    if (!product) {
        return <Typography>Loading...</Typography>;
    }

    return (
        <Container maxWidth="md">
            <Box sx={{ my: 4 }}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Typography variant="h2" gutterBottom>
                            {product.name}
                        </Typography>                        
                        <Button variant="contained" color="primary" onClick={() => alert('Yay, your product is on its way!')}>
                            Buy product #{product.uid}                            
                        </Button>
                    </Grid>
                    <Grid item xs={12}>
                        <Card>
                            <CardContent>
                                <Typography variant="subtitle1" color="secondary" paragraph>About this product:</Typography>
                                <Typography variant="body1" paragraph>{product.description}</Typography>
                                <Typography variant="subtitle1" color="secondary" paragraph>Attributes:</Typography>
                                <Divider />
                                <TableContainer>
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>Key</TableCell>
                                                <TableCell>Value</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {product.attributes.map((attr, index) => (
                                                <TableRow key={index}>
                                                    <TableCell>{attr.key}</TableCell>
                                                    <TableCell>{attr.value}</TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </Box>
        </Container>
    );
};

export default Product;