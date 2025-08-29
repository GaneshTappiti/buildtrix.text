const fs = require('fs');
const path = require('path');

// Read the cleaned investor data
const investorDataPath = path.join(__dirname, '..', 'investors_data_cleaned.json');
const rawData = JSON.parse(fs.readFileSync(investorDataPath, 'utf8'));

// Function to extract domain from email
function extractDomain(email) {
  if (!email || typeof email !== 'string') return '';
  const domain = email.split('@')[1];
  return domain ? `https://${domain}` : '';
}

// Function to generate focus areas based on company name and position
function generateFocusAreas(companyName, position) {
  const focusAreas = [];
  const company = (companyName || '').toLowerCase();
  const pos = (position || '').toLowerCase();
  
  // Tech-related keywords
  if (company.includes('tech') || pos.includes('tech')) focusAreas.push('Technology');
  if (company.includes('fintech') || pos.includes('fintech')) focusAreas.push('FinTech');
  if (company.includes('health') || pos.includes('health')) focusAreas.push('HealthTech');
  if (company.includes('edu') || pos.includes('education')) focusAreas.push('EdTech');
  if (company.includes('ai') || pos.includes('ai') || company.includes('artificial')) focusAreas.push('AI/ML');
  if (company.includes('saas') || pos.includes('saas')) focusAreas.push('SaaS');
  if (company.includes('venture') || pos.includes('venture')) focusAreas.push('Venture Capital');
  if (company.includes('startup') || pos.includes('startup')) focusAreas.push('Startups');
  if (company.includes('fund') || pos.includes('fund')) focusAreas.push('Investment Fund');
  if (company.includes('capital') || pos.includes('capital')) focusAreas.push('Private Equity');
  if (company.includes('angel') || pos.includes('angel')) focusAreas.push('Angel Investment');
  if (company.includes('accelerator') || pos.includes('accelerator')) focusAreas.push('Accelerator');
  if (company.includes('incubator') || pos.includes('incubator')) focusAreas.push('Incubator');
  
  // Industry-specific
  if (company.includes('media') || pos.includes('media')) focusAreas.push('Media');
  if (company.includes('retail') || pos.includes('retail')) focusAreas.push('Retail');
  if (company.includes('food') || pos.includes('food')) focusAreas.push('Food & Beverage');
  if (company.includes('energy') || pos.includes('energy')) focusAreas.push('Energy');
  if (company.includes('real estate') || pos.includes('real estate')) focusAreas.push('Real Estate');
  if (company.includes('logistics') || pos.includes('logistics')) focusAreas.push('Logistics');
  if (company.includes('travel') || pos.includes('travel')) focusAreas.push('Travel');
  if (company.includes('gaming') || pos.includes('gaming')) focusAreas.push('Gaming');
  
  // Default focus areas if none found
  if (focusAreas.length === 0) {
    if (pos.includes('founder') || pos.includes('ceo')) focusAreas.push('Entrepreneurship');
    else if (pos.includes('investor') || pos.includes('investment')) focusAreas.push('Investment');
    else focusAreas.push('General');
  }
  
  return focusAreas;
}

// Function to generate investment range based on position and company
function generateInvestmentRange(position, company) {
  const pos = (position || '').toLowerCase();
  const comp = (company || '').toLowerCase();
  
  if (pos.includes('angel') || comp.includes('angel')) return '$25K - $250K';
  if (pos.includes('seed') || comp.includes('seed')) return '$100K - $2M';
  if (pos.includes('series a') || comp.includes('series a')) return '$2M - $15M';
  if (pos.includes('series b') || comp.includes('series b')) return '$10M - $50M';
  if (pos.includes('growth') || comp.includes('growth')) return '$25M - $100M';
  if (pos.includes('pe') || comp.includes('private equity')) return '$50M+';
  if (pos.includes('vc') || comp.includes('venture capital')) return '$1M - $25M';
  if (pos.includes('fund') || comp.includes('fund')) return '$500K - $10M';
  
  return '$100K - $5M'; // Default range
}

// Function to generate location from company name or other indicators
function generateLocation(companyName, name) {
  // This is a simplified approach - in reality you'd use more sophisticated methods
  const locations = [
    'Mumbai, India', 'Bangalore, India', 'Delhi, India', 'Pune, India', 'Chennai, India',
    'Hyderabad, India', 'Kolkata, India', 'Ahmedabad, India', 'Gurgaon, India', 'Noida, India',
    'San Francisco, CA', 'New York, NY', 'London, UK', 'Singapore'
  ];
  
  // Random assignment for demo - in reality you'd parse from data or use APIs
  return locations[Math.floor(Math.random() * locations.length)];
}

// Process the data
const processedData = rawData.slice(0, 100).map((item, index) => {
  const focusAreas = generateFocusAreas(item['Company name'], item['Position']);
  const investmentRange = generateInvestmentRange(item['Position'], item['Company name']);
  const location = generateLocation(item['Company name'], item['Name']);
  
  return {
    id: `investor-${index + 1}`,
    name: item['Name'] || 'Unknown',
    company: item['Company name'] || 'Unknown Company',
    position: item['Position'] || 'Unknown Position',
    email: item['Email'] || '',
    linkedinUrl: item['LinkedIn URL'] || '',
    website: extractDomain(item['Email']),
    location: location,
    focusAreas: focusAreas,
    investmentRange: investmentRange,
    portfolioSize: Math.floor(Math.random() * 50) + 5, // Random for demo
    rating: Math.round((Math.random() * 2 + 3) * 10) / 10, // 3.0 to 5.0
    description: `${item['Position']} at ${item['Company name']}. Experienced investor with focus on ${focusAreas.join(', ')}.`,
    status: 'to-contact',
    lastMeeting: 'Never',
    notes: '',
    avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(item['Name'] || 'Unknown')}&background=random`,
    recentInvestments: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
});

// Save the processed data
const outputPath = path.join(__dirname, '..', 'app', 'data', 'investors.json');

// Create directory if it doesn't exist
const outputDir = path.dirname(outputPath);
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

fs.writeFileSync(outputPath, JSON.stringify(processedData, null, 2));

console.log(`Processed ${processedData.length} investors and saved to ${outputPath}`);
console.log('Sample investor:', JSON.stringify(processedData[0], null, 2));
