/* Magic Mirror
 * Node Helper: Thermostat
 *
 * By Sime Young
 * MIT Licensed.
 */


var NodeHelper = require("node_helper");
// const thermometer = require('./temperature');

module.exports = NodeHelper.create({
	// Subclass start method.
	start: function() {
        console.log('Starting module: ' + this.name + ' from helper');
        this.loaded = false;

        this.configureFirebase(this.config.apiKey,
			this.config.authDomain,
			this.config.databaseURL,
			this.config.projectId);

		this.fetch(this.config.roomId, this.onFetchTemperature);

		Log.info('api key: ' + this.config.apiKey);
		Log.info('continue load module thermometer..');
        
		// Listen firebase database
		// this.therm = new thermometer();
	}
});
