var app = angular.module('myApp', []);

app.controller('MainController', ['$scope', 'timeout', '$http', function($scope, $timeout, $http){
    $timeout(function(){
        $http.get('json/sazae.json')
            .success(function(data){
                $scope.items = data.list;
            })
            .error(function(err){
                alert('failed');
            });
    });
}]);
