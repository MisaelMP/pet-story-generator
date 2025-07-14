// Proper TypeScript interface for Xano response
export interface XanoStoryResponse {
	id: number;
	created_at: number;
	pims_pet_id: string;
	title: string;
	content: string;
	tone: string;
	suggested_goal: number;
	key_points: string[];
	form_data: Record<string, unknown>;
	updated_at: number;
}

// Payload type for creating stories
export interface CreateStoryPayload {
	pims_pet_id: string;
	title: string;
	content: string;
	tone: string;
	suggested_goal: number;
	key_points: string[];
	form_data: Record<string, unknown>;
}

export interface StoredStory {
	id: number;
	pimsPetId: string;
	title: string;
	content: string;
	tone: string;
	suggestedGoal: number;
	keyPoints: string[];
	formData: Record<string, unknown>; // CHANGED: no more any
	createdAt: string;
	updatedAt: string;
}
