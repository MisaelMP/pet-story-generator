import React from 'react';
import { ChevronLeft, ChevronRight, Send, Loader2 } from 'lucide-react';
import type { FormStep } from '../../types/form.types';

interface FormNavigationProps {
	currentStep: FormStep;
	totalSteps: number;
	onNext: () => void;
	onPrevious: () => void;
	isSubmitting: boolean;
	isValid: boolean;
}

export const FormNavigation: React.FC<FormNavigationProps> = ({
	currentStep,
	totalSteps,
	onNext,
	onPrevious,
	isSubmitting,
	isValid,
}) => {
	const isFirstStep = currentStep === 1;
	const isLastStep = currentStep === totalSteps;

	return (
		<div className='flex justify-between items-center bg-white rounded-xl shadow-lg p-6'>
			{/* Previous Button */}
			<button
				type='button'
				onClick={onPrevious}
				disabled={isFirstStep || isSubmitting}
				className={`flex items-center gap-2 px-6 py-3 rounded-lg transition-colors ${
					isFirstStep
						? 'bg-gray-100 text-gray-400 cursor-not-allowed'
						: 'bg-gray-200 text-gray-700 hover:bg-gray-300'
				}`}
			>
				<ChevronLeft className='w-4 h-4' />
				Previous
			</button>

			{/* Step Indicator */}
			<div className='flex items-center gap-2'>
				<span className='text-sm text-gray-600'>
					Step {currentStep} of {totalSteps}
				</span>
				<div className='flex gap-1'>
					{Array.from({ length: totalSteps }, (_, i) => (
						<div
							key={i}
							className={`w-2 h-2 rounded-full transition-colors ${
								i + 1 <= currentStep ? 'bg-blue-500' : 'bg-gray-300'
							}`}
						/>
					))}
				</div>
			</div>

			{/* Next/Submit Button */}
			{isLastStep ? (
				<button
					type='submit'
					disabled={isSubmitting || !isValid}
					className={`flex items-center gap-2 px-6 py-3 rounded-lg transition-colors ${
						isSubmitting || !isValid
							? 'bg-gray-400 text-white cursor-not-allowed'
							: 'bg-green-600 text-white hover:bg-green-700'
					}`}
				>
					{isSubmitting ? (
						<>
							<Loader2 className='w-4 h-4 animate-spin' />
							Generating Story...
						</>
					) : (
						<>
							<Send className='w-4 h-4' />
							Generate Story
						</>
					)}
				</button>
			) : (
				<button
					type='button'
					onClick={onNext}
					disabled={isSubmitting}
					className='flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400'
				>
					Next
					<ChevronRight className='w-4 h-4' />
				</button>
			)}
		</div>
	);
};
