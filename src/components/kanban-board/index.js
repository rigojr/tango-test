import React, { Component } from "react";
import "./index.css";

export default class KanbanBoard extends Component {
  constructor() {
    super();
    // Each task is uniquely identified by its name. 
    // Therefore, when you perform any operation on tasks, make sure you pick tasks by names (primary key) instead of any kind of index or any other attribute.
    this.state = {
      tasks: [
            { name: '1', stage: 0 },
            { name: '2', stage: 0 },
        ],
      inputForm: '',
    };
    this.stagesNames = ['Backlog', 'To Do', 'Ongoing', 'Done'];
  }

  getTaskIndex = (name) => this.state.tasks.findIndex(task => task.name === name);

  addTaskHandler = () => {
    const { inputForm } = this.state;
    const shouldPass = this.getTaskIndex(inputForm);
    if (inputForm !== '' && shouldPass < 0)
      this.setState(prevState => ({
        ...prevState,
        tasks: [...prevState.tasks, {
          name: inputForm,
          stage: 0,
        }],
        inputForm: '',
      }));
  };

  setValue = (e) => {
    e.persist();
    this.setState(prevState => ({
      ...prevState,
      inputForm: e.target.value,
    }));
  };

  positionHandler = (name, ahead) => {
    const { tasks } = this.state;
    const index = this.getTaskIndex(name);
    const newStage = ahead ? tasks[index].stage + 1 : tasks[index].stage - 1;
    const shouldPass = ahead ? newStage < 4 : newStage >= 0;
    if (shouldPass) {
      const tempTask = {
        ...tasks[index],
        stage: newStage,
      };
      const tempTasks = [...tasks.slice(0, index), ...tasks.slice(index + 1), tempTask];
      this.setState(prevState => ({
        ...prevState,
        tasks: tempTasks,
      }));
    }
  };

  deleteHandler = (name) => {
    const { tasks } = this.state;
    const index = this.getTaskIndex(name);
    const tempTasks = [...tasks.slice(0, index), ...tasks.slice(index + 1)];
    this.setState(prevState => ({
      ...prevState,
      tasks: tempTasks,
    }));
  };

  render() {
    const { tasks, inputForm } = this.state;
    let stagesTasks = [];
    for (let i = 0; i < this.stagesNames.length; ++i) {
      stagesTasks.push([]);
    }
    for (let task of tasks) {
      const stageId = task.stage;
      stagesTasks[stageId].push(task);
    }

    return (
      <div className="mt-20 layout-column justify-content-center align-items-center">
        <section className="mt-50 layout-row align-items-center justify-content-center">
          <input
            id="create-task-input"
            type="text"
            className="large"
            placeholder="New task name"
            data-testid="create-task-input"
            value={inputForm}
            onChange={this.setValue}
          />
          <button
            onClick={this.addTaskHandler}
            type="submit"
            className="ml-30"
            data-testid="create-task-button"
          >
            Create task
          </button>
        </section>

        <div className="mt-50 layout-row">
            {stagesTasks.map((tasks, i) => {
                return (
                    <div className="card outlined ml-20 mt-0" key={`${i}`}>
                        <div className="card-text">
                            <h4>{this.stagesNames[i]}</h4>
                            <ul className="styled mt-50" data-testid={`stage-${i}`}>
                                {tasks.map(({name, stage}, index) => {
                                  const formattedName = name.split(' ').join('-');
                                    return <li className="slide-up-fade-in" key={`${i}${index}`}>
                                      <div className="li-content layout-row justify-content-between align-items-center">
                                        <span data-testid={`${formattedName}-name`}>{name}</span>
                                        <div className="icons">
                                          <button
                                            className="icon-only x-small mx-2"
                                            data-testid={`${formattedName}-back`}
                                            onClick={() => this.positionHandler(name, false)}
                                            disabled={stage === 0}
                                          >
                                            <i className="material-icons">arrow_back</i>
                                          </button>
                                          <button
                                            className="icon-only x-small mx-2"
                                            data-testid={`${formattedName}-forward`}
                                            onClick={() => this.positionHandler(name, true)}
                                            disabled={stage === 3}
                                          >
                                            <i className="material-icons">arrow_forward</i>
                                          </button>
                                          <button
                                            className="icon-only danger x-small mx-2"
                                            data-testid={`${formattedName}-delete`}
                                            onClick={() => this.deleteHandler(name)}
                                          >
                                            <i className="material-icons">delete</i>
                                          </button>
                                        </div>
                                      </div>
                                    </li>
                                })}
                            </ul>
                        </div>
                    </div>
                )
            })}
        </div>
      </div>
    );
  }
}