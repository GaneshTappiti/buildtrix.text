import { Investor } from '@/types/investor';

// Cache for investor data
let investorDataCache: Investor[] | null = null;

/**
 * Load investor data from the JSON file
 */
export async function loadInvestorData(): Promise<Investor[]> {
  if (investorDataCache) {
    return investorDataCache;
  }

  try {
    const response = await fetch('/data/investors.json');
    if (!response.ok) {
      throw new Error(`Failed to load investor data: ${response.statusText}`);
    }
    
    const data = await response.json();
    investorDataCache = data;
    return data;
  } catch (error) {
    console.error('Error loading investor data:', error);
    return [];
  }
}

/**
 * Get investors by focus area
 */
export function getInvestorsByFocusArea(investors: Investor[], focusArea: string): Investor[] {
  return investors.filter(investor => 
    investor.focusAreas.some(area => 
      area.toLowerCase().includes(focusArea.toLowerCase())
    )
  );
}

/**
 * Get investors by location
 */
export function getInvestorsByLocation(investors: Investor[], location: string): Investor[] {
  return investors.filter(investor => 
    investor.location?.toLowerCase().includes(location.toLowerCase())
  );
}

/**
 * Get investors by investment range
 */
export function getInvestorsByInvestmentRange(investors: Investor[], range: string): Investor[] {
  return investors.filter(investor => 
    investor.investmentRange?.toLowerCase().includes(range.toLowerCase())
  );
}

/**
 * Get investors by status
 */
export function getInvestorsByStatus(investors: Investor[], status: string): Investor[] {
  return investors.filter(investor => investor.status === status);
}

/**
 * Search investors by query
 */
export function searchInvestors(investors: Investor[], query: string): Investor[] {
  const searchTerm = query.toLowerCase();
  return investors.filter(investor =>
    investor.name.toLowerCase().includes(searchTerm) ||
    investor.company.toLowerCase().includes(searchTerm) ||
    investor.position.toLowerCase().includes(searchTerm) ||
    investor.focusAreas.some(area => area.toLowerCase().includes(searchTerm)) ||
    (investor.location && investor.location.toLowerCase().includes(searchTerm)) ||
    (investor.description && investor.description.toLowerCase().includes(searchTerm))
  );
}

/**
 * Get unique focus areas from all investors
 */
export function getUniqueFocusAreas(investors: Investor[]): string[] {
  const focusAreas = new Set<string>();
  investors.forEach(investor => {
    investor.focusAreas.forEach(area => focusAreas.add(area));
  });
  return Array.from(focusAreas).sort();
}

/**
 * Get unique locations from all investors
 */
export function getUniqueLocations(investors: Investor[]): string[] {
  const locations = new Set<string>();
  investors.forEach(investor => {
    if (investor.location) {
      locations.add(investor.location);
    }
  });
  return Array.from(locations).sort();
}

/**
 * Get unique investment ranges from all investors
 */
export function getUniqueInvestmentRanges(investors: Investor[]): string[] {
  const ranges = new Set<string>();
  investors.forEach(investor => {
    if (investor.investmentRange) {
      ranges.add(investor.investmentRange);
    }
  });
  return Array.from(ranges).sort();
}

/**
 * Get investor statistics
 */
export function getInvestorStats(investors: Investor[]) {
  const totalInvestors = investors.length;
  const statusCounts = investors.reduce((acc, investor) => {
    acc[investor.status] = (acc[investor.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const avgRating = investors.reduce((sum, investor) => 
    sum + (investor.rating || 0), 0) / totalInvestors;

  const avgPortfolioSize = investors.reduce((sum, investor) => 
    sum + (investor.portfolioSize || 0), 0) / totalInvestors;

  return {
    totalInvestors,
    statusCounts,
    avgRating: Math.round(avgRating * 10) / 10,
    avgPortfolioSize: Math.round(avgPortfolioSize),
    uniqueFocusAreas: getUniqueFocusAreas(investors).length,
    uniqueLocations: getUniqueLocations(investors).length
  };
}
