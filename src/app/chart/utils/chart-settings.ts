import { scaleOrdinal } from 'd3-scale';
import { schemeSet3 } from 'd3-scale-chromatic';
import { arc, symbol, symbolCircle } from 'd3-shape';

import { legendColor } from 'd3-svg-legend';
import d3Tip from 'd3-tip';

export const dims = {
  height: 300,
  width: 300,
  radius: 150
};

export const cent = { x: dims.width / 2 + 5, y: dims.height / 2 + 5 };

export const colour = scaleOrdinal(schemeSet3);

export const arcPath = arc()
  .outerRadius(dims.radius)
  .innerRadius(dims.radius / 2);

export const legend = legendColor()
  .shape('path', symbol().type(symbolCircle)())
  .shapePadding(10)
  .scale(colour);

export const tip = d3Tip()
  .attr('class', 'tip card')
  .html(d => {
    let content = `<div class='name'>${d.data.name}</div>`;
    content += `<div class='cost'>£${d.data.cost}</div>`;
    content += `<div class='delete'>Click slice to delete</div>`;
    return content;
  });
