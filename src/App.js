import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

function App() {
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedModule, setSelectedModule] = useState(null);

  useEffect(() => {
    fetchModules();
  }, []);

  const fetchModules = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/api/modules`);
      setModules(response.data.modules);
    } catch (error) {
      console.error('Error fetching modules:', error);
    }
    setLoading(false);
  };

  const handleModuleClick = async (moduleId) => {
    try {
      const response = await axios.get(`${API_URL}/api/modules/${moduleId}`);
      setSelectedModule(response.data);
    } catch (error) {
      console.error('Error fetching module:', error);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>📚 Training Module</h1>
      </header>

      <div className="container">
        <div className="modules-list">
          <h2>Available Modules</h2>
          {loading ? (
            <p>Loading...</p>
          ) : (
            <ul>
              {modules.map((module) => (
                <li key={module.id}>
                  <button
                    onClick={() => handleModuleClick(module.id)}
                    className={selectedModule?.id === module.id ? 'active' : ''}
                  >
                    {module.title}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="module-content">
          {selectedModule ? (
            <>
              <h2>{selectedModule.title}</h2>
              <p>{selectedModule.content}</p>
            </>
          ) : (
            <p>Select a module to view content</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
