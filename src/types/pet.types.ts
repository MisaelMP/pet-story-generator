// Raw PIMS API response types (for handling dynamic external data)
export interface RawPIMSPet {
	// Common ID fields across different PIMS systems
	id?: string | number;
	patient_id?: string | number;
	petId?: string | number;

	// Name variations
	Name?: string;
	name?: string;
	patient_name?: string;
	petName?: string;

	// Species variations
	SpeciesDescription?: string;
	Species?: string;
	species?: string;
	animal_type?: string;
	type?: string;

	// Breed variations
	BreedDescription?: string;
	Breed?: string;
	breed?: string;
	breed_name?: string;

	// Age/Date variations
	age?: number;
	Age?: number;
	birth_date?: string;
	BirthDate?: string;
	DateOfBirth?: string;

	// Weight variations
	weight?: number;
	Weight?: number;
	weight_kg?: number;

	// Photo variations
	photo?: string;
	image?: string;
	profile_image?: string;

	// Owner information variations
	owner_id?: string | number;
	OwnerId?: string | number;
	owner_name?: string;
	OwnerName?: string;
	owner_email?: string;
	OwnerEmail?: string;
	owner_phone?: string;
	OwnerPhone?: string;

	// Medical history (flexible structure)
	medical_history?: unknown[];
	MedicalHistory?: unknown[];
	medicalRecords?: unknown[];

	// Timestamps
	created_at?: string;
	CreatedAt?: string;
	updated_at?: string;
	UpdatedAt?: string;

	// Allow for additional unknown fields from different PIMS systems
	[key: string]: unknown;
}

// API response wrapper types
export interface PIMSApiResponse {
	data?: RawPIMSPet[];
	patients?: RawPIMSPet[];
	items?: RawPIMSPet[];
	results?: RawPIMSPet[];
	[key: string]: unknown;
}

export interface Pet {
	id: string;
	name: string;
	species: 'dog' | 'cat' | 'bird' | 'rabbit' | 'other';
	breed: string;
	age: number;
	weight?: number;
	photo?: string;
	owner: {
		id: string;
		name: string;
		email: string;
		phone?: string;
	};
	medicalHistory?: MedicalRecord[];
	createdAt: string;
	updatedAt: string;
}

export interface MedicalRecord {
	id: string;
	condition: string;
	diagnosisDate: string;
	treatment: string;
	cost: number;
	status: 'ongoing' | 'completed' | 'pending';
}

// Analytics types
export interface PetAnalytics {
	totalPets: number;
	speciesDistribution: Array<{
		name: string;
		value: number;
		percentage: number;
	}>;
	ageDistribution: Array<{
		range: string;
		count: number;
		percentage: number;
	}>;
	averageAge: number;
	mostCommonBreed: string;
	recentlyAdded: Pet[];
}
