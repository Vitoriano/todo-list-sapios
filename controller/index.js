 
// controler root (padrão)
app.controller('RootController', function($scope, $http, $route, $routeParams, $location, $rootScope) {
    
    $scope.$on("activeRoot", function(evt,data){ 
        $location.path('/');
        setTimeout(function(){
         $scope.$broadcast("activeList", data);
        }, 50);
    });
});



// controler de lista.
app.controller('ListController', function($scope, $location, $routeParams, $http, $rootScope) {

    $scope.name = [];
    $scope.lists = [];
    $scope.tasks = [];

    $scope.list_id = 0;

    $scope.loadInit = () => {
        $http.get(API_URL+ 'list/').then(( response ) => {
            console.log(response);
            $scope.lists = response.data
        }).catch(() => {
            console.log('não foi possivel criar.');
        });
    }

    $scope.handleTask = (id) => {
        if(id)
        // guardando o id da lista selecionada
        $scope.list_id = id;
        $http.get(API_URL +'task/list/'+ id).then(( response ) => {
            console.log(response);
            $scope.tasks = response.data
        }).catch(() => {
            console.log('não foi possivel criar.');
        });
    }

    $scope.handleAdd = () => {
        $http.post(API_URL+ 'list/new', {name: $scope.name}).then(() => {
            $location.path('/');
        }).catch(() => {
            console.log('não foi possivel criar.');
        });
    }

    $scope.$on("activeList", function(evt,data){ 
        $scope.handleTask(data);
    });

    $scope.handleDeleteTask = (id) => {
        if(id)
        $http.delete(API_URL+ 'task/delete/' + id).then(() => {
            $scope.handleTask($scope.list_id);
        }).catch(() => {
            console.log('não foi possivel criar.');
        });
    }

    $scope.$on("activeList", function(evt,data){ 
        $scope.handleTask(data);
    });

});


// Controler de tarefas 
app.controller('TaskController', function($scope, $http, $routeParams, $location,  $rootScope) {
   
    $scope.model = {};

    $scope.loadInit = () => {
        $http.get(API_URL+ 'task/' +  $routeParams.id ).then(( response ) => {
            console.log(response);
            $scope.model = response.data
        }).catch(() => {
            console.log('não foi possivel criar.');
        });
    }

    $scope.handleAdd = () => {

        $http.get(API_URL_MAILBOX + serializeObject({
            access_key:MAILBOX_KEY ,
            email: $scope.model.email,
            smtp: 1,
            format: 1
        }).join('&')).then(( response ) => {

            console.log(response);

            if(response.data.smtp_check){
                $http.post(API_URL+ 'task/new', {list_id:$routeParams.id, ...$scope.model}).then(( response ) => {
                     // criando uma evento
                     $rootScope.$broadcast("activeRoot", $routeParams.id);
                }).catch(() => {
                    console.log('não foi possivel criar.');
                });
            } else {
               $scope.model.email_invalid = response.data.did_you_mean; 
            }
        }).catch(() => {
            console.log('não foi possivel criar.');
        });
    }

    $scope.handleEdit = () => {

        $http.get(API_URL_MAILBOX + serializeObject({
            access_key:MAILBOX_KEY ,
            email: $scope.model.email,
            smtp: 1,
            format: 1
        }).join('&')).then(( response ) => {

            console.log(response);

            if(response.data.smtp_check){
                $http.put(API_URL+ 'task/edit/' +  $routeParams.id , {task_id: $routeParams.id, ...$scope.model}).then(( response ) => {
                     // criando uma evento
                     $rootScope.$broadcast("activeRoot", $scope.model.list_id);
                }).catch(() => {
                    console.log('não foi possivel criar.');
                });
            } else {
               $scope.model.email_invalid = response.data.did_you_mean; 
            }
        }).catch(() => {
            console.log('não foi possivel criar.');
        });
    }

});

