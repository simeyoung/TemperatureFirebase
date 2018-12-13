const firebase = require('firebase');

/* Fetcher
 * Responsible for requesting an update on the set interval and broadcasting the data.
 *
 * attribute url string - URL of the news feed.
 * attribute reloadInterval number - Reload interval in milliseconds.
 * attribute logFeedWarnings boolean - Log warnings when there is an error parsing a news article.
 */


function thermometer() {
    // variabili
    this.config = {};

    var self = this;

    this.configure = function (apiKey, authDomain, databaseURL, projectId) {
        // See https://firebase.google.com/docs/web/setup#project_setup for how to
        // auto-generate this config
        self.config = {
            apiKey: apiKey,
            authDomain: authDomain,
            databaseURL: databaseURL,
            projectId: projectId
        };

        firebase.initializeApp(self.config);
    };

    this.fetch = function (idRoom, callback) {
        var temperatureRef = firebase.database().ref('rooms/' + idRoom + '/temperatures');
        return temperatureRef.once('child_added', callback);
    }
};

module.exports = thermometer;