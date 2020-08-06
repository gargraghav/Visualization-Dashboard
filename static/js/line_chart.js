function draw_line_chart(data, pollutant, popn_or_deaths) {
    console.log(data)
    pollutant = pollutant + " AQI";
    console.log(pollutant)
    var margin = {top: 20, right: 80, bottom: 100, left: 50},
        width = 700 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

    var x = d3.scalePoint().range([0, width]);
    var y0 = d3.scaleLinear().range([height, 0]);
    var y1 = d3.scaleLinear().range([height, 0]);

    data.map(function (d) {
        d[pollutant] = +d[pollutant];
        d[popn_or_deaths] = +d[popn_or_deaths]
    });

    var valueline = d3.line()
        .x(function (d) {
            return x(d["Year"]);
        })
        .y(function (d) {
            return y0(+d[pollutant]);
            console.log(d[pollutant])
        });


    var valueline2 = d3.line()
        .x(function (d) {
            return x(d["Year"]);
        })
        .y(function (d) {
            console.log(d[popn_or_deaths]);
            return y1(+d[popn_or_deaths]);
        });

    var svg = d3.select("body").append("svg").attr("id","double_line")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

    x.domain(data.map(function (d) {
        return d["Year"]
    }))
    y0.domain([d3.min(data, function (d) {
        return d[pollutant]
    }), d3.max(data, function (d) {
        return d[pollutant]
    })]);
    y1.domain([d3.min(data, function (d) {
        return d[popn_or_deaths]
    }), d3.max(data, function (d) {
        return d[popn_or_deaths]
    })]);


    svg.append("path")
        .data(data)
        .attr("class", "line")
        .attr("d", valueline(data));

    svg.append("path")
        .data(data)
        .attr("class", "line")
        .style("stroke", "red")
        .attr("d", valueline2(data));

    // Add the X Axis
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x))
        .selectAll("text")
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", ".15em")
        .attr("transform", "rotate(-90)");

    // Add the Y0 Axis
    svg.append("g")
        .attr("class", "axisSteelBlue")
        .call(d3.axisLeft(y0));

    // Add the Y1 Axis
    svg.append("g")
        .attr("class", "axisRed")
        .attr("transform", "translate( " + width + ", 0 )")
        .call(d3.axisRight(y1));

    svg.append("text")
        .attr("transform",
            "translate(" + (width / 2) + " ," +
            (height + margin.top + 70) + ")")
        .style("text-anchor", "middle")
        .text("Years");

    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text(pollutant);

    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", width + 64)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text(popn_or_deaths);
}