import { useState, useEffect } from 'react';
import {
	BrowserRouter as Router,
	Routes,
	Route,
	Navigate,
} from 'react-router-dom';
import { PetService } from './services/pet.service';
import { Pet } from './types/pet.types';
import { StoryFormData } from './types/form.types';
import { GeneratedStory } from './services/ai.service';
import { useStoryGenerator } from './hooks/useStoryGenerator';
import { Header } from './components/Layout/Header';
import { PetAnalytics } from './components/PetAnalytics';
import { StoryForm } from './components/StoryForm/StoryForm';
import { StoryDisplay } from './components/StoryDisplay/StoryDisplay';
import { StoryHistory, RecentStoriesWidget } from './components/StoryHistory';
import { LoadingSpinner } from './components/UI/LoadingSpinner';
import { ErrorBoundary } from './components/ErrorBoundary';
import './App.css';

export default function App() {
	const [pets, setPets] = useState<Pet[]>([]);
	const [selectedPet, setSelectedPet] = useState<Pet | null>(null);
	const [formData, setFormData] = useState<StoryFormData | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const {
		currentStory,
		isGenerating,
		isRegenerating,
		error: storyError,
		generateStory,
		regenerateStory,
		clearStory,
	} = useStoryGenerator();

	useEffect(() => {
		loadPets();
	}, []);

	const loadPets = async () => {
		try {
			setLoading(true);
			const petsData = await PetService.getAllPets();
			setPets(petsData);
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Failed to load pets');
		} finally {
			setLoading(false);
		}
	};

	const handleFormSubmit = async (data: StoryFormData) => {
		const pet = pets.find((p) => p.id === data.selectedPetId);
		if (!pet) {
			throw new Error('Selected pet not found');
		}

		setSelectedPet(pet);
		setFormData(data);
		await generateStory(data, pet);
	};

	const handleRegenerate = async (tone: GeneratedStory['tone']) => {
		if (formData && selectedPet) {
			await regenerateStory(formData, selectedPet, tone);
		}
	};

	const handleStartOver = () => {
		setSelectedPet(null);
		setFormData(null);
		clearStory();
	};

	if (loading) {
		return (
			<div className='min-h-screen bg-gray-50 flex items-center justify-center'>
				<LoadingSpinner size='large' message='Loading pet database...' />
			</div>
		);
	}

	if (error) {
		return (
			<div className='min-h-screen bg-gray-50 flex items-center justify-center'>
				<div className='text-center'>
					<h2 className='text-2xl font-bold text-red-600 mb-4'>
						Connection Error
					</h2>
					<p className='text-gray-600 mb-6'>{error}</p>
					<button
						onClick={loadPets}
						className='px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700'
					>
						Retry Connection
					</button>
				</div>
			</div>
		);
	}

	return (
		<ErrorBoundary>
			<Router>
				<div className='min-h-screen bg-gray-50'>
					<Header onStartOver={handleStartOver} />

					<main className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8'>
						<Routes>
							<Route path='/' element={<Navigate to='/dashboard' replace />} />

							<Route
								path='/dashboard'
								element={
									<div className='space-y-6 sm:space-y-8'>
										<div className='text-center px-4'>
											<h1 className='text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4'>
												Pet Story Generator
											</h1>
											<p className='text-base sm:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed'>
												Transform veterinary data into compelling fundraising
												stories that drive successful GoFundMe campaigns.
											</p>
										</div>
										<div className='grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8'>
											<div className='lg:col-span-2 min-w-0'>
												<PetAnalytics pets={pets} />
											</div>
											<div className='lg:col-span-1 min-w-0'>
												<RecentStoriesWidget maxStories={3} />
											</div>
										</div>
									</div>
								}
							/>

							<Route
								path='/create-story'
								element={
									<div className='min-h-[calc(100vh-120px)]'>
										{currentStory ? (
											<div className='max-w-4xl mx-auto'>
												<StoryDisplay
													story={currentStory}
													onRegenerate={handleRegenerate}
													isRegenerating={isRegenerating}
												/>
											</div>
										) : (
											<div>
												{isGenerating && (
													<div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4'>
														<div className='bg-white rounded-lg p-6 sm:p-8 text-center max-w-md w-full mx-4'>
															<LoadingSpinner
																size='large'
																message='Generating your story...'
															/>
															<p className='text-gray-600 mt-4 text-sm sm:text-base'>
																Our AI is crafting a compelling narrative for
																your pet's campaign.
															</p>
														</div>
													</div>
												)}

												<div className='max-w-4xl mx-auto'>
													<StoryForm onSubmit={handleFormSubmit} pets={pets} />
												</div>

												{storyError && (
													<div className='max-w-4xl mx-auto mt-6'>
														<div className='bg-red-50 border border-red-200 rounded-lg p-4'>
															<h4 className='text-red-800 font-semibold mb-2'>
																Generation Failed
															</h4>
															<p className='text-red-700 text-sm sm:text-base'>
																{storyError}
															</p>
														</div>
													</div>
												)}
											</div>
										)}
									</div>
								}
							/>

							<Route
								path='/story-history'
								element={
									<div className='max-w-7xl mx-auto'>
										<StoryHistory />
									</div>
								}
							/>

							<Route path='*' element={<Navigate to='/dashboard' replace />} />
						</Routes>
					</main>
				</div>
			</Router>
		</ErrorBoundary>
	);
}
