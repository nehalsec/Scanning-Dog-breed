
import type { BreedDetails } from '../types';

const API_KEY = 'live_yZRx3wdX8DZrITDWMJIkL41YCpswxQisdNwdXEIu7SNqDZrKnYNftXS0dSEve29i';
const API_URL = 'https://api.thedogapi.com/v1/breeds/search';

interface DogApiBreed {
    weight: { imperial: string; metric: string };
    height: { imperial: string; metric: string };
    id: number;
    name: string;
    bred_for?: string;
    breed_group?: string;
    life_span: string;
    temperament?: string;
    origin?: string;
}

export const fetchBreedDetails = async (breedName: string): Promise<Partial<BreedDetails>> => {
    // The Dog API doesn't handle "Mixed Breed" well, so we return empty details.
    if (breedName.toLowerCase().includes('mixed')) {
        return {};
    }
    
    try {
        const response = await fetch(`${API_URL}?q=${encodeURIComponent(breedName)}`, {
            headers: {
                'x-api-key': API_KEY,
            },
        });

        if (!response.ok) {
            console.error(`Dog API request failed with status ${response.status}`);
            return {};
        }

        const data: DogApiBreed[] = await response.json();

        if (!data || data.length === 0) {
            console.warn(`No breed details found for "${breedName}" from The Dog API.`);
            return {};
        }
        
        const bestMatch = data.find(d => d.name.toLowerCase() === breedName.toLowerCase()) || data[0];

        const details: Partial<BreedDetails> = {
            origin: bestMatch.origin,
            temperament: bestMatch.temperament,
            lifespan: bestMatch.life_span,
            sizeAndWeight: `Weight: ${bestMatch.weight.imperial} lbs. Height: ${bestMatch.height.imperial} in.`,
            commonTraits: [bestMatch.bred_for, bestMatch.breed_group].filter(Boolean).map(s => s.replace(/\.$/, '')).join('. Group: '),
        };
        
        return details;
    } catch (error) {
        console.error('Error fetching from The Dog API:', error);
        return {};
    }
};
