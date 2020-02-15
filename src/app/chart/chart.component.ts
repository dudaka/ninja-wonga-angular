import {
  Component,
  Input,
  ViewChild,
  ElementRef,
  ChangeDetectionStrategy,
  OnChanges,
  Output,
  EventEmitter
} from '@angular/core';

import * as d3 from 'd3';
import { pie } from 'd3-shape';

import { dims, cent, tip, legend, colour } from './utils/chart-settings';
import { handleMouseOut, handleMouseOver } from './utils/event-handlers';
import { arcTweenEnter, arcTweenExit, arcTweenUpdate } from './utils/tweens';

import { Expense } from '../expense-create/expense.model';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChartComponent implements OnChanges {
  @ViewChild('chart', { static: true }) chartEl: ElementRef;
  @Input() expenses: Expense[];
  @Output() deleteExpense = new EventEmitter<string>();

  private svg: any;
  private graph: any;
  private pie: any;
  private legendGroup: any;

  constructor() { }

  ngOnChanges() {
    if (this.expenses) {
      if (this.graph) {
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
    const paths = this.graph.selectAll('path').data(this.pie(this.expenses));

    // handle the exit selection
    paths.exit()
      .transition()
      .duration(750)
      .attrTween('d', arcTweenExit)
      .remove();

    // handle the current DOM path updates
    paths
      .transition()
      .duration(750)
      .attrTween('d', arcTweenUpdate);

    // add new DOM paths
    paths
      .enter()
      .append('path')
      .attr('class', 'arc')
      .attr('stroke', '#fff')
      .attr('stroke-width', 3)
      // .attr('d', arcPath)
      .attr('fill', d => colour(d.data.name))
      .each(function(d) {
        this._current = d;
      })
      .transition()
      .duration(750)
      .attrTween('d', arcTweenEnter);

    // update legend
    this.legendGroup.call(legend);
    this.legendGroup.selectAll('text').attr('fill', 'white');

    // add events
    this.graph
      .selectAll('path')
      .on('mouseover', (d, i, n) => {
        tip.show(d, n[i]);
        handleMouseOver(d, i, n);
      })
      .on('mouseout', (d, i, n) => {
        tip.hide();
        handleMouseOut(d, i, n);
      })
      .on('click', d => {
        const id = d.data.id;
        this.deleteExpense.emit(id);
      });

    this.graph.call(tip);
  }

  private initializeChart() {
    this.svg = d3.select(this.chartEl.nativeElement)
      .append('svg')
      // .attr('width', dims.width + 150)
      // .attr('height', dims.height + 150);
      .attr('viewBox', `0 0 ${dims.width + 150} ${dims.height + 150}`)
      .attr('preserveAspectRatio', 'xMidYMid');

    this.graph = this.svg
      .append('g')
      .attr('transform', `translate(${cent.x}, ${cent.y})`);

    this.pie = pie()
      .sort(null)
      .value(d => d['cost']);

    // legend setup
    this.legendGroup = this.svg
      .append('g')
      .attr('class', 'legend')
      .attr('transform', `translate(${dims.width + 40}, 10)`);

    // ------------------------------------------------------------

    this.updateChart();
  }
}
