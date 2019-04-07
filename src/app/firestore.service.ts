import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
  AngularFirestoreDocument
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class FirestoreService {

  public items: AngularFirestoreCollection;
  public currentTemp: Observable<any>;
  private itemDoc: AngularFirestoreDocument<any>;

  constructor(
    private afs: AngularFirestore
  ) { }

  public createDocument(doc: string, unit: string) {
    const newDoc = {
      name: unit,
      value: unit === 'fahrenheit' ? 78 : 26
    };
    this.itemDoc = this.afs.doc(`items/${doc}`);
    this.currentTemp = this.itemDoc.valueChanges();
    this.items = this.afs.collection('items');
    this.items.doc(doc).set(newDoc, {merge: true});
  }

}
