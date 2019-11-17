function addFunctionality() {

    let title = document.getElementById("title");
    let author = document.getElementById("author");
    let isbn = document.getElementById("isbn");

    let loadButton = document.getElementById("loadBooks")
    let submitButton = document.getElementById("submit");
    let tbody = document.getElementsByTagName("tbody")[0];


    const username = "entropy";
    const password = "fuckoff";

    function createHeader(username, password) {
        let auth = `Basic ${btoa(`${username}:${password}`)}`;
        let headers = {
            'Content-type': 'application/json',
            "Authorization": auth
        };
        return headers;
    }

    let headers = createHeader(username, password);


    async function load() {
        try {
            let response = await fetch("https://baas.kinvey.com/appdata/kid_rkzic96iS/books", {
                method: "GET",
                headers: headers
            });

            let books = await response.json();
            tbody.innerHTML = "";
            books.forEach(b => {
                displayBooks(b);
            });

        } catch {
            console.log("load didn't function");
        }
    }


    async function postBook() {
        try {
            let newBook = {
                title: title.value,
                author: author.value,
                isbn: isbn.value
            }

            await fetch("https://baas.kinvey.com/appdata/kid_rkzic96iS/books", {
                method: 'POST',
                headers: headers,
                body: JSON.stringify(
                    newBook
                ),
            });
            load();

        } catch {
            console.log("Book wasn't added to database")
        }
    }


    function displayBooks(obj) {
        let tr = document.createElement("tr");
        let ttlTd = document.createElement("td");
        ttlTd.textContent = obj.title;
        let authTd = document.createElement("td");
        authTd.textContent = obj.author;
        let isbnTd = document.createElement("td");
        isbnTd.textContent = obj.isbn;
        tr.append(ttlTd, authTd, isbnTd);
        tr.setAttribute("id", obj._id);

        let editBtn = document.createElement("button");
        editBtn.textContent = "Edit";
        editBtn.className = "table button";
        editBtn.addEventListener("click", function () {
            updateBook(tr.id)
        })

        let delBtn = document.createElement("button");
        delBtn.textContent = "Delete";
        delBtn.className = "table button"
        delBtn.addEventListener("click", function () {
            del(tr.id)
        })
        tr.append(editBtn, delBtn);
        tbody.append(tr)
    }

    async function del(id) {
        try {
            await fetch(`https://baas.kinvey.com/appdata/kid_rkzic96iS/books/${id}`, {
                method: "DELETE",
                headers: headers
            });
            load();

        } catch {
            console.log("Delete didn't function");
        }
    }


    function updateBook(id) {

        let trToBeUpdated = document.getElementById(id);
        console.log(`${id} to be updated`);
        let inputs = Array.from(document.getElementById(id).getElementsByTagName("td"));
        console.log(inputs);
        let titleVal = inputs[0].textContent;
        let authorVal = inputs[1].textContent;
        let isbnVal = inputs[2].textContent;

        trToBeUpdated.innerHTML = "";

        let ttlTd = document.createElement("td");
        let editTitle = document.createElement("input");
        editTitle.value = titleVal;
        ttlTd.appendChild(editTitle)

        let authTd = document.createElement("element");
        let editAuthor = document.createElement("input");
        editAuthor.value = authorVal;
        authTd.appendChild(editAuthor);

        let isbnTd = document.createElement("td");
        let editIsbn = document.createElement("input");
        editIsbn.value = isbnVal;
        isbnTd.appendChild(editIsbn)
        let saveBtn = document.createElement("button");
        saveBtn.textContent = "Save";
        saveBtn.addEventListener("click", function () {
            updateInBase(id);
        })
        trToBeUpdated.append(ttlTd, authTd, isbnTd, saveBtn);

        async function updateInBase(id) {

            let updatedBook = {
                title: editTitle.value,
                author: editAuthor.value,
                isbn: editIsbn.value
            }

            try {
                console.log(updatedBook)
                await fetch(`https://baas.kinvey.com/appdata/kid_rkzic96iS/books/${id}`, {
                    method: "PUT",
                    headers: headers,
                    body: JSON.stringify(updatedBook)

                });
                load();
            } catch {
                console.log("failed to update")
            }
        }
    }

    loadButton.addEventListener("click", load);

    submitButton.addEventListener("click", postBook)


    load();
}
addFunctionality();