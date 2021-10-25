import { FormControlLabel, IconButton, makeStyles } from '@material-ui/core';
import RemoveCircleIcon from '@material-ui/icons/RemoveCircle';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
const MatEdit = () => {

    const classes = useStyles();
    return <FormControlLabel
        className={classes.root}
        control={
            <IconButton
                title="delete  this workflow"
                className={classes.addButton}
                color="secondary"
                aria-label="add an alarm"
            >
                <RemoveCircleIcon style={{ color: 'red', }} />
            </IconButton>
        }
    />
};
const MatAdd = () => {
    const classes = useStyles();

    return <FormControlLabel
        control={
            <IconButton
                title="add a new workflow"
                color="secondary"
                aria-label="add an alarm"
                className={classes.addButton}
            >
                <AddCircleOutlineIcon style={{ color: 'green', }} />
            </IconButton>
        }
    />
};

const columns = [
    {
        field: 'source',
        headerName: 'Input came from',
        width: 150,
        sortable: false,
        description: 'Source',
        editable: true,
    },
    {
        field: 'input',
        headerName: "Input's name is",
        width: 150,
        editable: true,
        sortable: false,
        description: 'Input',
    },

    {
        field: 'name',
        headerName: 'We are doing *',
        width: 250,
        required: true,
        editable: true,
        sortable: false,
        description: 'Work instruction name.',
    },
    {
        field: 'output',
        headerName: 'Output name is',
        width: 180,
        editable: true,
        description: 'Output',
        sortable: false,
    },
    {
        field: 'destination',
        headerName: 'Output goes to',
        description: 'Destination',
        sortable: false,
        editable: true,
        width: 133,
    },
    {
        field: 'Delete',
        headerName: '',
        sortable: false,
        width: 75,
        renderCell: (params) => {

            return (
                <div

                >
                    <MatEdit index={params.row.id} />
                </div>
            );
        }
    },
    {
        field: 'Add',
        headerName: 'Add',
        sortable: false,
        width: 60,
        renderCell: (params) => {

            return (
                <div

                >
                    <MatAdd index={params.row.id} />
                </div>
            );
        }
    },
];


export default columns;


const useStyles = makeStyles((theme) => ({
    addButton: {
        cursor: "pointer",
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: "10px",
    }
    ,

}));
