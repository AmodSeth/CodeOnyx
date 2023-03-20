
import './App.css';
import {BrowserRouter,Routes,Route} from "react-router-dom"
import Home from './Pages/Home';
import EditorPage from './Pages/EditorPage';

function App() {
  return (
    <>
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home/>}></Route>
        <Route path='/editor/:id' element={<EditorPage/>}></Route>




      </Routes>
    
    
    </BrowserRouter>
    
    </>
  );
}

export default App;
