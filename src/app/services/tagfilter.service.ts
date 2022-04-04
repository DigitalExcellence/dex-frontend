import { EventEmitter } from '@angular/core';

export class TagfilterService {
  navchange: EventEmitter<number> = new EventEmitter();
  constructor() {}
  emitTagChangeEvent(tagId) {
    this.navchange.emit(tagId);
  }
  getTagChangeEmitter() {
    return this.navchange;
  }
}
