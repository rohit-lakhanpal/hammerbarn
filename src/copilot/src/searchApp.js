const { TeamsActivityHandler, CardFactory } = require("botbuilder");
const ACData = require("adaptivecards-templating");
const productCard = require("./adaptiveCards/productCard.json");
const HammerbarnService = require('./hammerbarnService');
const hammerbarnService = new HammerbarnService();

class SearchApp extends TeamsActivityHandler {
  constructor() {
    super();
  }

  async handleTeamsMessagingExtensionQuery(context, query) {
    const searchQuery = query.parameters[0].value;

    if (!searchQuery || !searchQuery.trim() === "" || searchQuery.trim().length < 3){
      return {
        composeExtension: {
          type: "message",
          text: "Please enter a search query with three or more characters.",
        },
      };
    }
    console.log('Search Query:', searchQuery);
    const searchResults = await hammerbarnService.searchProducts(searchQuery);
    //console.log('Search Results:', searchResults);

    if (searchResults.length === 0) {
      return {
        composeExtension: {
          type: "message",
          text: "No results found",
        },
      };
    }

    const attachments = [];
    searchResults.forEach((obj)=>{      
      const template = new ACData.Template(productCard);
      let truncatedObj = obj;      
      if(obj.attributes && obj.attributes.length > 6){
        truncatedObj.attributes = obj.attributes.slice(0,6);
      }
      truncatedObj.buyMe = `${process.env.HAMMER_BARN_API_BASE_URL}/product/${obj.uid}`;
      const newCard = template.expand({
        $root: truncatedObj,
      });      
      const preview = CardFactory.heroCard(obj.name);      
      const attachment = { ...CardFactory.adaptiveCard(newCard), preview };
      attachments.push(attachment);
    })

    return {
      composeExtension: {
        type: "result",
        attachmentLayout: "list",
        attachments: attachments,
      },
    };
  }
}

module.exports.SearchApp = SearchApp;
