import * as d3 from 'd3';
import { select } from 'd3-selection';
import { colour } from './chart-settings';

// event handlers
export const handleMouseOver = (d, i, n) => {
  select(n[i])
    .transition('changeSliceFill')
    .duration(300)
    .attr('fill', '#fff');
};

export const handleMouseOut = (d, i, n) => {
  select(n[i])
    .transition('changeSliceFill')
    .duration(300)
    .attr('fill', colour(d.data.name));
};
