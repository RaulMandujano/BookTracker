const searchForm=document.getElementById('search-form');
const searchInput=document.getElementById('txt-search');
const mainContent=document.querySelector('.main-content');
const bookList=document.getElementById('books-list');

// load books in my list

if(localStorage.getItem('myBooks')){
    let books=JSON.parse(localStorage.getItem('myBooks'));
    showList(books);
    showReadBooks(books)
    showWishBooks(books)
}

searchForm.addEventListener('submit',(event)=>{
    event.preventDefault();

    // clear exising list of books
    bookList.innerHTML='';



    document.querySelector('h1').classList.add('searching');
    
    
    let rawString=searchInput.value;
    let formatedStr=rawString.replace(/\s/g, '+');
    //const booksList=document.getElementById('books-list')

    fetch('http://openlibrary.org/search.json?title='+formatedStr)
    .then(response=>response.json())
    .then(data=>{
        // using books data here

        //document.write(data.docs[0].text)
        console.log(data.docs);

        document.querySelector('h1').classList.remove('searching');

        if(data.docs.length===0){
            bookList.innerHTML=`No book found with this title`;
        }
        data.docs.map((book,index)=>{
            let bookLi=document.createElement('li');
            bookLi.innerHTML=`
            <h3 id=${book.key} onClick='addToList(event)' class='book-title'>${book.title}</h3>
            `;

            bookLi.classList.add('li-books');
            bookList.appendChild(bookLi);
        })
    })

})



function addToList(event){
    console.log(event.target.id);
    console.log(event.target.innerHTML);

    let book={
        id:event.target.id,
        title:event.target.innerHTML,
        read:false
    };

    // check for existing local storage arrayof books here



    if(localStorage.getItem('myBooks')){
        
        let existingList=JSON.parse(localStorage.getItem('myBooks'));
        let newBook=book;
       if(checkIfFound(book)){
           alert('book already in the list')
           return false
       }
        existingList.push(book);
        localStorage.setItem('myBooks',JSON.stringify(existingList))

    }else{
        
        let myBooks=[];
        let newBook=book;
        myBooks.push(newBook);
        
        localStorage.setItem('myBooks',JSON.stringify(myBooks))
    }

    let latestBookList=JSON.parse(localStorage.getItem('myBooks'));
    showList(latestBookList)

}


function checkIfFound(book){
    let existingList=JSON.parse(localStorage.getItem('myBooks'));
      // Check if a value exists in the fruits array
      let title=book.title;
      const found = existingList.some(book => book.title ===title);
      if(found){
        return true;
    } else{
        return false;
    }
}


function showList(books){
    let ul=document.querySelector('.my-books-list');

    ul.innerHTML='';
    let index=books.length-1;
    while(index!=-1){
        let li=document.createElement('li');

        if(books[index].read===false){
        li.innerHTML=`
            <h4 class='my-book' ondblclick='removeMe(event)' id=${books[index].id}>${books[index].title}</h4>
            <button id=${books[index].id} onclick='removeMe(event)' class='btn-primary'>Delete</button>
            <button id=${books[index].id} onclick='read(event)' class='btn-primary'>Read</button>
            <button id=${books[index].id} onclick='wish(event)' class='btn-primary'>Wish</button>
            `;

        li.classList.add('mybooks-list');
        ul.appendChild(li);
        }


        
        index--;
    }

}

function removeMe(event){
    let currentBooks=JSON.parse(localStorage.getItem('myBooks'));

    let filteredBooks=currentBooks.filter(book=>{
        return book.id!=event.target.id;
    })
    
    localStorage.setItem('myBooks',JSON.stringify(filteredBooks))
    showList(filteredBooks)
    showReadBooks(filteredBooks)
    showWishBooks(filteredBooks)
}

function read(event){
    let currentBooks=JSON.parse(localStorage.getItem('myBooks'));
    
    // finding index

    index = currentBooks.findIndex((book => book.id == event.target.id));
    // do here
    currentBooks[index].read=true;
    localStorage.setItem('myBooks',JSON.stringify(currentBooks))

    showReadBooks(currentBooks)
    showList(currentBooks)
}

function showReadBooks(readBooks){
   let readBooksList= document.querySelector('.read-books-list');
   readBooksList.innerHTML=''
   readBooks.map(book=>{
       if(book.read===true){
        let li=document.createElement('li');

        li.innerHTML=`<h3 class='read-book' ondblclick='removeMe(event)' id=${book.id}>${book.title}</h3>`;

        li.classList.add('books-read-list')

        readBooksList.appendChild(li)
       }

   })
}

function wish(event){
    let currentBooks=JSON.parse(localStorage.getItem('myBooks'));
    
    // finding index

    index = currentBooks.findIndex((book => book.id == event.target.id));
    // do here
    currentBooks[index].wish=true;
    localStorage.setItem('myBooks',JSON.stringify(currentBooks))

    showWishBooks(currentBooks)
    showList(currentBooks)
    removeMe(currentBooks)
}

function showWishBooks(wishBooks){
   let wishBooksList= document.querySelector('.wish-books-list');
   wishBooksList.innerHTML=''
   wishBooks.map(book=>{
       if(book.wish===true){
        let li=document.createElement('li');

        li.innerHTML=`<h3 class='my-book' ondblclick='removeMe(event)' id=${book.id}>${book.title}</h3>`;

        li.classList.add('books-wish-list')

        wishBooksList.appendChild(li)
       }

   })
}

