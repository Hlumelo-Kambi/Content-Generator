import { useState } from 'react';

const ModelSelector = ({ onModelChange }) => {
  const [selectedModel, setSelectedModel] = useState('mistralai/Mistral-7B-Instruct-v0.1');

  const models = {
    text: [
      { id: 'mistralai/Mistral-7B-Instruct-v0.1', name: 'Mistral 7B' },
      { id: 'meta-llama/Llama-2-7b-chat-hf', name: 'Llama 2 7B' },
      { id: 'google/gemma-7b-it', name: 'Gemma 7B' }
    ],
    code: [
      { id: 'bigcode/starcoder2-7b', name: 'StarCoder2 7B' },
      { id: 'deepseek-ai/deepseek-coder-6.7b-instruct', name: 'DeepSeek Coder' }
    ],
    image: [
      { id: 'stabilityai/stable-diffusion-xl-base-1.0', name: 'Stable Diffusion XL' },
      { id: 'runwayml/stable-diffusion-v1-5', name: 'Stable Diffusion 1.5' }
    ]
  };

  const handleChange = (e) => {
    setSelectedModel(e.target.value);
    onModelChange(e.target.value);
  };

  return (
    <div className="model-selector">
      <label htmlFor="model-select">Select Model: </label>
      <select 
        id="model-select" 
        value={selectedModel} 
        onChange={handleChange}
      >
        {Object.entries(models).map(([category, modelList]) => (
          <optgroup key={category} label={`${category.toUpperCase()} Models`}>
            {modelList.map((model) => (
              <option key={model.id} value={model.id}>
                {model.name}
              </option>
            ))}
          </optgroup>
        ))}
      </select>
    </div>
  );
};

export default ModelSelector;