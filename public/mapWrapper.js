const MapWrapper = function (element, coords, zoom) {
  const osmLayer = new L.TileLayer("http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png");
 this.map = L.map(element).addLayer(osmLayer).setView(coords, zoom);
}

MapWrapper.prototype.flyTo = function (coords, zoom) {
    this.map.flyTo(coords, zoom);
};

MapWrapper.prototype.addMarker = function (coords, text) {
  const marker = L.marker(coords).addTo(this.map);
  marker.bindPopup(text).openPopup()
};
