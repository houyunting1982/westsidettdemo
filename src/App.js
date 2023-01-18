import './App.css';
import Displayer from './components/Displayer';
import { useLocation } from 'react-router-dom';
import { useMemo } from 'react';
import Sidebar from './components/Sidebar';
import { Grid, Stack } from '@mui/material';
import Header from './components/Header';

function useQuery() {
    const { search } = useLocation();
    return useMemo(() => new URLSearchParams(search), [search]);
}

function App() {
    const query = useQuery();
    const totalCamera = query.get("totalCamera") || 24
    return (
        <Stack className="App">
            <Header />
            <Grid container alignItems="center" spacing={2}>
                <Grid item xs={3}>
                    <Sidebar />
                </Grid>
                <Grid item xs={9}>
                    <Displayer totalCamera={totalCamera} />
                </Grid>
            </Grid>
        </Stack>
    );
}

export default App;
