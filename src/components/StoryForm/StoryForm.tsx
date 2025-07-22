// src/components/StoryForm/StoryForm.tsx
import React, { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { StoryFormData } from '@/types/form.types';
import { storyFormSchema } from '@/types/form.types';
import type { FormStep } from '@/types/form.types';
import type { Pet } from '@/types/pet.types';
import { PetSelectionStep } from './steps/PetSelectionStep';
import { MedicalSituationStep } from './steps/MedicalSituationStep';
import { PetStoryStep } from './steps/PetStoryStep';
import { FinancialSituationStep } from './steps/FinancialSituationStep';
import { FormNavigation } from './FormNavigation';
import { ProgressIndicator } from './ProgressIndicator';

interface StoryFormProps {
	onSubmit: (data: StoryFormData) => Promise<void>;
	pets: Pet[];
}

export const StoryForm: React.FC<StoryFormProps> = ({ onSubmit, pets }) => {
	const [currentStep, setCurrentStep] = useState<FormStep>(1);
	const [isSubmitting, setIsSubmitting] = useState(false);

	const methods = useForm<StoryFormData>({
		resolver: zodResolver(storyFormSchema),
		mode: 'onBlur',
		defaultValues: {
			selectedPetId: '',
			medicalSituation: {
				condition: '',
				timeline: '',
				treatment: '',
				cost: 0,
				urgency: undefined,
			},
			petStory: {
				relationshipDuration: '',
				personalityTraits: '',
				favoriteMemory: '',
				familyImpact: '',
			},
			financialSituation: {
				alreadySpent: 0,
				hardships: '',
				timeline: '',
				fundraisingGoal: 0,
			},
		},
	});

	const {
		handleSubmit,
		trigger,
		formState: { isValid },
	} = methods;

	const validateCurrentStep = async (): Promise<boolean> => {
		const fieldsToValidate = getFieldsForStep(currentStep);
		return await trigger(fieldsToValidate);
	};

	const handleNext = async () => {
		const isStepValid = await validateCurrentStep();
		if (isStepValid && currentStep < 4) {
			setCurrentStep((prev) => (prev + 1) as FormStep);
		}
	};

	const handlePrevious = () => {
		if (currentStep > 1) {
			setCurrentStep((prev) => (prev - 1) as FormStep);
		}
	};

	const handleFormSubmit = async (data: StoryFormData) => {
		setIsSubmitting(true);
		try {
			await onSubmit(data);
		} catch (error) {
			console.error('Form submission failed:', error);
		} finally {
			setIsSubmitting(false);
		}
	};

	const renderCurrentStep = () => {
		switch (currentStep) {
			case 1:
				return <PetSelectionStep pets={pets} />;
			case 2:
				return <MedicalSituationStep />;
			case 3:
				return <PetStoryStep />;
			case 4:
				return <FinancialSituationStep />;
			default:
				return null;
		}
	};

	return (
		<div className='w-full max-w-4xl mx-auto p-4 sm:p-6'>
			<div className='mb-6 sm:mb-8'>
				<ProgressIndicator currentStep={currentStep} totalSteps={4} />
			</div>

			<FormProvider {...methods}>
				<form
					onSubmit={handleSubmit(handleFormSubmit)}
					className='space-y-6 sm:space-y-8'
				>
					<div className='bg-white rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl p-4 sm:p-6 lg:p-8 min-h-[400px] sm:min-h-[500px]'>
						{renderCurrentStep()}
					</div>

					<FormNavigation
						currentStep={currentStep}
						totalSteps={4}
						onNext={handleNext}
						onPrevious={handlePrevious}
						isSubmitting={isSubmitting}
						isValid={isValid}
					/>
				</form>
			</FormProvider>
		</div>
	);
};

function getFieldsForStep(step: FormStep): (keyof StoryFormData)[] {
	switch (step) {
		case 1:
			return ['selectedPetId'];
		case 2:
			return ['medicalSituation'];
		case 3:
			return ['petStory'];
		case 4:
			return ['financialSituation'];
		default:
			return [];
	}
}
