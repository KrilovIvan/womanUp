import React, { useState } from "react";
import { updateTodo, uploadFile } from "../../../../api/api";

import "./ModalWindow.css";

/**
 *  * @param {string} id индивидуальный идентификатор задачи
 * @param {string} name название задачи в виде строки
 * @param {boolean} checked флаг выполненной задачи, true-выполнена, false-не завершена
 * @param {string} description описание задачи
 * @param {string} date дата завершения задачи вида "YYYY-MM-DD"
 * @param {string} file название файла, который прикрепляем к задаче
 * @return {JSX.Element}
 */
const ModalWindow = ({
  id,
  name,
  checked,
  description,
  setOpenModal,
  date,
  file,
}) => {
  const [nameVal, setNameVal] = useState(name);
  const [descriptionVal, setDescriptionVal] = useState(description);
  const [inputDate, setInputDate] = useState(date);
  const [isChangeFile, setIsChangeFile] = useState(false);
  const [fileCh, setFileCh] = useState("");
  const [fileNew, setFileNew] = useState("");
  return (
    <div className="modal">
      <div className="modal-window">
        <div className="modal-content">
          <input
            placeholder="Title"
            className="title-modalInput"
            value={nameVal}
            onChange={(e) => setNameVal(e.target.value)}
          />
          <textarea
            placeholder="Description"
            className="description-modalInput"
            value={descriptionVal}
            onChange={(e) => setDescriptionVal(e.target.value)}
          />
          <input
            className="date-modalInput"
            type="date"
            value={inputDate}
            onChange={(e) => setInputDate(e.target.value)}
          />
          {file ? (
            <div className="changeFile">
              {isChangeFile === true ? (
                <input
                  type="file"
                  accept="image/*,.txt"
                  onChange={(e) => setFileCh(e?.target?.files[0])}
                />
              ) : (
                <>
                  <div className="fileName">{file}</div>
                  <button
                    onClick={() => setIsChangeFile(true)}
                    className="btn-modal btn-modal--changeFile"
                  >
                    Change file
                  </button>
                </>
              )}
            </div>
          ) : (
            <input
              type="file"
              accept="image/*,.txt"
              onChange={(e) => setFileNew(e?.target?.files[0])}
            />
          )}
          <button
            className="btn-modal btn-modal--save"
            onClick={() => {
              updateTodo(
                id,
                nameVal,
                checked,
                descriptionVal,
                inputDate,
                file,
                fileCh,
                fileNew
              );
              if (!file) {
                uploadFile(id, fileNew);
              }
              setOpenModal(false);
            }}
          >
            Save
          </button>
          <button
            className="btn-modal btn-modal--close"
            onClick={() => setOpenModal(false)}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalWindow;
