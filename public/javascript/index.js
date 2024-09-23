const socket = io();

let map;
let userMarkers = {};

function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    zoom: 20,
    center: { lat: 0, lng: 0 }, // Default center, updated later
  });

  if (navigator.geolocation) {
    navigator.geolocation.watchPosition((position) => {
      const { latitude, longitude } = position.coords;

      // Send user's location to server
      socket.emit("sendLocation", { latitude, longitude });

      // Update map center to user's current location
      const userLocation = new google.maps.LatLng(latitude, longitude);
      map.setCenter(userLocation);
    });
  } else {
    alert("Geolocation is not supported by this browser.");
  }
}

// Receive location updates from server
socket.on("locationUpdate", (users) => {
  users.forEach((user) => {
    if (userMarkers[user.id]) {
      userMarkers[user.id].setPosition(
        new google.maps.LatLng(user.latitude, user.longitude)
      );
    } else {
      const marker = new google.maps.Marker({
        position: new google.maps.LatLng(user.latitude, user.longitude),
        map: map,
        title: `User ${user.id}`,
      });
      userMarkers[user.id] = marker;
    }
  });
});

window.onload = initMap;
