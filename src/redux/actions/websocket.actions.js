import { websocketConstant } from './constant';

export const refConnect = (data) => {
    return async (dispatch) => {
        dispatch({
            type: websocketConstant.REF_CONNECT,
            payload: data
        })
    }
}

export const SendMessageConnect = (newDataata) => {
    console.log("====", newDataata);

    // data.sendMessage(
    //     '/app/organization',
    //     JSON.stringify(newDataata)
    //   )
    return async (dispatch) => {
        dispatch({
            type: websocketConstant.SENDMESSAGE,
            payload: newDataata
        })
    }
}



export const onSockConnect = () => {
    return async (dispatch) => {
        dispatch({
            type: websocketConstant.ONCONNECT,
        })
    }
}

export const onSockDisconnect = () => {
    return async (dispatch) => {
        dispatch({
            type: websocketConstant.DISCONNECT,
        })
    }
}

