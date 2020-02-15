import { Injectable } from '@angular/core';
import { AngularFirestore, DocumentChangeAction } from '@angular/fire/firestore';
import 'firebase/firestore';
import { Expense } from './expense-create/expense.model';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private expenses: Expense[] = [];
  private expenseValuesChangedSubject = new Subject<Expense[]>();

  constructor(private fireStore: AngularFirestore) {
    // this.fireStore.collection('expenses').valueChanges()
    //   .subscribe((expenses: Expense[]) => {
    //     console.log("onValueChanges", expenses);
    //     this.expenses = expenses;
    //     this.expenseValuesChangedSubject.next([...this.expenses]);
    // });

    this.fireStore.collection('expenses').snapshotChanges().subscribe(res => {
      const expenses = [];
      res.forEach(change => {
        const doc = {...(change.payload.doc.data() as Expense), id: change.payload.doc.id};
        expenses.push(doc);
      });
      this.expenses = expenses;
      this.expenseValuesChangedSubject.next([...this.expenses]);
    });



    // this.fireStore.collection('expenses').stateChanges()
    // .subscribe(res => {
    //   console.log("stateChanges", res);
    // });
  }

  subscribeToDataSource() {
    return this.expenseValuesChangedSubject;
  }

  addExpense(expense: Expense) {
    return this.fireStore.collection('expenses').add(expense);
  }

  deleteExpense(id: string) {
    this.fireStore.collection('expenses').doc(id).delete();
  }
}
