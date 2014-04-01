var app = angular.module("app", ['ngRoute']); //dependences

app.config(function($routeProvider){
   $routeProvider.when('/blog',{
      templateUrl: 'templates/header.html',
      controller: 'BlogController'
   });
   $routeProvider.otherwise({redirectTo: '/blog'});

});

app.controller('BlogController', function($scope){
   $scope.sampleBlog = "Hello world this is some intense stuff going on!";
});