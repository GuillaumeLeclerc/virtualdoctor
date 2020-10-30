import { makeObservable, action, computed, observable, makeAutoObservable } from "mobx"

export default class Cursor3D {
  coords = [];

  constructor() {
    makeObservable(this, {
      coords: observable.ref,
      setCoords: action,
      isSet: computed,
      erase: action
    });
  }

  setCoords(coords) {
    this.coords = Object.values(coords);
  }

  erase() {
    this.coords = []
  }

  get isSet() {
    return this.coords.length == 3;
  }

}
