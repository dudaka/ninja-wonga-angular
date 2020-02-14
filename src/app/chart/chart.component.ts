import {
  Component,
  Input,
  ViewChild,
  ElementRef,
  ChangeDetectionStrategy,
  OnChanges
} from "@angular/core";

import * as d3 from "d3";

import { Expense } from "../expense-create/expense.model";

const dims = { height: 300, width: 300, radius: 150 };

const cent = { x: dims.width / 2 + 5, y: dims.height / 2 + 5 };

@Component({
  selector: "app-chart",
  templateUrl: "./chart.component.html",
  styleUrls: ["./chart.component.css"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChartComponent implements OnChanges {
  @ViewChild("chart", { static: true }) chartEl: ElementRef;
  @Input() expenses: Expense[];

  private svg: any;
  private graph: any;
  private pie: any;
  private angles: any;
  private arcPath: any;

  constructor() {}

  ngOnChanges() {
    if (this.expenses) {
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

      this.angles = this.pie([
        { name: "rent", cost: 500 },
        { name: "bills", cost: 300 },
        { name: "gaming", cost: 200 }
      ]);

      const arcPath = d3
        .arc()
        .outerRadius(dims.radius)
        .innerRadius(dims.radius / 2);

      console.log(arcPath(this.angles[0]));
    }
  }
}
