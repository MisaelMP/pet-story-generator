// src/hooks/useStoryGenerator.ts
import { useState, useCallback } from 'react';
import { StoryFormData } from '@/types/form.types';
import { Pet } from '@/types/pet.types';
import { AIStoryService, GeneratedStory } from '@/services/ai.service';

export const useStoryGenerator = () => {
	const [currentStory, setCurrentStory] = useState<GeneratedStory | null>(null);
	const [isGenerating, setIsGenerating] = useState(false);
	const [isRegenerating, setIsRegenerating] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const generateStory = useCallback(
		async (formData: StoryFormData, selectedPet: Pet) => {
			setIsGenerating(true);
			setError(null);

			try {
				const story = await AIStoryService.generateStory(formData, selectedPet);
				setCurrentStory(story);
			} catch (err) {
				const errorMessage =
					err instanceof Error ? err.message : 'Story generation failed';
				setError(errorMessage);
			} finally {
				setIsGenerating(false);
			}
		},
		[]
	);

	const regenerateStory = useCallback(
		async (
			formData: StoryFormData,
			selectedPet: Pet,
			tone: GeneratedStory['tone']
		) => {
			setIsRegenerating(true);
			setError(null);

			try {
				const story = await AIStoryService.regenerateStory(
					formData,
					selectedPet,
					tone
				);
				setCurrentStory(story);
			} catch (err) {
				const errorMessage =
					err instanceof Error ? err.message : 'Story regeneration failed';
				setError(errorMessage);
			} finally {
				setIsRegenerating(false);
			}
		},
		[]
	);

	const clearStory = useCallback(() => {
		setCurrentStory(null);
		setError(null);
	}, []);

	return {
		currentStory,
		isGenerating,
		isRegenerating,
		error,
		generateStory,
		regenerateStory,
		clearStory,
	};
};
