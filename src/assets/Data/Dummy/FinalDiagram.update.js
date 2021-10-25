import React, { useState, useRef, useEffect } from "react";
import ReactFlow, {
    addEdge,
    removeElements,
    Controls,
    Background,
    useStoreState,
    useStoreActions,
    updateEdge,
} from "react-flow-renderer";
import GetApp from "@material-ui/icons/GetApp";
import DeleteIcon from "@material-ui/icons/Delete";
import MenuIcon from "@material-ui/icons/Menu";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
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
    addNodeDataToTheTable,
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
} from "@material-ui/core";
// import { CSVLink } from 'react-csv';
import TableModal from "../../Components/Reusable/TableModal";
import { useForm, Controller } from "react-hook-form";
import CssTextField from "../../Components/Reusable/CssTextField";
import { useLocation } from "react-router-dom";
import { edgeArrowId } from "../../Utils";
import Modal from "../../Components/Reusable/Modal";
import { images } from "../../assets";
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
const initText = "Write your Text";

const FinalDiagram = () => {
    const { search } = useLocation();
    const searchId = new URLSearchParams(search).get("streamId");

    // from whole selected ELements
    // const selectedElements = useStoreState((store) => store.selectedElements);
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
    //instance
    const [reactFlowInstance, setReactFlowInstance] = useState(null);
    //opening the Modal of form
    const [openDoubleClick, setOpenDoubleClick] = useState(false);
    //open Editor menu
    const [openMenuClick, setOpenMenuClick] = useState(false);
    const [openeds, setopeneds] = useState(false);
    //opening the Modal of form
    //modal Data
    const [updatedData, setUpdatedData] = useState({});
    //state changes on websocket
    const [pendingRequest, setPendingRequest] = useState(false);

    useEffect(() => {
        dispatch(loadNodeDataToTheTableFromServer(updatedData.data?.nodeDataList));
    }, [updatedData, dispatch]);

    const onConnect = (params) => {
        const source = params.source;
        const target = params.target;
        const newEdgeId = edgeArrowId(source, target);
        handleAddingSource(target, source);
        setElements((els) =>
            addEdge(
                {
                    type: "custom",
                    // type: "smoothstep",
                    style: { stroke: "black", strokeWidth: "1.5" },
                    selectable: true,
                    ...params,
                    id: newEdgeId,
                    labelBgBorderRadius: 4,
                    arrowHeadType: "arrow",
                    // label: "Add Your Text",
                    labelBgStyle: { fill: "white", stroke: "black" },
                    data: {
                        line: true,
                        node: false,
                        source,
                        target,
                        text: "add your text",
                    },
                },
                els
            )
        );
        setPendingRequest(true);
    };

    const handleAddingSource = (target, source) => {
        if (target && source) {
            const els = [...elements];
            const maped = els.map((el) => {
                // if (el.id !== target) return el;
                // if (el.id !== source) return el;
                if (el.id === target) {
                    el.data.source = source;
                }
                if (el.id === source) {
                    el.data.target = target;
                }
                return el;
            });
            setElements(maped);
        }
    };
    const onElementClick = (event, element) => {
        if (element.type === "custom") {
            console.log("click", element);
            const data = { ...element };
            setUpdatedData(data);
            const els = [...elements];
            const maped = els.map((el) => {
                if (el.id === element.id) {
                    el.data.text = "new";
                }
                return el;
            });
            setElements(maped);
            setPendingRequest(true);
        }
    };

    const onEdgeUpdate = (oldEdge, newConnection, er) => {
        console.log(oldEdge, newConnection, er);
        setElements((els) => updateEdge(oldEdge, newConnection, els));
        setPendingRequest(true);
    };
    const onElementsRemove = (elementsToRemove) => {
        setElements((els) => removeElements(elementsToRemove, els));
        setPendingRequest(true);
    };

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
                decision: type === "decision", //name changed
                previousDecision: false, //new
                start: type === "start",
                process: type === "process", //name changed
                previousProcess: false, //new
                end: type === "end",
                source: "", //new
                target: "", //new
                processName:
                    type === "start" ? "start" : type === "end" ? "End" : initText,
                previousProcessName: "", //new
                previousProcessWhy: "", //new
                decisionLineName: "", //new
                persona: personaDataToTheNode.persona,
                valueStreamName: personaDataToTheNode.valueStreamName,
                valueStreamWhy: personaDataToTheNode.valueStreamWhy,
                processWhy: "",
                nodeDataList: [],
            },
        };
        setElements((es) => es.concat(newNode));
        // setPendingRequest(true);
    };
    //TODO_RUNNING save handleSaveAllDataToTheDecisionNode
    const handleSaveAllDataToTheDecisionNode = () => {
        console.log({ decisionNodeInitialData });
        if (decisionNodeInitialData) {
            const dataExist = decisionNodeInitialData.some(
                (item) => item.name === ""
            );
            console.log({ dataExist });
            if (dataExist) {
                setopeneds(true);
                return;
            } else {
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
            }
        }
        dispatch(cloaseEditableNodeDataToTheTable(false));
        setOpenDoubleClick(false);
        reset();
    };
    const {
        formState: { errors },
        control,
        handleSubmit,
        reset,
    } = useForm();

    //TODOupdate Node Data of particular thing
    const onUpdateSubmit = (data) => {
        if (data && updatedData.id) {
            const els = [...elements];
            const maped = els.map((el) => {
                if (el.id === updatedData.id) {
                    el.data.processName = data.processName;
                    el.data.processWhy = data.processWhy;
                }
                return el;
            });
            setElements(maped);
            setPendingRequest(true);
            reset();
            setOpenDoubleClick(false);
        }
    };

    //add new ProcessNodeData for the decision node
    const renderOpenClickWayListener = () => {
        let id = nanoid(5);
        const data = {
            id,
            source: "",
            input: "",
            destination: "",
            name: "",
            purpose: "",
            output: "",
        };
        dispatch(addNodeDataToTheTable(data));
    };
    //renderTableModalForUpdateNode

    const handleCloseModal = () => {
        // handleSaveAllDataToTheDecisionNode();
        if (decisionNodeInitialData) {
            const dataExist = decisionNodeInitialData.some(
                (item) => item.name === ""
            );
            console.log({ dataExist });
            if (dataExist) {
                setopeneds(true);
                return;
            } else {
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
            }
        }
        setOpenDoubleClick(false);
        reset();
    };
    //renderFormUpdateOnDoubleClick

    const renderFormUpdateOnDoubleClick = (updatedData) => {
        return (
            <form
                noValidate
                autoComplete="off"
                onSubmit={handleSubmit(onUpdateSubmit)}
            >
                <Grid container>
                    <Grid item md={4}>
                        <Controller
                            name="processName" //node Name
                            control={control}
                            defaultValue={updatedData.data?.processName}
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
                                    label="Process Name"
                                    variant="outlined"
                                    type="text"
                                />
                            )}
                        />

                        {errors.processName && (
                            <Typography style={{ margin: "0" }} color="error">
                                {errors.processName.message}
                            </Typography>
                        )}
                    </Grid>

                    <Grid item md={4}>
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
                                    label="Process Name Why"
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
                    <Grid item md={4}>
                        <TextField
                            id="outlined-read-only-input"
                            label="Persona"
                            defaultValue={updatedData.data?.persona}
                            InputProps={{
                                readOnly: true,
                            }}
                            variant="outlined"
                        />
                    </Grid>
                </Grid>

                <Box className={classes.AddInstructionBtn}>
                    <Button
                        style={{ margin: "20px 20px 10px 0px" }}
                        variant="outlined"
                        color="primary"
                        type="submit"
                    >
                        Update Node Data
                    </Button>
                </Box>
            </form>
        );
    };

    const renderTableModalForUpdateNodeData = () => {
        return (
            <TableModal open={openDoubleClick} handleClose={handleCloseModal}>
                <Box className={classes.table_header}>
                    <Box>
                        <h1>{updatedData.data?.processName} </h1>
                    </Box>
                </Box>
                <Box style={{ minWidth: "800px" }}>
                    {renderFormUpdateOnDoubleClick(updatedData)}
                </Box>

                {updatedData.type === "process" ? (
                    <Box>
                        <Box className={classes.button__container__of___table}>
                            <Button
                                variant="contained"
                                color="secondary"
                                onClick={handleSaveAllDataToTheDecisionNode}
                            >
                                Save All Instruction
                            </Button>
                        </Box>
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

    function saveFlow() {
        const downloadLink = document.createElement("a");
        const fileBlob = new Blob([JSON.stringify(elements, null, 2)], {
            type: "application/json",
        });
        downloadLink.href = URL.createObjectURL(fileBlob);
        downloadLink.download = "square-bear-flow" + nanoid(3) + ".json";
        downloadLink.click();
        setOpenMenuClick(false);
    }
    const updatedArray = [...elements];
    let newArray = [];
    updatedArray.forEach((item) => {
        const { id, type, data } = { ...item };
        const newObject = { id, type, data };
        newArray.push(newObject);
        return newArray;
    });

    // const header = [
    //   { label: 'First Name', key: 'firstname' },
    //   { label: 'Last Name', key: 'lastname' },
    //   { label: 'Email', key: 'email' },
    // ];

    // const datas = [
    //   { firstname: 'Ahmed', lastname: 'Tomi', email: 'ah@smthing.co.com' },
    //   { firstname: 'Raed', lastname: 'Labes', email: 'rl@smthing.co.com' },
    //   { firstname: 'Yezzi', lastname: 'Min l3b', email: 'ymin@cocococo.com' },
    // ];

    function generateCSV() {
        if (elements) {
            dispatch(sendValueStreamAndDiagramForCSV(elements));
            setOpenMenuClick(false);
        }
    }
    function deleteFlow() {
        if (elements) {
            setElements([]);
            setOpenMenuClick(false);
        }
    }
    const renderFunctionOfEditNode = () => {
        return (
            <Modal open={openMenuClick} handleClose={() => setOpenMenuClick(false)}>
                <h1>Execute Algorithm</h1>
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
                        onClick={() => saveFlow()}
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
                        <GetApp style={{ marginRight: "4px" }} /> Download All
                    </div>
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
                        <GetApp style={{ marginRight: "4px" }} /> Generate CSV
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
                    {/* <div
            title='Download All as Temporary'
            style={{
              background: '#4741BE',
              color: 'white',
              display: 'flex',
              padding: '20px 40px',
              borderRadius: '7px',
              margin: '20px 0px',
              cursor: 'pointer',
              height: '70px',
            }}
            className='dndnode'
          >
            <CSVLink data={datas} headers={header}>
              Download CSV
            </CSVLink>
          </div> */}
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
                        title="Decision Node"
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
        <Layout>
            <Box className={classes.root}>
                <Box className="dndflow">
                    <Box className="reactflow-wrapper" ref={reactFlowWrapper}>
                        <ReactFlow
                            nodeTypes={nodeTypes}
                            connectionLineComponent={ConnectionLine}
                            connectionLineType="smoothstep"
                            elements={elements}
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
                            {/* <MiniMap /> */}
                        </ReactFlow>
                    </Box>
                    {SideBar()}
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
