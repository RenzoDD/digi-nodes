var map = L.map('map').setView([35, 0], 1);

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

for (var peer of locations) {
    if (peer.subversion.indexOf("7.17.2") != -1)
        var icon = regIcon;
    else if (peer.subversion.indexOf("7.17.3") != -1)
        var icon = newIcon;
    else
        var icon = oldIcon;

    var marker = L.marker([peer.latitude || 0, peer.longitude || 0], { icon }).addTo(map)
        .bindPopup(`${peer.ip} - ${peer.port}<br>${peer.version} ${peer.subversion}`);
}