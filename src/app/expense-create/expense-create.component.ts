import { Component, OnInit, Output,EventEmitter, Input } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Expense } from './expense.model';

@Component({
  selector: 'app-expense-create',
  templateUrl: './expense-create.component.html',
  styleUrls: ['./expense-create.component.css']
})
export class ExpenseCreateComponent implements OnInit {

  @Output() expenseSubmited = new EventEmitter<Expense>();
  @Input() isSuccess: boolean;

  constructor() { }

  ngOnInit(): void {
  }

  onSubmit(form: NgForm) {
    const expense = {
      name: form.value.name,
      cost: form.value.cost
    };

    this.expenseSubmited.emit(expense);
    form.reset();
  }

}
