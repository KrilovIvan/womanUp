import { initializeApp } from "firebase/app";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getFirestore,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
import {
  deleteObject,
  getDownloadURL,
  getStorage,
  ref,
  uploadBytes,
} from "firebase/storage";
import { config } from "../config/config";

/**@type {import("firebase/app").firebaseConfig}*/
const app = initializeApp(config.firebaseConfig);
/**@type {import("firebase/firestore").Firestore}*/
const firestore = getFirestore(app);
/**@type {import("firebase/storage").FirebaseStorage} */
const storage = getStorage();
/**@type {import("firebase/firestore").CollectionReference}*/
const snapTodoRef = collection(firestore, "todos");

/**
 * @param {string} name название задачи в виде строки
 * @param {string} description описание задачи
 * @param {boolean} checked флаг выполненной задачи, true-выполнена, false-не завершена
 * @param {string} date дата завершения задачи вида "YYYY-MM-DD"
 * @param {string} file название файла, который прикрепляем к задаче
 * @description создание новой задачи
 */
export const createTodo = async (name, description, checked, date, file) => {
  const createTodoRef = collection(firestore, "todos");

  /**@type {import("firebase/firestore").addDoc} */
  let docRef = await addDoc(createTodoRef, {
    name: name,
    checked: checked,
    description: description,
    date: date,
    fileName: file ? file.name : null,
  });

  file && uploadFile(docRef.id, file);
};
/**
 * @param {React.Dispatch<React.SetStateAction<never[]>>} setter
 * @description получение задач в виде массива объектов
 */
export const getTodo = (setter) => {
  /**@type {import("firebase/firestore").DocumentSnapshot} */
  onSnapshot(snapTodoRef, (snapshot) =>
    setter(
      snapshot.docs.map((doc) => {
        return { ...doc.data(), id: doc.id };
      })
    )
  );
};

/**
 * @param {string} id индивидуальный идентификатор задачи
 * @param {string} name название задачи в виде строки
 * @param {boolean} checked флаг выполненной задачи, true-выполнена, false-не завершена
 * @param {string} description описание задачи
 * @param {string} date дата завершения задачи вида "YYYY-MM-DD"
 * @param {string} file название файла, который прикрепляем к задаче
 * @param {string} changedFile название измененного файла (если файл до этого был прикреплен)
 * @param {string} newFile название нового файла
 *@description обновление полей задачи
 */
export const updateTodo = async (
  id,
  name,
  checked,
  description,
  date,
  file,
  changedFile,
  newFile
) => {
  /**@type {import("firebase/firestore").DocumentData} */
  const updateTodoRef = doc(firestore, "todos", id);
  if (changedFile) {
    await deleteFile(id);
    await uploadFile(id, changedFile);
  }
  /**@type {import("firebase/firestore").DocumentData} */
  await updateDoc(updateTodoRef, {
    name: name,
    checked: checked,
    description: description,
    date: date,
    fileName: changedFile ? changedFile.name : file ? file : newFile.name,
  });
};

/**
 * @param {string} id индивидуальный идентификатор задачи
 * @param {boolean} checked флаг выполненной задачи, true-выполнена, false-не завершена
 * @description обновление поля статуса задачи (выполнена/не завершена)
 * */
export const updateChecked = async (id, checked) => {
  const updateTodoRef = doc(firestore, "todos", id);
  await updateDoc(updateTodoRef, {
    checked: checked,
  });
};
/**
 * @param {string} id индивидуальный идентификатор задачи
 * @param {string} file название файла
 * @description удаление задачи
 */
export const deleteTodo = async (id, file) => {
  const deleteTodoRef = collection(firestore, "todos");
  /**@type {import("firebase/firestore").DocumentReference} */
  await deleteDoc(doc(deleteTodoRef, id));
  if (file) deleteFile(id);
};

/**
 * @param {string} id индивидуальный идентификатор задачи
 * @param {string} file название файла, который прикрепляем к задаче
 * @description загрузка файла на сервер
 */
export const uploadFile = async (id, file) => {
  const upRef = ref(storage, id);
  await uploadBytes(upRef, file);
};

/**
 * @param {string} id индивидуальный идентификатор задачи
 * @description удаление файла
 * */
export const deleteFile = async (id) => {
  /**@type {import("firebase/firestore").DocumentReference} */
  await deleteObject(ref(storage, id));
};

/**
 * @param {string} file название файла, который скачиваем
 * @description получение ссылки на файл
 * */
export const download = async (file) => {
  let res = await getDownloadURL(ref(storage, file));
  return res;
};
