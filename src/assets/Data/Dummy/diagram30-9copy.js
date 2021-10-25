import React, { useState, useRef, useEffect, useCallback } from "react";
import ReactFlow, {
  addEdge,
  removeElements,
  Controls,
  Background,
  useStoreState,
  // useStoreActions,
  updateEdge,
} from "react-flow-renderer";
import GetApp from "@material-ui/icons/GetApp";
import DeleteIcon from "@material-ui/icons/Delete";
import MenuIcon from "@material-ui/icons/Menu";
// import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import CustomNode from "../../Components/FlowComponents/CustomNode";
import DiamondNode from "../../Components/FlowComponents/DiamondNode";
import OutputNode from "../../Components/FlowComponents/OutputNode";
import StartNode from "../../Components/FlowComponents/StartNode";
import DataGridOfProcessNode from "../../Components/FlowComponents/ProcessNodeGrid";
import ConnectionLine from "../../Components/FlowComponents/ConnectionLine";
import CustomEdge from "../../Components/FlowComponents/CustomEdge";
import Layout from "../../Components/Layout";
import WebSocks from "../InitialSock/WebSocks";
import "./dnd.css";
import { useDispatch, useSelector } from "react-redux";
import {
  loadDiagramFromBackend,
  loadNodeDataToTheTableFromServer,
  cloaseEditableNodeDataToTheTable,
  getNewValueStream,
  sendValueStreamAndDiagramForCSV,
} from "../../redux/actions";
import { nanoid } from "nanoid";
import {
  TextField,
  makeStyles,
  Button,
  Grid,
  Typography,
  Box,
  ClickAwayListener,
} from "@material-ui/core";
// import { CSVLink } from 'react-csv';
import TableModal from "../../Components/Reusable/TableModal";
import { useForm, Controller } from "react-hook-form";
import CssTextField from "../../Components/Reusable/CssTextField";
import { useLocation } from "react-router-dom";
import { edgeArrowId, saveFlow } from "../../Utils";
import Modal from "../../Components/Reusable/Modal";
import { images } from "../../assets";
import { useToggle } from "../../hooks/useToggle";
const nodeTypes = {
  start: StartNode,
  end: OutputNode,
  process: CustomNode,
  decision: DiamondNode,
};
const edgeTypes = {
  custom: CustomEdge,
};
//loaded from api or Empty Array
const initText = "Untitled";

