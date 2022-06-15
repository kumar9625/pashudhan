


mapboxgl.accessToken = 'pk.eyJ1Ijoia3VtYXI5NjI1IiwiYSI6ImNsMWo0eWtjNTB5dXcza280eDR0YWptd2EifQ.gGtajVvUt8ZqMwk3ltvltQ';
const map = new mapboxgl.Map({
    container: 'map', // Container ID
    style: 'mapbox://styles/mapbox/streets-v11', // Map style to use
    center: [76.559328, 28.987002], // Starting position [lng, lat]
    zoom: 10// Starting zoom level
});

const marker = new mapboxgl.Marker() // Initialize a new marker
    .setLngLat([-122.25948, 37.87221]) // Marker [lng, lat] coordinates
    .addTo(map); // Add the marker to the map

const geocoder = new MapboxGeocoder({
    // Initialize the geocoder
    accessToken: mapboxgl.accessToken, // Set the access token
    mapboxgl: mapboxgl, // Set the mapbox-gl instance
    marker: false, // Do not use the default marker style
    placeholder: 'अपने आस-पास के स्थान खोजें', // Placeholder text for the search bar
    bbox: [59.871096,21.072200,93.247561,36.339910], // Boundary for Berkeley
    proximity: {
        longitude: 28.987002,
        latitude: 76.559328
    } // Coordinates of UC Berkeley
});

// Add the geocoder to the map

map.addControl(geocoder);
map.addControl(
    new mapboxgl.GeolocateControl({
    positionOptions: {
    enableHighAccuracy: true
    },
    // When active the map will receive updates to the device's location as it changes.
    trackUserLocation: true,
    // Draw an arrow next to the location dot to indicate which direction the device is heading.
    showUserHeading: true
    })
    );
map.addControl(new mapboxgl.NavigationControl());
map.addControl(new mapboxgl.FullscreenControl());




// After the map style has loaded on the page,
// add a source layer and default styling for a single point


// Listen for the `result` event from the Geocoder // `result` event is triggered when a user makes a selection
//  Add a marker at the result's coordinates
geocoder.on('result', (event) => {
    map.getSource('single-point').setData(event.result.geometry);
});
