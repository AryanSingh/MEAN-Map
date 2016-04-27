(function() {
	'use strict';

	angular
	  .module('meanMapApp')
	  .controller('addCtrl',['$http','geolocation','gservice','$scope','$rootScope',addCtrl]);

	

	function addCtrl($http,geolocation,gservice,$scope,$rootScope) {
		var vm = this;
		vm.formData = {};
		var coords = {};
		var lat= 0;
		var long = 0;

		vm.formData.latitude = 39.500;
		vm.formData.longitude = -98.350;

		geolocation.getLocation().then(function(data){

		    // Set the latitude and longitude equal to the HTML5 coordinates
		    coords = {lat:data.coords.latitude, long:data.coords.longitude};

		    // Display coordinates in location textboxes rounded to three decimal points
		    vm.formData.longitude = parseFloat(coords.long).toFixed(3);
		    vm.formData.latitude = parseFloat(coords.lat).toFixed(3);

		    // Display message confirming that the coordinates verified.
		    vm.formData.htmlverified = "Yep (Thanks for giving us real data!)";

		    gservice.refresh(vm.formData.latitude, vm.formData.longitude);

		});

		$rootScope.$on("clicked", function(){

		    // Run the gservice functions associated with identifying coordinates
		   $scope.$apply(function(){

		        vm.formData.latitude = parseFloat(gservice.clickLat).toFixed(3);
		        console.log(vm.formData.latitude);
		        vm.formData.longitude = parseFloat(gservice.clickLong).toFixed(3);
		        vm.formData.htmlverified = "Nope (Thanks for spamming my map...)";
		   })
		   
		});

		vm.createUser = function(){
			var userData = {
				username: vm.formData.username,
	            gender: vm.formData.gender,
	            age: vm.formData.age,
	            favlang: vm.formData.favlang,
	            location: [vm.formData.longitude, vm.formData.latitude],
	            htmlverified: vm.formData.htmlverified
			};

			$http.post('/users',userData)
				.success(function(data){
					vm.formData.username = "";
	                vm.formData.gender = "";
	                vm.formData.age = "";
	                vm.formData.favlang = "";
	                gservice.refresh($scope.formData.latitude, $scope.formData.longitude);
				})
				.error(function(data){
					console.log('Error: ' + data);
				});
		};
	};
})();