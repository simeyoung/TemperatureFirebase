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
		degrees,
		humidity,
		roomName: 'Sala Sime'
	},

	// Define scripts
	getScripts: function () {
		return [
			this.file('node_modules/firebase/firebase.js')
		];
	},

	// Define styles
	// getStyles: function () {
	// 	return ['style.css'];
	// },

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
		}
	},

	// Get dom
	getDom: function () {
		this.sendSocketNotification("FIREBASE_CONFIG", this.config);
		// Crea div aggiungi classe container e card
		var wrapper = document.createElement('div');
		wrapper.innerHTML = this.createHTML('0', '0');
		return wrapper;
	},

	// loaded: function (callback) {
	// 	// Log.info("loaded");
	// 	this.finishLoading();
	// 	Log.log(this.name + ' is loaded!');
	// 	callback();
	// },

	// Funzione che ottiene relatime
	// la nuova temperatura
	receiveTemperature: function (temperature) {
		var humidity = document.getElementById('humidity');
		humidity.innerHTML = temperature.humidity + '%';
		var degrees = document.getElementById('degrees');
		degrees.innerHTML = temperature.degrees + '°';
	},

	createHTML: function (degrees, humidity) {
		return `<h6>Stanza {{ roomName | safe }}<h6>
				<dl>
					<dt>Temperatura</dt>
					<dd id="degrees" style="font-weight: bold">${degrees}°</dd>
					<dt>Umidità</dt>
					<dd id="humidity">${humidity}%</dd>
				</dl>`;
	},

	temperature: ""

});