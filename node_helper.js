/* Magic Mirror
 * Node Helper: Thermostat
 *
 * By Sime Young
 * MIT Licensed.
 */

var thermometer = require('./temperature.js');

module.exports = NodeHelper.create({
	// Subclass start method.
	start: function() {
        console.log('Starting module: ' + this.name);
        
		// Listen firebase database
		this.therm = new thermometer();
	}
});
