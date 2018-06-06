import mapboxgl from 'mapbox-gl';

class Mapboxgl {
    constructor() {
        mapboxgl.accessToken = 'pk.eyJ1IjoiZHZyaWV0IiwiYSI6ImNpbzlxdnEzMTAwMHB3Y201Ym9yOHgzc24ifQ.B8cRwcPdY0e28MI2gqP1aA';
        var map = new mapboxgl.Map({
            container: 'map', // container id
            style: 'mapbox://styles/mapbox/streets-v8',
            center: [4.895168, 52.370216], // starting position
            zoom: 9, // starting zoom
            scrollZoom: false
        });
        return map;
    }
}

class MapSwitch {
    constructor(map) {
        this.themap = map;
    }
    onAdd(map) {
        this.map = map;

        //Geolocation toggle
        var button = document.createElement('button');
        button.style.backgroundImage = 'url("data:image/svg+xml;charset=utf-8,%3Csvg%20viewBox%3D%270%200%2020%2020%27%20xmlns%3D%27http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%27%3E%0D%0A%20%20%3Cpath%20style%3D%27fill%3A%23333%3B%27%20d%3D%27M10%204C9%204%209%205%209%205L9%205.1A5%205%200%200%200%205.1%209L5%209C5%209%204%209%204%2010%204%2011%205%2011%205%2011L5.1%2011A5%205%200%200%200%209%2014.9L9%2015C9%2015%209%2016%2010%2016%2011%2016%2011%2015%2011%2015L11%2014.9A5%205%200%200%200%2014.9%2011L15%2011C15%2011%2016%2011%2016%2010%2016%209%2015%209%2015%209L14.9%209A5%205%200%200%200%2011%205.1L11%205C11%205%2011%204%2010%204zM10%206.5A3.5%203.5%200%200%201%2013.5%2010%203.5%203.5%200%200%201%2010%2013.5%203.5%203.5%200%200%201%206.5%2010%203.5%203.5%200%200%201%2010%206.5zM10%208.3A1.8%201.8%200%200%200%208.3%2010%201.8%201.8%200%200%200%2010%2011.8%201.8%201.8%200%200%200%2011.8%2010%201.8%201.8%200%200%200%2010%208.3z%27%20%2F%3E%0D%0A%3C%2Fsvg%3E")';
        const geo_options = {
            enableHighAccuracy: true,
            maximumAge: 1000,
            timeout: 10000
        };
        var tracking = true;
        var _this = this;
        var watcher = navigator.geolocation.watchPosition(_this.themap.geo_success.bind(_this.themap), null, geo_options);
        button.style.backgroundColor = "rgb(34,139,34, 0.2)";
        button.addEventListener('click', function () {
            console.log(_this.themap);

            if(!tracking){
                console.log("Starting watching");
                navigator.geolocation.clearWatch(watcher);
                watcher = navigator.geolocation.watchPosition(_this.themap.geo_success.bind(_this.themap), null, geo_options);
                button.style.backgroundColor = "rgb(34,139,34, 0.2)";
                tracking = true;
            }else{
                console.log("Stopping watching");
                navigator.geolocation.clearWatch(watcher);
                button.style.backgroundColor = "rgba(0,0,0,0.05)";
                tracking = false;
            }
        });

        //Map layout toggle
        var mapselector = document.createElement('button');
        mapselector.innerHTML = "o";

        var maptype = "street";
        mapselector.addEventListener('click', function () {
            console.log(map);
            // const maptype = document.getElementById("maptype");
            if (maptype === "street") {
                maptype = "sat";
                _this.map.setStyle('mapbox://styles/mapbox/' + "satellite-v9");
                console.log("satellite-v9");
            } else {
                maptype = "street";
                _this.map.setStyle('mapbox://styles/mapbox/' + "streets-v10");
                console.log("streets-v10");
            }
        });



        this.container = document.createElement('div');
        this.container.appendChild(button);
        this.container.appendChild(mapselector);
        this.container.className = 'mapboxgl-ctrl mapboxgl-ctrl-group';
        return this.container;
    }
    onRemove() {
        this.container.parentNode.removeChild(this.container);
        this.map = undefined;
    }
}

