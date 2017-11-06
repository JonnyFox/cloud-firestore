import * as firebase from 'firebase';
import { Component } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { firestore } from 'firebase';

@Component({
    selector: 'app-root',
    template: `
        <button (click)="addItem()">Add Item</button>
        <button (click)="upsertItem()">Modify Item</button>
        <button (click)="deleteField()">Delete Item</button>
        <button (click)="addItemWithTransaction()">Add Item with Transaction</button>
        <button (click)="addItemsWithBatch()">Add Items with Batch</button>
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

    public deleteField(): void {

        // remove the content field from the document
        this.itemCollection.doc('Document1').update({
            content: firebase.firestore.FieldValue.delete()
        });
    }

    public addItemWithTransaction(): void {

        const documentReference = this.itemCollection.doc('Document1');

        // running the transaction
        firebase.firestore().runTransaction(t => {

            // returning the transaction function
            return t.get(documentReference.ref)
                .then(doc => {

                    // read the current "value" field of the document
                    const newValue = doc.data().value + 1;

                    // increase it by 1 atomically
                    t.update(documentReference.ref, {
                        value: newValue
                    });
                });
        }).then(res => console.log('Transaction completed!'), err => console.error(err));

    }

    public addItemsWithBatch(): void {

        // create a batch container
        const batch = firebase.firestore().batch();

        for (let index = 0; index < 10; index++) {

            const currentdocRef = this.itemCollection.doc(`BatchDocument${index}`);

            // add our set operation
            batch.set(currentdocRef.ref, {
                value: index,
                content: `Secret file #${index + 1}`
            });
        }

        // add a different operation (update) to the set of batched writes
        batch.update(this.itemCollection.doc(`BatchDocument9`).ref, {
            value: 10
        });

        // execute our batch
        batch.commit()
             .then(res => console.log('Batch completed!'), err => console.error(err));
    }
}
