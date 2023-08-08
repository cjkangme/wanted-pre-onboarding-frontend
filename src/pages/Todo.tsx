import React, { useState, useEffect } from "react";
import axios, { AxiosResponse } from "axios";

interface TodoElement {
  id: number;
  todo: string;
  isCompleted: boolean;
  userId: number;
}

const BASE_URL = "https://www.pre-onboarding-selection-task.shop";
const TOKEN = localStorage.getItem("token")!; // PrivateRouter를 통해 체킹하기 때문에 확정 할당 어센션 사용

const Todo = () => {
  const [todoText, setTodoText] = useState("");
  const [todoList, setTodoList] = useState([] as TodoElement[]);

  useEffect(() => {
    getTodos();
  }, []);

  const responseToTodoElement = (data: any): TodoElement => {
    return {
      id: data.id,
      todo: data.todo,
      isCompleted: data.isCompleted,
      userId: data.userId,
    };
  };

  const createTodos = async (todo: string): Promise<TodoElement> => {
    const response = await axios.post(
      `${BASE_URL}/todos`,
      {
        todo,
      },
      {
        headers: {
          Authorization: TOKEN,
        },
      }
    );

    return responseToTodoElement(response.data);
  };

  const getTodos = async () => {
    const response = await axios.get(`${BASE_URL}/todos`, {
      headers: {
        Authorization: TOKEN,
      },
    });
    console.log(response.data);
    // forEach 사용하면 반환값이 없어 에러 발생
    const todoElements: TodoElement[] = response.data.map((todoElement: any) =>
      responseToTodoElement(todoElement)
    );

    setTodoList(todoElements);
  };

  const updateTodos = async (
    todo: string,
    isCompleted: boolean
  ): Promise<TodoElement> => {
    const response = await axios.put(
      `${BASE_URL}/todos`,
      {
        todo,
        isCompleted,
      },
      {
        headers: {
          Authorization: TOKEN,
        },
      }
    );

    return responseToTodoElement(response.data);
  };

  const deleteTodos = async (id: number) => {
    const response = await axios.delete(`${BASE_URL}/todos/${id}`, {
      headers: {
        Authorization: TOKEN,
      },
    });

    if (response.status === 204) {
      console.log("삭제 완료");
    } else {
      console.log("삭제할 요소가 없습니다.");
    }
  };

  const handleTodoTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTodoText(event.target.value);
  };

  const handleClickAddButton = async () => {
    const newTodo = await createTodos(todoText);
    setTodoList([...todoList, newTodo]);
  };

  return (
    <div id="todoContainer">
      <input
        type="text"
        name="text"
        data-testid="new-todo-input"
        value={todoText}
        onChange={handleTodoTextChange}
      />
      <button data-testid="new-todo-add-button" onClick={handleClickAddButton}>
        추가
      </button>
    </div>
  );
};

export default Todo;
