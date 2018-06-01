import $ from 'jquery';
import Ractive from 'ractive';
import Map from './map';
import {
    getroutesjson,
    posttextfile
} from './routes';

// Hiking app
const hikingapp = (remoteserver) => {
    'use strict';

    //Init
    const ractive_ui = new Ractive({
        el: '#container',
        template: '#template',
        debug: true
    });
    let map = null;

    // todo: Get cuid from localstorage if there is one. Otherwise ask backend (wandelappbackend_issues_v2) for new cuid:
    // todo: therefor implement getcuid function in routes.js module!
    // cuid is needed to get only the routes that belong to this cuid.
    const cuid = 'cjhpzw4gv001b0pbrli7171uj'; //todo: Temporarily use a dummy cuid (with the result that all app users see all routes!)

    //Wait until Ractive is ready
    ractive_ui.on('complete', () => {

        //New mapbox-gl map
        map = new Map();
        const geo_options = {
            enableHighAccuracy: true,
            maximumAge: 1000,
            timeout: 10000
        };
        
        function switchLayer(layer) {
            map.map.setStyle('mapbox://styles/mapbox/' + layer);
        }
        console.log(map);
        const maptype = document.getElementById("maptype");
        maptype.addEventListener("change", function () {
            if (maptype.value === "sat") {
                switchLayer("satellite-v9");
                console.log("satellite-v9");
            }
            else{
                switchLayer("streets-v10");
                console.log("streets-v10");
            }
        });


        //Get routes from server and show these as choices
        getroutesjson(remoteserver + '/routes?cuid=' + cuid)
            .then(
                (routesjson) => {
                    ractive_ui.set("hikes", routesjson);
                },
                (reason) => {
                    // Error retreiving routes!
                    console.log(reason);
                }
            )
            .catch(
                (e) => {
                    console.log(e);
                }
            );

        //Update device location on map
        navigator.geolocation.watchPosition(map.geo_success.bind(map), null, geo_options);
    });

    //Events
    ractive_ui.on({
        'collapse': (event, filename, routeobj) => {
            console.log("yes yes yes");
            //Toggle description
            $(".item").toggle(false);
            $("#route" + filename).toggle(true);
            //Show chosen route on map
            map.showroute(routeobj.data.json);
        },
        'uploadgpx': (event) => {
            const file = event.original.target.files[0];
            if (file) {
                //Post route (gpx text file) async
                console.log(file);
                posttextfile(remoteserver + '/upload?cuid=' + cuid, file)
                    .then(
                        () => {
                            //Retreive the latest routes async
                            getroutesjson(remoteserver + '/routes?cuid=' + cuid)
                                .then(
                                    (routesjson) => {
                                        //Show success
                                        $("#info").html("Route is toegevoegd");
                                        ractive_ui.set("hikes", routesjson);
                                        //Show chosen route
                                        map.showroute(routesjson[routesjson.length - 1].data.json);
                                    },
                                    (reason) => {
                                        //error
                                        $("#info").html(reason);
                                    }
                                )
                                .catch(
                                    (reason) => {
                                        //error
                                        $("#info").html(reason);
                                    }
                                );
                        }
                    )
                    .catch(
                        (e) => {
                            $("#info").html(e);
                        }
                    );
            }
        }
    });
};

//Expose ractive functions
exports.hikingapp = hikingapp;