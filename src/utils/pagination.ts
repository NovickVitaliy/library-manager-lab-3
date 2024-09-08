import {Paginatable} from "../services/paginatable";
import {Identifiable} from "../models/identifiable";
import {Representable} from "../models/representable";

export class Pagination {
    private readonly paginationId: string;
    private readonly listId: string;
    private readonly itemsPerPage: number;
    private paginatableItems: Paginatable<Representable>;
    private currentPage: number;
    private previousPagination: Paginatable<Representable> | undefined;

    constructor(paginationId: string,
                listId: string,
                paginatableItems: Paginatable<Representable>,
                itemsPerPage: number = 5) {
        this.currentPage = 1;
        this.paginationId = paginationId;
        this.listId = listId;
        this.paginatableItems = paginatableItems;
        this.itemsPerPage = itemsPerPage;
        this.initListeners();
        this.renderPageNumbers();
    }

    getTotalPages(): number {
        return Math.ceil(this.paginatableItems.getTotalCount() / this.itemsPerPage);
    }

    goToPage(page: number): void {
        const totalPages = this.getTotalPages();
        console.log(totalPages);
        console.log(page);
        if(totalPages == 0){
            this.clearPagination();
        }
        if (page < 1 || page > totalPages) return;
        this.currentPage = page;
        this.updatePaginationUI();
        this.renderPageNumbers();
        this.renderItems();
    }

    renderPageNumbers(): void {
        const totalPages = this.getTotalPages();
        console.log(totalPages);
        const paginationContainer = document.getElementById(this.paginationId);

        if (!paginationContainer) return;
        Array.from(document.querySelectorAll(`.${this.paginationId}-page-number`)).forEach(el => el.remove());

        for (let i = 1; i <= totalPages; i++) {
            const pageItem = document.createElement('li');
            pageItem.classList.add('page-item', `${this.paginationId}-page-number`);
            if (i === this.currentPage) {
                pageItem.classList.add('active');
            }

            const pageLink = document.createElement('a');
            pageLink.classList.add('page-link');
            pageLink.href = '#';
            pageLink.textContent = i.toString();
            pageLink.addEventListener('click', (e) => {
                e.preventDefault();
                this.goToPage(i);
            });

            pageItem.appendChild(pageLink);
            console.log(pageItem);
            paginationContainer.insertBefore(pageItem, document.getElementById(`${this.paginationId}-next-page`));
        }

        this.updatePaginationUI();
    }

    initListeners(): void {
        document.getElementById(`${this.paginationId}-prev-page`)?.addEventListener("click", (e) => {
            e.preventDefault();
            this.goToPage(this.currentPage - 1);
        });
        document.getElementById(`${this.paginationId}-next-page`)?.addEventListener("click", (e) => {
            e.preventDefault();
            this.goToPage(this.currentPage + 1);
        });
    }

    updatePaginationUI(): void {
        const totalPages = this.getTotalPages();
        document.getElementById(`${this.paginationId}-prev-page`)?.parentElement?.classList.toggle("disabled", this.currentPage === 1);
        document.getElementById(`${this.paginationId}-next-page`)?.parentElement?.classList.toggle("disabled", this.currentPage === totalPages);
    }


    private renderItems() {
        const list = document.getElementById(this.listId);
        if(!list) return;
        list.innerHTML = "";
        const items = this.paginatableItems.getPaginated(this.currentPage, this.itemsPerPage);
        for (let item of items) {
            const li = document.createElement('li');
            li.className = "list-group-item d-flex justify-content-between";
            const text = document.createTextNode(item.represent());
            const p = document.createElement('p');
            p.className = "mt-auto mb-auto";
            p.appendChild(text);
            li.appendChild(p);
            list.appendChild(li);
        }
    }

    private clearPagination() {
        const paginationContainer = document.getElementById(this.paginationId);

        if (!paginationContainer) return;
        Array.from(document.querySelectorAll(`.${this.paginationId}-page-number`)).forEach(el => el.remove());

        const list = document.getElementById(this.listId);
        if(!list) return;
        list.innerHTML = "";
    }
}