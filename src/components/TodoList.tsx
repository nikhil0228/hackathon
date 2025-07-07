
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, Check, CheckSquare, Square } from "lucide-react";
import ActionButton from "./ActionButton";
import ModuleInfoTooltip from "./ModuleInfoTooltip";

interface Todo {
  id: number;
  text: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
}

const TodoList = () => {
  const [todos, setTodos] = useState<Todo[]>([
    { id: 1, text: "Review ServiceNow tickets", completed: false, priority: 'high' },
    { id: 2, text: "Respond to urgent emails", completed: true, priority: 'high' },
    { id: 3, text: "Update GitLab issue status", completed: false, priority: 'medium' },
    { id: 4, text: "Prepare for 3 PM meeting", completed: false, priority: 'medium' },
    { id: 5, text: "Review project documentation", completed: false, priority: 'low' },
  ]);
  const [newTodo, setNewTodo] = useState("");

  const addTodo = () => {
    if (newTodo.trim()) {
      const todo: Todo = {
        id: Date.now(),
        text: newTodo.trim(),
        completed: false,
        priority: 'medium'
      };
      setTodos([todo, ...todos]);
      setNewTodo("");
    }
  };

  const toggleTodo = (id: number) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const deleteTodo = (id: number) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const markAllComplete = () => {
    setTodos(todos.map(todo => ({ ...todo, completed: true })));
  };

  const clearCompleted = () => {
    setTodos(todos.filter(todo => !todo.completed));
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  const quickActions = [
    "Add Task: Create new todo items",
    "Mark Complete: Toggle task completion status",
    "Delete Task: Remove tasks from the list"
  ];

  return (
    <Card className="h-full border-red-100">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-ubs-red flex items-center gap-2">
            <CheckSquare className="h-5 w-5" />
            Todo List
          </CardTitle>
          <div className="flex items-center gap-2">
            <ActionButton icon={Check} label="Mark All Complete" onClick={markAllComplete} />
            <ActionButton icon={Trash2} label="Clear Completed" onClick={clearCompleted} />
            <ModuleInfoTooltip title="Todo List" quickActions={quickActions} />
          </div>
        </div>
      </CardHeader>
      <CardContent className="h-[calc(100%-5rem)] overflow-hidden">
        <div className="space-y-4 h-full">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Add a new task..."
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addTodo()}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-ubs-red focus:border-transparent"
            />
            <Button 
              onClick={addTodo}
              className="bg-ubs-red hover:bg-ubs-red-dark"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="overflow-y-auto h-full space-y-2">
            {todos.map((todo) => (
              <div key={todo.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <button
                  onClick={() => toggleTodo(todo.id)}
                  className="flex-shrink-0"
                >
                  {todo.completed ? (
                    <CheckSquare className="h-5 w-5 text-ubs-red" />
                  ) : (
                    <Square className="h-5 w-5 text-gray-400" />
                  )}
                </button>
                
                <div className="flex-1 min-w-0">
                  <span className={`text-sm ${todo.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                    {todo.text}
                  </span>
                  <div className={`text-xs ${getPriorityColor(todo.priority)} capitalize`}>
                    {todo.priority} priority
                  </div>
                </div>
                
                <button
                  onClick={() => deleteTodo(todo.id)}
                  className="flex-shrink-0 text-gray-400 hover:text-red-500 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TodoList;
