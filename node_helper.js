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

    onFetchTemperature: function(value) {
        Log.info('send temperature to module:' + JSON.parse(value));
        this.sendSocketNotification("TEMPERATURE", value);
    },

    configureFirebase: function (config) {
        Log.info('configuring firebase...');
        // See https://firebase.google.com/docs/web/setup#project_setup for setup
        this.firebaseConfig = config.firebaseConfig;

        this.fetch(config.roomId, this.onFetchTemperature);

        Log.info('api key: ' + config.apiKey);
        Log.info('Configured firebase!');
    },

    fetch: function (roomId, callback) {
		this.openFirebaseConnection(this.firebaseConfig);

		const database = firebase.database();
        const temperatureRef = database.ref('rooms/' + roomId + '/temperatures');
		temperatureRef.once('child_changed', callback);
		
		Log.info('Configured fetch for firebase..');
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