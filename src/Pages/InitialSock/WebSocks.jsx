import React, { useEffect, useState } from "react";
import SockJsClient from "react-stomp";
import { useSelector } from "react-redux";
import { BACKEND_WEBSOCKET_URL } from "../../urlConfig";
const WebSocks = (props) => {
  const user = useSelector((state) => state.auth);

  const [visible, setVisible] = useState(true);
  const [refData, setRefData] = useState(null);
  const { id, projectId } = user?.user;
  const { elements, setPendingRequest, pendingRequest } = props;
  const sendMessage = () => {
    if (pendingRequest) {
      refData.sendMessage(
        "/app/organization",
        JSON.stringify({
          userId: id,
          projectId,
          messageContent: elements,
        })
      );
    }
  };

  useEffect(() => {
    sendMessage();
    setPendingRequest(false);
  }, [pendingRequest]);

  const handleMessage = (msg) => {
    props.setElements(msg.messageContent);
  };

  return (
    <div>
      <SockJsClient
        url={BACKEND_WEBSOCKET_URL + "/push-message-mapping/"}
        topics={["/topic/content/" + projectId]}
        onConnect={() => {
          setVisible(false);
        }}
        onDisconnect={() => {
          setVisible(false);
        }}
        onMessage={(msg) => {
          handleMessage(msg);
        }}
        ref={(client) => {
          setRefData(client);
        }}
      />
    </div>
  );
};

export default WebSocks;
