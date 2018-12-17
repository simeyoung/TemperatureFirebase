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
	getStyles: function () {
		return ['style.css'];
	},

	getTemplate: function () {
		return "thermometer.njk"
	},

	getTemplateData: function () {
		return this.config
	},

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
		// 	// Crea div aggiungi classe container e card
		// 	var wrapper = document.createElement('div');
		// 	wrapper.classList.add('container');
		// 	wrapper.setAttribute('id', 'container');
		// 	wrapper.innerHTML = this.createCard('temp', 'temperature', '0', 'gradi').trim() +
		// 		this.createCard('energy', 'umidità', '0', '%').trim();
		// 	return wrapper;
	},

	loaded: function (callback) {
		// Log.info("loaded");
		// this.finishLoading();
		// Log.log(this.name + ' is loaded!');
		// callback();
	},

	// Funzione che ottiene relatime
	// la nuova temperatura
	receiveTemperature: function (temperature) {
		// var wrapper = document.getElementById('container');
		// wrapper.innerHTML = JSON.stringify(temperature);
		// wrapper.innerHTML = this.createCard('temp', 'temperature', temperature.degrees, 'gradi').trim() +
		// 	this.createCard('energy', 'umidità', temperature.humidity, '%').trim();
		var humidity = document.getElementById('humidity');
		humidity.innerHTML = temperature.humidity + '%';
		var degrees = document.getElementById('degrees');
		degrees.innerHTML = temperature.degrees + '°';
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