import { useState } from 'react';
import ModelSelector from './components/ModelSelector';
import './App.css';
import TextGenerator from './components/TextGenerator';
import CodeGenerator from './components/CodeGenerator';
import ImageGenerator from './components/ImageGenerator';

function App() {
  const [activeTab, setActiveTab] = useState('text');
  const [selectedModel, setSelectedModel] = useState('mistralai/Mistral-7B-Instruct-v0.1');

  return (
    <div className="App">
      <header>
        <h1>AI Toolbox</h1>
         <ModelSelector onModelChange={setSelectedModel} />
        <nav>
          <button onClick={() => setActiveTab('text')}>Text</button>
          <button onClick={() => setActiveTab('code')}>Code</button>
          <button onClick={() => setActiveTab('image')}>Images</button>
        </nav>
      </header>
       <main>
        {activeTab === 'text' && <TextGenerator model={selectedModel} />}
        {activeTab === 'code' && <CodeGenerator model={selectedModel} />}
        {activeTab === 'image' && <ImageGenerator model={selectedModel} />}
      </main>
    </div>
  );
}

export default App;