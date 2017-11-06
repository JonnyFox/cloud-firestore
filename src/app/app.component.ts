import { Component } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';

@Component({
    selector: 'app-root',
    template: `
        <button (click)="addItem()">Add Item</button>
        <button (click)="upsertItem()">Modify Item</button>
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

    public upsertItem(): void {

        // in this case the document will be added to the collection
        this.itemCollection.doc('Document1').set({
            value: 33,
            content: 'Very important'
        });

        // here we will change the content field only
        this.itemCollection.doc('Document1').update({
            content: 'Top secret'
        });
    }

    
}