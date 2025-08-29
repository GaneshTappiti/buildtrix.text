import React from 'react';
import Link from 'next/link';
import { SearchResult } from '@/services/searchService';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  FileText, 
  Lightbulb, 
  Target, 
  CheckCircle2, 
  Building2,
  ArrowRight,
  Search,
  Zap
} from 'lucide-react';

interface SearchResultsProps {
  results: SearchResult[];
  query: string;
  onResultClick?: (result: SearchResult) => void;
  isLoading?: boolean;
}

const getTypeIcon = (type: string) => {
  switch (type) {
    case 'module':
      return <Target className="h-4 w-4" />;
    case 'project':
      return <Building2 className="h-4 w-4" />;
    case 'task':
      return <CheckCircle2 className="h-4 w-4" />;
    case 'idea':
      return <Lightbulb className="h-4 w-4" />;
    case 'document':
      return <FileText className="h-4 w-4" />;
    case 'action':
      return <Zap className="h-4 w-4" />;
    default:
      return <Search className="h-4 w-4" />;
  }
};

const getTypeBadgeColor = (type: string) => {
  switch (type) {
    case 'module':
      return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
    case 'project':
      return 'bg-green-500/20 text-green-400 border-green-500/30';
    case 'task':
      return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
    case 'idea':
      return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
    case 'document':
      return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    case 'action':
      return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
    default:
      return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
  }
};

export const SearchResults: React.FC<SearchResultsProps> = ({
  results,
  query,
  onResultClick,
  isLoading = false
}) => {
  if (isLoading) {
    return (
      <div className="absolute top-full left-0 right-0 mt-2 bg-black/90 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl z-50 p-4">
        <div className="flex items-center gap-2 text-gray-400">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
          <span className="text-sm">Searching...</span>
        </div>
      </div>
    );
  }

  if (!query.trim()) {
    return null;
  }

  if (results.length === 0) {
    return (
      <div className="absolute top-full left-0 right-0 mt-2 bg-black/90 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl z-50 p-4">
        <div className="text-center py-4">
          <Search className="h-8 w-8 text-gray-600 mx-auto mb-2" />
          <p className="text-gray-400 text-sm">No results found for "{query}"</p>
          <p className="text-gray-500 text-xs mt-1">Try searching for modules, ideas, or tasks</p>
        </div>
      </div>
    );
  }

  return (
    <div className="absolute top-full left-0 right-0 mt-2 bg-black/90 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl z-50 max-h-96 overflow-y-auto">
      <div className="p-2">
        <div className="flex items-center gap-2 px-3 py-2 text-xs text-gray-400 border-b border-white/10">
          <Search className="h-3 w-3" />
          <span>{results.length} result{results.length !== 1 ? 's' : ''} for "{query}"</span>
        </div>
        
        <div className="py-2 space-y-1">
          {results.map((result) => (
            <Link
              key={result.id}
              href={result.path}
              onClick={() => onResultClick?.(result)}
              className="block p-3 rounded-lg hover:bg-white/5 transition-colors group"
            >
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-0.5">
                  {result.icon ? (
                    <span className="text-lg">{result.icon}</span>
                  ) : (
                    <div className="p-1.5 bg-gray-600/20 rounded-md text-gray-400">
                      {getTypeIcon(result.type)}
                    </div>
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium text-white text-sm group-hover:text-green-400 transition-colors">
                      {result.title}
                    </h4>
                    <Badge 
                      variant="outline" 
                      className={`text-xs px-2 py-0.5 ${getTypeBadgeColor(result.type)}`}
                    >
                      {result.type}
                    </Badge>
                  </div>
                  
                  <p className="text-xs text-gray-400 line-clamp-2">
                    {result.description}
                  </p>
                </div>
                
                <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                  <ArrowRight className="h-4 w-4 text-gray-400" />
                </div>
              </div>
            </Link>
          ))}
        </div>
        
        {results.length >= 10 && (
          <div className="px-3 py-2 text-xs text-gray-500 border-t border-white/10">
            Showing first 10 results. Try a more specific search for better results.
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchResults;
