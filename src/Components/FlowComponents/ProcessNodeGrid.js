import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { useDispatch } from 'react-redux';
import columns from '../../assets/Data/DataGrid'
import {
    addNodeDataToTheTable,
    deleteNodeDataToTheTable,
    updateNodeDataToTheTable,
} from '../../redux/actions';
import { makeStyles } from '@material-ui/styles';
import { nanoid } from 'nanoid';
import { Fab } from '@material-ui/core';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';

export default function DataGridOfProcessNode({ rows }) {
    const classes = useStyles()
    const dispatch = useDispatch()
    const renderOpenClickWayListener = React.useCallback(() => {
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
    }, [dispatch]);
    const handleDeleteItem = (id) => {

        dispatch(deleteNodeDataToTheTable(id))
    }
    const handleEditItem = (id, value, name) => {
        const data = {
            id, name, value
        }
        dispatch(updateNodeDataToTheTable(data))
    }
    const newSetRow = [...new Set(rows)];

    return (
        <div className={classes.rootOfProcessNode}>
            <DataGrid
                rows={newSetRow}
                columns={columns}
                isCellEditable={() => true}
                onCellEditCommit={(row) => {
                    if (row.id && row.field) {
                        handleEditItem(row.id, row.field, row.value)
                    }
                }}
                onCellEditStart={(row) => console.log("Start", { row })}
                onCellEditStop={(row) => console.log("Stop", { row })}
                onEditCellChange={(row) => {
                    console.log({ row });
                    // if (row.id && row.field) {
                    //     handleEditItem(row.id, row.field, row.props.value)
                    // }
                }}
                disableColumnMenu
                pageSize={5}
                onCellClick={(row) => {
                    if (row.id && row.field === 'Delete') {
                        handleDeleteItem(row.id)
                    }
                    if (row.id && row.field === 'Add') {
                        renderOpenClickWayListener()
                    }
                }
                }
                disableSelectionOnClick
            />
            {
                rows.length === 0 && <div className={classes.buttonInDataGrid}>
                    <div title="add a new workflow" className={classes.addButton}>
                        <Fab onClick={renderOpenClickWayListener} color="primary" aria-label="add">
                            <AddCircleOutlineIcon fontSize="large" />
                        </Fab>
                    </div>
                </div>
            }
        </div>
    );
}
const useStyles = makeStyles({
    rootOfProcessNode: {
        height: 400,
        width: 1000,
        '& .MuiDataGrid-cell': {
            border: '1px solid #d4cfcf',
            borderRadius: '8px'
        },

    },
    buttonInDataGrid: {
        position: "relative"
    },
    addButton: {
        position: "absolute",
        color: "red",
        zIndex: 93,
        bottom: 5,
        left: 5

    }
})