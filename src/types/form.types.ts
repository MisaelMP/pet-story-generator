import { z } from 'zod';

export const storyFormSchema = z.object({
	// Step 1: Pet Selection
	selectedPetId: z.string().min(1, 'Please select a pet'),

	// Step 2: Medical Situation
	medicalSituation: z.object({
		condition: z
			.string()
			.min(10, 'Please provide detailed condition information'),
		timeline: z.string().min(5, 'When did this condition start?'),
		treatment: z.string().min(10, 'What treatment is recommended?'),
		cost: z
			.number()
			.min(1, 'Please provide estimated cost')
			.max(100000, 'Maximum cost is $100,000'),
		urgency: z.enum(['immediate', 'urgent', 'planned'], {
			error: 'Please select urgency level',
		}),
	}),

	// Step 3: Pet's Personal Story
	petStory: z.object({
		relationshipDuration: z.string().min(1, 'How long have you had your pet?'),
		personalityTraits: z
			.string()
			.min(
				20,
				'Please describe what makes your pet special (minimum 20 characters)'
			),
		favoriteMemory: z
			.string()
			.min(30, 'Please share a cherished memory (minimum 30 characters)'),
		familyImpact: z
			.string()
			.min(
				20,
				'Please describe how this has affected your family (minimum 20 characters)'
			),
	}),

	// Step 4: Financial Circumstances
	financialSituation: z.object({
		alreadySpent: z
			.number()
			.min(0, 'Amount must be positive')
			.max(50000, 'Maximum is $50,000'),
		monthlyIncome: z.number().optional(),
		hardships: z
			.string()
			.min(
				20,
				'Please explain your financial situation (minimum 20 characters)'
			),
		timeline: z.string().min(5, 'When do you need the funds?'),
		fundraisingGoal: z
			.number()
			.min(100, 'Minimum goal is $100')
			.max(100000, 'Maximum goal is $100,000'),
	}),
});

export type StoryFormData = z.infer<typeof storyFormSchema>;
export type FormStep = 1 | 2 | 3 | 4;

// Additional type for better step validation
export type StepValidationFields = {
	1: 'selectedPetId';
	2: 'medicalSituation';
	3: 'petStory';
	4: 'financialSituation';
};

// src/types/pet.types.ts (Complete interface)
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
	veterinarian?: string;
	notes?: string;
}

export interface PetAnalytics {
	totalPets: number;
	speciesDistribution: Array<{
		name: string;
		value: number;
		percentage: number;
	}>;
	ageDistribution: Array<{ range: string; count: number; percentage: number }>;
	averageAge: number;
	mostCommonBreed: string;
	recentlyAdded: Pet[];
}
