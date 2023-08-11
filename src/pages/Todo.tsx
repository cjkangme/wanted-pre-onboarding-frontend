import React, { useState, useEffect } from "react";
import axios from "axios";

interface TodoElement {
  id: number;
  todo: string;
  snapshot: string;
  isCompleted: boolean;
  userId: number;
  isEditing: boolean;
}

const BASE_URL = "https://www.pre-onboarding-selection-task.shop";
const TOKEN = localStorage.getItem("token")!; // PrivateRouter를 통해 체킹하기 때문에 확정 할당 어센션 사용

const Todo = () => {
  const [todoText, setTodoText] = useState("");
  const [todoList, setTodoList] = useState([] as TodoElement[]);

  useEffect(() => {
    const getTodos = async () => {
      const response = await axios.get(`${BASE_URL}/todos`, {
        headers: {
          Authorization: TOKEN,
        },
      });
      // forEach 사용하면 반환값이 없어 에러 발생
      const todoElements: TodoElement[] = response.data.map(
        (todoElement: any) => responseToTodoElement(todoElement)
      );

      setTodoList(todoElements);
    };

    getTodos();
  }, []);

  const responseToTodoElement = (data: any): TodoElement => {
    return {
      id: data.id,
      todo: data.todo,
      snapshot: data.todo,
      isCompleted: data.isCompleted,
      userId: data.userId,
      isEditing: false,
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

  const updateTodos = async (
    id: number,
    todo: string,
    isCompleted: boolean
  ): Promise<TodoElement> => {
    const response = await axios.put(
      `${BASE_URL}/todos/${id}`,
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

  // todoList의 isEditing을 토글하는 함수
  const toggleIsEditing = (idx: number) => {
    const newTodoList = todoList;
    newTodoList[idx].isEditing = !newTodoList[idx].isEditing;
    setTodoList([...newTodoList]);
  };

  // 생성할 Todo의 text input을 변경할 때 변경을 처리하는 함수
  const handleTodoTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTodoText(event.target.value);
  };

  // Todo 추가 버튼을 클릭할 때 서버에 반영하고 화면 요소에 추가하는 함수
  const handleClickAddButton = async () => {
    const newTodo = await createTodos(todoText);
    setTodoList([...todoList, newTodo]);
  };

  // Todo 내용을 수정했을 때 수정 내용을 서버에 반환하고 수정 불가 상태로 되돌리는 함수
  const handleClickUpdateButton = (event: React.MouseEvent<HTMLElement>) => {
    const previousSibling = event.currentTarget.previousElementSibling!;

    if (previousSibling instanceof HTMLElement && previousSibling.dataset.idx) {
      const todoElement = todoList[parseInt(previousSibling.dataset.idx)];

      updateTodos(todoElement.id, todoElement.todo, todoElement.isCompleted);
      toggleIsEditing(parseInt(previousSibling.dataset.idx));
    }
  };

  // Todo 내용 수정 취소 버튼을 클릭했을 때, 원래대로 되돌리는 함수
  const handleClickCancleButton = (event: React.MouseEvent<HTMLElement>) => {
    const idx = event.currentTarget.dataset.idx;
    if (idx === undefined) {
      return;
    }
    const newTodoList = todoList;
    newTodoList[parseInt(idx)].todo = newTodoList[parseInt(idx)].snapshot;
    setTodoList([...newTodoList]);
    toggleIsEditing(parseInt(event.currentTarget.dataset.idx!));
  };

  // TodoList의 삭제 버튼을 눌렀을 때 해당 요소를 삭제하고 서버에 반영하는 함수
  const handleClickDeleteButton = (event: React.MouseEvent<HTMLElement>) => {
    const newTodoList = todoList;
    const idx = parseInt(event.currentTarget.dataset.idx!);
    console.log(idx);
    deleteTodos(newTodoList[idx].id);
    newTodoList.splice(idx, 1);

    setTodoList([...newTodoList]);
  };

  // Todo 수정 버튼을 눌렀을 때 isEditing 함수로 바꿔주는 함수
  const handelClickEditButton = (event: React.MouseEvent<HTMLElement>) => {
    toggleIsEditing(parseInt(event.currentTarget.dataset.idx!));
  };

  // TodoList의 체크박스를 클릭할 때 서버에 반영하는 함수
  const handleChangeCheckbox = (event: React.ChangeEvent<HTMLInputElement>) => {
    const todoElment =
      todoList[parseInt(event.target.parentElement!.dataset.idx!)];
    updateTodos(todoElment.id, todoElment.todo, event.target.checked);
  };

  const handleEditTodoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newTodoList = todoList;
    newTodoList[parseInt(event.target.parentElement!.dataset.idx!)].todo =
      event.target.value;

    setTodoList([...newTodoList]);
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

      <ul>
        {todoList.map((todoElement, idx) => {
          if (todoElement.isEditing === true) {
            return (
              <li key={idx}>
                <label data-idx={idx}>
                  <input type="checkbox" onChange={handleChangeCheckbox} />
                  <input
                    type="text"
                    value={todoElement.todo}
                    onChange={handleEditTodoChange}
                  />
                </label>
                <button onClick={handleClickUpdateButton}>제출</button>
                <button onClick={handleClickCancleButton} data-idx={idx}>
                  취소
                </button>
              </li>
            );
          } else {
            return (
              <li key={idx}>
                <label data-idx={idx}>
                  <input type="checkbox" onChange={handleChangeCheckbox} />
                  <span>{todoElement.todo}</span>
                </label>
                <button
                  data-testid="modify-button"
                  onClick={handelClickEditButton}
                  data-idx={idx}
                >
                  수정
                </button>
                <button
                  data-testid="delete-button"
                  onClick={handleClickDeleteButton}
                  data-idx={idx}
                >
                  삭제
                </button>
              </li>
            );
          }
        })}
      </ul>
    </div>
  );
};

export default Todo;
