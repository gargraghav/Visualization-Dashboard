function drawScatter(sData) {
    d3.select('#scatter_pca').remove();
    var data = sData;
    var array = [];
    var min = 0, max = 0;
    ftrNames = Object.keys(data);

    for(var i=0; i< Object.keys(data[0]).length; ++i){
        obj = {}
        obj.x = data[0][i];
        obj.y = data[1][i];
        obj.clusterid = data['clusterid'][i]
        obj.ftr1 = data[ftrNames[2]][i]
        obj.ftr2 = data[ftrNames[3]][i]
        array.push(obj);
        console.log(data['clusterid'][i]);
    }
    data = array;

    var margin = {top: 40, right: 40, bottom: 40, left: 50},
    width = 600 - margin.left - margin.right,
    height = 330 - margin.top - margin.bottom;

    var xValue = function(d) { return d.x;},
        xScale = d3.scaleLinear().range([0, width]),
        xMap = function(d) { return xScale(xValue(d));},
        xAxis = d3.axisBottom().scale(xScale);

    var yValue = function(d) { return d.y;},
        yScale = d3.scaleLinear().range([height, 0]),
        yMap = function(d) { return yScale(yValue(d));},
        yAxis = d3.axisLeft().scale(yScale);


    var cValue
    // if(rs) {
    //     cValue = function(d) { return d.clusteridx;}
    // } else {
    cValue = function(d) { return d.clusterid;}
    // }
    //var color = d3.scale.category20();

    var color = d3.scaleOrdinal().range(d3.schemeCategory10);

    var svg = d3.select("body").append("svg")
        .attr('id','scatter_pca')
        .attr("width", width + margin.left*3 + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left*2 + "," + margin.top + ")");


    var tooltip = d3.select("body").append('div').style('position','absolute');

     $("#scatter_pca").css({top: 40, left: 10, position: "absolute"});

    xScale.domain([d3.min(data, xValue)-1, d3.min(data, yValue)-1]);
    yScale.domain([d3.min(data, yValue)-1, d3.max(data, yValue)+1]);



  svg.append("g")
    .attr("class", "myXaxis")   // Note that here we give a class to the X axis, to be able to call it later and modify it
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis)
    .attr("opacity", "0")

  // Add Y axis
  // var y = d3.scaleLinear()
  //   .domain([0, 500000])
  //   .range([ height, 0]);

  svg.append("g")
    .call(yAxis)
      .append("text")
          .attr("class", "label")
          .attr("y", 6)
          .attr("transform", "rotate(-90)")
          .attr("dy", ".71em")
	      .style("font", "18px sans-serif")
          .text("Component 2")
          .style('fill', 'black')
          .style("font-size", "14px")
          .style("text-anchor", "end");

  // Add dots
  svg.append('g')
    .selectAll("dot")
    .data(data)
    .enter()
    .append("circle")
      .attr("cx", xMap )
      .attr("cy", yMap )
      .attr("r", 3.5)
      .style("fill", function(d) { return color(cValue(d));})

  // new X axis
  xScale.domain([d3.min(data, xValue)-1, d3.max(data, xValue)+1]);
  svg.select(".myXaxis")
    .transition()
    .duration(100)
    .attr("opacity", "1")
    .call(xAxis);

  svg.select(".myXaxis").append("text")
          .attr("class", "label")
          .attr("y", -6)
          .attr("x", width)
          .text("Component 1")
	      .style("font", "18px sans-serif")
	      .style('fill', 'black')
          .style("font-size", "14px")
          .style("text-anchor", "end");

  svg.selectAll("circle")
    .transition()
    .delay(function(d,i){return(i*3)})
    .duration(100)
    .attr("cx", xMap )
    .attr("cy", yMap )

    svg.append("text")
        .attr("x", (width / 2) - 15)
        .attr("y", -20 + (margin.top / 2))
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        //.style("text-decoration", "underline")
        .style("font-weight", "bold")
        .text("PCA Scatter Plot");

}