import React, { useState } from 'react';
import { Box, Button, Typography, Paper } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DownloadIcon from '@mui/icons-material/Download';
// import ReactMarkdown from 'react-markdown';
import { marked } from 'marked'; // Import marked to convert Markdown to HTML


function ReadmePreview({ readmeContent, projectName }) {
  const [isCopying, setIsCopying] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [viewMode, setViewMode] = useState('raw'); // State for toggling between raw and rendered views



const cleanReadmeContent = (content) => {
    // If the content starts with "```markdown", remove it
    if (content.startsWith('```markdown')) {
        return content
          .replace(/^```markdown\s*/g, '')  // Remove the "```markdown" at the start
          .replace(/```$/g, '')             // Remove the "```" at the end
          .trim();                          // Trim any leading or trailing spaces
      }
    // Otherwise, return the content as is
    return content.trim();
  };


  const handleCopy = async () => {
    setIsCopying(true);
    try {
      await navigator.clipboard.writeText(readmeContent);
      alert('README copied to clipboard!');
    } catch (error) {
      console.error('Failed to copy README:', error);
      alert('Failed to copy README');
    } finally {
      setIsCopying(false);
    }
  };

  const handleDownload = () => {
    setIsDownloading(true);
    try {
      const element = document.createElement('a');
      const blob = new Blob([readmeContent], { type: 'text/markdown' });
      const url = URL.createObjectURL(blob);
      element.href = url;
      element.download = `${projectName}-README.md`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    } catch (error) {
      console.error('Failed to download README:', error);
      alert('Failed to download README');
    } finally {
      setIsDownloading(false);
    }
  };

  if (!readmeContent) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="body1" color="text.secondary">
          No README generated yet. Please use the Input tab to generate a README.
        </Typography>
      </Box>
    );
  }

  const cleanedContent = cleanReadmeContent(readmeContent); // Clean the content if necessary

  const htmlContent = marked(cleanedContent);


return (
  <Box sx={{ p: 3 }}>
    <Box sx={{ display: 'flex', justifyContent: 'flex-start', mb: 2 }}>
      <Button
        variant="outlined"
        onClick={() => setViewMode('raw')}
        sx={{ mr: 2 }}
      >
        Raw Markdown
      </Button>
      <Button
        variant="outlined"
        onClick={() => setViewMode('rendered')}
      >
        Rendered README
      </Button>
    </Box>

    {/* Display Raw Markdown or Rendered README based on selected view mode */}
    {viewMode === 'raw' ? (
      <Box>
        <Typography variant="h6" gutterBottom>
          Raw Markdown Syntax (GitHub Style)
        </Typography>
        <Paper elevation={1} sx={{ p: 2, mb: 2, maxHeight: '400px', overflow: 'auto' }}>
          <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
            {cleanedContent}
          </pre>
        </Paper>
      </Box>
    ) : (
      <Box>
        <Typography variant="h6" gutterBottom>
          Rendered README (GitHub Preview)
        </Typography>
        <Paper elevation={1} sx={{ p: 2, mb: 2, maxHeight: '400px', overflow: 'auto' }}>
          {/* Render the Markdown as HTML */}
          <div
            style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}
            dangerouslySetInnerHTML={{ __html: htmlContent }}
          />
        </Paper>
      </Box>
    )}

    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
      <Button
        variant="contained"
        color="primary"
        startIcon={<ContentCopyIcon />}
        onClick={handleCopy}
        disabled={isCopying}
      >
        {isCopying ? 'Copying...' : 'Copy to Clipboard'}
      </Button>
      <Button
        variant="contained"
        color="secondary"
        startIcon={<DownloadIcon />}
        onClick={handleDownload}
        disabled={isDownloading}
      >
        {isDownloading ? 'Downloading...' : 'Download README'}
      </Button>
    </Box>
  </Box>
);
}


export default ReadmePreview;

