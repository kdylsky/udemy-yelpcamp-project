const geo = [campgroundLng,campgroundLat]

mapboxgl.accessToken = mapToken
const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/streets-v12', // style URL
    center: geo , // starting position [lng, lat]
    zoom: 12, // starting zoom
});

new mapboxgl.Marker()
    .setLngLat(geo)
    .setPopup(
        new mapboxgl.Popup({offest:25})
            .setHTML(
                `<h5>${campgroundtitle}</h5>`
            )
    )
    .addTo(map)