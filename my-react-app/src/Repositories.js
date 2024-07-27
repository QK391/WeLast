// src/Repositories.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Repositories() {
  const [repos, setRepos] = useState([]);
  const [filteredRepos, setFilteredRepos] = useState([]);
  const [languages, setLanguages] = useState([]);
  const [selectedLanguage, setSelectedLanguage] = useState('All');

  useEffect(() => {
    async function fetchRepos() {
      try {
        const response = await axios.get('https://api.github.com/users/freeCodeCamp/repos');
        
        // Sort the repositories by creation date in reverse chronological order
        const sortedRepos = response.data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

        setRepos(sortedRepos);
        setFilteredRepos(sortedRepos);
        
        // Extract unique languages from the repositories
        const uniqueLanguages = ['All', ...new Set(sortedRepos.map(repo => repo.language).filter(Boolean))];
        setLanguages(uniqueLanguages);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }

    fetchRepos();
  }, []);

  const handleLanguageClick = (language) => {
    setSelectedLanguage(language);
    if (language === 'All') {
      setFilteredRepos(repos);
    } else {
      setFilteredRepos(repos.filter(repo => repo.language === language));
    }
  };

  return (
    <div>
      <h1>Repositories</h1>
      <div>
        {languages.map(language => (
          <button 
            key={language} 
            onClick={() => handleLanguageClick(language)}
            style={{ fontWeight: selectedLanguage === language ? 'bold' : 'normal' }}
          >
            {language}
          </button>
        ))}
      </div>
      <ul>
        {filteredRepos.map(repo => (
          <li key={repo.id}>
            <a href={repo.html_url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'inherit' }}>
              <h2>{repo.name}</h2>
              <p>{repo.description}</p>
              <p><strong>Language:</strong> {repo.language}</p>
              <p><strong>Forks:</strong> {repo.forks}</p>
              <p><strong>Created at:</strong> {new Date(repo.created_at).toLocaleDateString()}</p>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Repositories;
