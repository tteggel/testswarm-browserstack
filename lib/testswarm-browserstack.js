var request = require('request'),
    BrowserStack = require('browserstack'),
    async = require('async'),
    browserMap = require("./map").map;
var self;

var TestSwarmBrowserStackInteg = {

    options:function (options) {
        if (!options) {
            return self._options;
        }
        self._options = options;
    },

    client:function () {
        if (self._client) {
            return self._client;
        }
        self._client = BrowserStack.createClient({
            username:self.options().user,
            password:self.options().pass
        });
        return self._client;
    },

    /**
     * Get the swarmstate of testswarm (number of active clients and pending runs).
     * @param callback Function
     */
    getSwarmState:function (callback) {
        request.get(self.options().swarmUrl + '/api.php?action=swarmstate', function (error, res, body) {
                      console.log(error);
            var apiData = JSON.parse(body);
            if (apiData) {
                if (apiData.error) {
                    callback(apiData.error);
                    return;
                }
                if (apiData.swarmstate) {
                    callback(null, apiData.swarmstate);
                    return;
                }
            }
            callback({
                code:'unknown',
                info:'Malformed API response'
            });
        });
    },

    workerEquals:function (a, b) {
      return a.browser === b.browser && 
             a.device === b.device &&
             a.os === b.os &&
             a.version === b.version;
    },

    /**
     * Get a browserstack worker id based on a browserMap object
     * @param browser Object: Object with property 'name' and 'version' (from testswarm-browserstack.map)
     * @param currentWorkers Array: List of worker objects (from browserstack.getWorkers)
     * @return Array: Worker ids (can be empty if none found)
     */
    getWorkersByBrowser:function (browser, currentWorkers, includeQueued) {
        var i, worker,
            workers = [],
            len = currentWorkers.length;
        for (i = 0; i < len; i++) {
            worker = currentWorkers[i];
            if (self.workerEquals(browser, worker) &&
               (worker.status !== "queue" || includeQueued)) {
                workers.push(worker);
            }
        }
        return workers;
    },

    startWorker:function (browser, clientTimeout) {
        if (self.options().dryRun) {
            console.log('[dryRun] startWorker', browser, clientTimeout);
            return;
        }
        var client = self.client();
        browser.url = self.options().swarmRunUrl;
        browser.timeout = clientTimeout;
        client.createWorker(browser, function (err, worker) {
            if (err) {
                console.log('error spawning browser:', browser, err);
            } else {
                console.log('started browser: ', browser, worker);
            }
        });
    },

    containsWorker: function(worker, list) {
      return list.reduce(function(prev, curr, i, a) {
                           return self.workerEquals(worker, curr) || prev;
                         }, false);
    },

    getWorker:function(worker, list) {
      return list.filter(function(item) {return self.workerEquals(worker, item)})[0];
    },

    /**
     * @param currentWorkers Array: Array of browser objects
     * @param swarmState Object: Info about current state of the testswarm
     */
    updateBrowsers:function (currentWorkers, swarmState) {
        var browserID, stats, workers, doKillWorkers, i, len,
            // Browsers needed by TestSwarm, includes browsers that have workers already
            neededBrowsers = [],
            // Browsers to be started. Must not be more than options().stackLimit
            // May contain the same browser multiple times, this is expected behavior
            startBrowsers = [],
            // Workers that are no longer needed
            killWorkers = [];

        if (self.options().verbose) {
            console.log('TestSwarm statistics:\n', (function () {
                // Reduce big swarmState to just the user agent stats
                var uaID, uaStats = {};
                for (uaID in swarmState.userAgents) {
                    uaStats[uaID] = swarmState.userAgents[uaID].stats;
                }
                return uaStats;
            }()));
            console.log('BrowserStack current workers:\n', currentWorkers);
        }

        // Figure out which browsers are needed by TestSwarm and which should be killed
        for (browserID in browserMap) {
            if (!swarmState.userAgents[browserID]) {
                continue;
            }
            stats = swarmState.userAgents[browserID].stats;
            workers = self.getWorkersByBrowser(browserMap[browserID], currentWorkers, true);
            doKillWorkers = false;
            if (stats.pendingRuns > 0 || 
                stats.pendingReRuns > 0) {
              neededBrowsers.push(browserMap[browserID]);
            } else if (stats.activeRuns === 0 && 
                       stats.pendingReRuns === 0 && 
                       stats.pendingRuns === 0 && 
                       workers.length && 
                       self.options().kill) {
              killWorkers.push(self.getWorker(browserMap[browserID], workers));
            }

            if (doKillWorkers) {
                killWorkers.push.apply(killWorkers, workers);
            }
        }

        console.log('TestSwarm wants these browsers:', neededBrowsers);
        console.log('BrowserStack workers to be killed:', killWorkers);

        // How many browsers to start?
        var n = Math.max(self.options().stackLimit - (currentWorkers.length - killWorkers.length), 0);

        if (self.options().verbose) {
               console.log('BrowserStack limit:', self.options().stackLimit);
               console.log('BrowserStack # workers to start:', n);
        }

        while (neededBrowsers.length > 0 && 
               startBrowsers.length < n) {
          var candidate = neededBrowsers.pop();

          if (!self.containsWorker(candidate, currentWorkers)) {
            startBrowsers.push(candidate);
          }
        }
        console.log('BrowserStack workers to be started:', startBrowsers);

        killWorkers.forEach(function (worker, i) {
            if(worker.status !== "queue" || !self.containsWorker(worker, neededBrowsers)) {
              self.killWorker(worker);
            }
        });

        startBrowsers.forEach(function (browser, i) {
            self.startWorker(browser, self.options().clientTimeout);
        });
    },

    run:function () {
        var client = self.client();
        async.parallel({
            currentWorkers:function (callback) {
                client.getWorkers(function (err, resp) {
                    if (err) {
                        console.log('Error getting workers', err);
                    }
                    callback(err, resp);
                });
            },
            swarmState:function (callback) {
                self.getSwarmState(function (error, state) {
                    if (state) {
                        callback(null, state);
                    } else {
                        console.log('Getting testswarm state failed:\n', error);
                        // TODO handle err, for now just continue pretending there are no needs
                        // by giving it an empty object.
                        callback(null, {
                            userAgents:{}
                        });
                    }
                });
            }
        }, function (err, results) {
            self.updateBrowsers(results.currentWorkers, results.swarmState);
        });
    },

    /**
     * @param worker Object|Number: Either a worker object (as given by browerstack.getWorkers,
     * used by tsbs.updateBrowsers), or the worker id directly (used by "cli.js --killWorker")
     */
    killWorker:function (worker) {
        if (self.options().dryRun) {
            console.log('[dryRun] killWorker', worker);
            return;
        }
        var client = self.client();
        client.terminateWorker(worker.id || worker, function (err) {
            if (err) {
                console.log('could not kill worker', worker);
                return;
            }
            console.log('killed worker', worker);
        });
    },

    killAll:function () {
        var client = self.client();
        client.getWorkers(function (err, workers) {
            if (err) {
                console.log('could not get workers from browserstack');
                return;
            }
            if (!workers || workers.length < 1) {
                console.log('no workers running or queued');
            }
            workers.forEach(function (worker, i) {
                self.killWorker(worker);
            });
        });
    }
};

self = TestSwarmBrowserStackInteg;

module.exports = {
    options:TestSwarmBrowserStackInteg.options,
    getSwarmState:TestSwarmBrowserStackInteg.getSwarmState,
    run:TestSwarmBrowserStackInteg.run,
    killWorker:TestSwarmBrowserStackInteg.killWorker,
    killAll:TestSwarmBrowserStackInteg.killAll
};
