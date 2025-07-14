import React from 'react';
import { useFormContext } from 'react-hook-form';
import type { StoryFormData } from '../../../types/form.types';
import { DollarSign, CreditCard, Target, Clock } from 'lucide-react';

export const FinancialSituationStep: React.FC = () => {
	const {
		register,
		formState: { errors },
		watch,
	} = useFormContext<StoryFormData>();
	const alreadySpent = watch('financialSituation.alreadySpent');
	const fundraisingGoal = watch('financialSituation.fundraisingGoal');

	return (
		<div className='space-y-6'>
			<div className='text-center mb-8'>
				<h2 className='text-3xl font-bold text-gray-900 mb-2'>
					Financial Situation
				</h2>
				<p className='text-gray-600'>
					Help donors understand your financial need and campaign goals
				</p>
			</div>

			<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
				{/* Already Spent */}
				<div>
					<label className='block text-sm font-medium text-gray-700 mb-2'>
						<CreditCard className='inline w-4 h-4 mr-1' />
						How much have you already spent? *
					</label>
					<div className='relative'>
						<span className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500'>
							$
						</span>
						<input
							type='number'
							{...register('financialSituation.alreadySpent', {
								valueAsNumber: true,
							})}
							placeholder='0'
							min='0'
							max='50000'
							className='w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
						/>
					</div>
					{errors.financialSituation?.alreadySpent && (
						<p className='text-red-600 text-sm mt-1'>
							{errors.financialSituation.alreadySpent.message}
						</p>
					)}
				</div>

				{/* Fundraising Goal */}
				<div>
					<label className='block text-sm font-medium text-gray-700 mb-2'>
						<Target className='inline w-4 h-4 mr-1' />
						Fundraising goal *
					</label>
					<div className='relative'>
						<span className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500'>
							$
						</span>
						<input
							type='number'
							{...register('financialSituation.fundraisingGoal', {
								valueAsNumber: true,
							})}
							placeholder='5000'
							min='100'
							max='100000'
							className='w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
						/>
					</div>
					{errors.financialSituation?.fundraisingGoal && (
						<p className='text-red-600 text-sm mt-1'>
							{errors.financialSituation.fundraisingGoal.message}
						</p>
					)}
				</div>

				{/* Monthly Income (Optional) */}
				<div>
					<label className='block text-sm font-medium text-gray-700 mb-2'>
						<DollarSign className='inline w-4 h-4 mr-1' />
						Monthly household income (optional)
					</label>
					<div className='relative'>
						<span className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500'>
							$
						</span>
						<input
							type='number'
							{...register('financialSituation.monthlyIncome', {
								valueAsNumber: true,
							})}
							placeholder='4000'
							min='0'
							className='w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
						/>
					</div>
					<p className='text-xs text-gray-500 mt-1'>
						This helps contextualize your financial situation (won't be shared
						publicly)
					</p>
				</div>

				{/* Timeline */}
				<div>
					<label className='block text-sm font-medium text-gray-700 mb-2'>
						<Clock className='inline w-4 h-4 mr-1' />
						When do you need the funds? *
					</label>
					<input
						type='text'
						{...register('financialSituation.timeline')}
						placeholder='e.g., within 2 weeks, by end of month...'
						className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
					/>
					{errors.financialSituation?.timeline && (
						<p className='text-red-600 text-sm mt-1'>
							{errors.financialSituation.timeline.message}
						</p>
					)}
				</div>

				{/* Financial Hardships */}
				<div className='md:col-span-2'>
					<label className='block text-sm font-medium text-gray-700 mb-2'>
						Please explain your current financial situation *
					</label>
					<textarea
						{...register('financialSituation.hardships')}
						rows={4}
						placeholder='Describe any financial challenges, job loss, medical bills, fixed income, student loans, etc. Be honest about why you need help.'
						className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none'
					/>
					{errors.financialSituation?.hardships && (
						<p className='text-red-600 text-sm mt-1'>
							{errors.financialSituation.hardships.message}
						</p>
					)}
				</div>
			</div>

			{/* Financial Summary */}
			{(alreadySpent > 0 || fundraisingGoal > 0) && (
				<div className='bg-green-50 border border-green-200 rounded-lg p-6'>
					<h4 className='font-semibold text-green-900 mb-3'>
						💰 Financial Summary
					</h4>
					<div className='grid grid-cols-2 md:grid-cols-4 gap-4 text-sm'>
						{alreadySpent > 0 && (
							<div>
								<span className='font-medium text-green-800'>
									Already spent:
								</span>
								<p className='text-green-700'>
									${alreadySpent.toLocaleString()}
								</p>
							</div>
						)}
						{fundraisingGoal > 0 && (
							<div>
								<span className='font-medium text-green-800'>Goal:</span>
								<p className='text-green-700'>
									${fundraisingGoal.toLocaleString()}
								</p>
							</div>
						)}
						{alreadySpent > 0 && fundraisingGoal > 0 && (
							<div>
								<span className='font-medium text-green-800'>Total cost:</span>
								<p className='text-green-700'>
									${(alreadySpent + fundraisingGoal).toLocaleString()}
								</p>
							</div>
						)}
						{alreadySpent > 0 && fundraisingGoal > 0 && (
							<div>
								<span className='font-medium text-green-800'>
									Your contribution:
								</span>
								<p className='text-green-700'>
									{Math.round(
										(alreadySpent / (alreadySpent + fundraisingGoal)) * 100
									)}
									%
								</p>
							</div>
						)}
					</div>
				</div>
			)}

			{/* Financial Tips */}
			<div className='bg-amber-50 border border-amber-200 rounded-lg p-6'>
				<h4 className='font-semibold text-amber-900 mb-3'>
					💡 Financial transparency tips
				</h4>
				<ul className='space-y-2 text-amber-800 text-sm'>
					<li className='flex items-start gap-2'>
						<div className='w-2 h-2 bg-amber-500 rounded-full mt-2 flex-shrink-0'></div>
						Be honest about what you've already contributed
					</li>
					<li className='flex items-start gap-2'>
						<div className='w-2 h-2 bg-amber-500 rounded-full mt-2 flex-shrink-0'></div>
						Explain why you can't cover the full cost yourself
					</li>
					<li className='flex items-start gap-2'>
						<div className='w-2 h-2 bg-amber-500 rounded-full mt-2 flex-shrink-0'></div>
						Set a realistic goal based on actual treatment costs
					</li>
					<li className='flex items-start gap-2'>
						<div className='w-2 h-2 bg-amber-500 rounded-full mt-2 flex-shrink-0'></div>
						Include any payment plans or discounts you've arranged
					</li>
				</ul>
			</div>
		</div>
	);
};
