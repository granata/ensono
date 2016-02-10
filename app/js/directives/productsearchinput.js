four51.app.controller('ProductSearchInputCtrl', ['$scope','$location', function($scope,$location) {
	$scope.displayProductSearch = false;
	$scope.executeSearch = function() {
		var searchTerm = $scope.productSearchTerm;
		$scope.productSearchTerm = null;
		$scope.displayProductSearch = false;
		$location.path('search/' + searchTerm);
	};
}]);
//Use anywhere OTHER THAN the top navigation
//Displays as a normal input-group form element.
four51.app.directive('productsearchinput', function() {
	var obj = {
		restrict: 'E',
		replace: 'true',
		template: '<form role="search">' +
        	        '<div class="input-group">' +
        	            '<input type="text" class="form-control" placeholder="{{\'Search\' | r}} {{\'Products\' | r}}" ng-model="productSearchTerm"/>' +
        	            '<div class="input-group-btn">' +
        	                '<button type="submit" ng-click="executeSearch()" class="btn btn-default fa fa-search" ng-disabled="productSearchTerm == null || productSearchTerm == \'\'"></button>' +
        	    		'</div></div></form>',
		controller: 'ProductSearchInputCtrl'
	};
	return obj;
});