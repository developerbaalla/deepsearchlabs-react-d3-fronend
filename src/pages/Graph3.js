import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const baseURL = "http://127.0.0.1:8000";

const Graph3 = () => {

	const d3Chart = useRef()

	const parseDate = d3.timeParse('%Y-%m-%d')

	useEffect(()=>{
		fetch(`${baseURL}/young_people`)
			.then(response => response.json())
			.then(_data=>{
        
        const data = _data.map(logit => {
          return {
            time: new Date(logit.date),
            ...logit
          }
        });
        // console.log(_data)
        
        // set the dimensions and margins of the graph
				const margin = {top: 30, right: 100, bottom: 30, left: 100}
				const width = parseInt(d3.select('#d3demo').style('width')) - margin.left - margin.right
				const height = 400 - margin.top - margin.bottom


				// Set up chart
				const svg = d3.select(d3Chart.current)
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        // List of groups (here I have one group per column)
        const allGroup = ["logits", "net_sent", "logits_mean"]

        // Reformat the data: we need an array of arrays of {x, y} tuples
        const dataReady = allGroup.map( function(grpName) { // .map allows to do something for each element of the list
          return {
            name: grpName,
            values: data.map(function(d) {
              return {time: d.time, value: +d[grpName]};
            })
          };
        });
        // I strongly advise to have a look to dataReady with
        // console.log(dataReady)

        // A color scale: one color for each group
        const myColor = d3.scaleOrdinal()
          .domain(allGroup)
          .range(d3.schemeSet2);

        // Add X axis --> it is a date format
        const x = d3
        //   .scaleLinear()
        //   .domain([0,10])
          .scaleTime()
          .domain([new Date("2000-01-01"), new Date("2000-01-10")])
          .range([ 0, width ]);
        svg.append("g")
          .attr("transform", "translate(0," + height + ")")
          .call(d3.axisBottom(x));

        // Add Y axis
        const y = d3.scaleLinear()
          .domain( [-10,20])
          .range([ height, 0 ]);
        svg.append("g")
          .call(d3.axisLeft(y));

        // Add the lines
        const line = d3.line()
          .x(function(d) { return x(+d.time) })
          .y(function(d) { return y(+d.value) })
        svg.selectAll("myLines")
          .data(dataReady)
          .enter()
          .append("path")
            .attr("d", function(d){ return line(d.values) } )
            .attr("stroke", function(d){ return myColor(d.name) })
            .style("stroke-width", 4)
            .style("fill", "none")

        // Add the points
        svg
          // First we need to enter in a group
          .selectAll("myDots")
          .data(dataReady)
          .enter()
            .append('g')
            .style("fill", function(d){ return myColor(d.name) })
          // Second we need to enter in the 'values' part of this group
          .selectAll("myPoints")
          .data(function(d){ return d.values })
          .enter()
          .append("circle")
            .attr("cx", function(d) { return x(d.time) } )
            .attr("cy", function(d) { return y(d.value) } )
            .attr("r", 5)
            .attr("stroke", "white")

        // Add a legend at the end of each line
        svg
          .selectAll("myLabels")
          .data(dataReady)
          .enter()
            .append('g')
            .append("text")
              .datum(function(d) { return {name: d.name, value: d.values[d.values.length - 1]}; }) // keep only the last value of each time series
              .attr("transform", function(d) { return "translate(" + x(d.value.time) + "," + y(d.value.value) + ")"; }) // Put the text at the position of the last point
              .attr("x", 12) // shift the text a bit more right
              .text(function(d) { return d.name; })
              .style("fill", function(d){ return myColor(d.name) })
              .style("font-size", 15)




			})
	},[])

	return (
		<div id='d3demo'>
			<svg ref={d3Chart}></svg>
		</div>
	)
}

export default Graph3;