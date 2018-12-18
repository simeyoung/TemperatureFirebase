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
        // this.loaded = false;
        // this.sendSocketNotification("GET_FIREBASE_CONFIG", "");
    },

    startReceiver: function () {

    },

    onFetchTemperature: function (self) {
        console.log('send temperature to module: thermostat');
        console.log('temperature sended: ', self.rooms);
        self.sendSocketNotification('TEMPERATURE', self.rooms);
    },

    configureFirebase: function (config) {
        console.log('configuring firebase...');
        // this.sendSocketNotification("TEMPERATURE", "ciao");
        // See https://firebase.google.com/docs/web/setup#project_setup for setup
        this.firebaseConfig = config;
        this.fetch(config.roomsId, this.onFetchTemperature, this);

        console.log('api key: ' + config.apiKey);
        console.log('Configured firebase!');
    },

    fetch: function (roomsId, callback, self) {
        this.openFirebaseConnection(this.firebaseConfig);

        const database = firebase.database();
        for (var i = 0; i < roomsId.length; i++) {
            const roomRef = database.ref('rooms/' + roomsId[i]);
            roomRef.child('name').once('value', function (value) {
                // const roomName = value.val();
                // console.log('room name: ', value);
                const roomName = "sime";

                var recentPostsRef = roomRef.child('temperatures').limitToLast(1);
                recentPostsRef.on('child_added', function (snapshot) {
                    console.log('on child added');
                    self.getTemperature(roomsId[i], snapshot, callback, self, roomName);
                });
            });
        }
        // temperatureRef.once('child_changed', callback);

        console.log('Configured fetch for firebase..');
    },

    getTemperature: function (roomId, snapshot, callback, self, roomName) {
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
                this.rooms[roomId] = obj;
                console.log('temperature added', obj);
                callback(self);
            }
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
                console.log('firebase_config payload: ', payload);
                // this.sendSocketNotification("TEMPERATURE", "ciao");
                // console.log('socket notification sended');
                this.configureFirebase(payload);
                break;
        }
    },

    rooms: []

});