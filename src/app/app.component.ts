import { Component, OnInit, OnDestroy } from '@angular/core';
// import { AngularFirestore } from '@angular/fire/firestore';
// import 'firebase/firestore';
// import { Observable } from 'rxjs';
import { Expense } from './expense-create/expense.model';
import { DataService } from './data.service';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy{

  // items: Observable<any[]>;
  expenses: Expense[];
  private expensesSub: Subscription;
  isAddedSuccess: boolean;

  constructor(private dataService: DataService) {
    // this.items = firestore.collection('expenses').valueChanges();
  }

  ngOnInit() {
    this.expensesSub = this.dataService.subscribeToDataSource()
      .subscribe((expenses: Expense[]) => {
        this.expenses = expenses;
        console.log(this.expenses);
      });

    this.isAddedSuccess = false;
  }

  ngOnDestroy() {
    if(this.expensesSub) {
      this.expensesSub.unsubscribe();
    }
  }

  addExpenseToFirestore(expense: Expense) {
    this.dataService.addExpense(expense).then(docRef => {
      console.log("Added ", docRef.id);
      this.isAddedSuccess = true;
    }).catch(err => {
      console.error("error ", err);
    });
  }
}
