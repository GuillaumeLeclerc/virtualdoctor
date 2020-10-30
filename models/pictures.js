import { makeObservable, action, computed, observable, makeAutoObservable } from "mobx"

export class Picture {
  constructor(content, coords) {
    makeAutoObservable(this);
    this.content = content;
    this.coords = coords;
    this.date = Date.now();
  }
}

export default class PicturesContainer {
  pictures = []

  constructor() {
    makeAutoObservable(this);
  }

  add(picture) {
    this.pictures.push(picture);
  }

}


