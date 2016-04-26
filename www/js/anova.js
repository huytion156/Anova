angular.module('anova.services', [])
.
factory('socket', function (socketFactory) {
	const IP = "http://192.168.100.241:80";
  var myIoSocket =io.connect(IP);
  mySocket = socketFactory({
    ioSocket: myIoSocket
  });

  return mySocket;
})
.factory('AnovaSocket', function(localStorageService, socket, $ionicPopup, $timeout) {
	
	var humidityThreshold = localStorageService.get("humidityThreshold") || 100;
	var temperatureThreshold = localStorageService.get("temperatureThreshold") || 100;

	var nodes = {

	};

	socket.on('ACK', function() {
		console.log('ACK');
	});
	socket.on("TEMP", function(nodeid, value) {
		if (!nodes[nodeid]) 
			nodes[nodeid] = {id:nodeid, temp:0, humi: 0};
		nodes[nodeid].temp = value;
	});
	socket.on("HUMI", function(nodeid, value) {
		if (!nodes[nodeid]) 
			nodes[nodeid] = {id:nodeid, temp:0, humi: 0};
		nodes[nodeid].humi = value;
	});
	socket.on("MESSAGE", function(message) {
        var alertPopup = $ionicPopup.alert({
            title: 'Message',
            template: message
        });

        $timeout(function() {
            //ionic.material.ink.displayEffect();
            ionicMaterialInk.displayEffect();
        }, 0);
	});
	return {
		getIP: function() {
			return IP;
		},
		changeTempThreshold: function(threshold) {
			temperatureThreshold = threshold;
			localStorageService.set("temperatureThreshold", threshold); 
			console.log("save temp");
			console.log(threshold);
			socket.emit("updateTempThreshold", threshold);
		},
		changeHumidityThreshold: function(threshold) {
			humidityThreshold = threshold;
			localStorageService.set("humidityThreshold", threshold);
			console.log("Save humi");
			console.log(threshold);
			socket.emit("updatehumidityThreshold", threshold);
		},
		getTempThreshold: function() {
			return temperatureThreshold;
		},
		getHumidityThreshold: function() {
			return humidityThreshold;
		},
		getNodes: function() {
			return nodes;
		}
	};
});


function rand (min, max) {
  //  discuss at: http://phpjs.org/functions/rand/
  // original by: Leslie Hoare
  // bugfixed by: Onno Marsman
  //        note: See the commented out code below for a version which will work with our experimental (though probably unnecessary) srand() function)
  //   example 1: rand(1, 1);
  //   returns 1: 1

  var argc = arguments.length
  if (argc === 0) {
    min = 0
    max = 2147483647
  } else if (argc === 1) {
    throw new Error('Warning: rand() expects exactly 2 parameters, 1 given')
  }
  return Math.floor(Math.random() * (max - min + 1)) + min

  /*
  // See note above for an explanation of the following alternative code

  // +   reimplemented by: Brett Zamir (http://brett-zamir.me)
  // -    depends on: srand
  // %          note 1: This is a very possibly imperfect adaptation from the PHP source code
  // 0x7fffffff
  var rand_seed, ctx, PHP_RAND_MAX=2147483647;

  if (!this.php_js || this.php_js.rand_seed === undefined) {
    this.srand();
  }
  rand_seed = this.php_js.rand_seed;

  var argc = arguments.length;
  if (argc === 1) {
    throw new Error('Warning: rand() expects exactly 2 parameters, 1 given');
  }

  var do_rand = function (ctx) {
    return ((ctx * 1103515245 + 12345) % (PHP_RAND_MAX + 1));
  };

  var php_rand = function (ctxArg) {
   // php_rand_r
    this.php_js.rand_seed = do_rand(ctxArg);
    return parseInt(this.php_js.rand_seed, 10);
  };

  var number = php_rand(rand_seed);

  if (argc === 2) {
    number = min + parseInt(parseFloat(parseFloat(max) - min + 1.0) * (number/(PHP_RAND_MAX + 1.0)), 10);
  }
  return number;
  */
}