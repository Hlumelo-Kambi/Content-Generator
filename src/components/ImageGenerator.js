import { useState, useRef } from 'react';
import { HfInference } from '@huggingface/inference';

const ImageGenerator = ({ model }) => {
  const [prompt, setPrompt] = useState('');
  const [negativePrompt, setNegativePrompt] = useState('blurry, low quality');
  const [image, setImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [size, setSize] = useState('512x512');
  const downloadRef = useRef(null);
  
  const hf = new HfInference(process.env.REACT_APP_HF_TOKEN);

  const generateImage = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [width, height] = size.split('x').map(Number);
      
      const response = await hf.textToImage({
        model: model,
        inputs: prompt,
        parameters: {
          negative_prompt: negativePrompt,
          width,
          height
        }
      });
      
      const imageUrl = URL.createObjectURL(response);
      setImage(imageUrl);
    } catch (err) {
      setError(`Error: ${err.message}. Try a different prompt.`);
      console.error("API Error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const triggerDownload = () => {
    if (image && downloadRef.current) {
      downloadRef.current.click();
    }
  };

  return (
    <div className="generator-container">
      <h2>Image Generator ({model.split('/').pop()})</h2>
      
      <div className="input-group">
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Describe the image you want..."
          disabled={isLoading}
        />
        
        <input
          type="text"
          value={negativePrompt}
          onChange={(e) => setNegativePrompt(e.target.value)}
          placeholder="What to avoid (optional)"
          disabled={isLoading}
        />
        
        <select 
          value={size} 
          onChange={(e) => setSize(e.target.value)}
          disabled={isLoading}
        >
          <option value="512x512">512x512</option>
          <option value="768x768">768x768</option>
          <option value="1024x1024">1024x1024</option>
        </select>
      </div>

      <button 
        onClick={generateImage} 
        disabled={isLoading || !prompt.trim()}
      >
        {isLoading ? 'Generating...' : 'Generate Image'}
      </button>

      {error && <div className="error-message">{error}</div>}

      <div className="image-result">
        {image ? (
          <>
            <img 
              src={image} 
              alt="Generated from prompt" 
              onLoad={() => URL.revokeObjectURL(image)}
            />
            <div className="image-actions">
              <a
                href={image}
                download={`ai-image-${Date.now()}.png`}
                ref={downloadRef}
                style={{ display: 'none' }}
              >
                Download
              </a>
              <button onClick={triggerDownload}>
                Download Image
              </button>
            </div>
          </>
        ) : (
          <div className={`placeholder ${isLoading ? 'loading' : ''}`}>
            {isLoading ? (
              <div className="loader">Generating image...</div>
            ) : (
              'Your generated image will appear here'
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageGenerator;