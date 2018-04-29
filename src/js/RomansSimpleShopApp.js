  var app = angular.module('RomansSimpleShopApp', ['ngRoute']);

  
	app.config(function($routeProvider) {
		$routeProvider

			.when('/', {
				templateUrl : 'views/home.html',
				controller  : 'mainController'
			})

			.when('/about', {
				templateUrl : 'views/about.html',
				controller  : 'aboutController'
			})
        
			.when('/contact', {
				templateUrl : 'views/contact.html',
				controller  : 'contactController'
			})
      
			.when('/cart', {
				templateUrl : 'views/cart.html',
				controller  : 'cartController'
			})
        
			.when('/product', {
				templateUrl : 'views/product.html',
				controller  : 'productController'
			})
      
			.when('/shopping', {
				templateUrl : 'views/shopping.html',
				controller  : 'shoppingController'
      })
      .otherwise({redirectTo:'/'});
	});
  app.factory('JsonDataService', function($http) {
    return {
      Products: function() {
          return $http.get("https://webmppcapstone.blob.core.windows.net/data/itemsdata.json").then(function(response) {
              return response.data;
            });
          }
      }
  });

	app.controller('mainController',function($scope, $rootScope, JsonDataService) {
     if (!$rootScope.cart)  {$rootScope.cart = [];};
    
      $scope.prod = [];
      $scope.currentSlide = 2;
      $scope.toggle = false;
      $scope.maxSlide = 4;
      $scope.alreadyincart='';
      JsonDataService.Products().then(function(data){
        $rootScope.data = data;
       
          let count = 0;
          while (count < 10) {
            let dataRandom = $rootScope.data[Math.floor(Math.random()*$rootScope.data.length)];
            let subRandom = dataRandom.subcategories[Math.floor(Math.random()*dataRandom.subcategories.length)];
            let itemRandom = subRandom.items[Math.floor(Math.random()*subRandom.items.length)];
            
            if ((itemRandom !== undefined) && (!$scope.prod.includes(itemRandom))) {
              $scope.prod.push(itemRandom);
              count++;
            }  
 
          }
      
        $scope.getCartLength = function() {
            if ($rootScope.cart) {
                if($rootScope.cart.length==0) {
                       return '0 products';
                } else if ($rootScope.cart.length==1) {
                    return '1 product';
                } else {
                  return $rootScope.cart.length + ' products';
                }
            } else {
              return '0 products';
            }
          }
      $scope.ChangeSlide = function(isRight) {
        if (isRight) {
          $('#slide' + $scope.currentSlide).transition('fade right');
          if ($scope.currentSlide >= $scope.maxSlide) {
            $scope.currentSlide = 1;
          }
          else {
            $scope.currentSlide++;
          }
          $('#slide' + $scope.currentSlide).transition('fade right');
        }
        else {
          $('#slide' + $scope.currentSlide).transition('fade left');
          if ($scope.currentSlide <= 1) {
            $scope.currentSlide = $scope.maxSlide;
          }
          else {
            $scope.currentSlide--;
          }
          $('#slide' + $scope.currentSlide).transition('fade left');
        }
      }
      
      $scope.AutoSlide = function() {
        if ($scope.toggle) {
          $scope.auto = setInterval(function(){ 
            $('#slide' + $scope.currentSlide).transition('fade right');
            if ($scope.currentSlide >= $scope.maxSlide) {
              $scope.currentSlide = 1;
            }
            else {
              $scope.currentSlide++;
            }
            $('#slide' + $scope.currentSlide).transition('fade right');
          }, 2000);
        }
        else {
          clearInterval($scope.auto);
        }
      }
    });
  });
	app.controller('aboutController', function($scope, $rootScope) {

	});

	app.controller('contactController', function($scope, $rootScope) {
    $scope.ValidSubmit=false;
    
    $scope.submitForm = function(isValid) {

      if (isValid) {
          $scope.ValidSubmit=true;
      }
  
    };
      
	});

	app.controller('cartController', function($scope, $rootScope) {
      $scope.qty = [];

      $scope.submitCheckoutForm = function(isValid) {

        if (isValid) {
            $scope.checkoutcomplete=true;
            $rootScope.cart=[];
        }
    
      };
  
      $scope.getTotal = function() {
        let sub = 0;
        if ($rootScope.cart) {
          for (i = 0; i < $rootScope.cart.length; i++) {
            sub += $rootScope.cart[i].price * $rootScope.cart[i].qty;
          }
          if($rootScope.cart.length>0 ) {
            $scope.ItemsInCart=true;
          } else {
            $scope.ItemsInCart=false;
          }
        } else {
          $scope.ItemsInCart=false;
        }
        return sub.toFixed(2);
      }
      
      $scope.Remove = function(index) {
        $rootScope.cart.splice(index, 1);
      }
      
 
    
      
	});

	app.controller('productController', function($scope, $rootScope, $location) {
      
      $scope.currProduct;
      $scope.qty;
      
      $scope.GetProduct = function() {
        for (i in $rootScope.data) {
          for (j in $rootScope.data[i].subcategories) {
            for (k in $rootScope.data[i].subcategories[j].items) {
              if ($location.search().name == $rootScope.data[i].subcategories[j].items[k].name) {
                $scope.currProduct = $rootScope.data[i].subcategories[j].items[k];
               return;
              }
            }
          }
        }
      }
      
      $scope.Add = function() {
        if (!$rootScope.cart.includes($scope.currProduct)){
        $scope.currProduct.qty = $scope.qty;
        $rootScope.cart.push($scope.currProduct);
      } else {
        $scope.alreadyincart='This product is already in your cart!';
      }
    }
      
	})

	app.controller('shoppingController', function($scope, $rootScope, $route) {

      $scope.orderedlist = [];
      $scope.ordercatname;
      $scope.ordercatlength;
      $scope.stockCheck = false;
   
      let firstdata = $rootScope.data[0].subcategories[0];
      $scope.ordercatname = firstdata.name;
      $scope.orderedlist = firstdata.items;
      $scope.ordercatlength = firstdata.items.length;
      
      $scope.RunJ = function() {
          $('.ui.accordion').accordion('refresh');
          $('.ui.dropdown').dropdown();
      }
      
      $scope.selectItem = function(item) {
        $scope.orderedlist = item.items;
        $scope.ordercatname = item.name;
        $scope.ordercatlength = item.items.length;
      }
      
      $scope.FilterFunction = function(item) {
        if (item.stock > 0 || !$scope.stockCheck) {
          return true;
        }
        return false;
      }
      
      $scope.Sort = function(orderby) {

        if (orderby == 'p') {
          $scope.orderedlist.sort(function(a, b) {
              return a.price > b.price;
          });
        }
        if (orderby == 'abc') {
          $scope.orderedlist.sort(function(a, b) {
              return a.name > b.name;
          });
        }
        if (orderby == 'rat') {
          $scope.orderedlist.sort(function(a, b) {
              return a.rating < b.rating;
          });
        }
      }
      
      $scope.AddCart = function(item) {
        if (!$rootScope.cart.includes(item)){
          item.qty = 1;
          $rootScope.cart.push(item);
        } else {
          $scope.alreadyincart='This product is already in your cart!';
        }
  
      }
      
      $scope.Go = function (path) {
        $location.path(path);
      };
      

  });



  
  