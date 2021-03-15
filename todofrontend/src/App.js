import "./App.css";

import React, { Component } from "react";

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      todoList: [],
      todo: {
        id: null,
        title: "",
        uncompleted: true,
      },
      editing: false,
    };
    this.fetchtodo = this.fetchtodo.bind(this);
  }
  componentDidMount() {
    this.fetchtodo();
  }

  changehandler = (e) => {
    this.setState({
      todo: {
        ...this.state.todo,
        title: e.target.value,
      },
    });
  };

  submithandler = (e) => {
    let csrftoken = this.getCookie("csrftoken");
    e.preventDefault();

    let url = "https://todoapp-live.herokuapp.com/api/todo-create/";
    if (this.state.editing === true) {
      url = `https://todoapp-live.herokuapp.com/api/todo-update/${this.state.todo.id}/`;
      this.setState({
        editing: false,
      });
    }
    fetch(url, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
        "X-CSRFToken": csrftoken,
      },
      body: JSON.stringify(this.state.todo),
    })
      .then((res) => {
        this.fetchtodo();
        this.setState({
          todo: {
            id: null,
            title: "",
            uncompleted: true,
          },
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== "") {
      const cookies = document.cookie.split(";");
      for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        // Does this cookie string begin with the name we want?
        if (cookie.substring(0, name.length + 1) === name + "=") {
          cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
          break;
        }
      }
    }
    return cookieValue;
  }

  fetchtodo() {
    fetch("https://todoapp-live.herokuapp.com/api/todo-list/")
      .then((response) => response.json())
      .then((data) => {
        this.setState({
          todoList: data,
        });
      });
  }
  completehandler = (todo) => {
    todo.uncompleted = !todo.uncompleted;
    let csrftoken = this.getCookie("csrftoken");
    fetch(`https://todoapp-live.herokuapp.com/api/todo-update/${todo.id}/`, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
        "X-CSRFToken": csrftoken,
      },
      body: JSON.stringify(todo),
    })
      .then((res) => this.fetchtodo())
      .catch((err) => console.log(err));
  };

  edithandler(todo) {
    this.setState({
      todo: todo,
      editing: true,
    });
  }
  deletehandler(todo) {
    var csrftoken = this.getCookie("csrftoken");
    fetch(`https://todoapp-live.herokuapp.com/api/todo-delete/${todo.id}/`, {
      method: "DELETE",
      headers: { "Content-type": "application/json", "X-CSRFToken": csrftoken },
      body: JSON.stringify(this.state.todo),
    })
      .then((res) => {
        this.fetchtodo();
      })
      .catch((er) => console.log(er));
  }

  render() {
    let todos = this.state.todoList;
    return (
      <div className="container">
        <div id="task-container">
          <div id="form-wrapper">
            <form onSubmit={this.submithandler} id="form">
              <div className="flex-wrapper">
                <div style={{ flex: 6 }}>
                  <input
                    onChange={this.changehandler}
                    id="title"
                    value={this.state.todo.title}
                    className="form-control"
                    placeholder="Title"
                    name="title"
                    type="text"
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <input
                    id="submit"
                    className="btn btn-warning"
                    name="add"
                    type="submit"
                  />
                </div>
              </div>
            </form>
          </div>
          <div id={"list-wrapper"}>
            {todos.map((todo) => {
              return (
                <div key={todo.id} className="task-wrapper flex-wrapper">
                  <div
                    onClick={() => this.completehandler(todo)}
                    style={{ flex: 7 }}
                  >
                    {todo.uncompleted ? (
                      <strike>{todo.title}</strike>
                    ) : (
                      <span>{todo.title}</span>
                    )}
                  </div>
                  <div style={{ flex: 1 }}>
                    <button
                      onClick={() => this.edithandler(todo)}
                      className="btn btn-sm btn-outline-info"
                    >
                      Edit
                    </button>
                  </div>
                  <div style={{ flex: 1 }}>
                    <button
                      onClick={() => {
                        this.deletehandler(todo);
                      }}
                      className="btn btn-sm btn-outline-dark delete"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }
}

export default App;
