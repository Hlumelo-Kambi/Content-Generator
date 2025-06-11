import { useState } from 'react';
import { HfInference } from '@huggingface/inference';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

const TextGenerator = ({ model }) => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const hf = new HfInference(process.env.REACT_APP_HF_TOKEN);

  const generateText = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await hf.textGeneration({
        model: model,
        inputs: input,
        parameters: { 
          max_new_tokens: 500,
          temperature: 0.7,
          do_sample: true 
        }
      });
      setOutput(response.generated_text);
    } catch (err) {
      setError(`Error: ${err.message}. Please try again.`);
      console.error("API Error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="generator-container">
      <h2>Text Generator ({model.split('/').pop()})</h2>
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Enter your prompt..."
        disabled={isLoading}
      />
      <button 
        onClick={generateText} 
        disabled={isLoading || !input.trim()}
      >
        {isLoading ? 'Generating...' : 'Generate Text'}
      </button>
      
      {error && <div className="error-message">{error}</div>}

      <div className="output-container">
        {output ? (
          <ReactMarkdown
            components={{
              code({node, inline, className, children, ...props}) {
                const match = /language-(\w+)/.exec(className || '');
                return !inline && match ? (
                  <SyntaxHighlighter
                    style={atomDark}
                    language={match[1]}
                    PreTag="div"
                    {...props}
                  >
                    {String(children).replace(/\n$/, '')}
                  </SyntaxHighlighter>
                ) : (
                  <code className={className} {...props}>
                    {children}
                  </code>
                );
              }
            }}
          >
            {output}
          </ReactMarkdown>
        ) : (
          <div className="placeholder">
            {isLoading ? 'Generating response...' : 'Your generated text will appear here'}
          </div>
        )}
      </div>
    </div>
  );
};

export default TextGenerator;