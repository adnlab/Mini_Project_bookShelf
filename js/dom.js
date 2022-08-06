const COMPLETED_BOOK = 'completed-book';
const UNCOMPLETED_BOOK = 'uncompleted-book';
const BOOK_ITEM_ID = 'itemId';

function addBookToList(event) {
    const bookTitle = event.target[0].value;
    const bookAuthor = event.target[1].value;
    const bookPublishYear = event.target[2].value;
    const bookStatus = event.target[3].checked;

    const bookDataObject = composeBookDataObject(bookTitle, bookAuthor, bookPublishYear, bookStatus);
    bookDatas.push(bookDataObject);
    updateDataToStorage();
    countBookInList();

    event.target.reset();
    createBookElement(bookDataObject);

}

function countBookInList() {
    let completedBookCount = 0;
    let uncompletedBookCount = 0;
    
    for (item of bookDatas) {
        if (item.isComplete == true) {
            completedBookCount+=1;

        } else if (item.isComplete == false) {
            uncompletedBookCount+=1;

        }
    }

    const completedBookElement = document.getElementById('completed-book-count');
    const uncompletedBookElement = document.getElementById('uncompleted-book-count');

    completedBookElement.innerText = completedBookCount;
    uncompletedBookElement.innerText = uncompletedBookCount;

}

function createBookElement(bookItem) {
    const elementBookTitle = document.createElement('p');
    elementBookTitle.classList.add('item-title');
    elementBookTitle.innerText = bookItem.title;

    const elementBookInfo = document.createElement('p');
    elementBookInfo.classList.add('item-info');
    elementBookInfo.innerText = bookItem.author+' ('+bookItem.year+')';

    const elementContainer = document.createElement('div');
    elementContainer.classList.add('item-book');
    elementContainer[BOOK_ITEM_ID] = bookItem.id;

    elementContainer.append(
        elementBookTitle,
        elementBookInfo,
        createEditButton(),
        createDeleteButton()

    );

    if (bookItem.isComplete) {
        elementContainer.prepend(createUncheckButton());
        elementContainer[BOOK_ITEM_ID] = bookItem.id;

        const cardCompletedBook = document.getElementById('completed-book');
        cardCompletedBook.append(elementContainer);

    } else {
        elementContainer.prepend(createCheckButton());
        elementContainer[BOOK_ITEM_ID] = bookItem.id;

        const cardUncompletedBook = document.getElementById('uncompleted-book');
        cardUncompletedBook.append(elementContainer);
        
    }
}

function createCheckButton() {
    return createButton('check', function(event){
        checkBookInUncompleted(event.target.parentElement);

    });
}

function createUncheckButton() {
    return createButton('uncheck', function(event){
        uncheckBookInCompleted(event.target.parentElement);

    });
}

function createEditButton() {
    return createButton('edit', function(event){
        editThisBook(event.target.parentElement);

    });
}

function createDeleteButton() {
    return createButton('delete', function(event){
        deleteBookFromList(event.target.parentElement);

    });
}

function createButton(buttonClass, eventListener) {
    const elementButton = document.createElement('button');
    elementButton.classList.add('item-button');
    elementButton.classList.add(buttonClass);
    elementButton.innerText = buttonClass;

    elementButton.addEventListener('click', function(event) {
        eventListener(event);

    });

    return elementButton;

}

function checkBookInUncompleted(bookElement) {
    const bookData = findBook(bookElement[BOOK_ITEM_ID]);
    
    bookData.isComplete = true;
    updateDataToStorage();
    countBookInList();

    bookElement.remove();
    createBookElement(bookData);

}

function uncheckBookInCompleted(bookElement) {
    const bookData = findBook(bookElement[BOOK_ITEM_ID]);
    
    bookData.isComplete = false;
    updateDataToStorage();
    countBookInList();
    
    bookElement.remove();
    createBookElement(bookData);

}

function deleteBookFromList(bookElement) {
    const bookPosition = findBookIndex(bookElement[BOOK_ITEM_ID]);
    
    bookDatas.splice(bookPosition, 1);
    updateDataToStorage();
    countBookInList();

    bookElement.remove();

}

function editThisBook(bookElement) {
    const bookData = findBook(bookElement[BOOK_ITEM_ID]);

    while (bookElement.firstChild) {
        bookElement.removeChild(bookElement.firstChild);

    }

    bookElement.append(createEditElement(bookData));

    document.addEventListener('ondataupdated', () => {
        while (bookElement.firstChild) {
            bookElement.removeChild(bookElement.firstChild);

        }

        const newBookData = findBook(bookElement[BOOK_ITEM_ID]);

        const elementBookTitle = document.createElement('p');
        elementBookTitle.classList.add('item-title');
        elementBookTitle.innerText = newBookData.title;
    
        const elementBookInfo = document.createElement('p');
        elementBookInfo.classList.add('item-info');
        elementBookInfo.innerText = newBookData.author+' ('+newBookData.year+')';
    
        if (newBookData.isComplete) {
            bookElement.append(createUncheckButton());

        } else {
            bookElement.append(createCheckButton());

        }

        bookElement.append(
            elementBookTitle,
            elementBookInfo,
            createEditButton(),
            createDeleteButton()

        );
    });
}

function createEditElement(bookItem) {
    
    const elementTitleEdit = createFormInput('edit-book-title', 'text', bookItem.title);
    const elementAuthorEdit = createFormInput('edit-book-author', 'text', bookItem.author);
    const elementYearEdit = createFormInput('edit-book-year', 'number', bookItem.year);
    const elementSubmitEdit = createFormInput('edit-book-submit', 'submit', 'Update');

    const elementEditForm = document.createElement('form');
    elementEditForm.classList.add('edit-book');
    elementEditForm.setAttribute('display', 'none');

    elementEditForm.append(
        elementTitleEdit,
        elementAuthorEdit,
        elementYearEdit,
        elementSubmitEdit
    );

    elementEditForm.addEventListener('submit', function (event) {
        event.preventDefault();
        updateBookData(event, bookItem);
    });

    return elementEditForm;

}

function createFormInput(inputClass, inputType, inputValue) {
    const inputElement = document.createElement('input');
    inputElement.classList.add(inputClass);
    inputElement.setAttribute('type', inputType);
    inputElement.setAttribute('value', inputValue);

    return inputElement;

}

function filterBookFromList(event) {
    resetFilterBook();

    const keywordBookTitle = event.target[0].value.toLowerCase();
    let bookIds = [];

    for (bookItem of bookDatas) {
        if (bookItem.title.toLowerCase().includes(keywordBookTitle.toLowerCase())) {
            bookIds.push(bookItem.id);

        }
    }

    const bookTitleList = document.querySelectorAll('.item-title')

    for (bookTitle of bookTitleList) {
        lowerCaseTitle = bookTitle.innerText.toLowerCase();

        if (!lowerCaseTitle.includes(keywordBookTitle)) {
            bookTitle.parentElement.style.display = 'none';

        }
    }
}

function resetFilterBook() {
    const elementBookList = document.querySelectorAll('.item-book');
    
    for (item of elementBookList) {
        item.style.display = '';

    }
}