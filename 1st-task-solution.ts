interface IBook {
    id: number;
    name: string;
    author_name: string;
    publishing_year: number;
    // created_at: ;
    // updated_at: ;
    // deleted_at: ;
}

interface ILibrary {
    // private _books: IBook[];
    // private _idCounter: number;
    addBook( bookData: {name: string, author_name: string, publishing_year: number} ): IBook;
    getAllBooks(): IBook[];
    getBookById(id: number): IBook;
    updateBook(id:number, bookData: {name?: string, author_name?: string, publishing_year?: number} ): IBook;

    getAllBooksTotalPageNum(limit: number): number;
    getAllBooksFromPage(pageNum: number, limit: number): IBook[];
}

class Library implements ILibrary{

    constructor(
        private _books: IBook[] = [],
        private _idCounter: number = 1
    ){}
    
    addBook({ 
        name, 
        author_name, 
        publishing_year
    }:{name: string, author_name: string, publishing_year: number}){

        const newBook = {
            id: this._idCounter++,
            name, 
            author_name, 
            publishing_year
        };

        this._books = [...this._books, newBook];
        return newBook;
    }
    
    getAllBooks(){
        // По умолчанию сортируем по id
        const sortedBooks = [...this._books].sort((a, b) => a.id - b.id);
        return sortedBooks;
    }

    getBookById(id: number){
        const gettedBook = this._books.find(book => book.id === id);
        if(!gettedBook){
            throw new Error('Книга по указаному id отсутствует');
        }
        return gettedBook;
    }

    updateBook(
        id: number, {   
            name,
            author_name,
            publishing_year
        }: { name?: string, author_name?: string, publishing_year?: number }
    ){
        const currentBook = this._books.find(book => book.id === id);
        
        if(!currentBook){
            throw new Error('Книга по указаному id отсутствует');
        }

        const updatedBook = {
            ...currentBook,
            name: name ? name : currentBook.name,
            author_name: author_name ? author_name : currentBook.author_name,
            publishing_year: publishing_year ? publishing_year : currentBook.publishing_year
        }

        this._books = [
            ...this._books.filter(book => book.id !== id),
            updatedBook //специально добавляю а конец списка, так как сортировка должна осуществляться при получении данных
        ];

        return updatedBook;
    }

    deleteBook(id: number){
        const deletedBook = this._books.find(book => book.id === id);
        if(!deletedBook){
            throw new Error('Книга по указаному id отсутствует');
        }

        this._books = this._books.filter(book => book.id !== id);

        return deletedBook;
    }

    getAllBooksTotalPageNum(limit: number){
        const totalPageNum = Math.ceil(this._books.length/limit);
        return totalPageNum;
    }

    getAllBooksFromPage(pageNum: number, limit: number){

        // По умолчанию сортируем по id
        const sortedBooks = [...this._books].sort((a, b) => a.id - b.id);

        const totalPageNum = Math.ceil(sortedBooks.length/limit);
        
        if(pageNum > totalPageNum){
            throw new Error('На указанной странице книг нет');
        }

        const startIndex = (pageNum - 1) * limit;
        const endIndex = startIndex + limit;
        const paginatedBooks = sortedBooks.slice(startIndex, endIndex)

        return paginatedBooks

    }

}

const myLibrary = new Library();


myLibrary.addBook({name: 'Book 1', author_name: 'Author 1', publishing_year: 2022})
myLibrary.addBook({name: 'Book 2', author_name: 'Author 2', publishing_year: 2021})
myLibrary.addBook({name: 'Book 3', author_name: 'Author 3', publishing_year: 2020})
myLibrary.addBook({name: 'Book 4', author_name: 'Author 4', publishing_year: 2019})
myLibrary.addBook({name: 'Book 5', author_name: 'Author 5', publishing_year: 2018})
myLibrary.addBook({name: 'Book 6', author_name: 'Author 6', publishing_year: 2017})
myLibrary.addBook({name: 'Book 7', author_name: 'Author 7', publishing_year: 2016})
myLibrary.addBook({name: 'Book 8', author_name: 'Author 8', publishing_year: 2015})
myLibrary.addBook({name: 'Book 9', author_name: 'Author 9', publishing_year: 2014})
myLibrary.addBook({name: 'Book 10', author_name: 'Author 10', publishing_year: 2013})
myLibrary.addBook({name: 'Book 11', author_name: 'Author 11', publishing_year: 2012})
myLibrary.addBook({name: 'Book 12', author_name: 'Author 12', publishing_year: 2011})

myLibrary.updateBook(1, {author_name: 'Updated Author 1'});
console.log(myLibrary.getBookById(1));
myLibrary.deleteBook(2);
myLibrary.getAllBooksTotalPageNum(5); // Необходимо, чтобы можно было отразить макисмальное кол-во страниц
console.log(myLibrary.getAllBooksFromPage(1, 5));
console.log(myLibrary.getAllBooks());

