# US Air Pollution Dashboard
 
This project is part of CSE 564 - Visualization Course at Stony Brook University, New York.

Youtube link: [US Air Pollution Dashboard](https://www.youtube.com/watch?v=bizfcdVC090)

Data: [Pollution Data](https://drive.google.com/file/d/1Ic5nCEtJISUsvcZ2hn_fu3YEEPVgkhAJ/view?usp=sharing)
 
### System Design
We are using a client-server architecture:
- Server: Python and its libraries() to process and analyze data. Alongwith using flask as the backend server to serve data. 
 - Client: The front-end will primarily use d3.js to produce all the visualizations, AJAX to connect to the back-end and retrieve data, and JQuery for front end scripting.

### Dashboard

Our dashboard is divided in three tabs:

 

 - **Pollutants Analysis**

	- This area captures state wise temporal aspects of pollutants and respiratory deaths. This also contains a coordinate plot for overall view of data of a state.
	
	- The view contain 4 visualisations: 
		- Choropleth Map
		- Time Series Plot
		- Parallel Coordinates
		- Bar Chart
		
**![](https://lh3.googleusercontent.com/g1IbAjDio1ruQbsB_r4Le02nlTs6Ku0uNlDeXBmdWO32IgOE0qZ7Oh2laEEYByQYZHEwSZV1OjD-Yh4ri40MfvXwI3RXeiteC4bV6oeSNjxu3MH9oQljJchZLunpab2jdfj-P0MZ)**
-   **Pollutant Death Geography**
	
	- This area captures distribution of pair of pollutants and their paired effect on corresponding states over relative count of deaths.
	
	- The view contain 2 visualisations:
		- Scatter Plot
		-  Choropleth Map

**![](https://lh6.googleusercontent.com/geAL249uqK4XBegxGScwNyenoaQO8VBlVG_4vTkEnaWjfv9bDetNLkPKsIQhvuYdsbceTcDkfoavr1cvwcOiy09o7gx0HCT5c8e0RbAWDtNIgclKbyicbAj2KySgcv59L0ZIedmj)**

-   **Component Analysis**
	
	- This area give overview of the intrinsic nature of dataset, We do PCA analysis and MDA visualisation to better understand the data.
	
	- The view contain 4 visualisations:
		-  PCA Plot
		- Scree Plot
		- Squared PCA Loadings Table
		- MDS Plot
    
**![](https://lh6.googleusercontent.com/snHBDcB22xJBCcuOLYvgDRet6uX4W0gp6jhVRoqSbHFMPW-tNDJHtHopxal_WTV8Wq3zyqPQmzvSamP-9MKAjF7gPKhQV88O-4FD1Tdti2MtNtYmcPQqKsdPED4juE3V7FLQ5sVe)**
