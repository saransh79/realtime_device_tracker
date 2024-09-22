const socket = io();

const animatedIcon = L.icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/10473/10473293.png', // URL to an animated GIF (example: pulsating marker)
  iconSize: [38, 38], // Adjust the size to match your image
  iconAnchor: [19, 38], // Anchor to center the icon properly
  popupAnchor: [0, -38],
});

if (navigator.geolocation) {
  navigator.geolocation.watchPosition(
    (position) => {
      const { latitude, longitude } = position.coords;
      socket.emit("send-location", { longitude, latitude });
    },
    (error) => {
      console.error("Navigator error: ", error);
    },
    {
      enableHighAccuracy: true,
      maximumAge: 0,
      timeout: 5000,
    }
  );
}

// L is leaflet sortcut for location
const map = L.map("map").setView([0, 0], 15);

L.tileLayer("http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  // attribution: "Saransh",
}).addTo(map);

const markers = {};

socket.on("recieve-location", (data) => {
  const { id, latitude, longitude } = data;
  map.setView([latitude, longitude]);

  if (markers[id]) {
    markers[id].setLatLng([latitude, longitude]);
  } else {
    markers[id] = L.marker([latitude, longitude], { icon: animatedIcon }).addTo(
      map
    );
  }
});

socket.on("user-disconnected", (id) => {
  if (markers[id]) {
    map.removeLayer(markers[id]);
    delete markers[id];
  }
});