const FinalDiagram = () => {
  const { search } = useLocation();
  const searchId = new URLSearchParams(search).get("streamId");

  // from whole selected ELements
  const selectedElements = useStoreState((store) => store.selectedElements);
  // // const setSelected = useStoreActions((actions) => actions.setSelectedElements);
  // console.log({ selectedElements });

  //redux start
  const { decisionNodeInitialData, initialElements, valueStream, csvData } =
    useSelector((state) => state.diagram);
  const auth = useSelector((state) => state.auth);
  const { organizationId } = auth?.user;
  const dispatch = useDispatch();
  //main Elements State
  const [personaDataToTheNode, setPersonaDataToTheNode] = useState({});
  //main Elements of Diagram
  const [elements, setElements] = useState([]);

  //component Did mount or unmount
  useEffect(() => {
    if (organizationId) {
      dispatch(getNewValueStream(organizationId));
      dispatch(loadDiagramFromBackend(organizationId));
    }
  }, [organizationId, dispatch]);

  //initial Data or from backend uder the organization
  useEffect(() => {
    if (initialElements.messageContent) {
      setElements(initialElements.messageContent);
    }
  }, [initialElements.messageContent]);
  //stream Id

  useEffect(() => {
    const particularData = valueStream.find((stream) => stream.id === searchId);
    setPersonaDataToTheNode(particularData);
  }, [searchId, valueStream]);

  //useRef for DOM node
  const reactFlowWrapper = useRef(null);
  const submitRef = useRef(null);
  //instance
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  //opening the Modal of form
  const [openDoubleClick, setOpenDoubleClick] = useState(false);
  //open Editor menu
  const [openMenuClick, setOpenMenuClick] = useState(false);
  const [labelData, setLableData] = useState(false);
  const [openeds, setopeneds] = useState(false);
  const [edgeEditModal, setEdgeEditModal] = useState(false);
  const [edgeLabel, setEdgeLabel] = useState("");
  const [formError, setFormError] = useState("");
  const [deleteFlows, setDeleteFlows] = useToggle(false);
  //opening the Modal of form
  //modal Data
  const [updatedData, setUpdatedData] = useState({});
  const [deletedData, setdeletedData] = useState({});
  //state changes on websocket
  const [pendingRequest, setPendingRequest] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    dispatch(loadNodeDataToTheTableFromServer(updatedData.data?.nodeDataList));
  }, [updatedData, dispatch]);

  const onConnect = (params) => {
    const source = params.source;
    let str = source;
    const newDecisionLineEdge = str.match(/decision/g);
    const target = params.target;
    const newEdgeId = edgeArrowId(source, target);
    const newSource = new Array(source);
    const newTarget = new Array(target);
    handleAddingSource(target, source);
    setElements((els) =>
      addEdge(
        {
          type: "custom",
          style: { stroke: "black", strokeWidth: "1.5" },
          selectable: true,
          ...params,
          id: newEdgeId,
          labelBgBorderRadius: 4,
          arrowHeadType: "arrow",
          labelBgStyle: { fill: "white", stroke: "black" },
          data: {
            line: true,
            node: false,
            source: newSource,
            target: newTarget,
            text: newDecisionLineEdge ? "Line name" : "",
            label: "",
            decision: false,
            previousDecision: false,
            start: false,
            process: false,
            previousProcess: false,
            end: false,
            name: "",
            valueStreamId: personaDataToTheNode?.id,
            previousProcessName: "",
            previousProcessWhy: "",
            decisionLineName: "",
            persona: personaDataToTheNode?.persona,
            valueStreamName: personaDataToTheNode?.valueStreamName,
            valueStreamWhy: personaDataToTheNode?.valueStreamWhy,
            processWhy: "",
            nodeDataList: [],
          },
        },
        els
      )
    );
    setPendingRequest(true);
  };

  useEffect(() => {
    console.log(submitRef.current);
    // labelData && submitRef.current.addEventListener("click", () => {});
  }, [labelData]);

  const handleSubmitted = (e) => {
    if (!edgeLabel) return;
    const els = [...elements];
    const maped = els.map((el) => {
      if (el.id === updatedData?.id) {
        el.data.text = edgeLabel;
      }
      return el;
    });
    setElements(maped);
    setPendingRequest(true);
    setEdgeEditModal(false);
  };
  const handleCloseModalData = () => {
    setEdgeEditModal(false);
    handleSubmitted();
  };
  const newModalForEdge = () => {
    return (
      <Modal open={edgeEditModal} handleClose={handleCloseModalData}>
        <Box
          style={{
            padding: "25px",
            margin: "20px",
            border: "1px solid gray",
            borderRadius: "4px",
          }}
        >
          <h3
            style={{
              background: "#3232",
              padding: "5px",
              margin: "5px 5px 20px 5px",
            }}
          >
            Line name
          </h3>
          <form onSubmit={handleSubmitted}>
            <CssTextField
              type="text"
              placeholder="Enter your Edge Line"
              onChange={(e) => setEdgeLabel(e.target.value)}
            />
          </form>
        </Box>
      </Modal>
    );
  };

  const handleAddingSource = (target, source) => {
    const newSource = new Array(source);
    const newTarget = new Array(target);

    if (target && source) {
      const els = [...elements];
      const maped = els.map((el) => {
        if (el.id === target) {
          if (el.data.source) {
            const newUpdateSource = [...el.data.source];
            const lastSourceArray = [...newUpdateSource, ...newSource];
            el.data.source = [...new Set(lastSourceArray)];
          } else {
            el.data.source = [...newSource];
          }
        }
        if (el.id === source) {
          if (el.data.target) {
            const newUpdateTarget = [...el.data.target];
            const lastTargetArray = [...newUpdateTarget, ...newTarget];
            el.data.target = [...new Set(lastTargetArray)];
          } else {
            el.data.target = [...newTarget];
          }
        }
        return el;
      });
      setElements(maped);
    }
  };

  const onElementClick = (event, element) => {
    if (element.type === "custom") {
      const data = { ...element };
      setUpdatedData(data);
      setEdgeEditModal(true);
    }
    if (element.type === "process" || "decision") {
      // console.log("sdfsfdfdfds", element);
      const data = { ...element };
      // setUpdatedData(data);
      setdeletedData(data);
      setOpen(true);
    }
  };
  // if (el.id !== target) return el;
  // if (el.id !== source) return el;
  const onEdgeUpdate = (oldEdge, newConnection) => {
    setElements((els) => updateEdge(oldEdge, newConnection, els));
    setPendingRequest(true);
  };
  const onElementsRemove = (elementsToRemove) => {
    console.log({ elementsToRemove });
    const newSection = setElements((els) =>
      removeElements(elementsToRemove, els)
    );
    console.log({ newSection });
    setPendingRequest(true);
  };
  const [open, setOpen] = useState(false);

  const handleClickAway = () => {
    setOpen(false);
  };

  const handleDeleteElement = (datas) => {
    const newDara = new Array(datas);
    onElementsRemove(newDara);
    setOpen(false);
  };
  const deleteElement = () => {
    return (
      <ClickAwayListener onClickAway={handleClickAway}>
        <Box sx={{ position: "relative" }}>
          {open ? (
            <Box style={{ textAlign: "center" }}>
              <p
                title={deletedData?.data?.name}
                style={{ marginBottom: "5px", marginTop: "0px" }}
              >
                {deletedData?.data?.name.substr(0, 6)}
              </p>
              <DeleteIcon
                style={{ cursor: "pointer" }}
                onClick={() => handleDeleteElement(deletedData)}
              />
            </Box>
          ) : null}
        </Box>
      </ClickAwayListener>
    );
  };

  // const onElementsRemove = (elementsToRemove) => {
  //   if (selectedElements) {
  //     setElements((els) => removeElements(selectedElements, els));
  //     setPendingRequest(true);
  //   }
  // };

  const onLoad = (_reactFlowInstance) => {
    setReactFlowInstance(_reactFlowInstance);
  };
  const onNodeDragStop = (event, node) => {
    const data = { ...node };
    setUpdatedData(data);
    if (node) {
      const els = [...elements];
      const maped = els.map((el) => {
        if (el.id === data.id) {
          el.position = node.position;
        }
        return el;
      });
      setElements(maped);
      setPendingRequest(true);
    }
  };
  const onDragOver = (event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  };
  const PopUp = () => {
    return (
      <div>
        <h3 style={{ color: "red" }}>Need to check all the name fields</h3>
      </div>
    );
  };

  const onDrop = (event) => {
    event.preventDefault();
    const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
    const type = event.dataTransfer.getData("application/reactflow");
    const position = reactFlowInstance.project({
      x: event.clientX - reactFlowBounds.left,
      y: event.clientY - reactFlowBounds.top,
    });
    //new node Data
    const newNode = {
      id: `node_${type}_${nanoid(7)}`,
      type,
      position,
      data: {
        line: false,
        node: true,
        label: `${type} node`,
        decision: type === "decision",
        previousDecision: false,
        start: type === "start",
        process: type === "process",
        previousProcess: false,
        end: type === "end",
        text: "",
        source: [],
        target: [],

        name: type === "start" ? "start" : type === "end" ? "End" : initText,
        previousProcessName: "",
        previousProcessWhy: "",
        decisionLineName: "",
        valueStreamId: personaDataToTheNode?.id,
        persona: personaDataToTheNode?.persona,
        valueStreamName: personaDataToTheNode?.valueStreamName,
        valueStreamWhy: personaDataToTheNode?.valueStreamWhy,
        processWhy: "",
        nodeDataList: [],
      },
    };
    setElements((es) => es.concat(newNode));
    setOpenDoubleClick(true);
    const data = { ...newNode };
    setUpdatedData(data);
  };
  const {
    formState: { errors },
    control,
    handleSubmit,
    reset,
    watch,
  } = useForm({
    mode: "all",
  });
  const processName = watch("name");
  const processWhy = watch("processWhy");
  useCallback(() => watch("name"), [watch]);
  useCallback(() => watch("processWhy"), [watch]);
  console.log({ processName, processWhy });

  //TODOupdate Node Data of particular thing
  const onUpdateSubmit = (data) => {
    console.log("Azim", { data });
  };
  //renderTableModalForUpdateNode
  // || !updatedData?.data?.processWhy
  const handleCloseModal = () => {
    if (!updatedData?.data?.processWhy && !processName && !processWhy) {
      setFormError("Please fill the data");
      return;
    } else {
      if (processName && processWhy && updatedData?.id) {
        setFormError("");
        const els = [...elements];
        const maped = els.map((el) => {
          if (el.id === updatedData.id) {
            el.data.name = processName;
            el.data.processWhy = processWhy;
          }
          return el;
        });
        setElements(maped);
        setPendingRequest(true);
        reset();
        setOpenDoubleClick(false);
      }
    }

    setLableData(true);
    if (decisionNodeInitialData) {
      const workItemExist = decisionNodeInitialData.some(
        (item) => item.name === ""
      );
      const inputExist = decisionNodeInitialData.some(
        (item) => item.input === ""
      );
      const sourceExist = decisionNodeInitialData.some(
        (item) => item.source === ""
      );
      const outputExist = decisionNodeInitialData.some(
        (item) => item.output === ""
      );
      const destinationExist = decisionNodeInitialData.some(
        (item) => item.destination === ""
      );
      const inputandSourceCheck = inputExist && sourceExist;
      const destinationndOutputCheck = outputExist && destinationExist;
      if (workItemExist) {
        setopeneds(true);
        return;
      }
      // if (inputandSourceCheck && !workItemExist) {
      //   setopeneds(false);
      //   // return;
      // }
      // // if (inputAndOutputExist) {

      // // }
      else {
        renderTableOnWorkItem();
      }
    }
    dispatch(cloaseEditableNodeDataToTheTable(false));
    setOpenDoubleClick(false);
    reset();
  };
  //renderFormUpdateOnDoubleClick

  //if condition matched
  const renderTableOnWorkItem = () => {
    setopeneds(false);
    const els = [...elements];

    const maped = els.map((el) => {
      if (el.id === updatedData.id) {
        el.data.nodeDataList = decisionNodeInitialData;
      }
      return el;
    });
    setElements(maped);
    setPendingRequest(true);
  };

  const renderFormUpdateOnDoubleClick = (updatedData) => {
    console.log({ updatedData });
    return (
      <form
        noValidate
        autoComplete="off"
        onSubmit={handleSubmit(onUpdateSubmit)}
      >
        <Grid container>
          <Grid item md={6}>
            <Controller
              name="name"
              control={control}
              defaultValue={updatedData.data?.name}
              rules={{
                required: true,
                maxLength: 30,
                pattern: {
                  value: /^\s*([a-zA-Z]+\s*){3}$/,
                  message: "Three Words Format Only",
                },
              }}
              render={({ field }) => (
                <CssTextField
                  {...field}
                  label="Process Name *"
                  variant="outlined"
                  type="text"
                />
              )}
            />

            {errors.name && (
              <Typography style={{ margin: "0" }} color="error">
                {errors.name.message}
              </Typography>
            )}
          </Grid>

          <Grid item md={6}>
            {/* {updatedData.type === "decision" ? "" : ""} */}
            <Controller
              name="processWhy"
              control={control}
              defaultValue={updatedData.data?.processWhy}
              rules={{
                required: true,
                maxLength: 30,
                pattern: {
                  value: /^\s*([a-zA-Z]+\s*){3}$/,
                  message: "Three Words Format Only",
                },
              }}
              render={({ field }) => (
                <CssTextField
                  {...field}
                  label="Goal *"
                  variant="outlined"
                  type="text"
                />
              )}
            />
            {errors.processWhy && (
              <Typography style={{ margin: "0", color: "red" }}>
                {errors.processWhy.message}
              </Typography>
            )}
          </Grid>
        </Grid>
      </form>
    );
  };

  const renderTableModalForUpdateNodeData = () => {
    return (
      <TableModal open={openDoubleClick} handleClose={handleCloseModal}>
        <Box className={classes.table_header}>
          <Box>
            <h1>{updatedData?.data?.name} </h1>
          </Box>
        </Box>
        <Box style={{ minWidth: "800px" }}>
          {formError && <p style={{ color: "red" }}>{formError}</p>}
          {renderFormUpdateOnDoubleClick(updatedData)}
        </Box>

        {updatedData.type === "process" ? (
          <Box>
            <Box>{openeds && PopUp()}</Box>
            <DataGridOfProcessNode rows={decisionNodeInitialData} />
          </Box>
        ) : (
          <Box></Box>
        )}
      </TableModal>
    );
  };

  //onNodeDoubleClick
  //TODO need to update
  const onNodeDoubleClick = (event, element) => {
    setOpenDoubleClick(true);
    const data = { ...element };

    setUpdatedData(data);
  };

  const updatedArray = [...elements];
  let newArray = [];
  updatedArray.forEach((item) => {
    const { id, type, data } = { ...item };
    const newObject = { id, type, data };
    newArray.push(newObject);
    return newArray;
  });

  function generateCSV() {
    if (elements) {
      const newValueStream = valueStream.map((item) => {
        return elements.filter(
          (item1) => item1.data.valueStreamId == item.id && item1
        );
      });
      const newValueStreamFilter = valueStream.map((item, index) => {
        const newObj = {
          valueStreamId: item.id,
          elementsDtoList: newValueStream[index],
          valueStreamName: item.valueStreamName,
          valueStreamWhy: item.valueStreamWhy,
          persona: item.persona,
        };
        return newObj;
      });
      //to save the JSON
      // saveFlow(newValueStreamFilter, nanoid, setOpenMenuClick);
      const mapedElements = elements.some((item) => item.type === "end");
      // setEpicList()
      if (mapedElements) {
        dispatch(
          sendValueStreamAndDiagramForCSV(newValueStreamFilter, organizationId)
        );
        setOpenMenuClick(false);
      } else {
        setErrorMessage("Please Add EndNode To Execute Algorithm");
      }

      // if (mapedElements) {
      //   dispatch(sendValueStreamAndDiagramForCSV(elements, organizationId));
      //   setOpenMenuClick(false);
      // } else {
      //   setErrorMessage("Please Add EndNode To Execute Algorithm");
      // }
    }
  }
  function deleteFlow() {
    if (elements) {
      setDeleteFlows(true);
      alert("are you sure");
      setElements([]);
      setOpenMenuClick(false);
    }
  }
  const renderFunctionOfEditNode = () => {
    return (
      <Modal
        open={openMenuClick}
        handleClose={() => {
          setOpenMenuClick(false);
          setErrorMessage("");
        }}
      >
        <h1>Execute Algorithm</h1>

        {errorMessage && (
          <h1
            style={{
              color: "red",
              border: "2px solid gray",
              padding: "10px",
              background: "#3232",
              borderRadius: "4px",
            }}
          >
            {errorMessage}
          </h1>
        )}

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            width: "600px",
            height: "200px",
            marginTop: "30px",
          }}
        >
          <div
            title="Save All Elements As json"
            onClick={() => generateCSV()}
            style={{
              background: "#4741BE",
              color: "white",
              padding: "20px 40px",
              borderRadius: "7px",
              margin: "20px 0px",
              display: "flex",
              cursor: "pointer",
              height: "70px",
            }}
            className="dndnode"
          >
            <GetApp style={{ marginRight: "4px" }} /> Download User stories
          </div>
          <div
            title="Save All Elements As json"
            onClick={() => saveFlow(elements, nanoid, setOpenMenuClick)}
            style={{
              background: "#4741BE",
              color: "white",
              padding: "20px 40px",
              borderRadius: "7px",
              margin: "20px 0px",
              display: "flex",
              cursor: "pointer",
              height: "70px",
            }}
            className="dndnode"
          >
            <GetApp style={{ marginRight: "4px" }} /> Download JSON
          </div>
          <div
            title="Delete All as Temporary"
            onClick={() => deleteFlow()}
            style={{
              background: "#4741BE",
              color: "white",
              display: "flex",
              padding: "20px 40px",
              borderRadius: "7px",
              margin: "20px 0px",
              cursor: "pointer",
              height: "70px",
            }}
            className="dndnode"
          >
            <DeleteIcon style={{ marginRight: "4px" }} /> Delete All
          </div>
        </div>
      </Modal>
    );
  };

  //#TODO need to fix start and End
  const SideBar = () => {
    const onDragStart = (event, nodeType) => {
      event.dataTransfer.setData("application/reactflow", nodeType);
      event.dataTransfer.effectAllowed = "move";
    };
    return (
      <aside>
        <div className="description">
          <p> {personaDataToTheNode?.valueStreamName}</p>{" "}
        </div>
        <div style={{ boxShadow: "3px 3px 3px 2px rgba(0, 0, 0, 0.2)" }}>
          <img
            title="Start Node"
            style={{
              height: "50px",
              width: "40px",
              margin: "5px 0px",
              cursor: "grab",
            }}
            onDragStart={(event) => onDragStart(event, "start")}
            draggable
            src={images.start}
            alt="Process Node"
          />

          <img
            title="Process Node"
            style={{
              height: "40px",
              width: "50px",
              cursor: "grab",
              margin: "10px 0px",
            }}
            onDragStart={(event) => onDragStart(event, "process")}
            draggable
            src={images.process2}
            alt="Process Node"
          />

          <img
            title="End Node"
            style={{
              height: "40px",
              width: "50px",
              cursor: "grab",
              margin: "10px 0px",
            }}
            onDragStart={(event) => onDragStart(event, "decision")}
            draggable
            src={images.diamond}
            alt="Decision Node"
          />

          <img
            title="Decision Node"
            style={{
              height: "40px",
              width: "50px",
              cursor: "grab",
              margin: "10px 0px",
            }}
            onDragStart={(event) => onDragStart(event, "end")}
            draggable
            src={images.end}
            alt="Decision Node"
          />
          {open && (
            <div
              title="Delete"
              style={{
                color: "black",
                height: "40px",
                width: "50px",
                margin: "10px 0px 20px 0px",
                cursor: "pointer",
              }}
            >
              {deleteElement()}
            </div>
          )}
          <div
            title="Functions"
            onClick={() => setOpenMenuClick(true)}
            style={{
              color: "black",
              height: "40px",
              width: "50px",
              margin: "10px 0px",
              cursor: "pointer",
            }}
          >
            <MenuIcon style={{ marginLeft: "14px" }} />
          </div>
        </div>
      </aside>
    );
  };
  const classes = useStyles();
  return (
    <Layout onDiagram>
      <Box className={classes.root}>
        <Box className="dndflow">
          <Box className="reactflow-wrapper" ref={reactFlowWrapper}>
            <ReactFlow
              nodeTypes={nodeTypes}
              connectionLineComponent={ConnectionLine}
              connectionLineType="smoothstep"
              elements={elements}
              deleteKeyCode="/" //new
              multiSelectionKeyCode="Control" //new
              onElementClick={onElementClick}
              onConnect={onConnect}
              onElementsRemove={onElementsRemove}
              onLoad={onLoad}
              onNodeDragStop={onNodeDragStop}
              onDrop={onDrop}
              edgeTypes={edgeTypes}
              onDragOver={onDragOver}
              onNodeDoubleClick={onNodeDoubleClick}
              onEdgeUpdate={onEdgeUpdate}
              arrowHeadColor="#595A66"
            >
              <Background variant="dots" gap={12} size={0.8} />
              <Controls />
            </ReactFlow>
          </Box>
          {SideBar()}
          {edgeEditModal && newModalForEdge()}
          {openMenuClick && renderFunctionOfEditNode()}
          {openDoubleClick && renderTableModalForUpdateNodeData()}
        </Box>
      </Box>
      <WebSocks
        setElements={setElements}
        elements={elements}
        pendingRequest={pendingRequest}
        setPendingRequest={setPendingRequest}
      />
      {csvData && <h2> {JSON.stringify(csvData)}</h2>}
    </Layout>
  );
};

export default FinalDiagram;

const useStyles = makeStyles((theme) => ({
  ClickRoot: {
    position: "relative",
  },
  dropdown: {
    position: "absolute",
    top: 0,
    right: 0,
    left: 0,
    zIndex: 100000000000000,
    border: "1px solid",
    padding: theme.spacing(1),
    backgroundColor: theme.palette.background.paper,
  },
  button__container__of___table: {
    display: "flex",
    justifyContent: "space-evenly",
    padding: 20,
  },
  toolbarGroup: {
    background: "#FFF",
    border: "1px solid darkgrey",
    padding: "4px",
  },
  table_header: {
    border: "1px solid gray",
    background: "#005ae5",
    color: "white",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    padding: "0px 20px",
    marginBottom: "30px",
  },
  attributeGroup: {
    paddingTop: "5px",
  },
  nodetext: {
    margin: "25px 0px 10px 0px",
    background: "white",
    width: "100%",
  },
}));
