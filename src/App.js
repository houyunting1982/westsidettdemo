import './App.css';
import Displayer from './components/Displayer';
import { useLocation } from 'react-router-dom';
import { useMemo } from 'react';

function useQuery() {
    const { search } = useLocation();
    return useMemo(() => new URLSearchParams(search), [search]);
}

function App() {
    const query = useQuery();
    const totalCamera = query.get("totalCamera") || 24
    return (
        <div className="App">
            <Displayer totalCamera={totalCamera} />
        </div>
    );
}

export default App;
