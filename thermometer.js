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
		projectId: ''
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

	// Define start sequence.
	start: function () {
		// Log.info('Starting module: ' + this.name + ' from module');
	},

	notificationReceived: function(notification, payload, sender) { 
		Log.info(this.name + ': Received notification: ' + notification);

		switch (notification) {
			case "TEMPERATURE":
				this.receiveTemperature(payload);
				break;
		}
	},

	socketNotificationReceived: function (notification, payload) {
		Log.info(this.name + ': Received socketnotification: ' + notification);

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
		// wrapper.classList.add('container');
		wrapper.setAttribute('id', 'container');
		wrapper.innerHTML = JSON.stringify(this.temperature);
		// wrapper.innerHTML = this.createCard('temp', 'temperature', this.temperature.degrees, 'gradi').trim() +
		// 	this.createCard('energy', 'umidità', this.temperature.humidity, '%').trim();
		return wrapper;
	},

	loaded: function (callback) {
		Log.info("loaded");

		// this.sendSocketNotification("FIREBASE_CONFIG", this.config);
		this.finishLoading();
		Log.log(this.name + ' is loaded!');
		callback();
	},

	// Funzione che ottiene relatime
	// la nuova temperatura
	receiveTemperature: function (temperature) {
		Log.info('Firebase realtime database added: ' + JSON.stringify(value));
		this.temperature = temperature;
		// this.updateDom();
		var wrapper = document.getElementById('container');
		wrapper.innerHTML = JSON.stringify(temperature);
	},

	createCard: function (clss, txt, num, measure) {
		return `<div class='card ${clss}'>
					 <div class='inner'>
						<div class='icon'></div>
						<div class='title'>
							<div class='text'>${txt}</div>
						</div>
						<div class='number'>${num}</div>
						<div class='measure'>${measure}</div>
					 </div>
				 </div>`;
	},

	temperature: ""

});