/* global Log, Module, moment, config */

/* Magic Mirror
 * Module: thermostat
 *
 * By Paul-Vincent Roll http://paulvincentroll.com
 * MIT Licensed.
 */

Module.register('thermostat', {
	defaults: {
		roomId: 2,
		apiKey: apiKey,
		authDomain: authDomain,
		databaseURL: databaseURL,
		projectId: projectId
	},

	// Define scripts
	getScripts: function () {
		return ['temperature.js'];
	},

	// Define styles
	getStyles: function () {
		return ['style.css'];
	},

	// Define required translations.
	getTranslations: function () {
		return {
			// en: 'translations/en.json',
			// de: 'translations/de.json',
			// nl: 'translations/nl.json',
		};
	},

	// Define start sequence.
	start: function () {
		Log.info('Starting module: ' + this.name);

		// Listen firebase database
		var therm = new thermometer();

		therm.configure(this.config.apiKey,
			this.config.authDomain,
			this.config.databaseURL,
			this.config.projectId);

		therm.fetch(this.config.roomId, this.onFetchTemperature);
	},

	// Get dom
	getDom: function () {
		// Crea div aggiungi classe container e card
		var wrapper = document.createElement('div');
		wrapper.classList.add('container');
		wrapper.innerHTML = this.createCard('temp', 'temperature', this.temperature.degrees, 'gradi').trim() +
			this.createCard('energy', 'umidità', this.temperature.humidity, '%').trim();
		return wrapper;
	},

	// Funzione che ottiene relatime
	// la nuova temperatura
	onFetchTemperature: function (temperature) {
		Log.info('Firebase realtime database added: ' + JSON.stringify(value));
		this.temperature = temperature;
		this.updateDom();
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

	temperature: {}

});