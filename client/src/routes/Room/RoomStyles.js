import {makeStyles} from "@material-ui/core/styles";

const useStyles = makeStyles((theme)=>({
    root: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        overflow: 'hidden',
        '& > *': {
            padding: theme.spacing(1),
            margin: theme.spacing(1)
        }
    },
    container: {
        display: "flex",
        flexDirection: "column"
    },
    paper: {
        padding: "10px",
        margin: "30px"
    }
}));

export default useStyles;