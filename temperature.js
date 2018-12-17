const firebase = require('firebase');

/* Fetcher
 * Responsible for requesting an update on the set interval and broadcasting the data.
 *
 * attribute url string - URL of the news feed.
 * attribute reloadInterval number - Reload interval in milliseconds.
 * attribute logFeedWarnings boolean - Log warnings when there is an error parsing a news article.
 */


function thermometer() {
    // variabili
    this.config = {};

    var self = this;

    this.configure = function (apiKey, authDomain, databaseURL, projectId) {
        // See https://firebase.google.com/docs/web/setup#project_setup for how to
        // auto-generate this config
        self.config = {
            apiKey: apiKey,
            authDomain: authDomain,
            databaseURL: databaseURL,
            projectId: projectId
        };

        firebase.initializeApp(self.config);
    };

    this.fetch = function (idRoom, callback) {
        // var roomsRef = firebase.database().ref('rooms');
        // return temperatureRef.once('child_changed', callback);
        // temperatureRef.once('value', (snapshot) => {
        //     snapshot.forEach(function (childSnapshot) {
        //         var childKey = childSnapshot.key;
        //         var childData = childSnapshot.val();
        //         console.log(childData);
        //     });
        // });
        var roomsId = [1, 2];
        for (var i = 0; i < roomsId.length; i++) {
            const roomRef = firebase.database().ref('rooms/' + roomsId[i]);
            roomRef.child('name').once('value', function (value) {
                const roomName = value.val();
                console.log('room name: ', roomName);

                var recentPostsRef = roomRef.child('temperatures').limitToLast(1);
                recentPostsRef.on('child_added', function (snapshot) {
                    console.log('on child added');
                    var numberChild = snapshot.numChildren();
                    var obj = {},
                        i = 0;

                    snapshot.forEach(function (childSnapshot) {
                        i++;
                        var childKey = childSnapshot.key;
                        var childData = childSnapshot.val();
                        obj[childKey] = childData;
                        if (i == numberChild) {
                            obj['name'] = roomName;
                            console.log('temperature added', obj);
                        }
                    });
                });
            });
        }

        // var ref = firebase.database().ref('rooms/' + idRoom);
        // ref.child('name').once('value', function (value) {
        //     console.log('room name: ', value.val());

        //     var recentPostsRef = temperatureRef.limitToLast(1);
        //     recentPostsRef.on('child_added', function (snapshot) {
        //         var numberChild = snapshot.numChildren();
        //         var obj = {},
        //             i = 0;

        //         snapshot.forEach(function (childSnapshot) {
        //             i++;
        //             var childKey = childSnapshot.key;
        //             var childData = childSnapshot.val();
        //             obj[childKey] = childData;
        //             if (i == numberChild) {
        //                 console.log(obj);
        //                 return;
        //             }
        //         });
        //     });
        // });

    }
};

module.exports = thermometer;