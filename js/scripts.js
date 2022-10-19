let map;

function initMap() {
    const map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: 40.322346, lng: -74.386213 },
        zoom: 8,
    });
    const marker = new google.maps.Marker({
        position: { lat: 40.322346, lng: -74.386213 },
        map: map,
    });
}


window.initMap = initMap;