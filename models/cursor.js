import { makeObservable, action, computed, observable, makeAutoObservable } from "mobx"

import database  from './storage';

export default class Cursor3D {
  coords = [];

  constructor(room) {
    makeObservable(this, {
      coords: observable.ref,
      setCoords: action,
      isSet: computed,
      erase: action
    });

    this.room = room;


    this.initFirebase();
  }

  async initFirebase() {
    this.ref = database.ref('/cursors/' + this.room)
    this.ref.on('value', (v) => {
      try {
        this.setCoords(v.val());
      }
      catch {
        this.erase()
      }
    });
  }

  setCoords(coords) {
    this.coords = Object.values(coords);
    this.ref.set(this.coords)
  }

  erase() {
    this.setCoords([0]);
  }

  get isSet() {
    return this.coords.length == 3;
  }

}
