import { Identifiable } from './identifiable';
import { Representable } from './representable';

export interface IBook extends Identifiable<number>, Representable {
  bookName: string;
  author: string;
  releaseYear: number;
  borrowed: boolean;
  borrowedBy?: string;

  getBookName(): string;
  getAuthor(): string;
  getReleaseYear(): number;
  getFullName(): string;
}
