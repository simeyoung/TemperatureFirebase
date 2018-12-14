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
		// Log.info('Starting module: ' + this.name + ' from module');
		// Log.info('ciao');


		// const therm = new thermometer();
		// this.configureFirebase(this.config.apiKey,
		// 	this.config.authDomain,
		// 	this.config.databaseURL,
		// 	this.config.projectId);

		// this.fetch(this.config.roomId, this.onFetchTemperature);

		// Log.info('api key: ' + this.config.apiKey);
		// Log.info('continue load module thermometer..');
	},

	configureFirebase: function () {
        // See https://firebase.google.com/docs/web/setup#project_setup for setup
        this.firebaseConfig = {
            apiKey: this.config.apiKey,
            authDomain: this.config.authDomain,
            databaseURL: this.config.databaseURL,
            projectId: projethis.config.projectId
		};

		this.fetch(this.config.roomId, this.onFetchTemperature);

		Log.info('api key: ' + this.config.apiKey);
		Log.info('Configured firebase!');
    },

    fetch: function (idRoom, callback) {
		this.openFirebaseConnection(this.firebaseConfig);

		const database = firebase.database();
        const temperatureRef = database.ref('rooms/' + idRoom + '/temperatures');
		temperatureRef.once('child_added', callback);
		
		Log.info('Configured fetch for firebase..');
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

    openFirebaseConnection: function (firebaseConfig) {
        if (!firebase.apps.length) {
            firebase.initializeApp(firebaseConfig);
        }
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