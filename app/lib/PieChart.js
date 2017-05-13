import React from 'react';

const dataset = [
    { label: 'Betelgeuse', count: 20 },
    { label: 'Cantaloupe', count: 30 }
];

const dataset2 = [
    { label: 'Betelgeuse', count: 40 },
    { label: 'Cantaloupe', count: 10 }
];

// Parameters in the function below are:
// dataset: input
// elemeninfo: The div class which will contain the tag
const PieChart = (props) => {
    /*const radius = Math.min(width, height) / 2;
    //const color = d3.scaleOrdinal(d3.schemeCategory20b);
    const color = d3.scaleOrdinal()
        .range(['#A6022B', '#648C85', '#B3F2C9', '#228C18', '#C3F25C']);

    const svg = d3.select(elementinfo)
        .append('svg')
        .attr('width', width)
        .attr('height', height)
        .append('g')
        .attr('transform', 'translate(' + (width / 2) +  ',' + (height / 2) + ')');

    const arc = d3.arc()
        .innerRadius(0)
        .outerRadius(radius);

    const pie = d3.pie()
        .value(d => d.count)
        .sort(null);

    const path = svg.selectAll('path')
        .data(pie(dataset))
        .enter()
        .append('path')
        .attr('d', arc)
        .attr('fill', function(d, i) {*/
    //return color(d.data.label);
    const transformAttr = "translate(" + props.width/2 + "," + props.height/2 + ")";
    return (
        <svg width={props.width} height={props.height}>
            <g transform={transformAttr}>
            </g>
        </svg>
    );
}

export { PieChart };

//drawPieChart(dataset, '#chart', 300, 300)

//drawPieChart(dataset2,'#chart2', 200, 200)
