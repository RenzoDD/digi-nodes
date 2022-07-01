var table = document.getElementById('tableCountries');
for (var c of Object.keys(countries))
    table.innerHTML += `<tr> <td>${c}</td> <td>${countries[c]}</td> </tr>`;