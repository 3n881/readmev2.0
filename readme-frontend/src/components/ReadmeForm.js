
import React, { useState } from 'react';
import { TextField, Button, Box, CircularProgress, Chip, Typography } from '@mui/material';
import { AutoAwesome, Add } from '@mui/icons-material';

function ReadmeForm({ setReadmeContent, setProjectName }) {
  const [formData, setFormData] = useState({
    projectName: '',
    description: '',
    technologies: [],
    liveDemoLink: '',
    youtubeLink: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [techInput, setTechInput] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleTechInputChange = (e) => {
    setTechInput(e.target.value);
  };

  const handleAddTech = () => {
    if (techInput.trim() !== '' && !formData.technologies.includes(techInput.trim())) {
      setFormData((prevData) => ({
        ...prevData,
        technologies: [...prevData.technologies, techInput.trim()],
      }));
      setTechInput('');
    }
  };

  const handleRemoveTech = (tech) => {
    setFormData((prevData) => ({
      ...prevData,
      technologies: prevData.technologies.filter((t) => t !== tech),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:3000/api/generate-readme', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          technologies: formData.technologies.join(', '),
        }),
      });

      const data = await response.json();
      setReadmeContent(data.readme);
      setProjectName(formData.projectName);
    } catch (error) {
      console.error('Error generating README:', error);
      alert('Failed to generate README. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <TextField
        fullWidth
        label="Project Name"
        name="projectName"
        value={formData.projectName}
        onChange={handleChange}
        required
        variant="outlined"
        InputProps={{
          sx: { borderRadius: 2 },
        }}
      />
      <TextField
        fullWidth
        label="Project Description"
        name="description"
        value={formData.description}
        onChange={handleChange}
        multiline
        rows={4}
        required
        variant="outlined"
        InputProps={{
          sx: { borderRadius: 2 },
        }}
      />
      <Box>
        <Typography variant="subtitle1" gutterBottom>
          Technologies Used
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
          {formData.technologies.map((tech) => (
            <Chip
              key={tech}
              label={tech}
              onDelete={() => handleRemoveTech(tech)}
              color="primary"
              variant="outlined"
            />
          ))}
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <TextField
            fullWidth
            label="Add Technology"
            value={techInput}
            onChange={handleTechInputChange}
            variant="outlined"
            InputProps={{
              sx: { borderRadius: 2 },
            }}
          />
          <Button
            onClick={handleAddTech}
            variant="contained"
            color="secondary"
            sx={{ minWidth: 'auto', px: 2 }}
          >
            <Add />
          </Button>
        </Box>
      </Box>

      <TextField
        fullWidth
        label="Live Demo Link (Optional)"
        name="liveDemoLink"
        value={formData.liveDemoLink}
        onChange={handleChange}
        variant="outlined"
        InputProps={{
          sx: { borderRadius: 2 },
        }}
      />
      <TextField
        fullWidth
        label="YouTube Video Link (Optional)"
        name="youtubeLink"
        value={formData.youtubeLink}
        onChange={handleChange}
        variant="outlined"
        InputProps={{
          sx: { borderRadius: 2 },
        }}
      />

      <Button
        type="submit"
        variant="contained"
        color="primary"
        size="large"
        disabled={isLoading}
        startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : <AutoAwesome />}
        sx={{
          py: 1.5,
          fontWeight: 600,
          fontSize: '1rem',
          boxShadow: '0 4px 6px rgba(98, 0, 234, 0.25)',
          '&:hover': {
            boxShadow: '0 6px 10px rgba(98, 0, 234, 0.3)',
          },
        }}
      >
        {isLoading ? 'Generating...' : 'Generate AI README'}
      </Button>
    </Box>
  );
}

export default ReadmeForm;
