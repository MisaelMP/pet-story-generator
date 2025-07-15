import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
	Heart,
	BarChart3,
	PlusCircle,
	RotateCcw,
	History,
	Menu,
	X,
} from 'lucide-react';

interface HeaderProps {
	onStartOver: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onStartOver }) => {
	const location = useLocation();
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

	const navigationItems = [
		{ to: '/dashboard', icon: BarChart3, label: 'Dashboard', color: 'blue' },
		{
			to: '/create-story',
			icon: PlusCircle,
			label: 'Create Story',
			color: 'green',
		},
		{ to: '/story-history', icon: History, label: 'History', color: 'purple' },
	];

	const getNavItemClasses = (path: string, color: string) => {
		const isActive = location.pathname === path;
		return `flex items-center gap-2 px-3 py-2 rounded-lg transition-colors text-sm font-medium ${
			isActive
				? `bg-${color}-100 text-${color}-700`
				: 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
		}`;
	};

	return (
		<header className='bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50'>
			<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
				<div className='flex items-center justify-between h-16'>
					{/* Logo */}
					<Link
						to='/dashboard'
						className='flex items-center gap-2 sm:gap-3 flex-shrink-0'
					>
						<div className='w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center'>
							<Heart className='w-4 h-4 sm:w-6 sm:h-6 text-white' />
						</div>
						<div className='hidden sm:block'>
							<h1 className='text-lg sm:text-xl font-bold text-gray-900'>
								Pet Story Generator
							</h1>
							<p className='text-xs text-gray-500 hidden md:block'>
								AI-Powered Fundraising Stories
							</p>
						</div>
						<div className='block sm:hidden'>
							<h1 className='text-lg font-bold text-gray-900'>PSG</h1>
						</div>
					</Link>

					{/* Desktop Navigation */}
					<nav className='hidden md:flex items-center gap-1'>
						{navigationItems.map((item) => (
							<Link
								key={item.to}
								to={item.to}
								className={getNavItemClasses(item.to, item.color)}
							>
								<item.icon className='w-4 h-4' />
								<span>{item.label}</span>
							</Link>
						))}

						{location.pathname === '/create-story' && (
							<button
								onClick={onStartOver}
								className='flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors text-sm font-medium ml-2'
							>
								<RotateCcw className='w-4 h-4' />
								<span className='hidden lg:block'>Start Over</span>
							</button>
						)}
					</nav>

					{/* Mobile menu button */}
					<button
						onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
						className='md:hidden p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors'
						aria-label='Toggle mobile menu'
					>
						{isMobileMenuOpen ? (
							<X className='w-5 h-5' />
						) : (
							<Menu className='w-5 h-5' />
						)}
					</button>
				</div>

				{/* Mobile Navigation */}
				{isMobileMenuOpen && (
					<div className='md:hidden py-3 border-t border-gray-200'>
						<div className='flex flex-col space-y-1'>
							{navigationItems.map((item) => (
								<Link
									key={item.to}
									to={item.to}
									className={getNavItemClasses(item.to, item.color)}
									onClick={() => setIsMobileMenuOpen(false)}
								>
									<item.icon className='w-4 h-4' />
									<span>{item.label}</span>
								</Link>
							))}

							{location.pathname === '/create-story' && (
								<button
									onClick={() => {
										onStartOver();
										setIsMobileMenuOpen(false);
									}}
									className='flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors text-sm font-medium'
								>
									<RotateCcw className='w-4 h-4' />
									<span>Start Over</span>
								</button>
							)}
						</div>
					</div>
				)}
			</div>
		</header>
	);
};
