// src/components/StoryForm/steps/PetSelectionStep.tsx
import React from 'react';
import { useFormContext } from 'react-hook-form';
import type { StoryFormData } from '@/types/form.types';
import type { Pet } from '@/types/pet.types';
import { Search, Heart } from 'lucide-react';

interface PetSelectionStepProps {
	pets: Pet[];
}

export const PetSelectionStep: React.FC<PetSelectionStepProps> = ({ pets }) => {
	const {
		register,
		watch,
		setValue,
		formState: { errors },
	} = useFormContext<StoryFormData>();
	const selectedPetId = watch('selectedPetId');
	const selectedPet = pets.find((pet) => pet.id === selectedPetId);

	return (
		<div className='space-y-6'>
			<div className='text-center mb-8'>
				<h2 className='text-3xl font-bold text-gray-900 mb-2'>
					Select Your Pet
				</h2>
				<p className='text-gray-600'>
					Choose the pet you're creating a fundraising story for
				</p>
			</div>

			<div className='relative mb-6'>
				<Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5' />
				<input
					type='text'
					placeholder='Search pets by name, breed, or owner...'
					className='w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
				/>
			</div>

			<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto'>
				{pets.map((pet) => (
					<div
						key={pet.id}
						className={`relative p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 hover:shadow-lg ${
							selectedPetId === pet.id
								? 'border-blue-500 bg-blue-50 shadow-md'
								: 'border-gray-200 hover:border-gray-300'
						}`}
						onClick={() =>
							setValue('selectedPetId', pet.id, { shouldValidate: true })
						}
					>
						<input
							type='radio'
							{...register('selectedPetId')}
							value={pet.id}
							className='sr-only'
						/>

						{pet.photo && (
							<img
								src={pet.photo}
								alt={pet.name}
								className='w-20 h-20 rounded-full mx-auto mb-3 object-cover border-4 border-white shadow-sm'
							/>
						)}

						<div className='text-center'>
							<h3 className='font-semibold text-gray-900 mb-1'>{pet.name}</h3>
							<p className='text-sm text-gray-600 mb-1'>
								{pet.age} year old {pet.breed}
							</p>
							<p className='text-xs text-gray-500'>Owner: {pet.owner.name}</p>
						</div>

						{selectedPetId === pet.id && (
							<div className='absolute top-2 right-2'>
								<Heart className='w-6 h-6 text-red-500 fill-current' />
							</div>
						)}
					</div>
				))}
			</div>

			{selectedPet && (
				<div className='bg-blue-50 border border-blue-200 rounded-lg p-4'>
					<h4 className='font-semibold text-blue-900 mb-2'>
						Selected Pet Details
					</h4>
					<div className='grid grid-cols-2 gap-4 text-sm'>
						<div>
							<span className='font-medium text-blue-800'>Name:</span>{' '}
							{selectedPet.name}
						</div>
						<div>
							<span className='font-medium text-blue-800'>Age:</span>{' '}
							{selectedPet.age} years
						</div>
						<div>
							<span className='font-medium text-blue-800'>Breed:</span>{' '}
							{selectedPet.breed}
						</div>
						<div>
							<span className='font-medium text-blue-800'>Species:</span>{' '}
							{selectedPet.species}
						</div>
					</div>
				</div>
			)}

			{errors.selectedPetId && (
				<p className='text-red-600 text-sm font-medium'>
					{errors.selectedPetId.message}
				</p>
			)}
		</div>
	);
};
