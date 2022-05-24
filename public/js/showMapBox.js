mapboxgl.accessToken = mapToken;
const Jsoncampgrounds = JSON.parse(campground)
const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/streets-v11', // style URL
    center: Jsoncampgrounds.geometry.coordinates, // starting position [lng, lat]
    zoom: 15 // starting zoom
});

new mapboxgl.Marker()
    .setLngLat(Jsoncampgrounds.geometry.coordinates)
    .setPopup(
        new mapboxgl.Popup({ offset: 25 })
            .setHTML(
                `<h3>${Jsoncampgrounds.title}</h3><p>${Jsoncampgrounds.location}</p>`
            )
    )
    .addTo(map);