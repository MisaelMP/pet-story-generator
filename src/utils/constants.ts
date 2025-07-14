export const API_ENDPOINTS = {
	PETS: '/pims/patients',
	PET_DETAIL: (id: string) => `/pims/patients/${id}`,
	GENERATE_STORY: '/api/generate-story',
	HEALTH_CHECK: '/api/health',
} as const;

export const FORM_STEPS = {
	PET_SELECTION: 1,
	MEDICAL_SITUATION: 2,
	PET_STORY: 3,
	FINANCIAL_SITUATION: 4,
} as const;

export const URGENCY_LEVELS = {
	IMMEDIATE: 'immediate',
	URGENT: 'urgent',
	PLANNED: 'planned',
} as const;

export const STORY_TONES = {
	EMOTIONAL: 'emotional',
	HOPEFUL: 'hopeful',
	URGENT: 'urgent',
} as const;

export const PET_SPECIES = {
	DOG: 'dog',
	CAT: 'cat',
	BIRD: 'bird',
	RABBIT: 'rabbit',
	OTHER: 'other',
} as const;

export const VALIDATION_LIMITS = {
	MIN_GOAL: 100,
	MAX_GOAL: 100000,
	MAX_COST: 100000,
	MAX_SPENT: 50000,
	MIN_CONDITION_LENGTH: 10,
	MIN_STORY_LENGTH: 20,
	MIN_MEMORY_LENGTH: 30,
} as const;
