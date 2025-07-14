import React from 'react';
import { useFormContext } from 'react-hook-form';
import type { StoryFormData } from '../../../types/form.types';
import { AlertCircle, Calendar, DollarSign, Clock } from 'lucide-react';

export const MedicalSituationStep: React.FC = () => {
	const {
		register,
		formState: { errors },
		watch,
	} = useFormContext<StoryFormData>();
	const urgency = watch('medicalSituation.urgency');

	return (
		<div className='space-y-6'>
			<div className='text-center mb-8'>
				<h2 className='text-3xl font-bold text-gray-900 mb-2'>
					Medical Situation
				</h2>
				<p className='text-gray-600'>
					Tell us about your pet's medical condition and treatment needs
				</p>
			</div>

			<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
				{/* Medical Condition */}
				<div className='md:col-span-2'>
					<label className='block text-sm font-medium text-gray-700 mb-2'>
						<AlertCircle className='inline w-4 h-4 mr-1' />
						What is your pet's medical condition? *
					</label>
					<textarea
						{...register('medicalSituation.condition')}
						rows={4}
						placeholder="Please describe the diagnosis, symptoms, and severity of your pet's condition..."
						className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none'
					/>
					{errors.medicalSituation?.condition && (
						<p className='text-red-600 text-sm mt-1'>
							{errors.medicalSituation.condition.message}
						</p>
					)}
				</div>

				{/* Timeline */}
				<div>
					<label className='block text-sm font-medium text-gray-700 mb-2'>
						<Calendar className='inline w-4 h-4 mr-1' />
						When did this condition start? *
					</label>
					<input
						type='text'
						{...register('medicalSituation.timeline')}
						placeholder='e.g., 2 weeks ago, last month...'
						className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
					/>
					{errors.medicalSituation?.timeline && (
						<p className='text-red-600 text-sm mt-1'>
							{errors.medicalSituation.timeline.message}
						</p>
					)}
				</div>

				{/* Urgency */}
				<div>
					<label className='block text-sm font-medium text-gray-700 mb-2'>
						<Clock className='inline w-4 h-4 mr-1' />
						How urgent is this treatment? *
					</label>
					<select
						{...register('medicalSituation.urgency')}
						className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
					>
						<option value=''>Select urgency level</option>
						<option value='immediate'>Immediate (within days)</option>
						<option value='urgent'>Urgent (within weeks)</option>
						<option value='planned'>Planned (within months)</option>
					</select>
					{errors.medicalSituation?.urgency && (
						<p className='text-red-600 text-sm mt-1'>
							{errors.medicalSituation.urgency.message}
						</p>
					)}
				</div>

				{/* Treatment */}
				<div className='md:col-span-2'>
					<label className='block text-sm font-medium text-gray-700 mb-2'>
						What treatment does your veterinarian recommend? *
					</label>
					<textarea
						{...register('medicalSituation.treatment')}
						rows={3}
						placeholder='Describe the recommended treatment plan, procedures, medications, etc...'
						className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none'
					/>
					{errors.medicalSituation?.treatment && (
						<p className='text-red-600 text-sm mt-1'>
							{errors.medicalSituation.treatment.message}
						</p>
					)}
				</div>

				{/* Cost */}
				<div className='md:col-span-2'>
					<label className='block text-sm font-medium text-gray-700 mb-2'>
						<DollarSign className='inline w-4 h-4 mr-1' />
						Estimated treatment cost *
					</label>
					<div className='relative'>
						<span className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500'>
							$
						</span>
						<input
							type='number'
							{...register('medicalSituation.cost', { valueAsNumber: true })}
							placeholder='5000'
							min='1'
							max='100000'
							className='w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
						/>
					</div>
					{errors.medicalSituation?.cost && (
						<p className='text-red-600 text-sm mt-1'>
							{errors.medicalSituation.cost.message}
						</p>
					)}
				</div>
			</div>

			{/* Urgency indicator */}
			{urgency && (
				<div
					className={`p-4 rounded-lg border-l-4 ${
						urgency === 'immediate'
							? 'bg-red-50 border-red-400'
							: urgency === 'urgent'
								? 'bg-orange-50 border-orange-400'
								: 'bg-blue-50 border-blue-400'
					}`}
				>
					<p
						className={`text-sm font-medium ${
							urgency === 'immediate'
								? 'text-red-800'
								: urgency === 'urgent'
									? 'text-orange-800'
									: 'text-blue-800'
						}`}
					>
						{urgency === 'immediate' &&
							'🚨 Immediate care needed - This will help convey urgency in your story'}
						{urgency === 'urgent' &&
							'⚡ Urgent care needed - This will emphasize the time-sensitive nature'}
						{urgency === 'planned' &&
							'📅 Planned treatment - This allows for a more thoughtful fundraising approach'}
					</p>
				</div>
			)}
		</div>
	);
};
