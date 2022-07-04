JSON.get = function (url, callback = null) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url);
    xhr.addEventListener("load", function () {
        if (this.status != 200)
            return callback(null);

        var response = JSON.parse(this.responseText);
        if (response.error)
            return callback(null);

        return callback(response);
    });
    xhr.send();
}

JSON.post = function (url, data, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open('POST', url);
    xhr.setRequestHeader('Content-type', 'application/json;charset=UTF-8');
    xhr.addEventListener("load", function () {
        if (this.status != 200)
            return callback(null);

        var response = JSON.parse(this.responseText);
        if (response.error)
            return callback(null);;

        return callback(response);
    });
    xhr.send(JSON.stringify(data));
}


/*
 *   _____       _                       _                 
 *  / ____|     | |                     (_)                
 * | (___  _   _| |____   _____ _ __ ___ _  ___  _ __  ___ 
 *  \___ \| | | | '_ \ \ / / _ \ '__/ __| |/ _ \| '_ \/ __|
 *  ____) | |_| | |_) \ V /  __/ |  \__ \ | (_) | | | \__ \
 * |_____/ \__,_|_.__/ \_/ \___|_|  |___/_|\___/|_| |_|___/                                                    
 */

function FillSubversions(subversions) {
    new Chart(document.getElementById('graphSubversions'), {
        type: 'doughnut',
        data: {
            labels: Object.keys(subversions),
            datasets: [{
                data: Object.values(subversions),
                backgroundColor: ['#002352', '#0066CC', '#2196F3', '#082048'],
                hoverOffset: 4
            }]
        },
        options: {
            plugins: {
                legend: {
                    display: false,
                }
            }
        }
    });

    var tableSubversions = document.getElementById('tableSubversions');
    tableSubversions.innerHTML = '';
    for (var sv of Object.keys(subversions))
        tableSubversions.innerHTML += `<tr> <td>${sv}</td> <td>${subversions[sv]}</td> </tr>`;
}


/*
 *    _____                  _        _           
 *  / ____|                | |      (_)          
 * | |     ___  _   _ _ __ | |_ _ __ _  ___  ___ 
 * | |    / _ \| | | | '_ \| __| '__| |/ _ \/ __|
 * | |___| (_) | |_| | | | | |_| |  | |  __/\__ \
 *  \_____\___/ \__,_|_| |_|\__|_|  |_|\___||___/                                          
 */

function FillCountries(countries) {
    var tableCountries = document.getElementById('tableCountries');
    tableCountries.innerHTML = '';
    for (var c of Object.keys(countries))
        tableCountries.innerHTML += `<tr> <td>${c}</td> <td>${countries[c]}</td> </tr>`;
}

/*
 *  __  __             
 * |  \/  |            
 * | \  / | __ _ _ __  
 * | |\/| |/ _` | '_ \ 
 * | |  | | (_| | |_) |
 * |_|  |_|\__,_| .__/ 
 *              | |    
 *              |_|    
 */

const map = L.map('map').setView([35, 0], 1);
const layerGroup = L.layerGroup().addTo(map);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    minZoom: 1,
    //maxZoom: 8,
    attribution: '© OpenStreetMap'
}).addTo(map);

const size = 14;

let oldIcon = L.icon({
    iconUrl: 'img/old.png',
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, 0]
});
let regIcon = L.icon({
    iconUrl: 'img/regular.png',
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, 0]
});
let newIcon = L.icon({
    iconUrl: 'img/new.png',
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, 0]
});

/*
 *  _______        _            
 * |__   __|      | |           
 *    | | ___  ___| |_ ___ _ __ 
 *    | |/ _ \/ __| __/ _ \ '__|
 *    | |  __/\__ \ ||  __/ |   
 *    |_|\___||___/\__\___|_|
 */

const btnTest = document.getElementById("btnTest");
const txtIP = document.getElementById("txtIP");
const txtPort = document.getElementById("txtPort");

const loading = document.getElementById("loading");
const success = document.getElementById("success");
const fail = document.getElementById("fail");

const lblVersion = document.getElementById("lblVersion");
const lblSubversion = document.getElementById("lblSubversion");
const lblHeight = document.getElementById("lblHeight");

btnTest.addEventListener('click', async function () {
    loading.classList.remove("d-none");
    success.classList.add("d-none");
    fail.classList.add("d-none");

    JSON.post('/api/scan', { ip: txtIP.value, port: txtPort.value }, function (data) {
        loading.classList.add("d-none");
        success.classList.add("d-none");
        fail.classList.add("d-none");

        if (data == null)
            return fail.classList.remove("d-none");

        lblVersion.innerHTML = data.version;
        lblSubversion.innerHTML = data.subversion;
        lblHeight.innerHTML = data.height;

        success.classList.remove("d-none");
    });
});

/*
 *  _____
 * |  __ \
 * | |__) |__  ___ _ __ ___ 
 * |  ___/ _ \/ _ \ '__/ __|
 * | |  |  __/  __/ |  \__ \
 * |_|   \___|\___|_|  |___/
 */

let page = 1;

function FillPeers(peers) {
    layerGroup.clearLayers();
    for (var peer of peers) {
        if (peer.subversion.indexOf("7.17.2") != -1)
            var icon = regIcon;
        else if (peer.subversion.indexOf("7.17.3") != -1)
            var icon = newIcon;
        else
            var icon = oldIcon;

        var marker = L.marker([peer.latitude || 0, peer.longitude || 0], { icon }).addTo(layerGroup)
            .bindPopup(`${peer.ip} - ${peer.port}<br>${peer.version} ${peer.subversion}`);
    }

    var tablePeers = document.getElementById('tablePeers');
    tablePeers.innerHTML = '';
    for (var i = 0; i < peers.length; i++) {
        var peer = peers[i];
        tablePeers.innerHTML += `<tr> <td>${i + 1}</td> <td>${peer.ip}</td> <td>${peer.port}</td> <td>${peer.subversion}</td> <td>${peer.version}</td> <td><img src="/img/countries/${peer.country.toLocaleLowerCase()}.svg" class="img-fluid" style="max-width: 25px"></td> </tr>`;
    }
}




function FillAll() {
    JSON.get('/api/subversions', FillSubversions);
    JSON.get('/api/countries', FillCountries);
    JSON.get('/api/peers/country', FillPeers);
}
FillAll();
setInterval(FillAll, 60000);

