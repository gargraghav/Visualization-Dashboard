function deaths_state(data) {
    var margin = {top: 50, right: 30, bottom: 80, left: 40},
        width = 550 - margin.left - margin.right,
        height = 360 - margin.top - margin.bottom;

// append the svg object to the body of the page

    var colours = d3.scaleOrdinal().range(d3.schemeCategory20);


    var div = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

    var svg = d3.select("body")
        .append("svg")
        .attr("id", "deaths_state")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

    $("#deaths_state").css({top: 380, left: 700, position: "absolute"});

    var x = d3.scaleBand()
        .range([0, width])
        .domain(data.map(function (d) {
            return d.yr;
        }))
        .padding(0.2);
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x))
        .append("text")
        .attr("fill", "black")
        .attr("x", width/2)
        .attr("y", 38)
        .attr("font-size", '10px')
        .attr("font-weight", "bold")
        .text("Year");
        // .selectAll("text")
        // .attr("transform", "translate(-10,0)rotate(-45)")
        // .style("text-anchor", "end");

// Add Y axis
    var y = d3.scaleLinear()
        .domain([0, d3.max(data, function(d) { return d.deathcount; })])
        .range([height, 0]);
    svg.append("g")
        .call(d3.axisLeft(y));


// Bars
    svg.selectAll("mybar")
        .data(data)
        .enter()
        .append("rect")
        .attr("x", function (d) {
            return x(d.yr);
        })
        .attr("width", x.bandwidth()-5)
        .attr("fill", function (d) {
            return colours(d.yr);
        })
        // no bar at the beginning thus:
        .attr("height", function (d) {
            return height - y(0);
        }) // always equal to 0
        .attr("y", function (d) {
            return y(0);
        })
        .on("mouseover", function(d) {
       div.transition()
         .duration(200)
         .style("opacity", .9);
       div.html(d.deathcount)
         .style("left", (d3.event.pageX) + "px")
         .style("top", (d3.event.pageY - 28) + "px");
       })
     .on("mouseout", function(d) {
       div.transition()
         .duration(500)
         .style("opacity", 0);
       });

// Animation
    svg.selectAll("rect")
        .transition()
        .duration(700)
        .attr("y", function (d) {
            return y(d.deathcount);
        })
        .attr("height", function (d) {
            return height - y(d.deathcount);
        })
        .delay(function (d, i) {
            console.log(i);
            return (i * 1)
        })

     svg.append("text")
        .attr("x", 15+ (width / 2))
        .attr("y", -35+ (margin.top / 2))
        .attr("text-anchor", "middle")
        .attr("font-family", "myriad pro")
        .style("font-size", "16px")
        //.style("text-decoration", "underline")
        .style("font-weight", "bold")
        .text("Distribution of deaths across years")
        .style("z-index",10);
}









//
//     margin = {top: 400, right: 20, bottom: 30, left: 50},
//        width = 780 - margin.left - margin.right,
//        height = 600 - margin.top - margin.bottom;
//
//
//
// var tooltip = d3.select("body").append("div").attr("class", "toolTip");
//
// var x = d3.scaleBand().rangeRound([0, width]).padding(0.1),
//     y = d3.scaleLinear().rangeRound([height, 0]);
//
//
//
// var colours = d3.scaleOrdinal()
//     .range(["#517C3F", "#9D5130", "#5E9ACF", "#776327", "#944F7E","#5DA5B3", "#725D82", "#54AF52", "#954D56",
//       "#8C92E8", "#D8597D", "#AB9C27", "#D67D4B", "#D58323", "#BA89AD", "#357468", "#8F86C2"]);
//
// var g = d3.select("body").append("svg").attr("id","deaths_state")
//     .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
//
// $("#deaths_state").css({top:500,left:400, position:"absolute"});
//
// //d3.json("data.json", function(error, data) {
//  //   if (error) throw error;
//
//     x.domain(data.map(function(d) { return d.yr; }));
//     y.domain([0, d3.max(data, function(d) { return d.deathcount; })]);
//
//     g.append("g")
//         .attr("class", "axis axis--x")
//         .attr("transform", "translate(0," + height + ")")
//         .call(d3.axisBottom(x));
//
//     g.append("g")
//       	.attr("class", "axis axis--y")
//       	.call(d3.axisLeft(y).ticks(5).tickFormat(function(d) { return d; }).tickSizeInner([-width]))
//       .append("text")
//         .attr("transform", "rotate(-90)")
//         .attr("y", 6)
//         .attr("dy", "0.71em")
//         .attr("text-anchor", "end")
//         .attr("fill", "#5D6971")
//         .text("Average House Price - (£)")
//         .style("z-index",10);
//
//     g.selectAll(".bar")
//       	.data(data)
//       .enter().append("rect")
//         .attr("x", function(d) { return x(d.yr); })
//         .attr("y", function(d) { return y(d.deathcount); })
//         .attr("width", x.bandwidth())
//         .attr("height", function(d) { return height - y(d.deathcount); })
//         .attr("fill", function(d) { return colours(d.yr); })
//         .on("mousemove", function(d){
//             tooltip
//               .style("left", d3.event.pageX - 50 + "px")
//               .style("top", d3.event.pageY - 70 + "px")
//                 .style("z-index",10)
//               .style("display", "inline-block")
//               .html((d.yr) + "<br>" + "£" + (d.deathcount));
//         })
//     		.on("mouseout", function(d){ tooltip.style("display", "none");});
//
//     g.selectAll("rect")
//   .transition()
//   .duration(800)
//   .attr("y", function(d) { return y(d.deathcount); })
//   .attr("height", function(d) { return height - y(d.deathcount); })
//   .delay(function(d,i){console.log(i) ; return(i*100)})
// }