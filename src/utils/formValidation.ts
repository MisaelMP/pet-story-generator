import type { StoryFormData, FormStep } from '../types/form.types';

export const getFieldsForStep = (
	step: FormStep
): Array<keyof StoryFormData> => {
	const fieldMap: Record<FormStep, Array<keyof StoryFormData>> = {
		1: ['selectedPetId'],
		2: ['medicalSituation'],
		3: ['petStory'],
		4: ['financialSituation'],
	};

	return fieldMap[step] || [];
};

export const getStepTitle = (step: FormStep): string => {
	const titles: Record<FormStep, string> = {
		1: 'Select Your Pet',
		2: 'Medical Situation',
		3: "Pet's Story",
		4: 'Financial Information',
	};

	return titles[step];
};

export const getStepDescription = (step: FormStep): string => {
	const descriptions: Record<FormStep, string> = {
		1: "Choose the pet you're creating a fundraising story for",
		2: "Tell us about your pet's medical condition and treatment needs",
		3: "Help donors connect with your pet's personality and your bond",
		4: 'Help donors understand your financial need and campaign goals',
	};

	return descriptions[step];
};

export const calculateFormProgress = (
	currentStep: FormStep,
	totalSteps: number
): number => {
	return Math.round((currentStep / totalSteps) * 100);
};

export const validateStepCompletion = (
	data: Partial<StoryFormData>,
	step: FormStep
): boolean => {
	switch (step) {
		case 1:
			return Boolean(data.selectedPetId);
		case 2:
			return Boolean(
				data.medicalSituation?.condition &&
					data.medicalSituation?.timeline &&
					data.medicalSituation?.treatment &&
					data.medicalSituation?.cost &&
					data.medicalSituation?.urgency
			);
		case 3:
			return Boolean(
				data.petStory?.relationshipDuration &&
					data.petStory?.personalityTraits &&
					data.petStory?.favoriteMemory &&
					data.petStory?.familyImpact
			);
		case 4:
			return Boolean(
				data.financialSituation?.hardships &&
					data.financialSituation?.timeline &&
					data.financialSituation?.fundraisingGoal
			);
		default:
			return false;
	}
};
