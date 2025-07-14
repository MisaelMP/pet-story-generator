import React from 'react';
import { useFormContext } from 'react-hook-form';
import { StoryFormData } from '../../../types/form.types';
import { Heart, Camera, Users, MessageCircle } from 'lucide-react';

export const PetStoryStep: React.FC = () => {
	const {
		register,
		formState: { errors },
	} = useFormContext<StoryFormData>();

	return (
		<div className='space-y-6'>
			<div className='text-center mb-8'>
				<h2 className='text-3xl font-bold text-gray-900 mb-2'>
					Your Pet's Story
				</h2>
				<p className='text-gray-600'>
					Help donors connect with your pet's personality and your bond
				</p>
			</div>

			<div className='space-y-6'>
				{/* Relationship Duration */}
				<div>
					<label className='block text-sm font-medium text-gray-700 mb-2'>
						<Heart className='inline w-4 h-4 mr-1' />
						How long have you had your pet? *
					</label>
					<input
						type='text'
						{...register('petStory.relationshipDuration')}
						placeholder='e.g., 5 years, since they were a puppy, rescued 3 years ago...'
						className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
					/>
					{errors.petStory?.relationshipDuration && (
						<p className='text-red-600 text-sm mt-1'>
							{errors.petStory.relationshipDuration.message}
						</p>
					)}
				</div>

				{/* Personality Traits */}
				<div>
					<label className='block text-sm font-medium text-gray-700 mb-2'>
						<MessageCircle className='inline w-4 h-4 mr-1' />
						What makes your pet special? *
					</label>
					<textarea
						{...register('petStory.personalityTraits')}
						rows={4}
						placeholder='Describe their personality, quirks, habits, or what makes them unique. Are they playful, gentle, protective, funny? What do they love to do?'
						className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none'
					/>
					{errors.petStory?.personalityTraits && (
						<p className='text-red-600 text-sm mt-1'>
							{errors.petStory.personalityTraits.message}
						</p>
					)}
				</div>

				{/* Favorite Memory */}
				<div>
					<label className='block text-sm font-medium text-gray-700 mb-2'>
						<Camera className='inline w-4 h-4 mr-1' />
						Share a cherished memory with your pet *
					</label>
					<textarea
						{...register('petStory.favoriteMemory')}
						rows={4}
						placeholder="Tell us about a special moment, funny incident, or touching experience you've shared. This helps donors connect emotionally with your story."
						className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none'
					/>
					{errors.petStory?.favoriteMemory && (
						<p className='text-red-600 text-sm mt-1'>
							{errors.petStory.favoriteMemory.message}
						</p>
					)}
				</div>

				{/* Family Impact */}
				<div>
					<label className='block text-sm font-medium text-gray-700 mb-2'>
						<Users className='inline w-4 h-4 mr-1' />
						How has this situation affected your family? *
					</label>
					<textarea
						{...register('petStory.familyImpact')}
						rows={4}
						placeholder="Describe the emotional impact on your family, children, or other pets. How has everyone been coping with your pet's condition?"
						className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none'
					/>
					{errors.petStory?.familyImpact && (
						<p className='text-red-600 text-sm mt-1'>
							{errors.petStory.familyImpact.message}
						</p>
					)}
				</div>
			</div>

			{/* Story Tips */}
			<div className='bg-blue-50 border border-blue-200 rounded-lg p-6'>
				<h4 className='font-semibold text-blue-900 mb-3'>
					💡 Tips for a compelling story
				</h4>
				<ul className='space-y-2 text-blue-800 text-sm'>
					<li className='flex items-start gap-2'>
						<div className='w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0'></div>
						Be specific and authentic - real details make your story more
						relatable
					</li>
					<li className='flex items-start gap-2'>
						<div className='w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0'></div>
						Focus on your pet's personality rather than just medical facts
					</li>
					<li className='flex items-start gap-2'>
						<div className='w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0'></div>
						Share how your pet brings joy to your life and others
					</li>
					<li className='flex items-start gap-2'>
						<div className='w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0'></div>
						Include family members' reactions to show the broader impact
					</li>
				</ul>
			</div>
		</div>
	);
};
