import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { StoredStory } from '../../types/story.types';
import { Pet } from '../../types/pet.types';
import { StoryService } from '../../services/story.service';
import { PetService } from '../../services/pet.service';
import { Calendar, Eye, Heart, DollarSign, ArrowRight } from 'lucide-react';
import { LoadingSpinner } from '../UI/LoadingSpinner';

interface RecentStoriesWidgetProps {
	maxStories?: number;
	selectedPetId?: string;
	showHeader?: boolean;
}

export const RecentStoriesWidget: React.FC<RecentStoriesWidgetProps> = ({
	maxStories = 5,
	selectedPetId,
	showHeader = true,
}) => {
	const [stories, setStories] = useState<StoredStory[]>([]);
	const [pets, setPets] = useState<Pet[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const loadData = React.useCallback(async () => {
		setLoading(true);
		setError(null);

		try {
			// Load pets data for reference
			const petsData = await PetService.getAllPets();
			setPets(petsData);

			// Load stories
			let storiesData: StoredStory[];
			if (selectedPetId) {
				storiesData = await StoryService.getStoriesForPet(selectedPetId);
			} else {
				storiesData = await StoryService.getAllStories();
			}

			// Sort by newest first and limit
			const sortedStories = storiesData
				.sort(
					(a, b) =>
						new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
				)
				.slice(0, maxStories);

			setStories(sortedStories);
		} catch (err) {
			setError('Failed to load recent stories');
			console.error('Recent stories load error:', err);
		} finally {
			setLoading(false);
		}
	}, [selectedPetId, maxStories]);

	useEffect(() => {
		loadData();
	}, [loadData]);

	const getPetName = (pimsPetId: string): string => {
		const pet = pets.find((p) => p.id === pimsPetId);
		return pet?.name || 'Unknown Pet';
	};

	const getToneColor = (tone: string) => {
		switch (tone) {
			case 'emotional':
				return 'bg-red-100 text-red-800';
			case 'hopeful':
				return 'bg-green-100 text-green-800';
			case 'urgent':
				return 'bg-orange-100 text-orange-800';
			default:
				return 'bg-gray-100 text-gray-800';
		}
	};

	if (loading) {
		return (
			<div className='flex items-center justify-center p-6'>
				<LoadingSpinner size='medium' message='Loading recent stories...' />
			</div>
		);
	}

	if (error) {
		return (
			<div className='text-center p-6'>
				<div className='text-red-600 text-sm'>{error}</div>
			</div>
		);
	}

	return (
		<div className='bg-white rounded-lg shadow-sm border'>
			{showHeader && (
				<div className='flex items-center justify-between p-6 border-b'>
					<h3 className='text-lg font-semibold text-gray-900'>
						{selectedPetId
							? `Recent Stories for ${getPetName(selectedPetId)}`
							: 'Recent Stories'}
					</h3>
					<Link
						to='/story-history'
						className='flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700'
					>
						View All
						<ArrowRight className='w-4 h-4' />
					</Link>
				</div>
			)}

			<div className='p-6'>
				{stories.length === 0 ? (
					<div className='text-center py-8'>
						<Heart className='w-12 h-12 text-gray-300 mx-auto mb-3' />
						<p className='text-gray-500 text-sm'>
							{selectedPetId
								? 'No stories created for this pet yet'
								: 'No stories created yet'}
						</p>
						<Link
							to='/create-story'
							className='inline-flex items-center gap-2 mt-3 px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors'
						>
							Create First Story
						</Link>
					</div>
				) : (
					<div className='space-y-4'>
						{stories.map((story) => (
							<div
								key={story.id}
								className='border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow'
							>
								<div className='flex items-start justify-between mb-3'>
									<div className='flex-1'>
										<h4 className='font-medium text-gray-900 mb-1 line-clamp-1'>
											{story.title}
										</h4>
										<div className='flex items-center gap-3 text-xs text-gray-500'>
											<div className='flex items-center gap-1'>
												<Heart className='w-3 h-3' />
												{getPetName(story.pimsPetId)}
											</div>
											<div className='flex items-center gap-1'>
												<Calendar className='w-3 h-3' />
												{new Date(story.createdAt).toLocaleDateString()}
											</div>
										</div>
									</div>
									<div className='flex items-center gap-2 ml-3'>
										<span
											className={`px-2 py-1 rounded-full text-xs font-medium ${getToneColor(story.tone)}`}
										>
											{story.tone}
										</span>
									</div>
								</div>

								<p className='text-sm text-gray-600 mb-3 line-clamp-2'>
									{story.content.substring(0, 120)}...
								</p>

								<div className='flex items-center justify-between'>
									<div className='flex items-center gap-1 text-xs text-gray-500'>
										<DollarSign className='w-3 h-3' />$
										{story.suggestedGoal.toLocaleString()} goal
									</div>
									<Link
										to='/story-history'
										state={{ expandedStory: story.id }}
										className='flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700'
									>
										<Eye className='w-3 h-3' />
										View Details
									</Link>
								</div>
							</div>
						))}

						{stories.length === maxStories && (
							<div className='text-center pt-4 border-t'>
								<Link
									to='/story-history'
									className='text-sm text-blue-600 hover:text-blue-700 font-medium'
								>
									View All Stories →
								</Link>
							</div>
						)}
					</div>
				)}
			</div>
		</div>
	);
};
