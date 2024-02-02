var express = require('express');
var router = express.Router();

const ProductSearch = require('../helper/searchProducts');

/* GET listings. */
router.get('/', async function (req, res, next) {
  const description = req.query.description ? req.query.description.trim() : null;

  try {
    const productSearch = new ProductSearch();

    if(!description) {
      throw new Error('Description is required');
    }

    const listings = await productSearch.searchProducts(description);

    res.setHeader("Content-Type", "application/json");
    res.send(listings);

  } catch (e) {
    res.status(400).send({ error: e.message });
  }
});

module.exports = router;
