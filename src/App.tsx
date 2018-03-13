import * as React from "react";
import "./App.css";

interface Props {}

interface State {
	items: TodoItem[];
	value: string;
	showArchive: boolean;
}

class App extends React.Component<Props, State> {
	state: State = {
		items: [],
		value: "",
		showArchive: false,
	};

	handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		this.setState({ value: event.target.value });
	};

	handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		this.setState(prevState => {
			if (prevState.value === "") {
				return null;
			}
			return {
				items: prevState.items.concat({ value: prevState.value, status: "WIP" }),
				value: "",
			};
		});
	};

	removeItem = (index: number, status?: TodoStatus) => {
		const newItem = Object.assign({}, this.state.items[index], { status });
		const items = this.state.items.slice();
		items.splice(index, 1, newItem);
		this.setState({ items });
	};

	archiveDone = () => {
		this.setState(prevState => {
			const items = prevState.items.map(
				item => (item.status === "done" ? Object.assign({}, item, { status: "archived" }) : item)
			);
			return { items };
		});
	};

	toggleArchive = () => {
		this.setState(prevState => {
			return { showArchive: !prevState.showArchive };
		});
	};

	render() {
		let items = this.state.items;
		if (!this.state.showArchive) {
			items = this.state.items.filter(item => item.status !== "archived");
		}
		return (
			<div className="app">
				<div className="app-content">
					<h1>React Todo List</h1>
					<form className="form" onSubmit={this.handleSubmit}>
						<label className="label" htmlFor="add-item">
							Add item
						</label>
						<input
							className="input"
							id="add-item"
							onChange={this.handleChange}
							type="text"
							value={this.state.value}
						/>
						<button className="button button-submit" type="submit">
							Add
						</button>
					</form>
					<h2>Todos</h2>
					<TodoList items={items} updateStatus={this.removeItem} />
					<button className="button" onClick={this.archiveDone}>
						Archive completed
					</button>
					<button className="button" onClick={this.toggleArchive}>
						{this.state.showArchive ? "Hide" : "Show"} archived
					</button>
				</div>
			</div>
		);
	}
}

type TodoStatus = "WIP" | "done" | "archived";
const nextStatus: { [K in TodoStatus]: TodoStatus } = {
	WIP: "done",
	done: "WIP",
	archived: "WIP",
};

interface TodoItem {
	value: string;
	status: TodoStatus;
}

interface TodoListProps {
	items: TodoItem[];
	updateStatus: (index: number, status: TodoStatus) => void;
}

function TodoList(props: TodoListProps) {
	if (props.items.length === 0) {
		return <p>No items</p>;
	}
	return (
		<ul className="todo-list">
			{props.items.map((item, index) => (
				<li className="todo-list-item" key={index}>
					<span className={item.status}>{item.value}</span>
					<button
						className="button todo-list-remove-button"
						onClick={() => props.updateStatus(index, nextStatus[item.status])}
					>
						{nextStatus[item.status]}
					</button>
				</li>
			))}
		</ul>
	);
}

export default App;
