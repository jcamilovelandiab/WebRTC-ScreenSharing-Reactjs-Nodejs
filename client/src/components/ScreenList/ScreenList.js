import React from 'react';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import IconButton from '@material-ui/core/IconButton';
import Paper from '@material-ui/core/Paper';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import useStyles from './ScreenListStyles';

 const screens = [
  {
    video: 'https://source.unsplash.com/random',
    name: 'Camilo',
  },
  {
    video: 'https://source.unsplash.com/random',
    name: 'Tess',
  },
  {
    video: 'https://source.unsplash.com/random',
    name: 'Juan',
  }
];
export default function ScreenList() {

    const classes = useStyles();

    return (
        <div className={classes.root}>
            <Paper
                className={classes.paper}
                elevation={3}
            >
                <GridList className={classes.gridList}>
                    {screens.map((tile) => (
                        <GridListTile
                            key={tile.video}
                            cols={2}
                            rows={2}
                        >
                            <img
                                src={tile.video}
                                alt={tile.name}
                            />
                            <GridListTileBar
                                title={tile.name}
                                titlePosition="top"
                                actionIcon={
                                    <IconButton
                                        aria-label={`more ${tile.name}`}
                                        className={classes.icon}
                                    >
                                        <MoreVertIcon />
                                    </IconButton>
                                }
                                actionPosition="right"
                                className={classes.titleBar}
                            />
                        </GridListTile>
                        ))
                    }
                </GridList>
            </Paper>
        </div>
    );
}