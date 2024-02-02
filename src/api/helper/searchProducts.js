const { OpenAIClient } = require("@azure/openai");
const {
    AzureKeyCredential,
    SearchClient
} = require("@azure/search-documents");

require('dotenv').config();

class ProductSearch {
    constructor() {
        const accountName = process.env.AZURE_SEARCH_SERVICE_NAME;
        const accountKey = process.env.AZURE_SEARCH_ADMIN_KEY;
        const indexName = process.env.AZURE_SEARCH_INDEX_NAME;
        const oaiResourceName = process.env.AZURE_OPENAI_RESOURCE_NAME;
        const oaiKey = process.env.AZURE_OPENAI_KEY;
        const embeddingsModel = process.env.AZURE_OPENAI_EMBEDDINGS_MODEL;
        this.oaiclient = new OpenAIClient(
            `https://${oaiResourceName}.openai.azure.com/`,
            new AzureKeyCredential(oaiKey)
        );
        this.oaiEmbeddingsModel = embeddingsModel;
        this.searchIndexName = indexName;
        this.client = new SearchClient(
            `https://${accountName}.search.windows.net/`,
            indexName,
            new AzureKeyCredential(accountKey)
        );
    }

    async getSearchTermVector(searchTerm) {
        const embeddings = await this.oaiclient.getEmbeddings(this.oaiEmbeddingsModel, [searchTerm]);
        return embeddings.data[0].embedding;
    }

    async searchProducts(searchTerm) {
        const searchResults = await this.client.search("*", {
            vectorSearchOptions: {
                queries: [
                    {
                        kind: "vector",
                        fields: ["descriptionVectorEn"],
                        kNearestNeighborsCount: 3,
                        // An embedding of the query "What are the most luxurious hotels?"
                        vector: await this.getSearchTermVector(searchTerm),
                    }
                ],
            },
        });

        var resultSet = [];
        for await (const result of searchResults.results) {
            resultSet.push(result);
        }
        return resultSet.map((r) => {
            return {
                uid: r.document.uid,
                name: r.document.name,
                description: r.document.description,
                attributes: r.document.attributes,
                score: r.score,
            };
        });
    }
}

module.exports = ProductSearch;