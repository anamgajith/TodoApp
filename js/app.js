
var todo = function(data){
    this.task = ko.observable(data.task);
    this._id = ko.observable(data._id);
    this.textV = ko.observable('d-flex');
    this.inputV = ko.observable('hide');
    this.isDone = ko.observable(data.isDone);
}

var ViewModel = function(){
    this.load = () => {
        $.getJSON("https://todo-anamgajith.herokuapp.com/api/todos",function(data){
            data.forEach(element => {
                self.todos.push(new todo(element));
            });
        });
     }
    var self = this;
    this.todos = ko.observableArray();
    this.task = ko.observable("");
    this.taskE = ko.observable("");
    self.load();
    this.current = ko.observable(self.todos()[0]);

    this.delete = (item, event) =>{
        var context = ko.contextFor(event.target);
        var index = context.$index();
        var url = 'https://todo-anamgajith.herokuapp.com/api/'+self.todos()[index]._id()+'/delete';
        $.ajax({
            url: url,
            type: 'DELETE',
            success: (result) => {
                self.todos.splice(index,1);
            }
        });
    }

    this.addTodo = () =>{
        $.post('https://todo-anamgajith.herokuapp.com/api/add',{ task: self.task(),isDone: false},(data) => {
            self.todos.push(new todo(data));
            self.task("");
        });

    }


    this.updateStatus = () => {
        var context = ko.contextFor(event.target);
        var index = context.$index();
        self.current(self.todos()[index]);
        var state = self.current().isDone();
        var url = 'https://todo-anamgajith.herokuapp.com/api/'+self.current()._id()+'/update';
        $.ajax({
            url: url,
            type: 'PUT',
            data: {isDone: state},
            success: () => {
                self.current().isDone(state);
            }
        });
        return true;
    }

    this.editMode = (item, event) => {
        var context = ko.contextFor(event.target);
        var index = context.$index();
        self.taskE(self.todos()[index].task());
        self.current(self.todos()[index]);
        self.current().textV('hide');
        self.current().inputV('d-flex');
    }

    this.ExitEditMode = (item, event) => {
        var context = ko.contextFor(event.target);
        var index = context.$index();
        self.current().textV('d-flex');
        self.current().inputV('hide');
        self.taskE("");
    }

    this.updateTask = (item, event) => {
        var url = 'https://todo-anamgajith.herokuapp.com/api/'+self.current()._id()+'/update';
        $.ajax({
            url: url,
            type: 'PUT',
            data: {task: self.taskE()},
            success: () => {
                self.current().task(self.taskE());
                self.current().textV('d-flex');
                self.current().inputV('hide');
                self.taskE("");
            }
        });
    }
}

ko.applyBindings(new ViewModel());