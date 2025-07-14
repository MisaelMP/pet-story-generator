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
