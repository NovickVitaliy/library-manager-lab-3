export class Storage {
  private static instance: Storage;

  private constructor() {}
  save(key: string, data: unknown) {
    localStorage.setItem(key, JSON.stringify(data));
  }

  get(key: string): unknown {
    return JSON.parse(localStorage.getItem(key) || '[]');
  }

  clear(): void {
    localStorage.clear();
  }

  static getInstance() {
    if (!Storage.instance) {
      Storage.instance = new Storage();
    }

    return Storage.instance;
  }
}
