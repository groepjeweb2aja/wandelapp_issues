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
        mapselector.classList.add("sat");
        // mapselector.style.backgroundImage = "url(\"data:image/svg+xml,%3C%3Fxml version='1.0' %3F%3E%3C!DOCTYPE svg PUBLIC '-//W3C//DTD SVG 1.0//EN' 'http://www.w3.org/TR/2001/REC-SVG-20010904/DTD/svg10.dtd'%3E%3Csvg enable-background='new 0 0 24 24' id='Layer_1' version='1.0' viewBox='0 0 24 24' xml:space='preserve' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'%3E%3Cpath d='M21.7,12c0,5.4-4.4,9.7-9.7,9.7S2.3,17.4,2.3,12S6.6,2.3,12,2.3S21.7,6.6,21.7,12z M11.9,16.6c0-0.2-0.1-0.3-0.3-0.4 C11,16,10.4,16,9.9,15.5c-0.1-0.2-0.1-0.4-0.2-0.6c-0.2-0.2-0.7-0.3-1-0.4c-0.4,0-0.8,0-1.3,0c-0.2,0-0.5,0-0.7,0 c-0.3-0.1-0.5-0.5-0.7-0.8C6,13.6,6,13.4,5.8,13.4c-0.2-0.1-0.4,0.1-0.6,0c-0.1-0.1-0.1-0.2-0.1-0.3c0-0.3,0.2-0.6,0.4-0.8 c0.3-0.2,0.6,0.1,0.9,0.1c0.1,0,0.1,0,0.2,0.1C6.9,12.6,7,13,7,13.3c0,0.1,0,0.2,0,0.2c0,0.1,0.1,0.1,0.2,0.1c0.1-0.5,0.1-1,0.2-1.5 c0-0.6,0.6-1.2,1.1-1.4c0.2-0.1,0.3,0.1,0.5,0c0.6-0.2,2.1-0.8,1.8-1.6C10.6,8.4,10,7.7,9.2,7.8C9,7.9,8.9,8,8.7,8.1 C8.4,8.3,7.8,8.9,7.5,8.9C7,8.8,7,8.1,7.1,7.8c0.1-0.4,1-1.7,1.6-1.5C8.8,6.4,9,6.6,9.1,6.7c0.2,0.1,0.5,0.1,0.8,0.1 c0.1,0,0.2,0,0.3-0.1c0.1-0.1,0.1-0.1,0.1-0.2c0-0.3-0.3-0.6-0.5-0.8C9.6,5.5,9.3,5.3,9,5.2C8,4.9,6.4,5.3,5.6,6 C4.8,6.7,4.2,7.9,3.8,8.9C3.6,9.5,3.4,10.3,3.3,11c-0.1,0.5-0.2,0.9,0.1,1.4C3.7,13,4.3,13.6,4.9,14c0.4,0.3,1.2,0.3,1.6,0.8 c0.3,0.4,0.2,0.9,0.2,1.4c0,0.6,0.4,1.1,0.6,1.6c0.1,0.3,0.2,0.7,0.3,1c0,0.1,0.1,0.7,0.1,0.8c0.6,0.3,1.1,0.6,1.8,0.8 c0.1,0,0.5-0.6,0.5-0.7c0.3-0.3,0.5-0.7,0.8-0.9c0.2-0.1,0.4-0.2,0.6-0.4c0.2-0.2,0.3-0.6,0.4-0.9C11.9,17.3,12,16.9,11.9,16.6z M12.1,7.4c0.1,0,0.2-0.1,0.4-0.2c0.3-0.2,0.6-0.5,0.9-0.7c0.3-0.2,0.6-0.5,0.8-0.7c0.3-0.2,0.5-0.6,0.6-0.9 c0.1-0.2,0.4-0.6,0.3-0.9c-0.1-0.2-0.6-0.3-0.8-0.4c-0.8-0.2-1.5-0.3-2.3-0.3c-0.3,0-0.7,0.1-0.8,0.4c-0.1,0.5,0.3,0.4,0.7,0.5 c0,0,0.1,0.8,0.1,0.9c0.1,0.5-0.2,0.8-0.2,1.3c0,0.3,0,0.8,0.2,1C12,7.4,12.1,7.4,12.1,7.4z M20.5,14.4c0.1-0.2,0.1-0.5,0.2-0.7 c0.1-0.5,0.1-1,0.1-1.5c0-1-0.1-2-0.4-2.9C20.2,9,20.1,8.7,20,8.4c-0.2-0.5-0.5-1-0.9-1.4c-0.4-0.5-0.9-1.9-1.8-1.5 c-0.3,0.1-0.5,0.5-0.7,0.7c-0.2,0.3-0.4,0.6-0.6,0.9c-0.1,0.1-0.2,0.3-0.1,0.4c0,0.1,0.1,0.1,0.2,0.1c0.2,0.1,0.3,0.1,0.5,0.2 c0.1,0,0.2,0.1,0.1,0.2c0,0,0,0.1-0.1,0.1c-0.5,0.5-1,0.9-1.5,1.4c-0.1,0.1-0.2,0.3-0.2,0.4c0,0.1,0.1,0.1,0.1,0.2 c0,0.1-0.1,0.1-0.2,0.2c-0.2,0.1-0.4,0.2-0.5,0.3c-0.1,0.2,0,0.5-0.1,0.7c-0.1,0.5-0.4,0.9-0.6,1.4c-0.2,0.3-0.3,0.6-0.5,0.9 c0,0.4-0.1,0.7,0.1,1c0.5,0.7,1.4,0.3,2.1,0.6c0.2,0.1,0.4,0.1,0.5,0.3c0.3,0.3,0.3,0.8,0.4,1.1c0.1,0.4,0.2,0.8,0.4,1.2 c0.1,0.5,0.3,1,0.4,1.4c0.9-0.7,1.7-1.5,2.3-2.5C19.9,16,20.2,15.2,20.5,14.4z'/%3E%3Cpath d='M12,2C6.5,2,2,6.5,2,12c0,5.5,4.5,10,10,10c5.5,0,10-4.5,10-10C22,6.5,17.5,2,12,2z M12,20.4c-4.6,0-8.4-3.8-8.4-8.4 S7.4,3.6,12,3.6s8.4,3.8,8.4,8.4S16.6,20.4,12,20.4z'/%3E%3C/svg%3E%0A\");";
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