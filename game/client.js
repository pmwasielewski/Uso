


var form = new FormData();

// var response = await fetch('http://localhost:3000/', {
//     method: 'GET'
// });
//https://a63c-93-181-133-59.ngrok-free.app/

var response = await fetch('https://skos.ii.uni.wroc.pl/my/', {
    method: 'GET'
});


async function timeDiff(czas_pocz){
    
    form.append("time", czas_pocz);

    var wyn = await response.text();
    console.log(wyn);
    console.log("otrzymano odpowiedz z serwera");

    return Date.now() - czas_pocz;


}

console.log(await timeDiff(Date.now()));