import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import 'firebase/firestore';
import { Expense } from './expense-create/expense.model';
import { Subject, Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private expenses: Expense[];
  private expenseSSubject = new Subject<Expense[]>();
  private fireStoreSub: Subscription;

  constructor(private fireStore: AngularFirestore) {
    this.fireStoreSub = this.fireStore.collection('expenses').valueChanges()
      .subscribe((expenses: Expense[]) => {
        this.expenses = expenses;
        this.expenseSSubject.next([...this.expenses]);
    });
  }

  subscribeToDataSource() {
    return this.expenseSSubject;
  }

  addExpense(expense: Expense) {
    return this.fireStore.collection('expenses').add(expense);
  }
}
