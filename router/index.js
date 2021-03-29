
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
  }).when('/task/new/:id', {
    templateUrl: 'view/task/new.html',
    controller: 'TaskController'
  }).when('/task/edit/:id', {
    templateUrl: 'view/task/edit.html',
    controller: 'TaskController'
  }).when('/task/change/status/password/:id', {
    templateUrl: 'view/cardPassword/index.html',
    controller: 'TaskController'
  }).when('/list/new/', {
    templateUrl: 'view/list/new.html',
    controller: 'ListController'
  }).when('/list/edit/:id', {
    templateUrl: 'view/list/edit.html',
    controller: 'ListController'
  })
  .otherwise({redirectTo: '/'})

  // isto evita o uso do "#" nas rotas pelo padrão 5 do html. As rotas são clear (mais limpas e estilizadas)
  $locationProvider.html5Mode(true);
});
