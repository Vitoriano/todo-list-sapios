
app.config(function($routeProvider, $locationProvider) {
  $routeProvider.when('/', {
    templateUrl: 'view/index.html',
    controller: 'ListController',
    resolve: {
      // delay: function($q, $timeout) {
      //   var delay = $q.defer();
      //   $timeout(delay.resolve, 1000);
      //   return delay.promise;
      // }
    }
  }).when('/task', {
    templateUrl: 'view/task.html',
    controller: 'BookController'
  }).when('/list/new/', {
    templateUrl: 'view/list/new.html',
    controller: 'ListController'
  }).otherwise({redirectTo: '/'})

  // isto evita o uso do "#" nas rotas pelo padrão 5 do html. As rotas são clear (mais limpas e estilizadas)
  $locationProvider.html5Mode(true);
});
