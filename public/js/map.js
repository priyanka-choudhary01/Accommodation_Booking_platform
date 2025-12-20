 
 mapboxgl.accessToken = mapToken;

console.log("coords =", coordinates);

const map = new mapboxgl.Map({
    container: "map",
    style: "mapbox://styles/mapbox/streets-v12",
    center: coordinates,
    zoom: 9
});

new mapboxgl.Marker({ color: "red" })
    .setLngLat(coordinates)
    .addTo(map);
