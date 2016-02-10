four51.app.directive('addtoorderspecs', ['$routeParams', function($routeParams) { 
var obj = { 
restrict: 'E', 
//templateUrl: 'addToOrderSpecForm.hcf?id=' + $routeParams.productInteropID + '&r=' + Math.random()
template: '<div ng-include="specForm">', 
link: function(scope) { 
scope.specForm = 'addToOrderSpecForm.hcf?id=' + $routeParams.productInteropID + '&r=' + Math.random(); 
} 
}; 
return obj; 
}]);