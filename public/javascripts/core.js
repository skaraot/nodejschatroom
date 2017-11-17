
var chatroom = angular.module('chatroom', []);

chatroom
.directive('schrollBottom', function () {
  return {
    scope: {
      schrollBottom: "="
    },
    link: function (scope, element) {
      scope.$watchCollection('schrollBottom', function (newValue) {
        if (newValue)
        {
          $(element).scrollTop($(element)[0].scrollHeight);
        }
      });
    }
  }
})
.controller ('mainController', function($scope, $http, $window, $location){
	
	$relatedURL = 'http://127.0.0.1:3000/';
	$session = false;
	$nickname = 'deny';
	$toSource = '';
	
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

	$scope.getMessage = function(toName){
		$scope.message = [];
		$http({
			method: 'GET',
			url: $relatedURL+'messageList?from='+$nickname+'&to='+toName
		}).then(
			function successCallback(response){
				$scope.message = response.data.sonuc;
				$toSource = toName;
			},
			function errorCallback(response){
				console.log('Error: ' + response);
			}
		);
	};

	$scope.setMessage = function(){
		console.log($scope.messageText);
		$http({
			method: 'GET',
			url: $relatedURL+'messageAdd?from='+$nickname+'&to='+$toSource+'&message='+$scope.messageText
		}).then(
			function successCallback(response){
				$scope.message.push({
			      "from": $nickname,
			      "to": $toSource,
			      "time": Math.floor(Date.now() / 1000),
			      "message": $scope.messageText
			    });
				$scope.messageText = '';
			},
			function errorCallback(response){
				console.log('Error: ' + response);
			}
		);
	}
});
