import * as React from 'react';
// import { DataGrid } from '@material-ui/data-grid';
import { DataGrid } from '@mui/x-data-grid';
import { useDispatch } from 'react-redux';
import columns from '../../assets/Data/DataGrid'
import {
    deleteNodeDataToTheTable, updateNodeDataToTheTable,
} from '../../redux/actions';
import { makeStyles } from '@material-ui/styles';


export default function DataGridOfProcessNode({ rows }) {
    const classes = useStyles()
    const dispatch = useDispatch()
    const handleDeleteItem = (id) => {
        dispatch(deleteNodeDataToTheTable(id))
    }
    const handleEditItem = (id, value, name) => {
        const data = {
            id, name, value
        }
        dispatch(updateNodeDataToTheTable(data))
    }

    return (
        <div className={classes.rootOfProcessNode}>
            <DataGrid
                rows={rows}
                columns={columns}
                isCellEditable={() => true}
                onCellEditCommit={(row) => {
                    if (row.id && row.field) {
                        handleEditItem(row.id, row.field, row.value)
                    }
                    console.log({ row });
                }}
                disableColumnMenu
                pageSize={5}
                onCellClick={(row) => {
                    if (row.id && row.field === 'delete') {
                        handleDeleteItem(row.id)
                    }
                }
                }
                disableSelectionOnClick
            />
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
        }
    }
})