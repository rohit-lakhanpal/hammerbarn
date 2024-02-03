var express = require('express');
var router = express.Router();
const SwaggerParser = require("swagger-parser");
var path = require('path');
var yaml = require('js-yaml');
var fs = require('fs');

const { getHost, getScheme } = require('../helper/utils');

const getSwaggerYaml = (req, res) => {
    var host = getHost(req, res);
    var scheme = getScheme(req, res);
    console.log("Loading YAML from ", path.resolve() + "../data/swagger.yaml");
    var yamlObject = yaml.load(fs.readFileSync(path.resolve() + "/data/swagger.yaml", "utf8"));
    yamlObject.host = host;
    yamlObject.schemes = [scheme];
    return yamlObject;
}

const getSwaggerJson = async (req, res) => {
    const yamlObject = getSwaggerYaml(req, res);                
    return await SwaggerParser.validate(yamlObject);
}

const getAiPluginJson = () => {
    return JSON.parse(fs.readFileSync(path.resolve() + "/data/ai-plugin.json", "utf8"));
}

const getUrls = (req, res) => {
    return {
        api: `${getScheme(req, res)}://${getHost(req, res)}/.well-known/openapi.yaml`,
        logo_url: `${getScheme(req, res)}://${getHost(req, res)}/images/logo.png`
    }
}

router.get('/ai-plugin.json', function (req, res, next) {
    var json = getAiPluginJson();
    var urls = getUrls(req, res);
    json.api.url = urls.api;
    json.logo_url = urls.logo_url;
    res.setHeader("Content-Type", "application/json");
    res.send(json);
});

router.get('/openapi.yaml', function (req, res, next) {
    var data = getSwaggerYaml(req, res);    
    res.setHeader("Content-Type", "application/yaml");
    res.send(yaml.dump(data));
});

router.get('/openapi.json', async (req, res, next) =>  {
    var data = await getSwaggerJson(req, res);
    res.setHeader("Content-Type", "application/json");
    res.send(data);

});

module.exports = router;
