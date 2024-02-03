import React, { useState } from "react";
import { Box, Chip, Container, Typography, TextField, Button, Grid, Card, CardContent } from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import { Link } from "react-router-dom";
import { searchAsync } from "../services/searchService";

const Home = () => {
    const [products, setProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");

    const handleSearch = async (event) => {
        event.preventDefault();
        const result = await searchAsync(searchTerm);
        setProducts(result);
    };

    return (
        <Box sx={{ flexGrow: 1, backgroundColor: 'whitesmoke' }}>
            <Container maxWidth="lg">
                <Box sx={{ my: 4 }}>
                    <Typography variant="h2" gutterBottom>
                        Search Products
                    </Typography>
                    <form onSubmit={handleSearch}>
                        <Grid container spacing={2} alignItems="center">
                            <Grid item xs={10}>
                                <TextField
                                    fullWidth
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    label="Search"
                                    variant="outlined"
                                />
                            </Grid>
                            <Grid item xs={2}>
                                <Button

                                    type="submit"
                                    variant="outlined"
                                    color="primary"
                                    size="large"
                                    startIcon={<SearchIcon />}
                                >
                                    Search
                                </Button>
                            </Grid>
                        </Grid>
                    </form>
                    <Box sx={{ mt: 4 }}>
                        <Grid container spacing={2}>
                            {products.map((product) => (
                                <Grid item xs={12} key={product.uid}>
                                    <Link to={`/product/${product.uid}`} style={{ textDecoration: 'none' }}>
                                        <Card elevation={10}>
                                            <CardContent>
                                                <Typography variant="h6" sx={{
                                                    marginBottom: 1
                                                }}>
                                                    {product.name}
                                                </Typography>
                                                <Chip variant="outlined" label={`UID: ${product.uid} | Score: ${product.score}`} color="primary" />
                                                <Typography sx={{ marginTop: 1 }} variant="body1" noWrap>{product.description}</Typography>
                                            </CardContent>
                                        </Card>
                                    </Link>
                                </Grid>
                            ))}
                        </Grid>
                    </Box>
                </Box>
            </Container>
        </Box>
    );
};

export default Home;