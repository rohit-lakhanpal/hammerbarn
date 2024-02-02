const fs = require('fs');
const path = require('path');
const { SearchClient, SearchIndexClient, AzureKeyCredential } = require("@azure/search-documents");
const { OpenAIClient } = require("@azure/openai");

class DataSeeder {


    constructor(serviceName, adminKey, indexName, oaiResourceName, oaiKey, embeddingsModel) {
        this.client = new SearchClient(
            `https://${serviceName}.search.windows.net/`,
            indexName,
            new AzureKeyCredential(adminKey)
        );

        this.indexClient = new SearchIndexClient(
            `https://${serviceName}.search.windows.net/`,
            new AzureKeyCredential(adminKey)
        );

        this.oaiclient = new OpenAIClient(
            `https://${oaiResourceName}.openai.azure.com/`,
            new AzureKeyCredential(oaiKey)
        );

        this.oaiEmbeddingsModel = embeddingsModel;
        this.searchIndexName = indexName;
    }

    async createProductSearchIndex() {
        // check if the index already exists
        try {
            await this.indexClient.getIndex(this.searchIndexName);
            console.log(`Index "${this.searchIndexName}" already exists.`);
            return;
        } catch (error) {
            if (error.statusCode !== 404) {
                console.error("Error checking index:", error.message);
                return;
            }
        }

        const index = {
            name: this.searchIndexName,
            vectorSearch: {
                algorithms: [
                    {
                        name: "vector-search-algorithm",
                        kind: "hnsw"
                    }
                ],
                profiles: [
                    {
                        name: "vector-search-profile",
                        algorithmConfigurationName: "vector-search-algorithm",
                    },
                ],
            },
            fields: [
                { name: "uid", type: "Edm.String", key: true, filterable: true, sortable: true },
                { name: "name", type: "Edm.String", searchable: true, filterable: true, sortable: true },
                { name: "description", type: "Edm.String", searchable: true, analyzer: "standard.lucene" },
                {
                    name: "attributes", type: "Collection(Edm.ComplexType)", fields: [
                        { name: "key", type: "Edm.String", searchable: true },
                        { name: "value", type: "Edm.String", searchable: true }
                    ]
                },
                { name: "isDeleted", type: "Edm.Boolean", filterable: true, sortable: true },
                // Define a vector field if you are planning to use vector search features
                // Note: The feature might need specific configuration and Azure Cognitive Search service setup
                // { name: "productVector", type: "Edm.Vector", similarityAlgorithm: "cosine", searchable: true }
                { name: "descriptionVectorEn", type: "Collection(Edm.Single)", searchable: true, vectorSearchDimensions: 1536, vectorSearchProfileName: "vector-search-profile" }
            ]
        };

        try {
            await this.indexClient.createIndex(index);
            console.log(`Index "${this.client.indexName}" was created successfully.`);
        } catch (error) {
            console.error("Error creating index:", error.message);
        }
    }

    async seedData(dataDir) {
        fs.readdir(dataDir, (err, files) => {
            if (err) {
                console.error(`Error reading directory: ${err}`);
                return;
            }

            files.forEach(file => {
                if (path.extname(file) === '.json') {
                    const filePath = path.join(dataDir, file);
                    fs.readFile(filePath, 'utf8', async (err, data) => {
                        if (err) {
                            console.error(`Error reading file ${file}: ${err}`);
                            return;
                        }

                        const product = JSON.parse(data);

                        // convert the product.uid to a string
                        product.uid = `${product.uid}`

                        // add product embeddings for product description and name
                        const embeddings = await this.oaiclient.getEmbeddings(this.oaiEmbeddingsModel, [`${product.name}\n${product.description}`]);
                        product.descriptionVectorEn = embeddings.data[0].embedding;
            
                        try {
                            await this.client.mergeOrUploadDocuments([product]);
                            console.log(`Uploaded product ${product.uid}`);
                        } catch (err) {
                            console.error(`Error uploading product ${product.uid}: ${err}`);
                        }
                    });
                }
            });
        });
    }
}

module.exports = DataSeeder;