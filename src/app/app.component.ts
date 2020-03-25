import { Component } from '@angular/core';
import { AngularFireDatabase, AngularFireObject } from '@angular/fire/database';
import { AngularFirestore } from '@angular/fire/firestore';
import 'firebase/database';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { from } from 'rxjs';
import 'firebase/firestore';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']

})
export class AppComponent {
  title = 'Sholud I Stay At Home';
  items: AngularFireObject<any>;
  item: any;

  apiKey = 'trnsl.1.1.20200312T100508Z.f31964198bfb9a51.2a3d49e3b96be59bc155a8ddc080ae3f6f65f433';
  url = 'https://translate.yandex.net/api/v1.5/tr.json/translate';
  result: any;
  text: any;

  constructor(db: AngularFireDatabase, private http: HttpClient, firestore: AngularFirestore) {
    this.items = db.object('stayathome');
    this.items.snapshotChanges().subscribe(action => {
      this.item = action.payload.val();
      this.translate(this.item);
    });
    
    const test = firestore.collection('Drawings');
    test.snapshotChanges().subscribe(data => {
      // console.log({data});
    })
    

  }
  changeMyMind() {
    this.items.set(!this.item);
  }

  translate(status): void {
    const params = {
      lang: 'en-ru',
      key: this.apiKey,
      text: status ? 'Yes' : 'No'
    };
    const result = from(
        fetch(
          this.url + '?key=' + this.apiKey + '&text=' + params.text + '&lang=' + params.lang,
          {
            // body: JSON.stringify(params),
            headers: {
              'Content-Type': 'application/json; charset=utf-8',
            },
            method: 'GET',
          }
        )
      );

    // console.log(navigator.language);
    const lang = navigator.language.split('-');
    const res = this.http.get(this.url + '?key=' + this.apiKey + '&text=' + params.text + '&lang=' + (lang[0] ? lang[0] : 'en'));
    res.subscribe( (data: any) => {
      // console.log('data ', data.text[0]);
      this.text = data.text[0]
    });

   }
}
