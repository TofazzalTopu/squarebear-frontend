import { diagramConstant } from "../actions/constant";

const initState = {
  initialElements: {},
  valueStream: [],
  decisionNodeInitialData: [],
  csvData: null,
  persona: ""
};

const diagramReducer = (state = initState, action) => {
  switch (action.type) {

    case diagramConstant.ADDEDGE:
      return {
        ...state,
      };
    case diagramConstant.LOADDATA:
      return {
        ...state,
        initialElements: action.payload
      };
    case diagramConstant.GET_VALUE_STREAM:
      return {
        ...state,
        valueStream: [...action.payload]
      };
    case diagramConstant.DELETE_VALUE_STREAM:
      let valueStreamData = [...state.valueStream];
      return {
        ...state,
        valueStream: valueStreamData.filter((info) => info.id !== action.payload)
      };
    case diagramConstant.UPDATE_VALUE_STREAM:
      let UpdateValueStream = [...state.valueStream];
      const indexed = UpdateValueStream.findIndex((info) => (info.id === action.payload.id));
      console.log({ indexed });
      UpdateValueStream[indexed] = action.payload;
      console.log({ UpdateValueStream });
      return {
        ...state,
        valueStream: UpdateValueStream
      };
    case diagramConstant.ADD_VALUE_STREAM:
      return {
        ...state,
        valueStream: [...state.valueStream, action.payload]
      };
    case diagramConstant.FOR_CSV_WITH_VALUE_STREAM:
      return {
        ...state,
        csvData: action.payload
      };
    case diagramConstant.GET_PERSONA_DATA:
      return {
        ...state,
        persona: action.payload
      };
    case diagramConstant.ADD_NEW_PERSONA:
      return {
        ...state,
        persona: { ...action.payload }
      };
    case diagramConstant.UPDATE_PERSONA_DATA:
      return {
        ...state,
        persona: action.payload
      };

    case diagramConstant.ADD_NEW_FORM_NODE_DATA:
      return {
        ...state,
        decisionNodeInitialData: [...state.decisionNodeInitialData, action.payload]
      };
    case diagramConstant.LOAD_TABLE_DATA_FROM_BACKEND:
      return {
        ...state,
        decisionNodeInitialData: action.payload
      };
    case diagramConstant.UPDATE_NEW_FORM_NODE_DATA:
      let allTableDataa = [...state.decisionNodeInitialData];
      const index = allTableDataa.findIndex((info) => (info.id === action.payload.id));
      allTableDataa[index][action.payload.value] = action.payload.name;
      return {
        ...state,
        decisionNodeInitialData: allTableDataa
      };
    case diagramConstant.CLOSE_FORM_NODE_DATA:
      return {
        ...state,
        decisionNodeInitialData: []
      };
    case diagramConstant.DELETE_NEW_FORM_NODE_DATA:
      let allTableData = [...state.decisionNodeInitialData];
      return {
        ...state,
        decisionNodeInitialData: allTableData.filter((info) => info.id !== action.payload)
      };
    default:
      return state;
  }
};
export default diagramReducer;
