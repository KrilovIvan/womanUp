import React, { useState } from "react";
import ModalWindow from "./ModalWindow/ModalWindow";
import "./Todo.css";
import { deleteTodo, download, updateChecked } from "../../../api/api";
import dayjs from "dayjs";
/**
 * @param {string} id индивидуальный идентификатор задачи
 * @param {string} name название задачи в виде строки
 * @param {boolean} checked флаг выполненной задачи, true-выполнена, false-не завершена
 * @param {string} description описание задачи
 * @param {string} date дата завершения задачи вида "YYYY-MM-DD"
 * @param {string} file название файла, который прикрепляем к задаче
 * @return {JSX.Element}
 * @description Компонент одной задачи, возвращает JSX разметку и модальное окно изменения задачи
 */
const Todo = ({ id, name, checked, description, date, file }) => {
  const [openModal, setOpenModal] = useState(false);
  const [isChecked, setChecked] = useState(checked);
  const [downloadLink, setDownloadLink] = useState("");
  const [isOpenLink, setIsOpenLink] = useState(false);
  return (
    <div className="todo">
      <div className="content-contaner">
        <div
          className="todo-title"
          style={
            isChecked
              ? { textDecoration: "line-through" }
              : { textDecoration: "none" }
          }
          key={id}
        >
          {name}
        </div>
        <div className="todo-description">{description}</div>
      </div>
      <div className="btnNdate">
        <div className="btnContaner">
          <button
            className="btn btn--delete"
            onClick={() => {
              deleteTodo(id, file);
            }}
          >
            Delete
          </button>
          <button
            className="btn btn--edit"
            onClick={() => {
              setOpenModal(true);
            }}
          >
            Edit
          </button>

          {file && (
            <button
              className="btn btn--download"
              onClick={() => {
                (async () => {
                  let ff = await download(id);
                  setDownloadLink(ff);
                })();
                setIsOpenLink((prev) => !prev);
              }}
            >
              Download File
            </button>
          )}
          {isOpenLink && <a href={downloadLink}>{file}</a>}
          <input
            className="checkbox"
            type="checkbox"
            checked={isChecked}
            onChange={() => {
              setChecked(!isChecked);
              updateChecked(id, !isChecked);
            }}
          />
        </div>
        <span className="date">
          {dayjs().format("YYYY-MM-DD") < dayjs(date).format("YYYY-MM-DD") ? (
            `Completion date: ${date}`
          ) : dayjs().format("YYYY-MM-DD") ===
            dayjs(date).format("YYYY-MM-DD") ? (
            <span style={{ color: "red" }}>The last day</span>
          ) : (
            <span style={{ color: "red" }}>The task is overdue</span>
          )}
        </span>
      </div>
      {openModal && (
        <ModalWindow
          id={id}
          name={name}
          checked={checked}
          description={description}
          setOpenModal={setOpenModal}
          date={date}
          file={file}
        />
      )}
    </div>
  );
};

export default Todo;
