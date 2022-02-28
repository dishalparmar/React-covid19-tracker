import React, { useEffect, useState } from 'react';
import {  Line } from 'react-chartjs-2';
import { Chart as ChartJS } from 'chart.js/auto'
import numeral from 'numeral';

const options = {
    plugins: {
        legend: {
            display: false,
        },
    },
    elements: {
        point: {
            radius: 0
        },
    },
    maintainAspectRatio: true,
    tooltips: {
        mode: 'index',
        intersect: false,
        callbacks: {
            label: function(tooltipItem, data) {
                return numeral(tooltipItem.value).format('0,0');
            }
        }
    },
    scales: {
        xAxes: [
            {
                type: 'time',
                time: {
                    format: 'MM/DD/YY',
                    tooltipFormat: 'll'
                }
            }
        ],
        yAxes: [
            {
                gridLines: {
                    display: false,
                },
                ticks: {
                    callback: function (value, index, values) {
                        return numeral(value).format('0a');
                    }
                }
            }
        ]
    }
}

function Graph( {casesType = 'cases'}) {
const [data, setData] = useState({});
const caseType = casesType;

useEffect(() => {
    const fetchData = async () => {
        await fetch('https://disease.sh/v3/covid-19/historical/all?lastdays=100')
        .then((response) => response.json())
        .then((data) => {
            const chartData = buildChartData(data, casesType)
            setData(chartData);

        })
    }

    fetchData();

}, [casesType]);

// Format the data the way line graph wants it. I.e. {x: 1/1/22, y: 289813483}
const buildChartData = (data, casesType='cases') => {
    const chartData = [];
    let lastDataPoint;
    for(let date in data[casesType]) {
        if (lastDataPoint) {             // If this is the last data point, we want to do something
            const newDataPoint = {
                x: date,
                y: data[casesType][date] - lastDataPoint
            }
            chartData.push(newDataPoint);
        }
        lastDataPoint = data[casesType][date];
    };
    return chartData;
}

  return (
    <div>
        {data?.length > 0 ? (
            <Line options={options} 
                data={{
                    datasets: [{
                        backgroundColor: 'rgba(204, 16, 52, 0.5)',
                        borderColor: '#cc1034',
                        data: data,
                        fill: true
                    }]
            }}/>
        ) : `No data available for ${caseType} cases currently.`}
    </div>
  )
}

export default Graph
