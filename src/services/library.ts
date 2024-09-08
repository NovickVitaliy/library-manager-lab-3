import {Identifiable} from "../models/identifiable";

import {IBook} from "../models/IBook";
import {Paginatable} from "./paginatable";
import {Representable} from "../models/representable";

export class Library<TItem extends Identifiable<TId> & Representable, TId> implements Paginatable<Representable>{
    private items: Array<TItem>;
    constructor() {
        this.items = [];
    }

    add(item: TItem): void {
        this.items.push(item);
    }

    remove(item: TItem): void {
        this.items = this.items.filter(x => x !== item);
    }

    removeById(id: TId): void {
        const itemToDelete = this.items.filter(x => x.id === id)[0];
        if(!itemToDelete){
            throw new Error("Item was not found");
        }
        this.items = this.items.filter(x => x.id !== id);
    }

    find(id: TId): TItem | undefined {
        return this.items.filter(x => x.id === id)[0];
    }

    getAll(): Array<TItem> {
        return this.items;
    }

    getPaginated(pageNumber: number, pageSize: number): Representable[] {
        const start = (pageNumber - 1) * pageSize;
        const end = start + pageSize;
        return this.items.slice(start, end);
    }

    getTotalCount(): number {
        return this.items.length;
    }
}
