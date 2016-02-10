four51.app.controller('CheckOutViewCtrl', ['$scope', '$routeParams', '$location', '$filter', '$rootScope', '$451', 'Analytics', 'User', 'Order', 'OrderConfig', 'FavoriteOrder', 'AddressList', 'GoogleAnalytics',
function ($scope, $routeParams, $location, $filter, $rootScope, $451, Analytics, User, Order, OrderConfig, FavoriteOrder, AddressList, GoogleAnalytics) {
	$scope.errorSection = 'open';

	$scope.isEditforApproval = $routeParams.id != null && $scope.user.Permissions.contains('EditApprovalOrder');
	if ($scope.isEditforApproval) {
		Order.get($routeParams.id, function(order) {
			$scope.currentOrder = order;
		});
	}

	if (!$scope.currentOrder) {
        $location.path('catalog');
    }

	$scope.hasOrderConfig = OrderConfig.hasConfig($scope.currentOrder, $scope.user);
	$scope.checkOutSection = $scope.hasOrderConfig ? 'order' : 'shipping';

    $scope.$watch('checkOutSection',function(val){

    });

//    $scope.checkOutSection = 'shipping';
//    $scope.$watch('currentOrder.ShipAddressID', function() {
//        if ($scope.currentOrder.ShipAddressID && $scope.currentOrder.ShipperID) {
//            $scope.checkOutSection = 'billing';
//        }
//    });
//    $scope.$watch('currentOrder.ShipperID', function() {
//        if ($scope.currentOrder.ShipAddressID && $scope.currentOrder.ShipperID) {
//            $scope.checkOutSection = 'billing';
//        }
//    });
//    $scope.$watch('cart_billing.$invalid', function() {
//        if (!$scope.cart_billing.$invalid && $scope.currentOrder.Approvals[index] !== null) {
//            $scope.checkOutSection = 'approval';
//        }
//    });

    function submitOrder() {
	    $scope.displayLoadingIndicator = true;
	    $scope.errorMessage = null;
        if($scope.user.Type == "TempCustomer"){
            angular.forEach($scope.currentOrder.OrderFields, function(of){
                if(of.Label == "Email Address"){
                    $scope.user.GuestCheckout = true;
                    $scope.user.Email = of.Value;
                    $scope.user.FirstName = "Guest";
                    $scope.user.LastName = "User";
                    $scope.user.Password = "Guest1234";
                    $scope.user.ConfirmPassword = "Guest1234";
                    User.save($scope.user, function(data) {
                        Order.submit($scope.currentOrder,
                            function(data) {
                                if ($scope.user.Company.GoogleAnalyticsCode) {
                                    GoogleAnalytics.ecommerce(data, $scope.user);
                                }
                                $scope.user.CurrentOrderID = null;
                                User.save($scope.user, function(data) {
                                    $scope.user = data;
                                    $scope.displayLoadingIndicator = false;
                                });
                                $scope.currentOrder = null;
                                $location.path('/order/' + data.ID);
                            },
                            function(ex) {
                                $scope.errorMessage = ex.Message;
                                $scope.displayLoadingIndicator = false;
                                $scope.shippingUpdatingIndicator = false;
                                $scope.shippingFetchIndicator = false;
                            }
                        );
                    });
                }
            });
        }
       else {
            Order.submit($scope.currentOrder,
                function (data) {
                    $scope.user.CurrentOrderID = null;
                    User.save($scope.user, function (data) {
                        $scope.user = data;
                        $scope.displayLoadingIndicator = false;
                    });
                    $scope.currentOrder = null;
                    $location.path('/order/' + data.ID);
                },
                function (ex) {
                    $scope.errorMessage = ex.Message;
                    $scope.displayLoadingIndicator = false;
                    $scope.shippingUpdatingIndicator = false;
                    $scope.shippingFetchIndicator = false;
                }
            );
        }
    };

	$scope.$watch('currentOrder.CostCenter', function() {
		OrderConfig.address($scope.currentOrder, $scope.user);
	});


    $scope.$on('event:orderUpdate', function(event, order) {
        $scope.cartCount = order ? (order.Status == 'Unsubmitted' || order.Status == 'AwaitingApproval') ? order.LineItems.length : null : null;
    });


    function saveChanges(callback) {
	    $scope.displayLoadingIndicator = true;
	    $scope.errorMessage = null;
	    $scope.actionMessage = null;
	    var auto = $scope.currentOrder.autoID;
	    Order.save($scope.currentOrder,
	        function(data) {
		        $scope.currentOrder = data;
		        if (auto) {
			        $scope.currentOrder.autoID = true;
			        $scope.currentOrder.ExternalID = 'auto';
		        }
		        $scope.displayLoadingIndicator = false;
		        if (callback) callback($scope.currentOrder);
	            $scope.actionMessage = "Your changes have been saved";
	        },
	        function(ex) {
		        $scope.currentOrder.ExternalID = null;
		        $scope.errorMessage = ex.Message;
		        $scope.displayLoadingIndicator = false;
		        $scope.shippingUpdatingIndicator = false;
		        $scope.shippingFetchIndicator = false;
	        }
        );
    };

    $scope.continueShopping = function() {
	    if (confirm('Do you want to save changes to your order before continuing?') == true)
	        saveChanges(function() { $location.path('catalog') });
        else
		    $location.path('catalog');
    };

    $scope.cancelOrder = function() {
	    if (confirm('Are you sure you wish to cancel your order?') == true) {
		    $scope.displayLoadingIndicator = true;
	        Order.delete($scope.currentOrder,
		        function() {
		            $scope.user.CurrentOrderID = null;
		            $scope.currentOrder = null;
			        User.save($scope.user, function(data) {
				        $scope.user = data;
				        $scope.displayLoadingIndicator = false;
				        $location.path('catalog');
			        });
		        },
		        function(ex) {
			        $scope.actionMessage = ex.Message;
			        $scope.displayLoadingIndicator = false;
		        }
	        );
	    }
    };

    $scope.saveChanges = function() {
        saveChanges();
    };

    $scope.submitOrder = function() {
       submitOrder();
    };

    $scope.saveFavorite = function() {
        FavoriteOrder.save($scope.currentOrder);
    };

	$scope.cancelEdit = function() {
		$location.path('order');
	};
}]);