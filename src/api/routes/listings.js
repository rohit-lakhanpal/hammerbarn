var express = require('express');
var router = express.Router();

const ProductSearch = require('../helper/searchProducts');

/* GET listings. */
router.get('/', async function (req, res, next) {
  const query = req.query.query ? req.query.query.trim() : null;

  try {
    const productSearch = new ProductSearch();

    if(!query) {
      throw new Error('Query parameter is required');
    }

    const listings = await productSearch.searchProducts(query);

    res.setHeader("Content-Type", "application/json");
    res.send(listings);

  } catch (e) {
    res.status(400).send({ error: e.message });
  }
});

module.exports = router;
