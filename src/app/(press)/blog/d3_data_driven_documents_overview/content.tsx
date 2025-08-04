"use client";
import "react-image-crop/dist/ReactCrop.css";
import { Grid, Typography, Paper, Button, List, ListItem } from "@mui/material";
import React from "react";
import { useTheme } from "@mui/material/styles";
import { StyledSectionGrid } from "../../../components/layout/Spacing";
import BlogComponent, { LinkListItem } from "../../../components/blog/BlogContent";
import { CodeBox } from "../../../styles/globalStyles"; // Ensure this is correctly imported
import ImageWithCaption from "../../../components/customhtml/ImageWithCaption";
import getRelatedPages from "../../../data/RelatedPages";
// import { ResponsiveNativeBannerAd } from "@components/adds/ResponsiveNativeBannerAd";

const parentPath = "js";
const thisPagePath = "/blog/d3_data_driven_documents_overview";

export default function WorkflowDispatch() {
  const theme = useTheme();

  return (
    <StyledSectionGrid theme={theme} container gap={1} y16>
      <Grid item xs={12}>
        <BlogComponent
          relatedPages={getRelatedPages(parentPath, thisPagePath)}
          blogComponent={
            <>
              <Typography variant="h1" gutterBottom>
                Key Concepts of D3 js. (A d3 data driven documents overview)
              </Typography>
              <ImageWithCaption
                src="/images/blog/d3js.jpeg"
                alt="D3 js Visualization"
                caption=""
              />
              <Typography variant="h2" gutterBottom>
                Introduction
              </Typography>
              <Typography paragraph>
                In the world of data visualization, D3 js stands out as a potent
                library for creating interactive and dynamic graphics. This
                article provides an extensive guide to d3 js visualization, covering its
                functionalities, comparing it with other libraries, and offering
                practical tutorials to help you get started with creating your
                own visualizations.
              </Typography>

              <Typography variant="h2" gutterBottom>
                What is D3 js?
              </Typography>
              <Typography paragraph>
                D3 js, or Data-Driven Documents, is a JavaScript library that
                allows developers to create complex, interactive, and dynamic
                data visualizations in web browsers. D3 js visualization, 
                unlike many other libraries, enables developers to
                build custom visualizations from scratch, using data to drive
                the transformation of DOM elements. D3 js data visualization is therefore quite hands on.
              </Typography>

              <Typography variant="h2" gutterBottom>
                What is the function of d3js?/What is the application of d3js?
              </Typography>
              <Typography variant="h3" gutterBottom>
                What is the function of d3js?
              </Typography>
              <Typography paragraph>
                The primary function of D3js is to bind data to DOM elements and
                apply data-driven transformations. This includes creating and
                manipulating graphical elements such as SVG (Scalable Vector
                Graphics), lines, bars, and circles. D3 js provides a powerful
                framework for producing sophisticated d3 js visualizations that update
                dynamically as data changes.
              </Typography>
              <Typography variant="h3" gutterBottom>
                What is the application of D3 js?
              </Typography>
              <Typography paragraph>
                D3 js is applied in various scenarios, including:
              </Typography>
              <List>
                <ListItem>
                  Business Dashboards: For visualizing metrics and performance
                  indicators.
                </ListItem>
                <ListItem>
                  Scientific Research: To create complex data representations,
                  such as hierarchical trees or network graphs.
                </ListItem>
                <ListItem>
                  Interactive Maps: To display geographic data with zooming and
                  panning capabilities.
                </ListItem>
                <ListItem>
                  Financial Data Visualization: d3 js visualization is used for 
                  creating real-time stock
                  charts and financial dashboards.
                </ListItem>
              </List>

              <Typography variant="h2" gutterBottom>
                Is d3js obsolete?
              </Typography>
              <Typography paragraph>
                No, D3 js is far from obsolete. Despite the introduction of
                newer libraries, D3 js remains relevant due to its flexibility
                and the level of control it offers. It is still widely used by
                developers who need to create custom visualizations that other
                libraries might not support out-of-the-box.
              </Typography>

              <Typography variant="h2" gutterBottom>
                Are People Still Using D3 js?
              </Typography>
              {/* <ResponsiveNativeBannerAd/> */}
              <Typography paragraph>
                Yes, D3 js continues to be used by many organizations and
                developers. Its robust capabilities and active community ensure
                that it remains a popular choice for creating advanced data
                visualizations. Many companies and institutions rely on d3 js visualization
                for its versatility and powerful features.
              </Typography>

              <Typography variant="h2" gutterBottom>
                D3 js vs. Other Libraries
              </Typography>
              <Typography variant="h3" gutterBottom>
                Which is better, D3 JS or chart js?
              </Typography>
              <Typography paragraph>
                <strong>Chart.js:</strong> Provides a simpler API and is ideal
                for quickly creating standard charts such as bar charts, line
                charts, and pie charts. It is user-friendly but offers less
                customization.
                <br />
                <strong>D3 js:</strong> Offers extensive customization and is
                suitable for complex, interactive visualizations. d3 js visualization requires
                more effort and understanding but allows for detailed control
                over every aspect of the visualization.
              </Typography>

              <Typography variant="h3" gutterBottom>
                Which is better D3 JS or Sigma js?
              </Typography>
              <Typography paragraph>
                <strong>Sigma.js:</strong> Specializes in graph and network
                visualizations, making it ideal for displaying relationships
                between nodes. It is focused on network graphs and is not as
                versatile as D3 js.
                <br />
                <strong>D3 js:</strong> A general-purpose library that can
                create a wide range of visualizations, including complex custom
                charts beyond network graphs.
              </Typography>

              <Typography variant="h3" gutterBottom>
                What is better than D3 JS?
              </Typography>
              <Typography paragraph>
                Libraries such as <strong>Plotly</strong> and{" "}
                <strong>Highcharts</strong> offer built-in charts and simpler
                APIs, which might be better for quick development and easier
                integration. However, D3 js excels in scenarios requiring
                custom, data-driven visualizations.
              </Typography>

              <Typography variant="h3" gutterBottom>
                What is the difference between Google charts and D3 JS?
              </Typography>
              <Typography paragraph>
                <strong>Google Charts:</strong> Provides a straightforward API
                with predefined chart types. It is easier to use for standard
                charts but lacks the deep customization capabilities of D3 js.
                <br />
                <strong>D3 js:</strong> Allows for highly customized data
                visualizations and detailed control over every element. It is
                more complex but suitable for unique and interactive data
                representations.
              </Typography>

              <Typography variant="h2" gutterBottom>
                Working with D3 js
              </Typography>
              <Typography variant="h3" gutterBottom>
                Does D3js work with React?
              </Typography>
              <Typography paragraph>
                Yes, D3 js integrates well with React. You can use d3 js in react for
                data manipulation and visualization while leveraging React’s
                component-based architecture to manage the UI. This approach
                allows for combining the strengths of both libraries, enabling
                dynamic and interactive d3 js visualization within React
                applications.
              </Typography>

              <Typography variant="h4" gutterBottom>
              D3 JS Examples: Creating a Bar Chart with D3 js in React
              </Typography>
              <CodeBox>
                {`
import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';

const BarChart = ({ data }) => {
  const svgRef = useRef();

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    const width = 500;
    const height = 400;
    const barWidth = 40;
    
    svg.attr('width', width).attr('height', height);

    svg.selectAll('*').remove(); // Clear previous content

    svg.selectAll('rect')
      .data(data)
      .enter()
      .append('rect')
      .attr('x', (d, i) => i * (barWidth + 5))
      .attr('y', d => height - d)
      .attr('width', barWidth)
      .attr('height', d => d)
      .attr('fill', 'steelblue');
    
  }, [data]);

  return <svg ref={svgRef}></svg>;
};

export default BarChart;
                `}
              </CodeBox>

              <Typography variant="h3" gutterBottom>
                Can I use D3 JS in angular?
              </Typography>
              <Typography paragraph>
                Yes, D3 js can be used in Angular applications. By using
                Angular's directives and services, you can integrate D3 js to
                create and manage d3 js visualization within Angular components.
              </Typography>

              <Typography variant="h4" gutterBottom>
              D3 JS Examples: Creating a Pie Chart with D3 js in Angular
              </Typography>
              <CodeBox>
                {`
import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-pie-chart',
  template: '<svg #chart></svg>',
  styleUrls: ['./pie-chart.component.css']
})
export class PieChartComponent implements OnInit {
  @ViewChild('chart') private chartContainer: ElementRef;

  ngOnInit() {
    const data = [10, 20, 30, 40];
    const width = 200;
    const height = 200;
    const radius = Math.min(width, height) / 2;

    const color = d3.scaleOrdinal(d3.schemeCategory10);
    const arc = d3.arc().outerRadius(radius - 10).innerRadius(0);
    const pie = d3.pie().sort(null);

    const svg = d3.select(this.chartContainer.nativeElement)
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', \`translate(\${width / 2},\${height / 2})\`);

    svg.selectAll('path')
      .data(pie(data))
      .enter()
      .append('path')
      .attr('d', arc)
      .attr('fill', d => color(d.data.toString()));
  }
}
                `}
              </CodeBox>

              <Typography variant="h2" gutterBottom>
                Learning D3 js
              </Typography>
              <Typography variant="h3" gutterBottom>
                How much time it will take to learn D3 JS?
              </Typography>
              <Typography paragraph>
                The learning curve for D3 js can be steep, particularly if
                you're new to data visualization. On average, it may take a few
                weeks to become proficient, especially if you already have a
                solid understanding of JavaScript and SVG. Starting with basic
                examples and gradually working up to more complex visualizations
                can help in mastering D3 js.
              </Typography>

              <Typography variant="h2" gutterBottom>
                What are the prerequisites for D3 JS?
              </Typography>
              <Typography paragraph>
                Before learning D3 js, ensure you have a good grasp of the
                following:
              </Typography>
              <List>
                <ListItem>
                  HTML and CSS: For structuring and styling web content.
                </ListItem>
                <ListItem>
                  JavaScript: To understand the scripting and data manipulation
                  required.
                </ListItem>
                <ListItem>
                  SVG: Since D3 js often uses SVG to create graphics.
                </ListItem>
                <ListItem>
                  Basic Data Visualization Concepts: Understanding charts,
                  graphs, and data representation principles will be beneficial.
                </ListItem>
              </List>

              <Typography variant="h2" gutterBottom>
                What are the disadvantages of D3 JS?
              </Typography>
              <Typography paragraph>
                Some disadvantages of D3 JS include:
              </Typography>
              <List>
                <ListItem>
                  Steep Learning Curve: The library’s flexibility and complexity
                  can make it challenging to learn, especially for beginners.
                </ListItem>
                <ListItem>
                  Performance Considerations: For very large datasets, d3 js visualization
                   may require performance optimizations.
                </ListItem>
                <ListItem>
                  No Built-in Charts: Unlike some libraries, D3 js does not
                  offer pre-built charts, requiring more effort to implement
                  basic d3 js visualization.
                </ListItem>
              </List>

              <Typography variant="h3" gutterBottom>
                Why not use D3 js?
              </Typography>
              <Typography paragraph>
                D3 js might not be ideal for projects requiring rapid
                development of standard charts or for those who prefer a simpler
                API. Libraries like Chart.js or Google Charts offer easier setup
                and built-in chart types, which can be more suitable for
                straightforward visualization needs.
              </Typography>

              <Typography variant="h2" gutterBottom>
                What companies use D3 JS?
              </Typography>
              <Typography paragraph>
                D3 js is used by numerous prominent organizations, including:
              </Typography>
              <List>
                <ListItem>
                  The New York Times: For creating interactive news graphics and
                  data visualizations.
                </ListItem>
                <ListItem>
                  Netflix: To visualize complex data for internal analytics and
                  reporting.
                </ListItem>
                <ListItem>
                  GitHub: For interactive charts and data displays in various
                  features. checkbelow for d3 js github link.
                </ListItem>
              </List>

              <Typography variant="h2" gutterBottom>
                D3 js Examples
              </Typography>
              <Typography variant="h3" gutterBottom>
                Example 1: Simple Bar Chart
              </Typography>
              <CodeBox>
                {`
<!DOCTYPE html>
<html>
<head>
  <title>D3 js Bar Chart</title>
  <script src="https://d3js.org/d3.v7.min.js"></script>
</head>
<body>
  <script>
    const data = [30, 86, 168, 281, 303, 365];
    const width = 420, barHeight = 20;

    const x = d3.scaleLinear().domain([0, d3.max(data)]).range([0, width]);

    d3.select("body").append("svg").attr("width", width).attr("height", barHeight * data.length)
      .selectAll("rect").data(data).enter().append("rect")
      .attr("width", x)
      .attr("height", barHeight - 1)
      .attr("y", (d, i) => i * barHeight)
      .attr("fill", "steelblue");
  </script>
</body>
</html>
                `}
              </CodeBox>

              <Typography variant="h3" gutterBottom>
              D3 JS Examples: Line Chart
              </Typography>
              <CodeBox>
                {`
<!DOCTYPE html>
<html>
<head>
  <title>D3 js Line Chart</title>
  <script src="https://d3js.org/d3.v7.min.js"></script>
</head>
<body>
  <script>
    const data = [
      { date: new Date(2020, 0, 1), value: 30 },
      { date: new Date(2020, 1, 1), value: 50 },
      { date: new Date(2020, 2, 1), value: 70 }
    ];
    
    const width = 500, height = 300;
    const x = d3.scaleTime().domain(d3.extent(data, d => d.date)).range([0, width]);
    const y = d3.scaleLinear().domain([0, d3.max(data, d => d.value)]).range([height, 0]);

    const line = d3.line()
      .x(d => x(d.date))
      .y(d => y(d.value));

    const svg = d3.select("body").append("svg")
      .attr("width", width)
      .attr("height", height);

    svg.append("path")
      .data([data])
      .attr("d", line)
      .attr("fill", "none")
      .attr("stroke", "steelblue");
  </script>
</body>
</html>
                `}
              </CodeBox>

              <Typography variant="h2" gutterBottom>
                Conclusion
              </Typography>
              <Typography paragraph>
                D3 js remains an essential tool in the data visualization
                toolkit, offering unparalleled flexibility and customization.
                While it has a steep learning curve and may not be the best fit
                for all projects, its powerful capabilities make it a valuable
                asset for developers needing to create custom, interactive
                visualizations. By mastering D3 js, you can leverage its full
                potential to produce sophisticated and dynamic data-driven
                graphics.
              </Typography>

              <Typography variant="h2" gutterBottom>
                Sources
              </Typography>
              <Typography paragraph>
                1.{" "}
                <a
                  href="https://d3js.org/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  D3 js Official Documentation
                </a>
                <br />
                2.{" "}
                <a
                  href="https://github.com/d3/d3"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  D3 js GitHub Repository
                </a>
                <br />
                3.{" "}
                <a
                  href="https://observablehq.com/@d3"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Observable D3 js
                </a>
                <br />
                4.{" "}
                <a
                  href="https://www.chartjs.org/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Chart.js Official Site
                </a>
                <br />
                5.{" "}
                <a
                  href="http://sigmajs.org/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Sigma.js Official Site
                </a>
              </Typography>
            </>
          }
        />
      </Grid>
    </StyledSectionGrid>
  );
}
