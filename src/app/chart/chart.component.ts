import {
  Component,
  Input,
  ViewChild,
  ElementRef,
  ChangeDetectionStrategy,
  OnChanges,
  Output,
  EventEmitter
} from "@angular/core";

import * as d3 from "d3";
import { legendColor } from "d3-svg-legend";
import d3Tip from "d3-tip";

import { Expense } from "../expense-create/expense.model";

const dims = { height: 300, width: 300, radius: 150 };

const cent = { x: dims.width / 2 + 5, y: dims.height / 2 + 5 };

const colour = d3.scaleOrdinal(d3["schemeSet3"]);

const arcPath = d3
  .arc()
  .outerRadius(dims.radius)
  .innerRadius(dims.radius / 2);

const legend = legendColor()
  .shape("path", d3.symbol().type(d3.symbolCircle)())
  .shapePadding(10)
  .scale(colour);

const tip = d3Tip()
  .attr("class", "tip card")
  .html(d => {
    let content = `<div class="name">${d.data.name}</div>`;
    content += `<div class="cost">£${d.data.cost}</div>`;
    content += `<div class="delete">Click slice to delete</div>`;
    return content;
  });

@Component({
  selector: "app-chart",
  templateUrl: "./chart.component.html",
  styleUrls: ["./chart.component.css"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChartComponent implements OnChanges {
  @ViewChild("chart", { static: true }) chartEl: ElementRef;
  @Input() expenses: Expense[];
  @Output() deleteExpense = new EventEmitter<string>();

  private svg: any;
  private graph: any;
  private pie: any;
  private legendGroup: any;

  constructor() {}

  ngOnChanges() {
    if (this.expenses) {
      if (this.graph) {
        console.log(this.expenses);
        this.updateChart();
      } else {
        this.initializeChart();
      }
    }
  }

  private updateChart() {
    // update colour scale domain
    colour.domain(this.expenses.map(d => d.name));

    // join enhanced (pie) data to path elements
    const paths = this.graph.selectAll("path").data(this.pie(this.expenses));

    // handle the exit selection
    paths
      .exit()
      .transition()
      .duration(750)
      .attrTween("d", arcTweenExit)
      .remove();

    // handle the current DOM path updates
    paths
      .transition()
      .duration(750)
      .attrTween("d", arcTweenUpdate);

    paths
      .enter()
      .append("path")
      .attr("class", "arc")
      .attr("stroke", "#fff")
      .attr("stroke-width", 3)
      // .attr('d', arcPath)
      .attr("fill", d => colour(d.data.name))
      .each(function(d) {
        this._current = d;
      })
      .transition()
      .duration(750)
      .attrTween("d", arcTweenEnter);

    // update legend
    this.legendGroup.call(legend);
    this.legendGroup.selectAll("text").attr("fill", "white");

    // add events
    this.graph
      .selectAll("path")
      .on('mouseover', (d,i,n) => {
        tip.show(d, n[i]);
        handleMouseOver(d, i, n);
      })
      .on('mouseout', (d,i,n) => {
        tip.hide();
        handleMouseOut(d, i, n);
      })
      .on("click", d => {
        const id = d.data.id;
        this.deleteExpense.emit(id);
      });
  }

  private initializeChart() {
    this.svg = d3
      .select(this.chartEl.nativeElement)
      .append("svg")
      .attr("width", dims.width + 150)
      .attr("height", dims.height + 150);

    this.graph = this.svg
      .append("g")
      .attr("transform", `translate(${cent.x}, ${cent.y})`);
    this.pie = d3
      .pie()
      .sort(null)
      .value(d => d["cost"]);

    // legend setup
    this.legendGroup = this.svg
      .append("g")
      .attr("transform", `translate(${dims.width + 40}, 10)`);

    colour.domain(this.expenses.map(d => d.name));

    const paths = this.graph.selectAll("path").data(this.pie(this.expenses));

    paths
      .enter()
      .append("path")
      .attr("class", "arc")
      .attr("stroke", "#fff")
      .attr("stroke-width", 3)
      // .attr('d', arcPath)
      .attr("fill", d => colour(d.data.name))
      .each(function(d) {
        this._current = d;
      })
      .transition()
      .duration(750)
      .attrTween("d", arcTweenEnter);

    // update legend
    this.legendGroup.call(legend);
    this.legendGroup.selectAll("text").attr("fill", "white");

    // add events
    this.graph
      .selectAll("path")
      .on('mouseover', (d,i,n) => {
        tip.show(d, n[i]);
        handleMouseOver(d, i, n);
      })
      .on('mouseout', (d,i,n) => {
        tip.hide();
        handleMouseOut(d, i, n);
      })
      .on("click", d => {
        const id = d.data.id;
        this.deleteExpense.emit(id);
      });

    this.graph.call(tip);
  }
}

// event handlers
const handleMouseOver = (d, i, n) => {
  //console.log(n[i]);
  d3.select(n[i])
    .transition("changeSliceFill")
    .duration(300)
    .attr("fill", "#fff");
};

const handleMouseOut = (d, i, n) => {
  //console.log(n[i]);
  d3.select(n[i])
    .transition("changeSliceFill")
    .duration(300)
    .attr("fill", colour(d.data.name));
};

// use function keyword to allow use of 'this'
function arcTweenUpdate(d) {
  // console.log(this._current, d);
  // interpolate between the two objects
  var i = d3.interpolate(this._current, d);
  // update the current prop with new updated data
  this._current = i(1);

  return function(t) {
    // i(t) returns a value of d (data object) which we pass to arcPath
    return arcPath(i(t));
  };
}

const arcTweenEnter = d => {
  var i = d3.interpolate(d.endAngle - 0.1, d.startAngle);

  return function(t) {
    d.startAngle = i(t);
    return arcPath(d);
  };
};

const arcTweenExit = d => {
  var i = d3.interpolate(d.startAngle, d.endAngle);

  return function(t) {
    d.startAngle = i(t);
    return arcPath(d);
  };
};
