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
        
		// Listen firebase database
		// this.therm = new thermometer();
	}
});
