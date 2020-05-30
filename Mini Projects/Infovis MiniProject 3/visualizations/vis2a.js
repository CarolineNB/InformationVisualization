function vis2a(data, div) {
  
  const rates = d3.rollup(data,
    group => d3.sum(new Set(group.map(g => g.amount))),
    d => d.donor,
    d => d.coalesced_purpose_name)

  const purposeAmounts = Array.from(rates, ([donor, purposes]) => ({
    donor: donor,
    types: Array.from(purposes, ([purpose, amount]) => ({purpose, amount}))
  })); 

  const donors = ['United States',
      'Japan',
      'Germany',
      'United Kingdom',
      'France',
      'Netherlands',
      'Canada',
      'Sweden',
      'Norway',
      'Italy',
      'Denmark',
      'Switzerland',
      'Australia',
      'Belgium',
      'Spain',
      'Saudi Arabia',
      'Kuwait',
      'Korea',
      'Austria',
      'Finland']
  
  const recips = ['India',
  'Thailand',
  'Brazil',
  'Colombia',
  'Korea',
  'Poland',
  'South Africa',
  'Kuwait',
  'Chile',
  'Saudi Arabia']

  const margin = {top: 0, right: 50, bottom: 0, left: 30};
  const visWidth = 1140 - margin.left - margin.right;

  const visHeight = 50 - margin.top - margin.bottom;
    
  const svg = div.append("svg")
      .attr("width", visWidth + margin.left + margin.right)
      .attr("height", visHeight + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    
  const g = svg.append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);
      
  

  const x = d3.scalePoint()
    .domain(donors)
    .range([0, visWidth]);


  // the radius of the pie charts
  const outerRadius = x.step() / 3.1;

  // this axis will show the month labels
  const xAxis = d3.axisBottom(x)
     .tickSize(0);

  g.append('g')
    .attr('transform', `translate(0,${(visHeight / 2) + outerRadius + 5})`)
    .call(xAxis)
    .style("font", "0px times")
    .call(g => g.selectAll('.domain').remove());

  // create the pie and area generators
  console.log(purposeAmounts)
  const maxRadius = 10;
  const radius = d3.scaleSqrt()
      .domain([0, d3.max(purposeAmounts, d => d3.max(d.types, b => b.amount))])
      .range([0, maxRadius]);


  const pie = d3.pie()
    .value(d => d.amount);

  const arc = d3.arc()
    .innerRadius(0)
    .outerRadius(outerRadius);

  const topFivePurp = ['Air transport',
  'Rail transport',
  'Industrial development',
  'Power generation/non-renewable sources',
  'RESCHEDULING AND REFINANCING']

  cType = d3.scaleOrdinal()
    .domain(topFivePurp)
    .range(d3.schemeTableau10);

  const pieGroups = g.selectAll('.pieGroup')
    .data(purposeAmounts)
    .join('g')
      .attr('class', 'pieGroup')
      .attr('transform', d => `translate(${x(d.donor)},${visHeight / 2})`);
      
  pieGroups.selectAll('path')
  .data(d => pie(d.types))
  .join('path')
    .attr('d', d => arc(d))
    .attr('fill', d => cType(d.data.purpose))
   
}


function legend(data, div) {
  const top_codes = ['Air transport',
  'Rail transport',
  'Industrial development',
  'Power generation/non-renewable sources',
  'RESCHEDULING AND REFINANCING']

  const color = d3.scaleOrdinal()
    .domain(top_codes)
    .range(d3.schemeTableau10);

  const size = 8;
  const lineHeight = 2 * size;
  
  const svg = div.append("svg")
  const rows = svg
    .selectAll("g")
    .data(color.domain())
    .join("g")
      .attr("transform", (d, i) => `translate(0, ${i * lineHeight})`);
  
  rows.append("rect")
      .attr("height", size)
      .attr("width", size)
      .attr("fill", d => color(d));
  
  rows.append("text")
      .attr("font-family", "sans-serif")
      .attr("font-size", 12)
      .attr("dominant-baseline", "hanging")
      .attr("x", lineHeight)
      .text(d => d);
  
  return svg.node();
}