import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  selectLocalPeer,
  selectPeersByRole,
  useHMSActions,
  useHMSNotifications,
} from "@100mslive/react-sdk";
import {
  useHMSStore,
  selectIsConnectedToRoom,
  selectPeers,
  selectIsLocalAudioEnabled,
  selectPermissions,
  selectPeerScreenSharing,
  selectScreenShareByPeerID,
  useVideo,
  selectIsSomeoneScreenSharing,
  selectIsLocalScreenShared,
  selectConnectionQualityByPeerID,
} from "@100mslive/react-sdk";
// import { HMSReactiveStore } from "@100mslive/hms-video-store";
import { toast } from "react-toastify";

const VideoTile = () => {
  const presenter = useHMSStore(selectPeerScreenSharing);
  console.log(presenter, "#### presenter");
  const screenshareVideoTrack = useHMSStore(
    selectScreenShareByPeerID(presenter.id)
  );
  console.log(screenshareVideoTrack, "#### screenshareVideoTrack");
  const { videoRef } = useVideo({
    trackId: screenshareVideoTrack.id,
  });
  return <video ref={videoRef}></video>;
};

const ConnectionQuality = () => {
  const hmsActions = useHMSActions();
  const dispatch = useDispatch();
  const hi = "hi";
  const attendee = useHMSStore(selectPeersByRole("attendee"));
  console.log(attendee, "####attendee");
  const host = useHMSStore(selectPeersByRole("host"));
  console.log(host, "####host");
  const speaker = useHMSStore(selectPeersByRole("speaker"));
  console.log(speaker, "####speaker");
  if (host.length !== 0) {
    hmsStore.subscribe((connectionQuality) => {
      if (connectionQuality) {
        const quality = connectionQuality.downlinkQuality;
        console.log(quality, "####quality");
        if (speaker.length !== 0 && quality === 0) {
          hmsActions.changeRole(speaker[0].id, "host", true);
        }
      }
    }, selectConnectionQualityByPeerID(host[0].id));
  }

  return <></>;
};

