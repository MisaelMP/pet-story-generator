import React, { useState, useEffect } from 'react';
import { StoredStory } from '../../types/story.types';
import { Pet } from '../../types/pet.types';
import { StoryService } from '../../services/story.service';
import { PetService } from '../../services/pet.service';
import {
	Calendar,
	Trash2,
	Eye,
	Copy,
	Download,
	Filter,
	Search,
	Heart,
	DollarSign,
	Clock,
	RefreshCw,
} from 'lucide-react';
import { LoadingSpinner } from '../UI/LoadingSpinner';

interface StoryHistoryProps {
	selectedPetId?: string;
	onStorySelect?: (story: StoredStory) => void;
}

export const StoryHistory: React.FC<StoryHistoryProps> = ({
	selectedPetId,
	onStorySelect,
}) => {
	const [stories, setStories] = useState<StoredStory[]>([]);
	const [pets, setPets] = useState<Pet[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [searchTerm, setSearchTerm] = useState('');
	const [filterTone, setFilterTone] = useState<string>('all');
	const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'goal'>('newest');
	const [expandedStory, setExpandedStory] = useState<number | null>(null);

	const loadData = React.useCallback(async () => {
		setLoading(true);
		setError(null);

		try {
			// Load stories first since they come from Xano (not rate-limited)
			let storiesData: StoredStory[];
			if (selectedPetId) {
				storiesData = await StoryService.getStoriesForPet(selectedPetId);
			} else {
				storiesData = await StoryService.getAllStories();
			}
			setStories(storiesData);
			console.log(`Loaded ${storiesData.length} stories`);

			// Debug: Log first few stories and their pet IDs
			if (storiesData.length > 0) {
				console.log(
					'Sample story pet IDs:',
					storiesData
						.slice(0, 5)
						.map((s) => `"${s.pimsPetId}" (${typeof s.pimsPetId}) - ${s.title}`)
				);
				console.log('All unique pet IDs in stories:', [
					...new Set(storiesData.map((s) => s.pimsPetId)),
				]);
			} else {
				console.log('No stories found in Xano');
			}

			// Try to load pets data for reference (may fail due to rate limit)
			try {
				const petsData = await PetService.getAllPets();
				setPets(petsData);
				console.log(`Loaded ${petsData.length} pets`);
			} catch (petsError) {
				console.warn('Failed to load pets (likely rate-limited):', petsError);

				// Create mock pets based on known story pet IDs for testing
				if (storiesData.length > 0) {
					const uniquePetIds = [
						...new Set(storiesData.map((s) => s.pimsPetId)),
					];
					const mockPets: Pet[] = uniquePetIds.map((id) => ({
						id: String(id),
						name: `Pet ${id}`, // We'll update this with known names
						species: 'dog' as const,
						breed: 'Mixed Breed',
						age: 3,
						owner: {
							id: `owner-${id}`,
							name: 'Mock Owner',
							email: '',
							phone: '',
						},
						medicalHistory: [],
						createdAt: new Date().toISOString(),
						updatedAt: new Date().toISOString(),
					}));

					// Add some known pets that might match our stories
					const knownBuddyPets = [
						116, 126, 142, 268, 381, 548, 552, 663, 738, 972,
					];
					knownBuddyPets.forEach((id) => {
						if (!mockPets.find((p) => p.id === String(id))) {
							mockPets.push({
								id: String(id),
								name: 'Buddy',
								species: 'dog' as const,
								breed: 'Golden Retriever',
								age: 4,
								owner: {
									id: `owner-${id}`,
									name: 'Mock Owner',
									email: '',
									phone: '',
								},
								medicalHistory: [],
								createdAt: new Date().toISOString(),
								updatedAt: new Date().toISOString(),
							});
						}
					});

					setPets(mockPets);
					console.log('Created mock pets for testing:', mockPets.length);
				}
			}
		} catch (err) {
			setError('Failed to load story history');
			console.error('Story history load error:', err);
		} finally {
			setLoading(false);
		}
	}, [selectedPetId]);

	useEffect(() => {
		loadData();
	}, [loadData]);

	const handleDeleteStory = async (storyId: number) => {
		if (
			!confirm(
				'Are you sure you want to delete this story? This action cannot be undone.'
			)
		) {
			return;
		}

		try {
			const success = await StoryService.deleteStory(storyId);
			if (success) {
				setStories((prev) => prev.filter((story) => story.id !== storyId));
			} else {
				alert('Failed to delete story. Please try again.');
			}
		} catch (error) {
			console.error('Delete story error:', error);
			alert('An error occurred while deleting the story.');
		}
	};

	const handleCopyStory = async (story: StoredStory) => {
		try {
			await navigator.clipboard.writeText(`${story.title}\n\n${story.content}`);
			alert('Story copied to clipboard!');
		} catch (error) {
			console.error('Copy failed:', error);
			alert('Failed to copy story to clipboard.');
		}
	};

	const handleDownloadStory = (story: StoredStory) => {
		const element = document.createElement('a');
		const file = new Blob([`${story.title}\n\n${story.content}`], {
			type: 'text/plain',
		});
		element.href = URL.createObjectURL(file);
		element.download = `${story.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.txt`;
		document.body.appendChild(element);
		element.click();
		document.body.removeChild(element);
	};

	const getPetName = React.useCallback(
		(pimsPetId: string | number): string => {
			// First try exact match
			let pet = pets.find((p) => p.id === pimsPetId);

			if (!pet) {
				// Try string conversion matches
				const pimsPetIdStr = String(pimsPetId);
				pet = pets.find((p) => String(p.id) === pimsPetIdStr);
			}

			if (!pet) {
				// Try number conversion if possible
				const pimsPetIdNum = Number(pimsPetId);
				if (!isNaN(pimsPetIdNum)) {
					pet = pets.find((p) => Number(p.id) === pimsPetIdNum);
				}
			}

			// Debug logging to help identify the mapping issue
			if (!pet && pets.length > 0) {
				console.log(
					`No pet found for ID: "${pimsPetId}" (type: ${typeof pimsPetId})`
				);
				console.log(
					'Available pet IDs:',
					pets.slice(0, 5).map((p) => `"${p.id}" (${typeof p.id})`)
				);
			}

			return pet?.name || 'Unknown Pet';
		},
		[pets]
	);

	const getPetInfo = React.useCallback(
		(pimsPetId: string | number): Pet | undefined => {
			// First try exact match
			let pet = pets.find((p) => p.id === pimsPetId);

			if (!pet) {
				// Try string conversion matches
				const pimsPetIdStr = String(pimsPetId);
				pet = pets.find((p) => String(p.id) === pimsPetIdStr);
			}

			if (!pet) {
				// Try number conversion if possible
				const pimsPetIdNum = Number(pimsPetId);
				if (!isNaN(pimsPetIdNum)) {
					pet = pets.find((p) => Number(p.id) === pimsPetIdNum);
				}
			}

			return pet;
		},
		[pets]
	);

	const filteredAndSortedStories = React.useMemo(() => {
		let filtered = stories;

		// Filter by search term
		if (searchTerm) {
			filtered = filtered.filter(
				(story) =>
					story.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
					story.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
					getPetName(story.pimsPetId)
						.toLowerCase()
						.includes(searchTerm.toLowerCase())
			);
		}

		// Filter by tone
		if (filterTone !== 'all') {
			filtered = filtered.filter((story) => story.tone === filterTone);
		}

		// Sort stories
		filtered.sort((a, b) => {
			switch (sortBy) {
				case 'newest':
					return (
						new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
					);
				case 'oldest':
					return (
						new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
					);
				case 'goal':
					return b.suggestedGoal - a.suggestedGoal;
				default:
					return 0;
			}
		});

		return filtered;
	}, [stories, searchTerm, filterTone, sortBy, getPetName]);

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
			<div className='flex items-center justify-center p-8'>
				<LoadingSpinner size='large' message='Loading story history...' />
			</div>
		);
	}

	if (error) {
		return (
			<div className='text-center p-8'>
				<div className='text-red-600 mb-4'>{error}</div>
				<button
					onClick={loadData}
					className='flex items-center gap-2 mx-auto px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700'
				>
					<RefreshCw className='w-4 h-4' />
					Try Again
				</button>
			</div>
		);
	}

	return (
		<div className='w-full max-w-7xl mx-auto p-4 sm:p-6'>
			{/* Header */}
			<div className='mb-6 sm:mb-8'>
				<h1 className='text-2xl sm:text-3xl font-bold text-gray-900 mb-2'>
					Story History
				</h1>
				<p className='text-sm sm:text-base text-gray-600'>
					{selectedPetId
						? `Stories for ${getPetName(selectedPetId)}`
						: 'Manage and view all generated fundraising stories'}
				</p>
			</div>

			{/* Filters and Search */}
			<div className='bg-white rounded-lg shadow-sm border p-4 sm:p-6 mb-6'>
				<div className='flex flex-col gap-4'>
					{/* Search */}
					<div className='relative'>
						<Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5' />
						<input
							type='text'
							placeholder='Search stories, titles, or pet names...'
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
							className='w-full pl-9 sm:pl-10 pr-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
						/>
					</div>

					{/* Filters Row */}
					<div className='flex flex-col sm:flex-row gap-3 sm:gap-4'>
						{/* Tone Filter */}
						<div className='flex items-center gap-2 flex-1'>
							<Filter className='w-4 h-4 text-gray-500 flex-shrink-0' />
							<select
								value={filterTone}
								onChange={(e) => setFilterTone(e.target.value)}
								className='flex-1 min-w-0 border border-gray-300 rounded-lg px-3 py-2 text-sm sm:text-base focus:ring-2 focus:ring-blue-500 focus:border-transparent'
							>
								<option value='all'>All Tones</option>
								<option value='emotional'>Emotional</option>
								<option value='hopeful'>Hopeful</option>
								<option value='urgent'>Urgent</option>
							</select>
						</div>

						{/* Sort */}
						<div className='flex items-center gap-2 flex-1'>
							<Calendar className='w-4 h-4 text-gray-500 flex-shrink-0' />
							<select
								value={sortBy}
								onChange={(e) =>
									setSortBy(e.target.value as 'newest' | 'oldest' | 'goal')
								}
								className='flex-1 min-w-0 border border-gray-300 rounded-lg px-3 py-2 text-sm sm:text-base focus:ring-2 focus:ring-blue-500 focus:border-transparent'
							>
								<option value='newest'>Newest First</option>
								<option value='oldest'>Oldest First</option>
								<option value='goal'>Highest Goal</option>
							</select>
						</div>
					</div>
				</div>
			</div>

			{/* Story Count */}
			<div className='mb-4 text-sm text-gray-600'>
				Showing {filteredAndSortedStories.length} of {stories.length} stories
			</div>

			{/* Stories List */}
			{filteredAndSortedStories.length === 0 ? (
				<div className='text-center py-12'>
					<Heart className='w-16 h-16 text-gray-300 mx-auto mb-4' />
					<h3 className='text-lg font-semibold text-gray-900 mb-2'>
						{stories.length === 0
							? 'No Stories Yet'
							: 'No Stories Match Your Search'}
					</h3>
					<p className='text-gray-600'>
						{stories.length === 0
							? 'Create your first story to get started!'
							: 'Try adjusting your search or filter criteria.'}
					</p>
				</div>
			) : (
				<div className='space-y-6'>
					{filteredAndSortedStories.map((story) => {
						const pet = getPetInfo(story.pimsPetId);
						const isExpanded = expandedStory === story.id;

						return (
							<div
								key={story.id}
								className='bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow'
							>
								{/* Story Header */}
								<div className='p-4 sm:p-6 border-b'>
									<div className='flex items-start justify-between gap-4'>
										<div className='flex-1 min-w-0'>
											<div className='flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2'>
												<h3 className='text-lg sm:text-xl font-semibold text-gray-900 truncate'>
													{story.title}
												</h3>
												<span
													className={`px-2 py-1 rounded-full text-xs font-medium w-fit ${getToneColor(story.tone)}`}
												>
													{story.tone}
												</span>
											</div>

											<div className='space-y-2 sm:space-y-1'>
												<div className='flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-2 sm:gap-4 text-sm text-gray-600'>
													<div className='flex items-center gap-1'>
														<Heart className='w-4 h-4 flex-shrink-0' />
														<span className='truncate'>
															{getPetName(story.pimsPetId)}
															{pet && (
																<span className='text-gray-400 hidden sm:inline'>
																	({pet.species} • {pet.breed})
																</span>
															)}
														</span>
													</div>
													<div className='flex items-center gap-1'>
														<DollarSign className='w-4 h-4 flex-shrink-0' />$
														{story.suggestedGoal.toLocaleString()} goal
													</div>
													<div className='flex items-center gap-1'>
														<Clock className='w-4 h-4 flex-shrink-0' />
														{new Date(story.createdAt).toLocaleDateString()}
													</div>
												</div>
											</div>

											{/* Key Points Preview */}
											{story.keyPoints && story.keyPoints.length > 0 && (
												<div className='flex flex-wrap gap-2 mt-3'>
													{story.keyPoints.slice(0, 2).map((point, index) => (
														<span
															key={index}
															className='px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded max-w-full truncate'
														>
															{point.length > 25
																? `${point.substring(0, 25)}...`
																: point}
														</span>
													))}
													{story.keyPoints.length > 2 && (
														<span className='px-2 py-1 bg-gray-50 text-gray-500 text-xs rounded'>
															+{story.keyPoints.length - 2} more
														</span>
													)}
												</div>
											)}
										</div>

										{/* Action Buttons */}
										<div className='flex flex-col sm:flex-row items-end sm:items-center gap-1 sm:gap-2 flex-shrink-0'>
											<button
												onClick={() =>
													setExpandedStory(isExpanded ? null : story.id)
												}
												className='p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors'
												title={isExpanded ? 'Collapse' : 'Expand'}
											>
												<Eye className='w-4 h-4' />
											</button>
											<button
												onClick={() => handleCopyStory(story)}
												className='p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors'
												title='Copy to clipboard'
											>
												<Copy className='w-4 h-4' />
											</button>
											<button
												onClick={() => handleDownloadStory(story)}
												className='p-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors'
												title='Download story'
											>
												<Download className='w-4 h-4' />
											</button>
											<button
												onClick={() => handleDeleteStory(story.id)}
												className='p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors'
												title='Delete story'
											>
												<Trash2 className='w-4 h-4' />
											</button>
										</div>
									</div>
								</div>

								{/* Expanded Content */}
								{isExpanded && (
									<div className='p-4 sm:p-6'>
										<div className='prose max-w-none'>
											<div className='bg-gray-50 rounded-lg p-3 sm:p-4 leading-relaxed text-gray-800 whitespace-pre-line text-sm sm:text-base'>
												{story.content}
											</div>
										</div>

										{/* Full Key Points */}
										{story.keyPoints && story.keyPoints.length > 0 && (
											<div className='mt-4 sm:mt-6'>
												<h4 className='font-semibold text-gray-900 mb-3 text-sm sm:text-base'>
													Key Story Elements
												</h4>
												<ul className='space-y-2'>
													{story.keyPoints.map((point, index) => (
														<li
															key={index}
															className='flex items-start gap-2 text-gray-700 text-sm sm:text-base'
														>
															<div className='w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0'></div>
															<span className='break-words'>{point}</span>
														</li>
													))}
												</ul>
											</div>
										)}

										{/* Action Bar */}
										<div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mt-4 sm:mt-6 pt-4 border-t'>
											<div className='text-xs sm:text-sm text-gray-500'>
												Last updated:{' '}
												{new Date(story.updatedAt).toLocaleString()}
											</div>
											{onStorySelect && (
												<button
													onClick={() => onStorySelect(story)}
													className='px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base'
												>
													Use This Story
												</button>
											)}
										</div>
									</div>
								)}
							</div>
						);
					})}
				</div>
			)}
		</div>
	);
};
