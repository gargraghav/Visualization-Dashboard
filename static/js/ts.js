function draw_ts_chart(dd,md,state,pollutant){
	// d3.select('#ts').remove();
pollutant = pollutant+' AQI'
console.log('Jassi#1')

console.log(dd)
console.log(md)
var data_path = "./static/",
    data_path_day = "./static/day_avg/",
    data_path_month = "./static/month_avg/";


var svg = d3.select("svg").attr('id','ts'),
    margin = {top: 20, right: 20, bottom: 110, left: 40},
    margin2 = {top: 200, right: 20, bottom: 20, left: 40},
    width = +svg.attr("width") - margin.left - margin.right,
    height = +svg.attr("height") - margin.top - margin.bottom,
    height2 = +svg.attr("height") - margin2.top - margin2.bottom;
	
    $("#ts").css({top:100,left:10, position:"absolute"});
	
	// d3.selectAll("svg").remove();
	

var parseDate1 = d3.timeParse("%Y/%m/%d"),
    parseDate2 = d3.timeParse("%Y/%m");

var x = d3.scaleTime().range([0, width]),
    x2 = d3.scaleTime().range([0, width]),
    y = d3.scaleLinear().range([height, 0]),
    y2 = d3.scaleLinear().range([height2, 0]);

var xAxis = d3.axisBottom(x),
    xAxis2 = d3.axisBottom(x2),
    yAxis = d3.axisLeft(y);

var brush = d3.brushX()
    .extent([[0, 0], [width, height2]])
    .on("brush end", brushed);

var zoom = d3.zoom()
    .scaleExtent([1, Infinity])
    .translateExtent([[0, 0], [width, height]])
    .extent([[0, 0], [width, height]])
    .on("zoom", zoomed);

var area = d3.area()
    .curve(d3.curveMonotoneX)
    .x(function(d) { return x(d.DATE); })
    .y0(height)   // For not showing line in the bottom
    .y1(function(d) { return y(d.VALUE); });

var area2 = d3.area()
    .curve(d3.curveMonotoneX)
    .x(function(d) { return x2(d.DATE); })
    .y0(height2)
    .y1(function(d) { return y2(d.VALUE); });

var line = d3.line()
    .curve(d3.curveMonotoneX)
    .x(function(d) { return x(d.DATE); })
    .y(function(d) { return y(d.VALUE); });

svg.append("defs").append("clipPath")
  .attr("id", "clip")
  .append("rect")
  .attr("width", width)
  .attr("height", height);

svg.append("text")
        .attr("x", -3+ (width / 2))
        .attr("y",  2+(margin.top / 2))
        .attr("text-anchor", "middle")
        .attr("font-family", "myriad pro")
        .style("font-size", "16px")
        //.style("text-decoration", "underline")
        .style("font-weight", "bold")
        .text("Time Series Analysis")
        .style("z-index",10);

var focus = svg.append("g")
    .attr("class", "focus")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var context = svg.append("g")
    .attr("class", "context")
    .attr("transform", "translate(" + margin2.left + "," + margin2.top + ")");

	var traits = ["SO2", "CO", "O3", "NO2"];

  var myTraitRange = {"SO2 AQI":[0, 200], "CO AQI":[0, 201], "O3 AQI":[0, 218],  "NO2 AQI":[0,132]}

var myTrait = 0;
var maxDate;





var stations = ['Arizona', 'California', 'Colorado', 'District Of Columbia',
       'Florida', 'Illinois', 'Indiana', 'Kansas', 'Kentucky',
       'Louisiana', 'Michigan', 'Missouri', 'New Jersey', 'New York',
       'North Carolina', 'Oklahoma', 'Pennsylvania', 'Texas', 'Virginia',
       'Massachusetts', 'Nevada', 'New Hampshire', 'Tennessee',
       'South Carolina', 'Connecticut', 'Iowa', 'Maine', 'Maryland',
       'Wisconsin', 'Country Of Mexico', 'Arkansas', 'Oregon', 'Wyoming',
       'North Dakota', 'Idaho', 'Ohio', 'Georgia', 'Delaware', 'Hawaii',
       'Minnesota', 'New Mexico', 'Rhode Island', 'South Dakota', 'Utah',
       'Alabama', 'Washington', 'Alaska'];



var myStation = 0;

data = dd

  drawHistoricalFigure(pollutant, "2015/01", 12, state,dd,md);

function drawCircularFigure(myTrait, myStation,data){

    data.forEach(function(d){
      for (var i = 0; i < traits.length; i++) {
        d[traits[i]] = +d[traits[i]];
      }  
    });

    var radial_labels = ["2012","2013","2014","2015","2016"];
    var segment_labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    var inputData =[]
    for (var i = 0; i < data.length; i++) {
      inputData.push({"month": data[i].DATE.getMonth()+1, 
        "year": data[i].DATE.getFullYear(), "value": data[i][myTrait]});
    }

    loadCircularHeatMap(inputData,"#right_div",radial_labels, segment_labels, myTrait, myStation);

  // });
}


function drawHistoricalFigure(myTrait, initDate, initDateLen, myStation,day_data,month_data){


      console.log("Jassi");

      console.log(day_data);
      console.log(month_data);

      dictData = [];
      dictAvg = [];
      day_data.forEach(function(d){
        d[traits[myTrait]] = +d[myTrait];
		d['DATE']= parseDate1(d['DATE'])
		
        dictData.push({"DATE": d['DATE'], "VALUE": d[myTrait]});
      });
      // console.log(dictData);

      // console.log(month_data);
      month_data.forEach(function(d){
        d[myTrait] = +d[myTrait];
		d['DATE']= parseDate2(d['DATE'])
        dictAvg.push({"DATE": d['DATE'], "VALUE": d[myTrait]});
      });
      maxDate = d3.max(month_data, function(d) { return d.DATE; });
      maxDateValue = 0;
      for (var i = 0; i < dictAvg.length; i++) {
        if(dictAvg[i]["DATE"] == maxDate){
          maxDateValue = dictAvg[i]["VALUE"];
        }
      }
      maxDate = parseDate1(maxDate.getFullYear().toString() + "/" + (maxDate.getMonth() + 1) + "/31");
      dictAvg.push({"DATE": maxDate, "VALUE": maxDateValue});
      // console.log(dictAvg);  

      // console.log(traits);
      var MAX_VALUE = 1.01 * d3.max(dictData, function(d) { return d.VALUE; });


      x.domain(d3.extent(dictData, function(d) { return d.DATE; }));
      y.domain([myTraitRange[myTrait][0], Math.min(
        myTraitRange[myTrait][1], 1.1 * d3.max(dictData, function(d) { return d.VALUE; }))]);
      x2.domain(x.domain());
      y2.domain(y.domain());


      // gridlines in y axis function
      focus.append("g")     
          .attr("class", "grid")
          .call(d3.axisLeft(y).tickSize(-width).tickFormat(""));
      
      focus.append("path")
          .datum(dictData)
          .attr("class", "area")
          .attr("d", area);

      focus.append("g")
          .attr("class", "axis axis--x")
          .attr("transform", "translate(0," + height + ")")
          .call(xAxis);

      focus.append("g")
          .attr("class", "axis axis--y")
          .call(yAxis);

      focus.selectAll(".bar")
          .data(dictData)
          .enter().append("rect")
          .attr("class", "bar")
          .attr("x", function(d) { return x(d.DATE); })
          .attr("y", function(d) { return y(d.VALUE); })
          .attr('fill', "none")
          .attr("width", 2)
          .attr("height", function(d) { return height - y(d.VALUE); })
          .on("mouseover", function(d, i){
            svg.select("g").append("text")
              .text(d.DATE + "(" + d.VALUE + ")")
              .attr("transform", "translate(100,100)")
              .attr("x", 100)
              .attr("y", 200)
              .style("text-anchor", "middle")
              .attr("font-family", "sans-serif")
              .attr("font-size", "28px")
              .style("fill", "black");
          });

      focus.append("path")
          .datum(dictAvg)
          .attr("class", "line")
          .attr("d", line);

      context.append("path")
          .datum(dictData)
          .attr("class", "area")
          .attr("d", area2);

      context.append("g")
          .attr("class", "axis axis--x")
          .attr("transform", "translate(0," + height2 + ")")
          .call(xAxis2);

      context.append("g")
          .attr("class", "brush")
          .call(brush)
          .call(brush.move, x.range());

      svg.append("rect")
          .attr("class", "zoom")
          .attr("width", width)
          .attr("height", height)
          .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
          .call(zoom);

      // Set initial zoom level
      svg.call(zoom.transform, d3.zoomIdentity.scale(month_data.length/initDateLen)
        .translate(-x(parseDate2(initDate)), 0));


    // });

  // });

}



function type1(d) {
  d.DATE = parseDate1(d.DATE);
  return d;
}
function type2(d) {
  d.DATE = parseDate2(d.DATE);
  return d;
}

function brushed() {
  if (d3.event.sourceEvent && d3.event.sourceEvent.type === "zoom") return; // ignore brush-by-zoom
  var s = d3.event.selection || x2.range();
  x.domain(s.map(x2.invert, x2));
  focus.select(".area").attr("d", area);
  focus.select(".axis--x").call(xAxis);
  focus.selectAll(".bar").attr("x", function(d) { return x(d.DATE); });
  focus.select(".line").attr("d", line);
  svg.select(".zoom").call(zoom.transform, d3.zoomIdentity
      .scale(width / (s[1] - s[0]))
      .translate(-s[0], 0));
}

function zoomed() {
  if (d3.event.sourceEvent && d3.event.sourceEvent.type === "brush") return; // ignore zoom-by-brush
  var t = d3.event.transform;
  x.domain(t.rescaleX(x2).domain());
  focus.select(".area").attr("d", area);
  focus.select(".axis--x").call(xAxis);
  focus.selectAll(".bar").attr("x", function(d) { return x(d.DATE); });
  focus.select(".line").attr("d", line);
  context.select(".brush").call(brush.move, x.range().map(t.invertX, t));
}


function hightlight(newValue)
{
  d3.select("#hightlight_text").remove();
  d3.select("#top_left_div").append('text').attr('id',"hightlight_text")
    .text(Math.ceil(newValue*100)/100);
  // document.getElementById("slider_text").innerHTML = newValue;
  focus.selectAll(".bar").attr('fill', function(d) { 
    if(d.VALUE > newValue) return "red"; 
    else return "none";
  });
}

function resetHighlight(){
  d3.select("#hightlight_text").remove();
  // document.getElementById("slider").value = MAX_VALUE/2;
  focus.selectAll(".bar").attr('fill', "none");
}

}