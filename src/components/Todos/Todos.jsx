import "./Todos.css";
import { useEffect, useState } from "react";
import Todo from "./Todo/Todo";
import dayjs from "dayjs";
import { createTodo, getTodo } from "../../api/api";

const Todos = () => {
  /**
   * @callback ReferenceStateSetter
   * @param {ReferenceState} state
   * @returns {void}
   */
  const [
    /**@type {ReferenceState} */
    nameVal,
    /**@type {ReferenceStateSetter} */
    setNameVal,
  ] = useState("");

  const [descriptionVal, setDescriptionVal] = useState("");

  const [todos, setTodos] = useState([]);

  const [inputDate, setInputDate] = useState(
    dayjs(Date.now()).format("YYYY-MM-DD")
  );
  const [file, setFile] = useState("");
  const [errName, setErrName] = useState(false);
  useEffect(() => {
    getTodo(setTodos);
  }, []);

  const todosView = todos.map((el) => {
    return (
      <Todo
        id={el.id}
        name={el.name}
        description={el.description}
        checked={el.checked}
        key={el.id}
        date={el.date}
        file={el.fileName}
      />
    );
  });
  return (
    <div className="app" lang="en">
      <div className="inputs">
        <input
          placeholder="Title"
          className="inName"
          value={nameVal}
          onChange={(e) => setNameVal(e.target.value)}
        />
        {errName && <span className="errMessage">Required field</span>}

        <textarea
          placeholder="Description"
          className="inDes"
          value={descriptionVal}
          onChange={(e) => setDescriptionVal(e.target.value)}
        />
        <input
          className="datepicker"
          type="date"
          value={inputDate}
          min={dayjs().format("YYYY-MM-DD")}
          onChange={(e) => setInputDate(e.target.value)}
        />
        <div className="filepicker">
          <div>
            You can upload files with the extension <b>.txt, all images</b>
          </div>
          <input
            type="file"
            accept="image/*,.txt"
            onChange={(e) => setFile(e?.target?.files[0])}
          />
        </div>
        <button
          className="buttonCreate"
          type="submit"
          onClick={() => {
            if (nameVal) {
              setErrName(false);
              createTodo(nameVal, descriptionVal, false, inputDate, file);
              setNameVal("");
              setDescriptionVal("");
              setFile("");
            } else setErrName(true);
          }}
        >
          Create
        </button>
        {/* {errName && <span className="errMessage">Required field</span>} */}
      </div>
      <div className="todosView">{todosView}</div>
    </div>
  );
};

export default Todos;
