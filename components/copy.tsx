import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
interface CodeBlockProps {
  code: any;
}

export const CodeBlock: React.FC<CodeBlockProps> = ({ code }) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="relative w-96 md:w-full  bg-gray-800 p-5 rounded-2xl my-5 mr-2">
        <pre className="p-4 m-0 font-sans text-balance text-sm leading-relaxed rounded-lg bg-gray-900 text-gray-300">
            <ReactMarkdown>{code}</ReactMarkdown>
        </pre>
        <button
            className={`absolute top-2 right-2 bg-gray-700 text-gray-300 border border-gray-300 
                        rounded-full px-3 py-1 text-xs cursor-pointer 
                        transition duration-300 hover:bg-gray-400 hover:text-black`}
            onClick={copyToClipboard}
        >
            {copied ? 'Copiado!' : 'Copiar'}
        </button>
    </div>
);
};