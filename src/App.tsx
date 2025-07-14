// src/App.tsx
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
import { useStoryGenerator } from './hooks/useStoryGenerator';
import { Header } from './components/Layout/Header';
import { PetAnalytics } from './components/PetAnalytics';
import { StoryForm } from './components/StoryForm/StoryForm';
import { StoryDisplay } from './components/StoryDisplay/StoryDisplay';
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

					<main className='container mx-auto px-4 py-8'>
						<Routes>
							<Route path='/' element={<Navigate to='/dashboard' replace />} />

							<Route
								path='/dashboard'
								element={
									<div className='space-y-8'>
										<div className='text-center'>
											<h1 className='text-4xl font-bold text-gray-900 mb-4'>
												Pet Story Generator
											</h1>
											<p className='text-xl text-gray-600 max-w-3xl mx-auto'>
												Transform veterinary data into compelling fundraising
												stories that drive successful GoFundMe campaigns.
											</p>
										</div>
										<PetAnalytics pets={pets} />
									</div>
								}
							/>

							<Route
								path='/create-story'
								element={
									currentStory ? (
										<StoryDisplay
											story={currentStory}
											onRegenerate={handleRegenerate}
											isRegenerating={isRegenerating}
										/>
									) : (
										<div>
											{isGenerating && (
												<div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
													<div className='bg-white rounded-lg p-8 text-center'>
														<LoadingSpinner
															size='large'
															message='Generating your story...'
														/>
														<p className='text-gray-600 mt-4'>
															Our AI is crafting a compelling narrative for your
															pet's campaign.
														</p>
													</div>
												</div>
											)}

											<StoryForm onSubmit={handleFormSubmit} pets={pets} />

											{storyError && (
												<div className='max-w-4xl mx-auto mt-6'>
													<div className='bg-red-50 border border-red-200 rounded-lg p-4'>
														<h4 className='text-red-800 font-semibold mb-2'>
															Generation Failed
														</h4>
														<p className='text-red-700'>{storyError}</p>
													</div>
												</div>
											)}
										</div>
									)
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