function App() {
  const [userName, setUserName] = useState("");
  const [roomName, setRoomName] = useState("");
  // const [roomType, setRoomType] = useState("");
  // const hms = new HMSReactiveStore();
  // const hmsStore = useHMSStore();
  const dispatch = useDispatch();
  const { rooms, roomIds, joinToken } = useSelector(
    (state) => state.roomReducer
  );
  useEffect(() => {
    dispatch({ type: "GET_ROOMS_REQUEST" });
  }, [dispatch]);
  const hmsActions = useHMSActions();

  // const config = {
  //   userName: userName,
  //   authToken: joinToken,
  //   settings: {
  //     isAudioMuted: true,
  //     isVideoMuted: true,
  //   },
  // };
  const joinRoom = async (id) => {
    dispatch({
      type: "GET_JOIN_ROOM_TOKEN",
      payload: {
        roomId: id,
        user: userName,
      },
      hmsActions,
    });
    // await hmsActions.join(config);
  };
  const isConnected = useHMSStore(selectIsConnectedToRoom);
  window.addEventListener("beforeunload", () => hmsActions.leave());
  window.addEventListener("onunload", () => hmsActions.leave());
  const peers = useHMSStore(selectPeers);
  const audioEnabled = useHMSStore(selectIsLocalAudioEnabled);
  const toggleAudio = async () => {
    await hmsActions.setLocalAudioEnabled(!audioEnabled);
  };
  const permissions = useHMSStore(selectPermissions);
  const endRoom = async () => {
    try {
      const lock = false; // set to true to disallow rejoins
      const reason = "party is over";
      await hmsActions.endRoom(lock, reason);
    } catch (error) {
      // Permission denied or not connected to room
      console.error(error);
    }
  };

  const notification = useHMSNotifications();

  useEffect(() => {
    if (!notification) {
      return;
    }

    switch (notification.type) {
      // ...Other notification type cases
      case "ROOM_ENDED":
        // Redirect or Show toast to user
        toast(notification.data.reason);
        break;

      case "REMOVED_FROM_ROOM":
        // Redirect or Show toast to user
        toast("Reason: ", notification.data.reason);
        break;
      default:
        toast("");
    }
  }, [notification]);

  const screenShare = async () => {
    try {
      await hmsActions.setScreenShareEnabled(true);
    } catch (error) {
      console.log(error);
      // an error will be thrown if user didn't give access to share screen
    }
  };
  // const screenshareOn = hmsStore.getState(selectIsSomeoneScreenSharing);
  const screenshareOn = useHMSStore(selectIsSomeoneScreenSharing);
  // console.log(screenshareOn, "####");
  // useEffect(() => {
  //   console.log(screenshareOn, "####");
  // }, [screenshareOn]);

  // const presenter = useHMSStore(selectPeerScreenSharing);
  // console.log(presenter);
  // if (screenshareOn) {
  //   const screenshareVideoTrack = useHMSStore(
  //     selectScreenShareByPeerID(presenter.id)
  //   );
  // }

  // const { videoRef } = useVideo({
  //   screenshareVideoTrack,
  // });
  const stopScreenShare = () => {
    hmsActions.setScreenShareEnabled(false);
  };
  const amIScreenSharing = useHMSStore(selectIsLocalScreenShared);

  // const quality = (hostId) => {
  //   const downlinkQuality = useHMSStore(
  //     selectConnectionQualityByPeerID(hostId)
  //   )?.downlinkQuality;
  //   return downlinkQuality;
  // };
  // console.log(quality, "####quality");
  // if (attendee.length !== 0 && quality === 0) {
  //   hmsActions.changeRole(attendee[0].id, "host", true);
  // }
  const changeRole = (id, role) => {
    hmsActions.changeRole(id, role, true);
  };

  const localPeer = useHMSStore(selectLocalPeer);

  return (
    <div>
      {isConnected ? (
        <div>
          <ConnectionQuality />
          <div>this is a room</div>
          <br />
          {peers.map((peer) => (
            <div key={peer.id}>
              {peer.name}
              {localPeer.roleName === "host" &&
                peer.roleName === "attendee" && (
                  <button onClick={() => changeRole(peer.id, "speaker")}>
                    Change to speaker
                  </button>
                )}
              {localPeer.roleName === "host" && peer.roleName === "speaker" && (
                <button onClick={() => changeRole(peer.id, "attendee")}>
                  Change to attendee
                </button>
              )}
            </div>
          ))}
          <br />
          <button onClick={() => toggleAudio()}>
            {audioEnabled ? "Mute" : "Unmute"}
          </button>
          <br />
          {console.log(screenshareOn, "####")}
          {screenshareOn && !amIScreenSharing && <VideoTile />}
          {/* {host.length !== 0 &&
            attendee.length !== 0 &&
            ConnectionQuality(host[0].id, attendee[0].id)} */}
          <br />
          <button onClick={() => hmsActions.leave()}>Leave Room</button>
          <br />
          <br />
          {permissions.endRoom ? (
            <button onClick={endRoom}>End Room</button>
          ) : null}
          <br />
          <br />
          <button onClick={() => screenShare()}>Share Screen</button>
          <br />
          <br />
          {screenshareOn && (
            <button onClick={() => stopScreenShare()}>Stop Screen Share</button>
          )}
        </div>
      ) : (
        <div>
          <input
            placeholder="UserName"
            onChange={(e) => setUserName(e.target.value)}
          />
          <br />
          <br />
          <input
            placeholder="RoomName"
            onChange={(e) => setRoomName(e.target.value)}
          />
          {/* <br />
          <br />
          <input
            type="radio"
            name="roomType"
            value={roomType}
            onChange={() => setRoomType("now")}
          />
          <label>Now</label>
          <input
            type="radio"
            name="roomType"
            value={roomType}
            onChange={() => setRoomType("scheduled")}
          />
          <label>Scheduled</label> */}
          <br />
          <br />
          <button
            onClick={() =>
              dispatch({
                type: "CREATE_ROOM_REQUEST",
                payload: {
                  name: roomName,
                  user: userName,
                },
              })
            }
          >
            Create Room
          </button>
          <br />
          <br />
          <br />
          <br />
          {roomIds !== 0 &&
            roomIds.map((item) => (
              <div key={item}>
                {rooms[item].name}
                <button onClick={() => joinRoom(item)}>Join Room</button>
                <br />
                <br />
              </div>
            ))}
        </div>
      )}
    </div>
  );
}

export default App;
