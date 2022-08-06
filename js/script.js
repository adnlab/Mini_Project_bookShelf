document.addEventListener("DOMContentLoaded", function () {
    const existingForm = document.getElementsByTagName('form');

    for (formItem of existingForm){
        formItem.addEventListener("submit", function (event) {
            event.preventDefault();

            const submitId = event.submitter.getAttribute('id');

            if (submitId == 'book-submit') {
                addBookToList(event);

            } else if (submitId == 'filter-book-submit') {
                filterBookFromList(event);

            } else if (submitId == 'filter-book-reset') {
                resetFilterBook();
                event.target.reset();

            }
        });
    }
    
    if(isStorageExist()){
        loadDataFromStorage();
    }
    
 });

document.addEventListener("ondataloaded", () => {
    countBookInList();

    const loadedBookDatas = localStorage.getItem(STORAGE_KEY);

    let loadedBookDataObject = JSON.parse(loadedBookDatas);

    if (loadedBookDataObject !== null) {
        for (item of loadedBookDataObject) {
            createBookElement(item);
        }
    }

});


 