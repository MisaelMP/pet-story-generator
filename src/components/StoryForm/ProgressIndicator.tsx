import React from 'react';
import { Check } from 'lucide-react';
import type { FormStep } from '@/types/form.types';

interface ProgressIndicatorProps {
	currentStep: FormStep;
	totalSteps: number;
}

const stepLabels = ['Pet', 'Medical', 'Story', 'Financial'];

const stepLabelsDesktop = [
	'Select Pet',
	'Medical Details',
	"Pet's Story",
	'Financial Info',
];

export const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({
	currentStep,
	totalSteps,
}) => {
	return (
		<div className='mb-6 sm:mb-8'>
			<div className='flex items-center justify-between'>
				{Array.from({ length: totalSteps }, (_, i) => {
					const stepNumber = i + 1;
					const isCompleted = stepNumber < currentStep;
					const isCurrent = stepNumber === currentStep;

					return (
						<React.Fragment key={stepNumber}>
							<div className='flex flex-col items-center'>
								{/* Step Circle */}
								<div
									className={`w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-full flex items-center justify-center text-xs sm:text-sm font-semibold transition-colors ${
										isCompleted
											? 'bg-green-500 text-white'
											: isCurrent
												? 'bg-blue-500 text-white'
												: 'bg-gray-200 text-gray-500'
									}`}
								>
									{isCompleted ? (
										<Check className='w-3 h-3 sm:w-4 sm:h-4 lg:w-6 lg:h-6' />
									) : (
										stepNumber
									)}
								</div>

								{/* Step Label */}
								<span
									className={`mt-1 sm:mt-2 text-xs sm:text-sm font-medium text-center max-w-[60px] sm:max-w-none leading-tight ${
										isCompleted || isCurrent ? 'text-gray-900' : 'text-gray-500'
									}`}
								>
									<span className='sm:hidden'>{stepLabels[i]}</span>
									<span className='hidden sm:inline'>
										{stepLabelsDesktop[i]}
									</span>
								</span>
							</div>

							{/* Progress Line */}
							{i < totalSteps - 1 && (
								<div
									className={`flex-1 h-0.5 sm:h-1 mx-2 sm:mx-4 rounded transition-colors ${
										stepNumber < currentStep ? 'bg-green-500' : 'bg-gray-200'
									}`}
								/>
							)}
						</React.Fragment>
					);
				})}
			</div>
		</div>
	);
};
