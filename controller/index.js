
// controler root (padrão)
app.controller('RootController', function ($scope, $http, $route, $routeParams, $location, $rootScope) {
    $scope.$on("rootBroadcast", function (evt, data) {
        $location.path('/');
        setTimeout(function () {
            $scope.$broadcast("listBroadcast", data);
        }, 50);
    });
});

// controler de lista.
app.controller('ListController', function ($scope, $location, $routeParams, $http, $rootScope) {

    $scope.name = [];
    $scope.lists = [];
    $scope.tasks = [];

    $scope.list_id = 0;
    $scope.messeger = "";


    $scope.loadInit = () => {
        $http.get(API_URL + 'list/').then((response) => {
            $scope.lists = response.data
        }).catch(() => {
            console.log('não foi possivel criar.');
        });
    }

    $scope.handleList = () => {

            $scope.list_id = $routeParams.id;

            $http.get(API_URL + 'list/' + $routeParams.id).then((response) => {
                $scope.name = response.data.name
            }).catch(() => {
                console.log('não foi possivel criar.');
            });
    }


    $scope.handleTask = (id) => {
        if (id)
            $scope.list_id = id;

            $http.get(API_URL + 'task/list/' + id).then((response) => {
                $scope.tasks = response.data
            }).catch(() => {
                console.log('não foi possivel criar.');
            });
    }

    $scope.$on("listBroadcast", function (evt, data) {
        $scope.handleTask(data);
    });

    $scope.handleAdd = () => {
        $http.post(API_URL + 'list/new', { name: $scope.name }).then(() => {
            $location.path('/');
        }).catch(() => {
            console.log('não foi possivel criar.');
        });
    }

    $scope.handleUpdate = () => {
        $http.put(API_URL + 'list/edit', { name: $scope.name, id: $scope.list_id }).then(() => {
            $location.path('/');
        }).catch(() => {
            console.log('não foi possivel atualizar.');
        });
    }

    $scope.handleDelete = (id) => {
        if (id)
            $http.delete(API_URL + 'list/delete/' + id).then(() => {
                $location.path('/');
                $scope.loadInit();
            }).catch(() => {
                console.log('não foi possivel deletar.');
            });
    }

    $scope.handleDeleteTask = (id) => {
        if (id)
            $http.delete(API_URL + 'task/delete/' + id).then(() => {
                $scope.handleTask($scope.list_id);
            }).catch(() => {
                console.log('não foi possivel criar.');
            });
    }

    $scope.handleStatus = (id) => {

        let task = $scope.tasks.filter((value) => value.id == id)

        if (task[0].is_done) {
            $location.path('/task/change/status/password/' + id);
        } else if (task[0].is_done == 0) {
            $http.put(API_URL + 'task/edit/' + id, { is_done: true }).then((response) => {
                $scope.handleTask($scope.list_id);
            }).catch((error) => {
                console.log('não foi possivel criar.');
            });
        }
    }

    $scope.handleUpdateStatus = () => {
        let task_id = $routeParams.id
        $http.post(API_URL + 'task/status/change', { id: task_id, password: $scope.password }).then(( response ) => {
            $rootScope.$broadcast("rootBroadcast", response.data.list_id);
        }).catch((error) => {
            $scope.messeger = error.data.message;
        });
    }
});


// Controler de tarefas 
app.controller('TaskController', function ($scope, $http, $routeParams, $location, $rootScope) {

    $scope.model = {};

    $scope.loadInit = () => {
        $http.get(API_URL + 'task/' + $routeParams.id).then((response) => {
            $scope.model = response.data
        }).catch(() => {
            console.log('não foi possivel criar.');
        });
    }

    $scope.handleAdd = () => {

        $http.get(API_URL_MAILBOX + serializeObject({
            access_key: MAILBOX_KEY,
            email: $scope.model.email,
            smtp: 1,
            format: 1
        }).join('&')).then((response) => {
            if (response.data.smtp_check) {
                $http.post(API_URL + 'task/new', { list_id: $routeParams.id, ...$scope.model }).then((response) => {
                    $rootScope.$broadcast("rootBroadcast", $routeParams.id);
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
            access_key: MAILBOX_KEY,
            email: $scope.model.email,
            smtp: 1,
            format: 1
        }).join('&')).then((response) => {
            if (response.data.smtp_check) {
                $http.put(API_URL + 'task/edit/' + $routeParams.id, { task_id: $routeParams.id, ...$scope.model }).then((response) => {
                    $rootScope.$broadcast("rootBroadcast", $scope.model.list_id);
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
