const STORAGE_KEY = 'BOOK_SHELF'

let bookDatas = [];

function isStorageExist() {
    if (typeof(Storage) === 'undefined') {
        return false;

    }
    return true;

}

function loadDataFromStorage() {
    const loadedBookDatas = localStorage.getItem(STORAGE_KEY);

    let loadedBookDataObject = JSON.parse(loadedBookDatas);
    
    if(loadedBookDataObject !== null) {
        bookDatas = loadedBookDataObject;

    };

    document.dispatchEvent(new Event("ondataloaded"));

}

function saveBookData() {
    const parsedBookDataObject = JSON.stringify(bookDatas);
    localStorage.setItem(STORAGE_KEY, parsedBookDataObject);
    document.dispatchEvent(new Event("ondatasaved"));

}

function updateBookData(newBookData, currentBookData) {
    const newBookTitle = newBookData.target[0].value;
    const newBookAuthor = newBookData.target[1].value;
    const newBookPublishYear = newBookData.target[2].value;

    currentBookData.title = newBookTitle;
    currentBookData.author = newBookAuthor;
    currentBookData.year = newBookPublishYear;

    updateDataToStorage();

    document.dispatchEvent(new Event("ondataupdated"));

}

function updateDataToStorage() {
    if(isStorageExist()){
        saveBookData();

    }
}

function composeBookDataObject(title, author, year, isComplete) {
    return {
        id: +new Date(),
        title,
        author,
        year: parseInt(year),
        isComplete

    };
 }

function findBook(bookId) {
    for(bookData of bookDatas){
        if(bookData.id === bookId)
            return bookData;

    }
    return null;

 }

function findBookIndex(bookId) {
   let index = 0

   for (bookData of bookDatas) {
       if(bookData.id === bookId)
           return index;

       index++;

   }
   return -1;

}