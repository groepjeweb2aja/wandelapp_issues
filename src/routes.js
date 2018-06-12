// import * as $ from 'jquery';

/**
 * Read json from remoteserver
 * @param remoteserver
 * @returns {Promise}
 */
const getroutesjson = (remoteserver) => {
    return new Promise((resolve, reject) => { //New promise for array
        // let routesjson = [];
        fetch(remoteserver, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
            }).then(res => res.json())
            .catch(error => reject(error))
            .then(function (response) {
                console.log(response);
                const routesjson = response.map((f) => {
                    return {
                        data: f
                    };
                });
                resolve(routesjson);
            });
    });
};

/**
 * Post a textfile to the remoteserver
 * @param remoteserver
 * @param file
 * @returns {Promise}
 */
const posttextfile = (remoteserver = "", file = "") => {

    return new Promise((resolve, reject) => { //New promise for array
        const reader = new FileReader();
        //Send contents file when read
        reader.onloadend = (e) => {
            const contents = e.target.result;

            const xhr = new XMLHttpRequest();
            xhr.onreadystatechange = () => {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        const res = JSON.parse(xhr.response);
                        console.log(res);
                        if (res.error === true) {
                            console.log(res);
                            reject(res.msg);
                        } else {
                            resolve();
                        }
                    } else {
                        reject("Problem posting " + xhr.status);
                    }
                }
            };

            xhr.open("POST", remoteserver);
            xhr.overrideMimeType('text/plain; charset=x-user-defined-binary');
            xhr.send(contents);
        };
        reader.readAsText(file);
    });
};


/**
 * Gets cuid from server
 * @param remoteserver
 * @returns cuid
 */
const getcuid = (remoteserver, force = false) => {
    let cuid = localStorage.getItem("cuid");
    console.log(cuid);
    if (cuid == null || cuid === "" || force) {
        fetch(remoteserver + "/cuid", {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
            }).then(res => res.json())
            .catch(function (error) {
                console.log(error);
                return null;
            })
            .then(function (response) {
                console.log(response);
                cuid = response.cuid;
                console.log(cuid);
                localStorage.setItem('cuid', cuid);
                return cuid;
            });
    } else {
        return cuid;
    }
    return null;
};

//expose ajax functions
exports.getroutesjson = getroutesjson;
exports.posttextfile = posttextfile;
exports.getcuid = getcuid;