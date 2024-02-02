var express = require('express');
var router = express.Router();

var path = require('path');
var yaml = require('js-yaml');
var fs = require('fs');

const { getHost, getScheme } = require('../helper/utils');

router.get('/ai-plugin.json', function (req, res, next) {
    var json = JSON.parse(fs.readFileSync(path.resolve() + "/data/ai-plugin.json", "utf8"));
    json.api.url = `${getScheme(req, res)}://${getHost(req, res)}/.well-known/openapi.yaml`;
    json.logo_url = `${getScheme(req, res)}://${getHost(req, res)}/images/logo.png`;
    res.setHeader("Content-Type", "application/json");
    res.send(json);
});

router.get('/openapi.yaml', function (req, res, next) {
    console.log(path.resolve() + "../data/swagger.yaml");
    var data = yaml.load(fs.readFileSync(path.resolve() + "/data/swagger.yaml", "utf8"));
    var host = getHost(req, res);
    var scheme = getScheme(req, res);

    if (typeof host === 'function' || typeof scheme === 'function') {
        return next(new Error('getHost or getScheme returned a function instead of a value'));
    }

    data.host = getHost(req, res);
    data.schemes = [getScheme(req, res)];
    res.setHeader("Content-Type", "application/yaml");
    res.send(yaml.dump(data));
});

module.exports = router;
