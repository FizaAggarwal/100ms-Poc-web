import { put } from "redux-saga/effects";

function* createRoom(action) {
  let { name, user } = action.payload;
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  var raw = JSON.stringify({
    name: name,
    user: user,
  });
  var requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };

  let data = yield fetch("http://localhost:4000/createRoom", requestOptions);
  data = yield data.json();
  yield put({
    type: "CREATE_ROOM_SUCCESS",
    payload: { room: data },
  });
}

export default createRoom;
