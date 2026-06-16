import dotenv from 'dotenv';
dotenv.config();

// Simple in-memory cache for repeated job searches to save RapidAPI rate limits
const jobsCache = new Map();

// Helper to determine string similarity/presence
const calculateMatchScore = (jobText, userSkills) => {
  if (!userSkills || userSkills.length === 0) return 0;
  
  const text = jobText.toLowerCase();
  let matchCount = 0;
  
  userSkills.forEach(skill => {
    // Basic presence check, we give slightly more weight to skills directly mentioned
    if (text.includes(skill.toLowerCase())) {
      matchCount += 1;
    }
  });

  // Calculate percentage of skills matched (capped at 100)
  // For better visual scores, we add a base relevancy of 30 if at least 1 match is found
  if (matchCount === 0) return Math.floor(Math.random() * 20) + 10; // 10-30 baseline for generic
  
  const percentage = Math.floor((matchCount / userSkills.length) * 70) + 30;
  return Math.min(percentage, 100);
};

export const getJobs = async (req, res) => {
  try {
    const { skills, location } = req.query;
    const skillList = skills ? skills.split(',').map(s => s.trim()) : [];
    const queryTerm = skillList.length > 0 ? skillList[0] + ' developer' : 'software engineering';
    const locationTerm = location || 'Remote';
    
    const cacheKey = `${queryTerm.toLowerCase()}_${locationTerm.toLowerCase()}`;

    let jobsData = [];

    if (jobsCache.has(cacheKey)) {
      console.log('Serving jobs from cache...');
      jobsData = jobsCache.get(cacheKey);
    } else {
      console.log('Fetching formatting from RapidAPI JSearch...');
      const apiKey = process.env.RAPIDAPI_KEY;

      if (!apiKey || apiKey === 'your_key_here') {
        // Fallback Mock Data if no key is provided
        console.log("No RapidAPI Key found, using mock fallback data...");
        jobsData = [
          {
            employer_name: 'TechNova',
            job_title: 'Frontend Engineer',
            job_city: 'San Francisco',
            job_state: 'CA',
            job_description: 'We are looking for an expert in Angular, React, and modern JavaScript. Knowledge of UI design and APIs is preferred.',
            job_apply_link: 'https://example.com/apply/1'
          },
          {
            employer_name: 'CloudSync',
            job_title: 'Full Stack Java/Angular Developer',
            job_city: 'Remote',
            job_state: 'Remote',
            job_description: 'Join our team. Requirements: Java, Spring Boot, MySQL, REST APIs, and front-end tools like Angular or Vue.',
            job_apply_link: 'https://example.com/apply/2'
          },
          {
            employer_name: 'DataPulse',
            job_title: 'Backend Software Engineer',
            job_city: 'New York',
            job_state: 'NY',
            job_description: 'Experience required in Node.js, Express, databases, and general software architecture.',
            job_apply_link: 'https://example.com/apply/3'
          }
        ];
      } else {
        // Real API Call
        const url = `https://jsearch.p.rapidapi.com/search?query=${encodeURIComponent(queryTerm + ' in ' + locationTerm)}&page=1&num_pages=1`;
        
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'x-rapidapi-key': apiKey,
            'x-rapidapi-host': 'jsearch.p.rapidapi.com'
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch from JSearch API');
        }

        const result = await response.json();
        jobsData = result.data || [];
        
        // Save to cache
        jobsCache.set(cacheKey, jobsData);
        setTimeout(() => jobsCache.delete(cacheKey), 3600000); // 1 hour cache
      }
    }

    // Process and score jobs
    const formattedJobs = jobsData.map(job => {
      const fullText = (job.job_title || '') + ' ' + (job.job_description || '');
      const matchScore = calculateMatchScore(fullText, skillList);

      return {
        title: job.job_title,
        company: job.employer_name,
        location: `${job.job_city || ''}, ${job.job_state || 'Remote'}`,
        matchScore: matchScore,
        applyLink: job.job_apply_link || '#',
        description: job.job_description ? job.job_description.substring(0, 150) + '...' : ''
      };
    });

    // Sort by match score descending
    formattedJobs.sort((a, b) => b.matchScore - a.matchScore);

    res.status(200).json({
      success: true,
      data: formattedJobs,
      message: 'Jobs fetched successfully'
    });

  } catch (error) {
    console.error('Job Fetch Error:', error);
    res.status(500).json({
      success: false,
      data: [],
      message: 'An error occurred while fetching jobs. Please try again later.'
    });
  }
};
