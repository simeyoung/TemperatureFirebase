/* global Log, Module, moment, config */

/* Magic Mirror
 * Module: thermostat
 *
 * By Paul-Vincent Roll http://paulvincentroll.com
 * MIT Licensed.
 */

Module.register('thermometer', {
	defaults: {
		roomId: 2,
		apiKey: '',
		authDomain: '',
		databaseURL: '',
		projectId: '',
		degrees: '0',
		humidity: '0',
		roomName: 'Sala Sime'
	},

	// Define scripts
	getScripts: function () {
		return [
			this.file('node_modules/firebase/firebase.js')
		];
	},

	// Define styles
	getStyles: function () {
		return ['style.css'];
	},

	// getTemplate: function () {
	// 	// this.sendSocketNotification("FIREBASE_CONFIG", this.config);
	// 	return "thermometer.njk"
	// },

	// getTemplateData: function () {
	// 	return this.config
	// },

	// Define start sequence.
	start: function () {},

	socketNotificationReceived: function (notification, payload) {
		switch (notification) {
			case "TEMPERATURE":
				this.receiveTemperature(payload);
				break;
			// case "GET_FIREBASE_CONFIG":
			// 	this.sendSocketNotification("FIREBASE_CONFIG", this.config);
			// 	break;
		}
	},

	// Get dom
	getDom: function () {
		this.sendSocketNotification("FIREBASE_CONFIG", this.config);
		// Crea div aggiungi classe container e card
		var wrapper = document.createElement('div');
		wrapper.innerHTML = this.createHTML('0', '0', 'sala Sime');
		return wrapper;
	},

	loaded: function (callback) {
		// Log.info("loaded");
		this.finishLoading();
		Log.log(this.name + ' is loaded!');
		callback();
	},

	// Funzione che ottiene relatime
	// la nuova temperatura
	receiveTemperature: function (temperature) {
		var humidity = document.getElementById('humidity');
		humidity.innerHTML = temperature.humidity + '%';
		var degrees = document.getElementById('degrees');
		degrees.innerHTML = temperature.degrees + '°';
		var roomName = document.getElementById('roomName');
		roomName.innerHTML = temperature.roomName;
	},

	createHTML: function (degrees, humidity, roomName) {
		return `<h3 id="roomName">Stanza: ${roomName}</h3>
				<div class="row">
					<label class="font-bold">Temperatura</label>
					<label id="degrees">${degrees}°</label>
				</div>
				<div class="row">
					<label class="font-bold">Umidità</label>
					<label id="humidity">${humidity}%</label>
				</div>`;
	},

	temperature: ""

});