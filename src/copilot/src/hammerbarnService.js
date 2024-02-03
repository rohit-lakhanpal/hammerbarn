const axios = require('axios');

class HammerbarnService {
  constructor() {
    this.client = axios.create({
      baseURL: process.env.HAMMER_BARN_API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  async searchProducts(query) {
    try {
      const response = await this.client.get('/api/listings/search', {
        params: { query },
      });
      return response.data;
    } catch (error) {
      console.error('Error searching for products:', error.message);
      throw error;
    }
  }

  async getProductById(id) {
    try {
      const response = await this.client.get(`/api/listings/product/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error retrieving product by ID:', error.message);
      throw error;
    }
  }
}

module.exports = HammerbarnService;
