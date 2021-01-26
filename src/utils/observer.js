export default class Observer {
  constructor() {
    this._observers = [];
  }

  addObserver(observer) {
    this._observers.push(observer);
  }

  removeObserver(observer) {
    this._observers = this._observers.filter((currentObserver) => currentObserver !== observer);
  }

  _notify(event, payload) {
    console.log(`Notify!!`)
    console.log(event);
    console.log(payload);
    this._observers.forEach((observer) => {
      console.log(observer);
      return observer(event, payload);
    });
  }
}
