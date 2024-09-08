import {Identifiable} from "../models/identifiable";
import {Representable} from "../models/representable";

export interface Paginatable<TEntity extends Representable> {
    getPaginated(pageNumber: number, pageSize: number): TEntity[];
    getTotalCount(): number;
}