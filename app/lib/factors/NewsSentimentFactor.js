import React from 'react';
import FactorBase from './FactorBase';
import RiskFactorData from './RiskFactorData';
import {BarChart, Bar, XAxis, YAxis, Tooltip, Legend} from 'recharts';

class NewsSentimentFactor extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            articles: [],
            mode: "loaded", // "loading" | "loaded" | "error"
        };
    }

    componentWillMount() {
        this._fetchNewTickerData(this.props.ticker);
        this.setState({mode: "loading"});
    }

    componentWillReceiveProps(newProps) {
        if(newProps.ticker !== this.props.ticker) {
            this._fetchNewTickerData(newProps.ticker);
            this.setState({mode: "loading"});
        }
    }

    _fetchNewTickerData(newTicker) {
        RiskFactorData.getNewsData(newTicker).then(articles => {
            this.setState({articles, mode: "loaded"});
        }).catch(err => {
            RiskFactorData.getRawNewsData(newTicker).then(articles => {
                console.log("got raw materials news instead");
                this.setState({articles, mode: "loaded"});
            }).catch(err => {
                this.setState({mode: "error"});
                console.log("Data fetching for news sentiment failed:");
                console.log(err);
            });
        });
    }

    render() {
        switch(this.state.mode) {
            case "error":
                return (
                    <FactorBase title="News Sentiment">
                        <span style={{color: "red"}}>Error loading news sentiment data.</span>
                    </FactorBase>
                );
            case "loading":
                return (
                    <FactorBase title="News Sentiment">
                        Loading...
                    </FactorBase>
                );
            case "loaded":
                return this._renderLoaded();
            default:
                return (
                    <FactorBase title="News Sentiment">
                        Something went wrong.
                    </FactorBase>
                );
        }
    }

    _renderLoaded() {
        return (this.state.articles.length > 0)
            ? this._renderWithArticles()
            : <FactorBase title="News Sentiment">
                No recent news about {this.props.ticker} to analyze.
            </FactorBase>;
    }

    _renderWithArticles() {
        const al = this.state.articles; // "Article List"

        // <li> elements which link to the actual article source webpage
        const articleLinks = al.map((article, idx) => {
            const color = article.sentimentLabel === "positive" ? "green" : "red";
            return (
                <li key={idx}>
                    <span style={{color}}>{article.sentimentScore.toFixed(2)} </span>
                    <a target="_blank" href={article.url}>{article.title}</a>
                </li>
            );
        });

        // Sentiment data
        const positiveCount = al.filter(article => article.sentimentLabel == "positive").length;
        const negativeCount = al.length - positiveCount;
        const isRisky = positiveCount < negativeCount;
        const span = isRisky
            ? {label: "negative", color: "red", count: negativeCount}
            : {label: "positive", color: "green", count: positiveCount};
        const summaryStatement = (
            <p>
                Overall, the sentiment is
                <span style={{color: span.color}}> {span.label} </span>
                ({positiveCount} pos / {negativeCount} neg articles)
            </p>
        );

        // Calculate the emotion scores for rendering as bar chart
        let anger = 0;
        let disgust = 0;
        let fear = 0;
        let joy = 0;
        let sadness = 0;
        for(let i = 0; i < al.length; i++) {
            anger += al[i].emotions.anger;
            disgust += al[i].emotions.disgust;
            fear += al[i].emotions.fear;
            joy += al[i].emotions.joy;
            sadness += al[i].emotions.sadness;
        }
        anger = parseFloat((anger/al.length).toFixed(3));
        disgust = parseFloat((disgust/al.length).toFixed(3));
        fear = parseFloat((fear/al.length).toFixed(3));
        joy = parseFloat((joy/al.length).toFixed(3));
        sadness = parseFloat((sadness/al.length).toFixed(3));

        const emotionData = [
            {label: "Anger", val: anger},
            {label: "Disgust", val: disgust},
            {label: "Fear", val: fear},
            {label: "Joy", val: joy},
            {label: "Sadness", val: sadness},
        ];

        return (
            <FactorBase isRisky={isRisky} title="News Sentiment">
                {summaryStatement}
                <ul>{articleLinks}</ul>
                <SentimentCharts data={emotionData} />
            </FactorBase>
        );
    }
}

const SentimentCharts = (props) => {
    console.log(props);
    return (
        <div>
            <h4><center>Average Emotion Score in recent news</center></h4>
            <BarChart width={400} height={200} data={props.data}>
                <Bar dataKey='val' fill='#8884d8'/>
                <XAxis dataKey="label" />
                <YAxis />
                <Tooltip />
            </BarChart>
        </div>
    );
}

export default NewsSentimentFactor;
