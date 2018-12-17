/* Magic Mirror
 * Node Helper: Thermostat
 *
 * By Sime Young
 * MIT Licensed.
 */


var NodeHelper = require("node_helper");
const firebase = require('firebase');

module.exports = NodeHelper.create({

    // Subclass start method.
    start: function () {
        console.log('Starting module: ' + this.name + ' from helper');
        this.loaded = false;
    },

    startReceiver: function () {

    },

    onFetchTemperature: function (value) {
        Log.info('send temperature to module:' + JSON.parse(value));
        this.sendSocketNotification('TEMPERATURE', value);
    },

    configureFirebase: function (config) {
        Log.info('configuring firebase...');
        // See https://firebase.google.com/docs/web/setup#project_setup for setup
        // this.firebaseConfig = config.firebaseConfig;

        this.fetch(config.roomId, this.onFetchTemperature);

        Log.info('api key: ' + config.apiKey);
        Log.info('Configured firebase!');
    },

    fetch: function (roomId, callback) {
        this.openFirebaseConnection(this.firebaseConfig);

        const database = firebase.database();
        const temperatureRef = database.ref('rooms/' + roomId + '/temperatures');
        // temperatureRef.once('child_changed', callback);

        var recentPostsRef = temperatureRef.limitToLast(1);
        recentPostsRef.on('child_added', function (snapshot) {
            // console.log(value);
            this.getTemperature(snapshot, callback);
        })

        Log.info('Configured fetch for firebase..');
    },

    getTemperature: function (snapshot, callback) {
        snapshot.forEach(function (childSnapshot) {
            var numberChild = snapshot.numChildren();
            var obj = {},
                i = 0;

            snapshot.forEach(function (childSnapshot) {
                i++;
                var childKey = childSnapshot.key;
                var childData = childSnapshot.val();
                obj[childKey] = childData;
                if (i == numberChild)
                    callback(obj);
            });
        });
    },

    openFirebaseConnection: function (firebaseConfig) {
        if (!firebase.apps.length) {
            firebase.initializeApp(firebaseConfig);
        }
    },

    socketNotificationReceived: function (notification, payload) {
        switch (notification) {
            case "FIREBASE_CONFIG":
                this.configureFirebase(payload);
                break;
        }
    }


});