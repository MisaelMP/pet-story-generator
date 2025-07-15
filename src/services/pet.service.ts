import apiClient from './api.service';
import {
	Pet,
	RawPIMSPet,
	PIMSApiResponse,
	MedicalRecord,
} from '../types/pet.types';

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
				(error as { code: string }).code === 'ENOTFOUND'
			) {
				throw new Error('Unable to connect to backend server.');
			}
			if (
				typeof error === 'object' &&
				error !== null &&
				'response' in error &&
				(error as { response?: { status?: number } }).response?.status === 502
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

	// Enhanced data parsing for unknown PIMS format
	private static normalizePetData(
		rawData: PIMSApiResponse | RawPIMSPet[]
	): Pet[] {
		// Handle different possible response formats
		let petsArray: RawPIMSPet[];

		if (Array.isArray(rawData)) {
			petsArray = rawData;
		} else if (rawData.data && Array.isArray(rawData.data)) {
			petsArray = rawData.data;
		} else if (rawData.patients && Array.isArray(rawData.patients)) {
			petsArray = rawData.patients;
		} else {
			console.warn('Unexpected data format:', rawData);
			petsArray = [rawData as RawPIMSPet]; // Treat as single pet
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
			medicalHistory: this.extractMedicalHistory(pet) as
				| MedicalRecord[]
				| undefined,
			createdAt: this.extractCreatedAt(pet),
			updatedAt: this.extractUpdatedAt(pet),
		}));
	}

	// Flexible field extraction methods
	private static extractId(pet: RawPIMSPet): string {
		return String(pet.id || pet.patient_id || pet.petId || 'unknown');
	}

	private static extractName(pet: RawPIMSPet): string {
		return (
			pet.Name || pet.name || pet.patient_name || pet.petName || 'Unnamed Pet'
		);
	}

	private static extractSpecies(pet: RawPIMSPet): string {
		return (
			pet.SpeciesDescription ||
			pet.Species ||
			pet.species ||
			pet.animal_type ||
			pet.type ||
			'other'
		);
	}

	private static extractBreed(pet: RawPIMSPet): string {
		return (
			pet.BreedDescription ||
			pet.Breed ||
			pet.breed ||
			pet.breed_name ||
			'Mixed Breed'
		);
	}

	private static calculateAge(pet: RawPIMSPet): number {
		if (pet.age && typeof pet.age === 'number') return pet.age;
		if (pet.Age && typeof pet.Age === 'number') return pet.Age;

		// Handle PIMS DateOfBirth field
		const birthDate = pet.DateOfBirth || pet.birth_date || pet.BirthDate;
		if (birthDate && typeof birthDate === 'string') {
			const birth = new Date(birthDate);
			const today = new Date();
			return Math.floor(
				(today.getTime() - birth.getTime()) / (365.25 * 24 * 60 * 60 * 1000)
			);
		}
		return 0;
	}

	private static extractWeight(pet: RawPIMSPet): number | undefined {
		const weight = pet.Weight || pet.weight || pet.weight_kg;
		return weight ? Number(weight) : undefined;
	}

	private static extractPhoto(pet: RawPIMSPet): string | undefined {
		return (pet.photo || pet.image || pet.profile_image) as string | undefined;
	}

	private static extractOwnerId(pet: RawPIMSPet): string {
		return String(pet.owner_id || pet.OwnerId || 'unknown');
	}

	private static extractOwnerName(pet: RawPIMSPet): string {
		return (pet.owner_name || pet.OwnerName || 'Unknown Owner') as string;
	}

	private static extractOwnerEmail(pet: RawPIMSPet): string {
		return (pet.owner_email || pet.OwnerEmail || '') as string;
	}

	private static extractOwnerPhone(pet: RawPIMSPet): string {
		return (pet.owner_phone || pet.OwnerPhone || '') as string;
	}

	private static extractMedicalHistory(pet: RawPIMSPet): unknown[] {
		return (pet.medical_history ||
			pet.MedicalHistory ||
			pet.medicalRecords ||
			[]) as unknown[];
	}

	private static extractCreatedAt(pet: RawPIMSPet): string {
		const createdDate = pet.created_at || pet.CreatedAt;
		return (createdDate as string) || new Date().toISOString();
	}

	private static extractUpdatedAt(pet: RawPIMSPet): string {
		const updatedDate = pet.updated_at || pet.UpdatedAt;
		return (updatedDate as string) || new Date().toISOString();
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
