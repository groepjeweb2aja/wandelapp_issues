import $ from 'jquery';
import Ractive from 'ractive';
import Map from './map';
import {
    getroutesjson,
    posttextfile,
    getcuid
} from './routes';

// Hiking app
const hikingapp = (remoteserver) => {
    'use strict';

    //Init
    const ractive_ui = new Ractive({
        el: '#container',
        template: '#template',
        debug: true,
        style: 'mapbox://styles/mapbox/streets-v10'
    });

    let map = null;
    let cuid = getcuid(remoteserver);

    let info = document.getElementById("info");

    //Wait until Ractive is ready
    ractive_ui.on('complete', () => {

        //New mapbox-gl map
        map = new Map();
        // const geo_options = {
        //     enableHighAccuracy: true,
        //     maximumAge: 1000,
        //     timeout: 10000
        // };

       

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
        // navigator.geolocation.watchPosition(map.geo_success.bind(map), null, geo_options);
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
                                        var timeleft = 10;
                                        var downloadTimer = setInterval(function () {
                                            --timeleft;
                                            if (timeleft <= 0){
                                                clearInterval(downloadTimer);
                                                info.innerHTML = "";
                                            }
                                        }, 1000);
                                        info.innerHTML = "Route is toegevoegd";
                                        ractive_ui.set("hikes", routesjson);
                                        //Show chosen route
                                        map.showroute(routesjson[routesjson.length - 1].data.json);
                                    },
                                    (reason) => {
                                        //error
                                        info.innerHTML = reason;
                                    }
                                )
                                .catch(
                                    (reason) => {
                                        //error
                                        info.innerHTML = reason;
                                    }
                                );
                        }
                    )
                    .catch(
                        (e) => {
                            info.innerHTML = e;
                        }
                    );
            }
        }
    });
};

//Expose ractive functions
exports.hikingapp = hikingapp;