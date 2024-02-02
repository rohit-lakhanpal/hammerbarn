class Utils {
    static getHost(req, res) {
        return req.headers["x-forwarded-host"] || req.headers.host;
    }

    static getScheme(req, res) {
        return req.headers["x-forwarded-proto"] || req.protocol;
    }

    static getCorsOrigins() {
        let o = [];

        if (process.env.CORS_ORIGIN) {
            process.env.CORS_ORIGIN.split(';').forEach(origin => {
                if (origin && (origin.startsWith("http://") || origin.startsWith("https://"))) {
                    o.push(origin.trim());
                }
            });
        }
        
        return o;
    }

    static getCorsOptions() {
        let options = {
            origin: Utils.getCorsOrigins(),
        };

        return options;
    }
}

module.exports = Utils;