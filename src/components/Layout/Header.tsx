import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Heart, BarChart3, PlusCircle, RotateCcw } from 'lucide-react';

interface HeaderProps {
	onStartOver: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onStartOver }) => {
	const location = useLocation();

	return (
		<header className='bg-white shadow-sm border-b border-gray-200'>
			<div className='container mx-auto px-4 py-4'>
				<div className='flex items-center justify-between'>
					{/* Logo */}
					<Link to='/dashboard' className='flex items-center gap-3'>
						<div className='w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center'>
							<Heart className='w-6 h-6 text-white' />
						</div>
						<div>
							<h1 className='text-xl font-bold text-gray-900'>
								Pet Story Generator
							</h1>
							<p className='text-xs text-gray-500'>
								AI-Powered Fundraising Stories
							</p>
						</div>
					</Link>

					{/* Navigation */}
					<nav className='flex items-center gap-4'>
						<Link
							to='/dashboard'
							className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
								location.pathname === '/dashboard'
									? 'bg-blue-100 text-blue-700'
									: 'text-gray-600 hover:text-gray-900'
							}`}
						>
							<BarChart3 className='w-4 h-4' />
							Dashboard
						</Link>

						<Link
							to='/create-story'
							className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
								location.pathname === '/create-story'
									? 'bg-green-100 text-green-700'
									: 'text-gray-600 hover:text-gray-900'
							}`}
						>
							<PlusCircle className='w-4 h-4' />
							Create Story
						</Link>

						{location.pathname === '/create-story' && (
							<button
								onClick={onStartOver}
								className='flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 rounded-lg transition-colors'
							>
								<RotateCcw className='w-4 h-4' />
								Start Over
							</button>
						)}
					</nav>
				</div>
			</div>
		</header>
	);
};
