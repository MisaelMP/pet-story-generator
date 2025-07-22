import apiClient from './api.service';
import type { StoryFormData } from '@/types/form.types';
import type { Pet } from '@/types/pet.types';
import { StoryService } from './story.service';

export interface GeneratedStory {
	title: string;
	content: string;
	suggestedGoal: number;
	tone: 'emotional' | 'hopeful' | 'urgent';
	keyPoints: string[];
	estimatedReadTime: number;
}

interface AIResponse {
	story: {
		title: string;
		content: string;
		tone: string;
		suggestedGoal: number;
		keyPoints: string[];
	};
	usage?: {
		total_tokens?: number;
	};
	model?: string;
	savedToXano?: boolean;
	timestamp?: string;
}

export class AIStoryService {
	static async generateStory(
		formData: StoryFormData,
		selectedPet: Pet,
		saveToXano: boolean = true
	): Promise<GeneratedStory> {
		try {
			// Sanitize input data before sending to backend
			const sanitizedPrompt = this.buildSecurePrompt(formData, selectedPet);

			const response = await apiClient.post('/api/generate-story', {
				prompt: sanitizedPrompt,
				parameters: {
					maxTokens: 1500,
					temperature: 0.7,
					topP: 0.9,
				},
				options: {
					includeSuggestions: true,
					moderationCheck: true,
				},
			});

			const story = this.parseAIResponse(response.data as AIResponse);

			// Save to Xano if requested
			if (saveToXano) {
				try {
					const savedStory = await StoryService.saveStory(
						selectedPet.id,
						story,
						formData
					);
					if (savedStory) {
						console.log('Story saved to Xano with ID:', savedStory.id);
					}
				} catch (saveError) {
					console.warn(
						'Xano save failed, but story generated successfully:',
						saveError
					);
				}
			}

			return story;
		} catch (error) {
			console.error('AI story generation failed:', error);
			throw new Error(
				'Unable to generate story. Please try again or contact support.'
			);
		}
	}

	private static buildSecurePrompt(data: StoryFormData, pet: Pet): string {
		// Sanitize all user inputs to prevent prompt injection
		const sanitizedData = {
			petName: this.sanitizeInput(pet.name),
			breed: this.sanitizeInput(pet.breed),
			age: pet.age,
			condition: this.sanitizeInput(data.medicalSituation.condition),
			treatment: this.sanitizeInput(data.medicalSituation.treatment),
			cost: data.medicalSituation.cost,
			timeline: this.sanitizeInput(data.medicalSituation.timeline),
			personalityTraits: this.sanitizeInput(data.petStory.personalityTraits),
			favoriteMemory: this.sanitizeInput(data.petStory.favoriteMemory),
			familyImpact: this.sanitizeInput(data.petStory.familyImpact),
			hardships: this.sanitizeInput(data.financialSituation.hardships),
			goal: data.financialSituation.fundraisingGoal,
		};

		// Check if tone preference was specified
		const requestedTone = (data as StoryFormData & { _requestedTone?: string })
			._requestedTone;
		const toneGuidance = requestedTone
			? this.getToneGuidance(requestedTone)
			: '';

		return `You are a professional fundraising copywriter specializing in pet medical campaigns. Create a compelling, authentic GoFundMe story using this information:

Pet Information:
- Name: ${sanitizedData.petName}
- Breed: ${sanitizedData.breed} 
- Age: ${sanitizedData.age} years old

Medical Situation:
- Condition: ${sanitizedData.condition}
- Treatment needed: ${sanitizedData.treatment}
- Estimated cost: $${sanitizedData.cost.toLocaleString()}
- Timeline: ${sanitizedData.timeline}

Personal Story:
- What makes them special: ${sanitizedData.personalityTraits}
- Cherished memory: ${sanitizedData.favoriteMemory}
- Family impact: ${sanitizedData.familyImpact}

Financial Context:
- Current hardship: ${sanitizedData.hardships}
- Fundraising goal: $${sanitizedData.goal.toLocaleString()}

${toneGuidance}

Requirements:
1. Write an emotionally engaging narrative that encourages donations
2. Include specific medical details while keeping it accessible
3. Highlight the pet's personality and bond with family
4. Create urgency without being manipulative
5. End with a clear call-to-action
6. Keep tone authentic and heartfelt
7. Length: 400-600 words

Format your response as JSON:
{
  "title": "Campaign title (under 60 characters)",
  "content": "Full story content",
  "suggestedGoal": recommended_goal_amount,
  "tone": "${requestedTone || 'emotional'}",
  "keyPoints": ["key point 1", "key point 2", "key point 3"],
  "estimatedReadTime": minutes_to_read
}`;
	}

	private static getToneGuidance(tone: string): string {
		switch (tone) {
			case 'emotional':
				return `TONE GUIDANCE: Write with deep emotional resonance. Focus on the love, bond, and heartbreak. Use touching language that moves readers to tears and action.`;
			case 'hopeful':
				return `TONE GUIDANCE: Write with optimism and hope. Emphasize the positive outcome, recovery potential, and bright future ahead. Inspire confidence in a happy ending.`;
			case 'urgent':
				return `TONE GUIDANCE: Write with urgency and time sensitivity. Emphasize the critical timeline, immediate need for action, and consequences of delay. Create appropriate urgency without panic.`;
			default:
				return '';
		}
	}

	private static sanitizeInput(input: string): string {
		// Remove potential prompt injection attempts
		return input
			.replace(/\n\n/g, ' ') // Remove paragraph breaks that could break prompt structure
			.replace(/[{}]/g, '') // Remove JSON-breaking characters
			.replace(/["'`]/g, '') // Remove quote characters
			.replace(/\\/g, '') // Remove escape characters
			.trim()
			.substring(0, 500); // Limit length to prevent prompt overflow
	}

	private static parseAIResponse(response: AIResponse): GeneratedStory {
		try {
			// The backend returns the story data in a 'story' property
			const storyData = response.story;

			if (!storyData) {
				throw new Error('No story data in response');
			}

			return {
				title: storyData.title || 'Help Save Our Beloved Pet',
				content:
					storyData.content || 'Story generation failed. Please try again.',
				suggestedGoal: storyData.suggestedGoal || 5000,
				tone: this.validateTone(storyData.tone),
				keyPoints: Array.isArray(storyData.keyPoints)
					? storyData.keyPoints
					: ['Medical treatment needed', 'Financial assistance required'],
				estimatedReadTime: Math.max(
					1,
					Math.ceil((storyData.content || '').split(' ').length / 200)
				),
			};
		} catch (error) {
			console.error('Failed to parse AI response:', error);
			console.error('Response data:', response);
			throw new Error('Invalid response format from AI service');
		}
	}

	private static validateTone(
		tone: string | undefined
	): GeneratedStory['tone'] {
		const validTones: GeneratedStory['tone'][] = [
			'emotional',
			'hopeful',
			'urgent',
		];
		return validTones.includes(tone as GeneratedStory['tone'])
			? (tone as GeneratedStory['tone'])
			: 'emotional';
	}

	static async regenerateStory(
		originalData: StoryFormData,
		pet: Pet,
		tone: GeneratedStory['tone']
	): Promise<GeneratedStory> {
		// Create modified data with tone preference
		const modifiedData = {
			...originalData,
			_requestedTone: tone,
		} as StoryFormData & { _requestedTone: string };

		// Generate story with tone preference
		const story = await this.generateStory(modifiedData, pet, true);

		// Ensure the returned story has the requested tone
		return {
			...story,
			tone: tone,
		};
	}
}
