function createArr(file) {
    let arr = read(file).split('\n');
    for (let i = 0; i < arr.length; ++i) {
        arr[i] = arr[i].trim();
    }
    return arr;
}

let movieList = new List();
for (var i = 0; i < movies.length; ++i) {
    movieList.append(movies[i]);
}


function displayList(list) {
    for (list.front(); list.currPos() < list.length(); list.next()) {
        if (list.getElement() instanceof Customer) {
            console.log(list.getElement()["name"] + ", " +
                list.getElement()["movie"]);
        }
        console.log(list.getElement());
    }
}

function Customer(name, movie) {
    this.name = name;
    this.movie = movie;
}

function checkOut(name, movie, filmList, customerList) {
    if (movieList.contains(movie)) {
        let c = new Customer(name, movie);
        customerList.append(c);
        filmList.remove(movie);
    } else {
        console.log(movie + " is not available.");
    }
}

let movies = createArr("films.txt");
let movieList = new List();
let customers = new List();
for (let i = 0; i < movies.length; ++i) {
    movieList.append(movies[i]);
}
console.log("Available movies: \n");
displayList(movieList);
checkOut("Jane Doe", "The Godfather", movieList, customers);
console.log("\nCustomer Rentals: \n");
displayList(customers);

let movies = createArr("films.txt");
let movieList = new List();
let customers = new List();
for (let i = 0; i < movies.length; ++i) {
    movieList.append(movies[i]);
}
console.log("Available movies: \n");
displayList(movieList);
putstr("\nEnter your name: ");
let name = readline();
putstr("What movie would you like? ");
let movie = readline();
checkOut(name, movie, movieList, customers);
console.log("\nCustomer Rentals: \n");
displayList(customers);
console.log("\nMovies Now Available\n");
displayList(movieList);
