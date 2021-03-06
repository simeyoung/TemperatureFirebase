/* global Log, Module, moment, config */

/* Magic Mirror
 * Module: thermostat
 *
 * By Paul-Vincent Roll http://paulvincentroll.com
 * MIT Licensed.
 */

Module.register('thermometer', {
	defaults: {
		roomsId: [1, 2],
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
			this.file('node_modules/firebase/firebase.js'),
			'moment.js'
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

		var body = document.createElement('div');

		// Crea div aggiungi classe container e card
		var linkcss = document.createElement('link');
		// <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.6.1/css/all.css" integrity="sha384-gfdkjb5BdAXd+lj+gudLWI+BXq4IuLW5IT+brZEZsLFm++aCMlF1V92rMkPaX4PP" crossorigin="anonymous"></link>
		linkcss.setAttribute('rel', 'stylesheet');
		linkcss.setAttribute('href', 'https://use.fontawesome.com/releases/v5.6.1/css/all.css');
		linkcss.setAttribute('integrity', 'sha384-gfdkjb5BdAXd+lj+gudLWI+BXq4IuLW5IT+brZEZsLFm++aCMlF1V92rMkPaX4PP');
		linkcss.setAttribute('crossorigin', 'anonymous');

		var wrapper = document.createElement('div');
		wrapper.setAttribute('id', 'main')
		wrapper.innerHTML = this.createHTML('0', '0', 'sala Sime');

		body.append(linkcss);
		body.append(wrapper);

		return body;
	},

	loaded: function (callback) {
		// Log.info("loaded");
		this.finishLoading();
		Log.log(this.name + ' is loaded!');
		callback();
	},

	// Funzione che ottiene relatime
	// la nuova temperatura
	receiveTemperature: function (rooms) {
		var wrapper = document.getElementById('main');
		var cards;
		for (let index = 0; index < rooms.length; index++) {
			const room = rooms[index];
			const currentDate = moment(room.currentDate).format('DD/MM/YY HH:mm');
			cards += this.createHTML(room.degrees, room.humidity, room.name, currentDate);

			if (index + 1 < rooms.length) {
				cards += '<hr>';
			}
		}

		wrapper.innerHTML = cards;
	},

	createHTML: function (degrees, humidity, roomName, currentDate) {
		return `
		<div class="col">
			<h3 id="roomName">${roomName}</h3>
			<div class="row">
				<i class="fa fa-temperature-high"></i>
				<label class="degrees">${degrees}°</label>
			</div>
			<div class="row">
				<i class="fa fa-tint"></i>
				<label class="humidity">${humidity}%</label>
			</div>
			<div class="row">
				<i class="fa fa-clock"></i>
				<label class="clock">${currentDate}</label>
			</div>
		</div>`;
	},

	temperature: ""

});