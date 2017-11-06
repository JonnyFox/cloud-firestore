import { Component } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';

@Component({
    selector: 'app-root',
    template: `
        <button (click)="addItem()">Add Item</button>
        <ul>
            <li *ngFor="let item of items | async">
                <pre>{{ item | json }}</pre>
            </li>
        </ul>
    `
})
export class AppComponent {
    public items: Observable<any[]>;

    private itemCollection: AngularFirestoreCollection<any>;

    constructor(private db: AngularFirestore) {
        this.itemCollection = db.collection('/items');
        this.items = this.itemCollection.valueChanges();
    }

    public addItem(): void {
        this.itemCollection.add({
            anotherTest: 'another value'
        });
    }
}