export default class Map {

    //Init
    constructor() {
        this.map = new Mapboxgl();
        this.defaultzoomlevel = 12;
        this.youarehere = null;
        this.el = document.createElement('div');
        this.el.className = 'marker';

        var nav = new mapboxgl.NavigationControl();
        this.map.addControl(nav, 'top-left');
        this.map.addControl(new MapSwitch(this), 'top-left');

        this.map.on('click', function (e) {
            const features = this.map.queryRenderedFeatures(e.point, {
                layers: ['poi']
            });
            if (!features.length) {
                return;
            }

            const feature = features[0];
            console.log(feature);

            const name = (feature.properties.name === undefined) ? '' : feature.properties.name;
            const desc = (feature.properties.desc === undefined) ? '' : feature.properties.desc;
            //Create and show popup
            new mapboxgl.Popup()
                .setLngLat(feature.geometry.coordinates)
                .setHTML("<div style='background-color: white;position:relative;width:30vw;'>" + desc + "</div>")
                .addTo(this.map);
        }.bind(this));
    }

    //Center map around coordinates
    center(lnglat) {
        if (!lnglat) {
            return;
        }
        console.log(lnglat);
        this.map.setCenter(lnglat);
        this.map.setZoom(this.defaultzoomlevel);
    }

    //Show route and set events
    showroute(geo_json) {
        if (!geo_json) {
            return;
        }

        //Remove old layers and sources
        try {
            this.map.removeLayer("poi");
            this.map.removeSource("poi");
            this.map.removeLayer("route");
            this.map.removeSource("route");
        } catch (e) {
            console.log('layer or source doesnt exist');
        }

        /////
        // POI (points of interest)
        // https://www.mapbox.com/mapbox-gl-js/example/geojson-markers/
        const poi_filter = geo_json.features.filter((feature) => {
            //If feature.geometry.type isn't Point, delete this feature
            return feature.geometry.type === "Point";
        });
        const poi = {
            "type": "geojson",
            "data": {
                "type": "FeatureCollection",
                "features": poi_filter
            }
        };
        this.map.addSource("poi", poi);
        let routelayer = this.map.addLayer({
            "id": "poi",
            "type": "symbol",
            "source": "poi",
            "layout": {
                "icon-image": "monument-15",
                "text-field": "{name}",
                "text-font": ["Open Sans Semibold", "Arial Unicode MS Bold"],
                "text-offset": [0, 0.6],
                "text-anchor": "top"
            }
        });

        ///////
        // ROUTE
        // https://www.mapbox.com/mapbox-gl-js/example/geojson-line/
        const route_filter = geo_json.features.filter((feature) => {
            //If feature.geometry.type isn't LineString
            return feature.geometry.type === "LineString";
        });
        const route = {
            "type": "geojson",
            "data": route_filter[0]
        };
        this.map.addSource("route", route);
        this.map.addLayer({
            "id": "route",
            "type": "line",
            "source": "route",
            "layout": {
                "line-join": "round",
                "line-cap": "round"
            },
            "paint": {
                "line-color": "#888",
                "line-width": 4
            }
        });


        //Center the route
        const c = [geo_json.features[0].geometry.coordinates[0][0], geo_json.features[0].geometry.coordinates[0][1]];
        this.center(c);

    }

    //You-are-here Marker
    geo_success(position) {
        console.log("New pos:" + position);
        if (this.youarehere) {
            this.youarehere.remove();
        }
        const location = [position.coords.longitude, position.coords.latitude];

        this.youarehere = new mapboxgl.Marker(this.el, {
                offset: [-10, -10]
            })
            .setLngLat(location)
            .addTo(this.map);
        this.center(location);
    }

}