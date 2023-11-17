import { Routes, Route, BrowserRouter} from 'react-router-dom';
import ShowBooks from './components/ShowBooks';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/book' element={<ShowBooks></ShowBooks>}></Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App;
