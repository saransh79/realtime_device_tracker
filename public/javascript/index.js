const socket = io();

const colors = ['red', 'blue', 'green', 'yellow', 'purple', 'orange'];
const randomColor = colors[Math.floor(Math.random() * colors.length)];

const animatedIcon = L.icon({
  iconUrl: `https://maps.google.com/mapfiles/ms/icons/${randomColor}-dot.png`, 
  iconSize: [38, 38],
  iconAnchor: [19, 38],
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
