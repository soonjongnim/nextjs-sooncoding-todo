import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, doc, setDoc, 
  getDoc, deleteDoc, updateDoc, Timestamp, 
  query, orderBy, limit } from "firebase/firestore";
import { getAnalytics, isSupported, logEvent } from "firebase/analytics";

const firebaseConfig = {
  apiKey: process.env.API_KEY,
  authDomain: process.env.AUTH_DOMAIN,
  projectId: process.env.PROJECT_ID,
  storageBucket: process.env.STORAGE_BUCKET,
  messagingSenderId: process.env.MESSAGING_SENDER_ID,
  appId: process.env.APP_ID,
  measurementId: process.env.MEASUREMENT_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
const db = getFirestore(app);

// logEvent(analytics, 'goal_completion', { name: 'lever_puzzle'});

// 모든 할일 가져오기
export async function fetchTodos() {
  const todosRef = collection(db, "todos");
  const descQuery = query(todosRef, orderBy("created_at", "desc"));

  // const querySnapshot = await getDocs(collection(db, "todos"));  // todos= 만든문서명
  const querySnapshot = await getDocs(descQuery);  // todos= 만든문서명
  if (querySnapshot.empty) return [];

  const fetchedTodos = [];

  querySnapshot.forEach((doc) => {
    // doc.data() is never undefined for query doc snapshots
    console.log(doc.id, " => ", doc.data());

    const aTodo = {
      id: doc.id,
      title: doc.data()["title"],
      is_done: doc.data()["is_done"],
      created_at: doc.data()["created_at"].toDate(), // 대한민국시간표로하는방법:  .toLocaleTimeString('ko') 추가함
    }
    fetchedTodos.push(aTodo);
  });
  return fetchedTodos;
}

// 할일 추가하기
export async function addTodo({ title }) {
  const newTodoRef = doc(collection(db, "todos"));
  const createdAtTimestemp = Timestamp.fromDate(new Date());

  const newTodoData = {
    id: newTodoRef.id,
    title: title,
    is_done: false,
    created_at: createdAtTimestemp
  }

  await setDoc(newTodoRef, newTodoData);
  return {
    id: newTodoRef.id,
    title: title,
    is_done: false,
    created_at: createdAtTimestemp.toDate()
  };
}

// 단일 할일 가져오기
export async function fetchATodo(id) {

  if (id === null) return null;

  const todoDocRef = doc(db, "todos", id);
  const todoDocSnap = await getDoc(todoDocRef);

  if (todoDocSnap.exists()) {
    console.log("Document data:", todoDocSnap.data());

    const fetchedTodo = {
      id: todoDocSnap.id,
      title: todoDocSnap.data()["title"],
      is_done: todoDocSnap.data()["is_done"],
      created_at: todoDocSnap.data()["created_at"].toDate(), // 대한민국시간표로하는방법:  .toLocaleTimeString('ko') 추가함
    }

    return fetchedTodo;
  } else {
    // docSnap.data() will be undefined in this case
    console.log("No such document!");
    return null;
  }
}

// 단일 할일 삭제하기
export async function deleteATodo(id) {
  const deleteTodoDocRef = doc(db, "todos", id);
  await deleteDoc(deleteTodoDocRef);
}

// 단일 할일 수정하기
export async function editATodo(id, { title, is_done }) {
  const editeTodoDocRef = doc(db, "todos", id);

  const editedTodo = await updateDoc(editeTodoDocRef, {
    title: title,
    is_done: is_done
  });

  return editedTodo;
}

module.exports = { fetchTodos, addTodo, fetchATodo, deleteATodo, editATodo }