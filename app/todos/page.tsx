import { title } from "@/components/primitives";
import TodosTable from "@/components/todos-table";

async function fetchTodosApiCall() {
	console.log("fetchTodosApiCalled");
	const res = await fetch(`${process.env.BASE_URL}/api/todos/`, { 
		cache: 'no-store' 
	});

	const contentTypeHeaderValue = res.headers.get('Content-Type');
	if (contentTypeHeaderValue?.includes("text/plain") 
		|| contentTypeHeaderValue?.includes("text/html")) {
			console.log('contentTypeHeaderValue: ', contentTypeHeaderValue);
			return null;
	}

	return res.json();
}

export default async function TodosPage() {

	const response = await fetchTodosApiCall();

	const fetchedTodos = response?.data ?? [];

	return (
		<div className="flex flex-col space-y-8">
			<h1 className={title()}>Todos</h1>
			<TodosTable todos={fetchedTodos} />
		</div>
	);
}
