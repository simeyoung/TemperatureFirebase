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

    startReceiver: function () { },

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
        this.fetch(config.roomsId, this);

        console.log('api key: ' + config.apiKey);
        console.log('Configured firebase!');
    },

    fetch: function (roomsId, self) {
        this.openFirebaseConnection(this.firebaseConfig);

        const database = firebase.database();
        for (var i = 0; i < roomsId.length; i++) {
            const roomId = roomsId[i];
            const roomRef = database.ref('rooms/' + roomId);
            roomRef.child('name').once('value', value => self.getRoom(value, roomId, roomRef, self));
            console.log('room id from fetch: ', roomId);
        }

        console.log('Configured fetch for firebase..');
    },

    getRoom: function (value, roomId, roomRef, self) {
        const roomName = value.val();
        console.log('room name: ', roomName);

        var recentPostsRef = roomRef.child('temperatures').limitToLast(1);
        recentPostsRef.on('child_added', snapshot => self.getTemperature(roomId, snapshot, self, roomName));
    },

    getTemperature: function (roomId, snapshot, self, roomName) {
        var numberChild = snapshot.numChildren();
        var obj = {},
            i = 0;

        console.log('on child added');

        snapshot.forEach(function (childSnapshot) {
            console.log('room id from getTemperature: ', roomId);
            i++;
            var childKey = childSnapshot.key;
            var childData = childSnapshot.val();
            obj[childKey] = childData;
            if (i == numberChild) {
                obj['name'] = roomName;
                self.rooms.splice(roomId - 1, 1, obj);
                console.log('temperature added', obj);
                self.onFetchTemperature(self);
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

    rooms: [ ]

});