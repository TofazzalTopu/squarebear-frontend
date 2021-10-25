import { diagramConstant } from './constant';
import axios from "../../api/axios";

export const addEdge = (data) => {
    return async (dispatch) => {
        dispatch({
            type: diagramConstant.ADDEDGE,
            payload: data
        })
    }
}

export const loadDiagramFromBackend = (projectId) => {
    return async (dispatch) => {
        try {
            if (projectId) {
                const res = await axios.get("/v1/projects/" + projectId + "/contents");
                dispatch({
                    type: diagramConstant.LOADDATA,
                    payload: res.data
                })
            }
        } catch (error) {
            console.log(error);
        }
    }
}

export const addNewValueStream = (valueStream, projectId) => {
    return async (dispatch) => {
        try {
            if (valueStream) {
                const res = await axios.post("/v1/projects/" + projectId + "/valueStreams", valueStream);
                dispatch({
                    type: diagramConstant.ADD_VALUE_STREAM,
                    payload: res.data
                })
            }
        } catch (error) {
            console.log(error);
        }
    }
}
export const getNewValueStream = (projectId) => {
    return async (dispatch) => {
        try {
            if (projectId) {
                const res = await axios.get("/v1/projects/" + projectId + "/valueStreams");
                console.log(res.data);
                dispatch({
                    type: diagramConstant.GET_VALUE_STREAM,
                    payload: res.data
                })
            }
        } catch (error) {
            console.log(error);
        }
    }
}
export const addNewPersona = (data, projectId) => {
    return async (dispatch) => {
        try {
            if (data && projectId) {
                const res = await axios.post("/v1/projects/" + projectId + "/persona", data);
                console.log("created", res.data.data);
                dispatch({
                    type: diagramConstant.ADD_NEW_PERSONA,
                    payload: res.data.data
                })
            }
        } catch (error) {
            console.log(error);
        }
    }
}
export const getPersona = (projectId) => {
    return async (dispatch) => {
        try {
            if (projectId) {
                const res = await axios.get("/v1/projects/" + projectId + "/persona");
                dispatch({
                    type: diagramConstant.GET_PERSONA_DATA,
                    payload: res.data.data[0]
                })
            }
        } catch (error) {
            console.log(error);
        }
    }
}
export const updatePersona = (data, projectId, id) => {
    return async (dispatch) => {
        try {
            if (projectId) {
                const res = await axios.patch("/v1/projects/" + projectId + "/persona/" + id, data);
                console.log("from update", res.data.data);
                dispatch({
                    type: diagramConstant.UPDATE_PERSONA_DATA,
                    payload: res.data.data
                })
            }
        } catch (error) {
            console.log(error);
        }
    }
}
export const deleteValueStream = (id) => {
    return async (dispatch) => {
        try {
            if (id) {
                const res = await axios.delete("/v1/projects/{projectId}/valueStreams/" + id);
                console.log(res);
                dispatch({
                    type: diagramConstant.DELETE_VALUE_STREAM,
                    payload: id
                })
            }
        } catch (error) {
            console.log(error);
        }
    }
}
export const updateValueStream = (id, updatedValueStream) => {
    return async (dispatch) => {
        try {
            if (id) {
                const res = await axios.patch("/v1/projects/{projectId}/valueStreams/" + id, updatedValueStream);
                console.log(res.data);
                dispatch({
                    type: diagramConstant.UPDATE_VALUE_STREAM,
                    payload: res.data
                })
            }
        } catch (error) {
            console.log(error);
        }
    }
}



export const sendValueStreamAndDiagramForCSV = (projectId, valueStreamDtoList) => {
    return async (dispatch) => {
        try {
            if (valueStreamDtoList) {
                const res = await axios.post("/v1/projects/" + projectId + "/valueStreams/generate-csv", valueStreamDtoList);
                console.log(res.data);
                dispatch({
                    type: diagramConstant.FOR_CSV_WITH_VALUE_STREAM,
                    payload: res.data
                })
            }
        } catch (error) {
            console.log(error);
        }
    }
}
//for the decision or process Node {next 3 actions}
export const addNodeDataToTheTable = (data) => {
    return async (dispatch) => {
        try {
            if (data) {
                dispatch({
                    type: diagramConstant.ADD_NEW_FORM_NODE_DATA,
                    payload: data
                })
            }
        } catch (error) {
            console.log(error);
        }
    }
}
export const loadNodeDataToTheTableFromServer = (data) => {
    return async (dispatch) => {
        try {
            if (data) {
                dispatch({
                    type: diagramConstant.LOAD_TABLE_DATA_FROM_BACKEND,
                    payload: data
                })
            }
        } catch (error) {
            console.log(error);
        }
    }
}
export const updateNodeDataToTheTable = (data) => {
    return async (dispatch) => {
        try {
            if (data) {
                dispatch({
                    type: diagramConstant.UPDATE_NEW_FORM_NODE_DATA,
                    payload: data
                })
            }
        } catch (error) {
            console.log(error);
        }
    }
}
export const cloaseEditableNodeDataToTheTable = (data) => {
    return async (dispatch) => {
        try {
            dispatch({
                type: diagramConstant.CLOSE_FORM_NODE_DATA,
                payload: data
            })
        } catch (error) {
            console.log(error);
        }
    }
}
export const deleteNodeDataToTheTable = (id) => {

    return async (dispatch) => {
        try {
            if (id) {
                dispatch({
                    type: diagramConstant.DELETE_NEW_FORM_NODE_DATA,
                    payload: id
                })
            }
        } catch (error) {
            console.log(error);
        }
    }
}


