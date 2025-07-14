import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
	size?: 'small' | 'medium' | 'large';
	message?: string;
	className?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
	size = 'medium',
	message,
	className = '',
}) => {
	const sizeClasses = {
		small: 'w-4 h-4',
		medium: 'w-8 h-8',
		large: 'w-12 h-12',
	};

	return (
		<div className={`flex flex-col items-center justify-center ${className}`}>
			<Loader2 className={`${sizeClasses[size]} animate-spin text-blue-500`} />
			{message && (
				<p className='mt-2 text-sm text-gray-600 text-center'>{message}</p>
			)}
		</div>
	);
};
