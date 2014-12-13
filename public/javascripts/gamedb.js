var db;

function indexedDBOk() {
  return "indexedDB" in window;
}

document.addEventListener("DOMContentLoaded", function() {

  //No support? Go in the corner and pout.
  if(!indexedDBOk) return;
  
  var openRequest = indexedDB.open("game",1);

  openRequest.onupgradeneeded = function(e) {
    var thisDB = e.target.result;

    if(!thisDB.objectStoreNames.contains("players")) {
      thisDB.createObjectStore("players");
    }
  }

  openRequest.onsuccess = function(e) {
    db = e.target.result;
  } 

  openRequest.onerror = function(e) {
    //Do something for the error
  }


},false);


function addPlayer(player) {
  var transaction = db.transaction(["players"],"readwrite");
  var store = transaction.objectStore("players");

  //Perform the add
  var request = store.add(person,1);

  request.onerror = function(e) {
    console.log("Error",e.target.error.name);
    //some type of error handler
  }

  request.onsuccess = function(e) {
    console.log("player added");
  }
}
