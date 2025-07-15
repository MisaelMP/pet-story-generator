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
		<div className='bg-white rounded-lg sm:rounded-xl shadow-lg p-4 sm:p-6'>
			<div className='flex flex-col sm:flex-row justify-between items-center gap-4'>
				{/* Previous Button */}
				<button
					type='button'
					onClick={onPrevious}
					disabled={isFirstStep || isSubmitting}
					className={`flex items-center justify-center gap-2 px-4 sm:px-6 py-2 sm:py-3 rounded-lg transition-colors text-sm sm:text-base w-full sm:w-auto ${
						isFirstStep
							? 'bg-gray-100 text-gray-400 cursor-not-allowed'
							: 'bg-gray-200 text-gray-700 hover:bg-gray-300'
					}`}
				>
					<ChevronLeft className='w-4 h-4' />
					Previous
				</button>

				{/* Step Indicator */}
				<div className='flex flex-col sm:flex-row items-center gap-2 sm:gap-4 order-first sm:order-none'>
					<span className='text-sm text-gray-600 whitespace-nowrap'>
						Step {currentStep} of {totalSteps}
					</span>
					<div className='flex gap-1'>
						{Array.from({ length: totalSteps }, (_, i) => (
							<div
								key={i}
								className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-colors ${
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
						className={`flex items-center justify-center gap-2 px-4 sm:px-6 py-2 sm:py-3 rounded-lg transition-colors text-sm sm:text-base w-full sm:w-auto ${
							isSubmitting || !isValid
								? 'bg-gray-400 text-white cursor-not-allowed'
								: 'bg-green-600 text-white hover:bg-green-700'
						}`}
					>
						{isSubmitting ? (
							<>
								<Loader2 className='w-4 h-4 animate-spin' />
								<span className='hidden sm:inline'>Generating Story...</span>
								<span className='sm:hidden'>Generating...</span>
							</>
						) : (
							<>
								<Send className='w-4 h-4' />
								<span className='hidden sm:inline'>Generate Story</span>
								<span className='sm:hidden'>Generate</span>
							</>
						)}
					</button>
				) : (
					<button
						type='button'
						onClick={onNext}
						disabled={isSubmitting}
						className='flex items-center justify-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 text-sm sm:text-base w-full sm:w-auto'
					>
						Next
						<ChevronRight className='w-4 h-4' />
					</button>
				)}
			</div>
		</div>
	);
};
