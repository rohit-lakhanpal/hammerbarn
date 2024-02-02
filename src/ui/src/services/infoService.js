export const infoService = {
    getAppInfoAsync: async () => {
        return {
            "app": {
                "name": "Hammerbarn",
                "description": "powered by azure",
                "repositoryOptional": "https://github.com/rohit-lakhanpal/hammerbarn"
            }
        };
    }
};