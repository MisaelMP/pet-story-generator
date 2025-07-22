import axios from 'axios';
import type { GeneratedStory } from './ai.service';
import type { StoryFormData } from '@/types/form.types';
import type {
	CreateStoryPayload,
	StoredStory,
	XanoStoryResponse,
} from '@/types/story.types';

const xanoClient = axios.create({
	baseURL: import.meta.env.VITE_XANO_BASE_URL,
	timeout: 10000,
	headers: {
		'Content-Type': 'application/json',
	},
});

export class StoryService {
	static async saveStory(
		pimsPetId: string,
		story: GeneratedStory,
		formData: StoryFormData
	): Promise<StoredStory | null> {
		try {
			const payload: CreateStoryPayload = {
				pims_pet_id: pimsPetId,
				title: story.title,
				content: story.content,
				tone: story.tone,
				suggested_goal: story.suggestedGoal,
				key_points: story.keyPoints,
				form_data: formData as Record<string, unknown>,
			};

			const response = await xanoClient.post<XanoStoryResponse>(
				'/generated_stories',
				payload
			);

			return this.normalizeStoryResponse(response.data);
		} catch (error) {
			console.error('Failed to save story to Xano:', error);
			return null; // Don't break story generation if saving fails
		}
	}

	static async getStoriesForPet(pimsPetId: string): Promise<StoredStory[]> {
		try {
			const response =
				await xanoClient.get<XanoStoryResponse[]>('/generated_stories');
			const allStories = response.data.map(this.normalizeStoryResponse);

			return allStories.filter((story) => story.pimsPetId === pimsPetId);
		} catch (error) {
			console.error('Failed to fetch stories:', error);
			return [];
		}
	}

	static async getAllStories(): Promise<StoredStory[]> {
		try {
			const response =
				await xanoClient.get<XanoStoryResponse[]>('/generated_stories');
			return response.data.map(this.normalizeStoryResponse);
		} catch (error) {
			console.error('Failed to fetch all stories:', error);
			return [];
		}
	}

	static async deleteStory(storyId: number): Promise<boolean> {
		try {
			await xanoClient.delete(`/generated_stories/${storyId}`);
			return true;
		} catch (error) {
			console.error('Failed to delete story:', error);
			return false;
		}
	}

	// ADDED: Private method to normalize Xano response
	private static normalizeStoryResponse(
		rawData: XanoStoryResponse
	): StoredStory {
		return {
			id: rawData.id,
			pimsPetId: rawData.pims_pet_id,
			title: rawData.title,
			content: rawData.content,
			tone: rawData.tone,
			suggestedGoal: rawData.suggested_goal,
			keyPoints: Array.isArray(rawData.key_points) ? rawData.key_points : [],
			formData: rawData.form_data || {},
			createdAt: new Date(rawData.created_at).toISOString(),
			updatedAt: rawData.updated_at
				? new Date(rawData.updated_at).toISOString()
				: new Date().toISOString(),
		};
	}
}
