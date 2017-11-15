
var chatroom = angular.module('chatroom', []);

chatroom.controller ('mainController', function($scope, $http, $window, $location){
	
	$relatedURL = 'http://127.0.0.1:3000/';
	$session = false;
	$nickname = 'deny';
	
	$http({
	  method: 'GET',
	  url: $relatedURL+'checkSession'
	}).then(
		function successCallback(response) {
		    $session = response.data.session;
		    $nickname = response.data.nick;
		    if ($session == false){
		    	console.log('izinsiz kullanıcı');
		    	$session = false;
		    	$nickname = 'deny';
		    	$window.location.href = $relatedURL;
		    }else{
		    	$session = true;
		    	$scope.nickname = $nickname;
		    	getContact();
		    }
		}, 
		function errorCallback(response) {
		    console.log('Error: ' + response);
		}
	);

	$scope.LogOut = function(){
		$window.location.href = $relatedURL + 'logout';
	}

	var getContact = function(){
		$scope.contact = [];
		$http({
			method: 'GET',
			url: $relatedURL+'contactList?from='+$nickname
		}).then(
			function successCallback(response){
				$scope.contact = response.data.sonuc;
			},
			function errorCallback(response){
				console.log('Error: ' + response);
			}
		);
	}

	$scope.getMessage = function(fromName){
		console.log(fromName);
	};
});