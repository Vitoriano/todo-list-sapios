 
// controler root (padrão)
app.controller('RootController', function($scope, $http, $route, $routeParams, $location) {
    
    
});


// controler de lista.
app.controller('ListController', function($scope, $location, $routeParams, $http) {

    $scope.name = []
    $scope.lists = [];
    $scope.tasks = []

    $http.get(API_URL+ 'list/').then(( response ) => {
        console.log(response);
        $scope.lists = response.data
    }).catch(() => {
        console.log('não foi possivel criar.');
    });

    $scope.handleTask = (id) => {
        if(id) 
            console.log(id);

        $http.get(API_URL +'task/'+ id).then(( response ) => {
            console.log(response);
            $scope.tasks = response.data
        }).catch(() => {
            console.log('não foi possivel criar.');
        });
    }

    $scope.createList = () => {
        $http.post(API_URL+ 'list/new', {name: $scope.name}).then(() => {
            $location.path('/');
        }).catch(() => {
            console.log('não foi possivel criar.');
        });
    }
});

// Controler de tarefas 
app.controller('TaskController', function($scope, $routeParams) {
    $scope.name = 'TaskController';
    $scope.params = $routeParams;
});
