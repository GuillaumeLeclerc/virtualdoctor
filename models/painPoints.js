import { makeObservable, action, computed, observable, makeAutoObservable } from "mobx"

const PAIN_MAP = {
  0: 'No Pain',
  1: 'Very Mild',
  2: 'Discomforting',
  3: 'Tolerable',
  4: 'Distressing',
  5: 'Very Distressing',
  6: 'Intense',
  7: 'Very Intense',
  8: 'Utterly Horrible',
  9: 'Excruciating Unbearable',
  10: 'Unimaginable Unspeakable'
}



export class PainPoint {
  constructor(intensity, coords) {
    makeAutoObservable(this);
    this.intensity = parseInt(intensity);
    this.coords = coords;
    this.date = Date.now();
  }

  get description() {
    return PAIN_MAP[this.intensity];
  }

  get colorMap() {
    switch(this.intensity) {
      case 0:
        return 'cyan';
      case 1:
      case 2:
        return 'green';
      case 3:
      case 4:
        return 'lime';
      case 5:
      case 6:
        return 'gold';
      case 7:
      case 8:
        return 'orange';
      case 9:
        return 'volcano';
      case 10:
        return 'red'
    }
    return 'cyan';
  }

  get key() {
    return this.date;
  }
}

export default class PainPointsContainer {
  painPoints = []

  constructor() {
    makeAutoObservable(this);
  }

  add(picture) {
    this.painPoints.push(picture);
  }
}


