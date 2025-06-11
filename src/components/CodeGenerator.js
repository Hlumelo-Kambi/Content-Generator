import { useState } from 'react';
import { HfInference } from '@huggingface/inference';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

const CodeGenerator = ({ model }) => {
  const [prompt, setPrompt] = useState('');
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('python');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const hf = new HfInference(process.env.REACT_APP_HF_TOKEN);

  const generateCode = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await hf.textGeneration({
        model: model,
        inputs: `Write a ${language} code that ${prompt}. Return ONLY the code with no additional explanations.`,
        parameters: { 
          max_new_tokens: 600,
          temperature: 0.2  // Lower for more deterministic code
        }
      });
      
      // Clean up the output (remove potential natural language)
      const cleanCode = response.generated_text.replace(/```[\s\S]*?\n|```/g, '');
      setCode(cleanCode.trim());
    } catch (err) {
      setError(`Error: ${err.message}. Try a shorter prompt.`);
      console.error("API Error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="generator-container">
      <h2>Code Generator ({model.split('/').pop()})</h2>
      
      <div className="input-group">
        <select 
          value={language} 
          onChange={(e) => setLanguage(e.target.value)}
          disabled={isLoading}
        >
          <option value="python">Python</option>
          <option value="javascript">JavaScript</option>
          <option value="typescript">TypeScript</option>
          <option value="java">Java</option>
          <option value="c++">C++</option>
          <option value="rust">Rust</option>
        </select>
        
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="What should the code do?"
          disabled={isLoading}
        />
      </div>

      <button 
        onClick={generateCode} 
        disabled={isLoading || !prompt.trim()}
      >
        {isLoading ? 'Generating...' : 'Generate Code'}
      </button>

      {error && <div className="error-message">{error}</div>}

      <div className="code-output">
        {code ? (
          <SyntaxHighlighter 
            language={language} 
            style={atomDark}
            showLineNumbers
          >
            {code}
          </SyntaxHighlighter>
        ) : (
          <div className="placeholder">
            {isLoading ? 'Generating code...' : 'Your generated code will appear here'}
          </div>
        )}
      </div>
    </div>
  );
};

export default CodeGenerator;