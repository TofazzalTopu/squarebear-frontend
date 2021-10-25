import { FormControlLabel, IconButton, makeStyles } from '@material-ui/core';
import RemoveCircleIcon from '@material-ui/icons/RemoveCircle';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
const MatEdit = () => {

    const classes = useStyles();
    return <FormControlLabel
        control={
            <IconButton
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
        headerName: 'Source',
        width: 150,
        sortable: false,
        description: 'You Can Update Source Column data.',
        editable: true,
    },
    {
        field: 'input',
        headerName: 'Input',
        width: 150,
        editable: true,
        sortable: false,
        description: 'You Can Update Input Column data.',
    },

    {
        field: 'name',
        headerName: 'Name',
        width: 250,
        required: true,
        editable: true,
        sortable: false,
        description: 'You Can Update Name Column data.',
    },
    {
        field: 'output',
        headerName: 'Output',
        width: 180,
        editable: true,
        description: 'You Can Update Output Column data.',
        sortable: false,
    },
    {
        field: 'destination',
        headerName: 'Destination',
        description: 'You Can Update Destination Column data.',
        sortable: false,
        editable: true,
        width: 140,
    },
    {
        field: 'delete',
        headerName: '',
        sortable: false,
        width: 80,
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
    cursor: "pointer",
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
}));
