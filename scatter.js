 // First undefine 'circles' so we can easily reload this file.
require.undef('scatter');

define('scatter', ['d3'], function (d3) {

    function showData(data) {
        var SVG_PADDING = 50, SVG_WIDTH = 400, SVG_HEIGHT = 400;
        var DOMAIN_PADDING = 50
        var RADIUS = 10;
        var country = [], gold = [], silver = [];

        // Read data
        data.map(function(d) {
            country.push(d.country);
            gold.push(+d.gold);         // convert to int, else the max function will not work correctly
            silver.push(+d.silver);     // convert to int, else the max function will not work correctly
        })
        console.log(data);console.log(data[0], data[0].country)
        console.log(country)
        console.log("Golds:", gold,  "MIN:", d3.min(gold), "MAX:", d3.max(gold))
        console.log("Silvers:", silver, "MIN:", d3.min(silver), "MAX:", d3.max(silver))

        // Create SVG
        var svg_scatter = d3.select("body").append("svg")
            .attr("width", SVG_WIDTH).attr("height", SVG_HEIGHT)
            .attr("style", "outline: thin solid black;") 

        // Create scales
        let xscale = d3.scaleLinear().range([SVG_PADDING, SVG_WIDTH-SVG_PADDING]).domain([0, d3.max(gold)+DOMAIN_PADDING])
        let yscale = d3.scaleLinear().range([SVG_PADDING, SVG_HEIGHT-SVG_PADDING]).domain([d3.max(silver)+DOMAIN_PADDING, 0])

        function COLOR_CIRCLE(d){  
            return "rgb("+d.gold+", "+d.silver+",0)"
        }  

        var circles = svg_scatter.selectAll("circle").data(data).enter()
            .append("circle")
            .attr("cx", function(d) { return (xscale(d.gold))   })
            .attr("cy", function(d) { return (yscale(d.silver)) })
            //.attr("r", RADIUS)
            .attr("r", function(d) {return Math.sqrt(d.gold*d.gold+d.silver*d.silver)/10})
            .attr("fill", function(d) {return COLOR_CIRCLE(d)})

        // TODO: 
        // Axes should start from -10 onwards so that the circle is not cut
        // Show hover text of the number of golds, silvers, total
        // On clicking the circle, circle should pop out  or go to an external site

        var xaxis = d3.axisBottom(xscale).ticks(5)
        var yaxis = d3.axisLeft(yscale).ticks(5)

        svg_scatter.append("g").attr("class", "axis").call(xaxis)
            .attr("transform", "translate(0," + (SVG_HEIGHT - SVG_PADDING) + ")").call(xaxis)
        svg_scatter.append("g").attr("class", "axis").call(yaxis)
            .attr("transform", "translate(" + SVG_PADDING + ",0)").call(yaxis)

        // Annotate
        svg_scatter.selectAll("annotation").data(data).enter().append("text")
            .transition().duration(1000).delay(500).ease(d3.easeLinear)
            .attr("x", function(d) { return xscale(d.gold)+10 })
            .attr("y", function(d) { return yscale(d.silver) })
            .text(function(d) { return d.country }).attr("font-size", "10px")

        // Define the div for the tooltip
        var tip = d3.select("body").append("div")
            .attr("class", "tooltip").style("opacity", 0)

        circles.on("mouseover", function(d) {
            d3.select(this).attr("fill" , "rgb(0,0,0)");

        tip.style("opacity", 1)
            .html(d.country + "<br/> Gold: " + d.gold + "<br/> Silver: " + d.silver)
            .style("left", (d3.event.pageX-25) + "px")
            .style("top", (d3.event.pageY-75) + "px")
        })

        circles.on("mouseout", function(d) {
            d3.select(this)
            .transition().duration(500)
            .attr("fill", function(d) {return COLOR_CIRCLE(d)})
        tip.style("opacity", 0)
        })
    }

    function myFunction() {
        // Read the data
        d3.csv("data/countries.csv").then(showData)
    }

    return myFunction;
});