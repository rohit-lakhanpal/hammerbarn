module.exports = {
    searchAsync: async (search) => {
        const url = `/api/listings/search?query=${search}`;
        var response = await fetch(url);
        return response.json();
    },
    getProductAsync: async (uid) => {
        const url = `/api/listings/product/${uid}`;
        var response = await fetch(url);
        return response.json();
    }
};