import React from 'react';
import { Check } from 'lucide-react';
import type { FormStep } from '../../types/form.types';

interface ProgressIndicatorProps {
	currentStep: FormStep;
	totalSteps: number;
}

const stepLabels = [
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
		<div className='mb-8'>
			<div className='flex items-center justify-between'>
				{Array.from({ length: totalSteps }, (_, i) => {
					const stepNumber = i + 1;
					const isCompleted = stepNumber < currentStep;
					const isCurrent = stepNumber === currentStep;
					const isUpcoming = stepNumber > currentStep;

					return (
						<React.Fragment key={stepNumber}>
							<div className='flex flex-col items-center'>
								{/* Step Circle */}
								<div
									className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-semibold transition-colors ${
										isCompleted
											? 'bg-green-500 text-white'
											: isCurrent
												? 'bg-blue-500 text-white'
												: 'bg-gray-200 text-gray-500'
									}`}
								>
									{isCompleted ? <Check className='w-6 h-6' /> : stepNumber}
								</div>

								{/* Step Label */}
								<span
									className={`mt-2 text-xs font-medium text-center ${
										isCompleted || isCurrent ? 'text-gray-900' : 'text-gray-500'
									}`}
								>
									{stepLabels[i]}
								</span>
							</div>

							{/* Progress Line */}
							{i < totalSteps - 1 && (
								<div
									className={`flex-1 h-1 mx-4 rounded transition-colors ${
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
