// A basic client for fetch()-ing risk factor data

const baseDataFetch = (ticker, category) => {
    const url = "/data/" + ticker + "/" + category;
    const handler = (res) => {
        if(res.status === 200 || res.status === 0) {
            return res.json();
        } else {
            return Promise.reject(new Error(res.statusText));
        }
    };
    return fetch(url).then(handler);
};

export default {
    getStockData:       (ticker) => baseDataFetch(ticker, "stocks"),
    getNewsData:        (ticker) => baseDataFetch(ticker, "news"),
    getRawNewsData:     (material) => baseDataFetch(material, "news_raw"),
    getQuarterlyProfits:(ticker) => baseDataFetch(ticker, "reports/quarterly"),
    getAnnualProfits:   (ticker) => baseDataFetch(ticker, "reports/annual"),
    getSummary:         (ticker) => baseDataFetch(ticker, "summary"),
};
