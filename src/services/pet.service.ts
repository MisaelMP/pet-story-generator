import apiClient from './api.service';
import { Pet } from '../types/pet.types';

export class PetService {
	private static readonly ENDPOINTS = {
		PETS: '/api/pets', // Backend proxy will call PIMS
		PET_DETAIL: (id: string) => `/api/pets/${id}`,
	};

	static async getAllPets(): Promise<Pet[]> {
		try {
			console.log('Fetching pets via backend proxy...');
			const response = await apiClient.get(this.ENDPOINTS.PETS);

			return this.normalizePetData(response.data);
		} catch (error) {
			console.error('Failed to fetch pets:', error);

			if (
				typeof error === 'object' &&
				error !== null &&
				'code' in error &&
				(error as any).code === 'ENOTFOUND'
			) {
				throw new Error('Unable to connect to backend server.');
			}
			if (
				typeof error === 'object' &&
				error !== null &&
				'response' in error &&
				(error as any).response?.status === 502
			) {
				throw new Error('Backend cannot reach veterinary system.');
			}

			throw new Error('Unable to load pet database. Please try again.');
		}
	}

	static async getPetById(id: string): Promise<Pet> {
		try {
			const response = await apiClient.get(this.ENDPOINTS.PET_DETAIL(id));
			return this.normalizePetData([response.data])[0];
		} catch (error) {
			console.error(`Failed to fetch pet ${id}:`, error);
			throw new Error('Pet not found or unavailable.');
		}
	}

	// NEW: Enhanced data parsing for unknown PIMS format
	private static normalizePetData(rawData: any): Pet[] {
		// Handle different possible response formats
		let petsArray: any[];

		if (Array.isArray(rawData)) {
			petsArray = rawData;
		} else if (rawData.data && Array.isArray(rawData.data)) {
			petsArray = rawData.data;
		} else if (rawData.patients && Array.isArray(rawData.patients)) {
			petsArray = rawData.patients;
		} else {
			console.warn('Unexpected data format:', rawData);
			petsArray = [rawData]; // Treat as single pet
		}

		return petsArray.map((pet) => ({
			id: this.extractId(pet),
			name: this.extractName(pet),
			species: this.normalizeSpecies(this.extractSpecies(pet)),
			breed: this.extractBreed(pet),
			age: this.calculateAge(pet),
			weight: this.extractWeight(pet),
			photo: this.extractPhoto(pet),
			owner: {
				id: this.extractOwnerId(pet),
				name: this.extractOwnerName(pet),
				email: this.extractOwnerEmail(pet),
				phone: this.extractOwnerPhone(pet),
			},
			medicalHistory: this.extractMedicalHistory(pet),
			createdAt: this.extractCreatedAt(pet),
			updatedAt: this.extractUpdatedAt(pet),
		}));
	}

	// NEW: Flexible field extraction methods
	private static extractId(pet: any): string {
		return String(pet.id || pet.patient_id || pet.petId || 'unknown');
	}

	private static extractName(pet: any): string {
		return pet.name || pet.patient_name || pet.petName || 'Unnamed Pet';
	}

	private static extractSpecies(pet: any): string {
		return pet.species || pet.animal_type || pet.type || 'other';
	}

	private static extractBreed(pet: any): string {
		return pet.breed || pet.breed_name || 'Mixed Breed';
	}

	private static calculateAge(pet: any): number {
		if (pet.age && typeof pet.age === 'number') return pet.age;
		if (pet.birth_date || pet.birthDate) {
			const birthDate = new Date(pet.birth_date || pet.birthDate);
			const today = new Date();
			return Math.floor(
				(today.getTime() - birthDate.getTime()) / (365.25 * 24 * 60 * 60 * 1000)
			);
		}
		return 0;
	}

	private static extractWeight(pet: any): number | undefined {
		const weight = pet.weight || pet.weight_kg;
		return weight ? Number(weight) : undefined;
	}

	private static extractPhoto(pet: any): string | undefined {
		return pet.photo || pet.photo_url || pet.image;
	}

	private static extractOwnerId(pet: any): string {
		return String(pet.owner_id || pet.client_id || 'unknown');
	}

	private static extractOwnerName(pet: any): string {
		return (
			pet.owner_name || pet.client_name || pet.owner?.name || 'Unknown Owner'
		);
	}

	private static extractOwnerEmail(pet: any): string {
		return pet.owner_email || pet.client_email || pet.owner?.email || '';
	}

	private static extractOwnerPhone(pet: any): string {
		return pet.owner_phone || pet.client_phone || pet.owner?.phone || '';
	}

	private static extractMedicalHistory(pet: any): any[] {
		return pet.medical_history || pet.medical_records || [];
	}

	private static extractCreatedAt(pet: any): string {
		return pet.created_at || pet.date_created || new Date().toISOString();
	}

	private static extractUpdatedAt(pet: any): string {
		return pet.updated_at || pet.date_modified || new Date().toISOString();
	}

	private static normalizeSpecies(species: string): Pet['species'] {
		const normalized = species?.toLowerCase();
		if (['dog', 'canine'].includes(normalized)) return 'dog';
		if (['cat', 'feline'].includes(normalized)) return 'cat';
		if (['bird', 'avian'].includes(normalized)) return 'bird';
		if (['rabbit', 'bunny'].includes(normalized)) return 'rabbit';
		return 'other';
	}
}
