// src/components/StoryDisplay/StoryDisplay.tsx
import React, { useState } from 'react';
import { GeneratedStory } from '../../services/ai.service';
import { Copy, Download, Edit, RefreshCw } from 'lucide-react';

interface StoryDisplayProps {
	story: GeneratedStory;
	onRegenerate: (tone: GeneratedStory['tone']) => void;
	isRegenerating: boolean;
}

export const StoryDisplay: React.FC<StoryDisplayProps> = ({
	story,
	onRegenerate,
	isRegenerating,
}) => {
	const [copiedToClipboard, setCopiedToClipboard] = useState(false);

	const handleCopyToClipboard = async () => {
		try {
			await navigator.clipboard.writeText(story.content);
			setCopiedToClipboard(true);
			setTimeout(() => setCopiedToClipboard(false), 2000);
		} catch (error) {
			console.error('Failed to copy to clipboard:', error);
		}
	};

	const handleDownload = () => {
		const element = document.createElement('a');
		const file = new Blob([`${story.title}\n\n${story.content}`], {
			type: 'text/plain',
		});
		element.href = URL.createObjectURL(file);
		element.download = `${story.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.txt`;
		document.body.appendChild(element);
		element.click();
		document.body.removeChild(element);
	};

	return (
		<div className='w-full max-w-4xl mx-auto p-4 sm:p-6'>
			<div className='bg-white rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl overflow-hidden'>
				{/* Header */}
				<div className='bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 sm:p-6'>
					<h2 className='text-xl sm:text-2xl font-bold mb-2'>
						Your Generated Story
					</h2>
					<p className='opacity-90 text-sm sm:text-base'>
						Review and customize your fundraising campaign
					</p>
				</div>

				{/* Story Content */}
				<div className='p-4 sm:p-6 lg:p-8'>
					<div className='mb-6'>
						<h3 className='text-2xl sm:text-3xl font-bold text-gray-900 mb-4 leading-tight'>
							{story.title}
						</h3>

						{/* Story Metadata */}
						<div className='flex flex-col sm:flex-row sm:flex-wrap gap-2 sm:gap-4 mb-6 text-xs sm:text-sm text-gray-600'>
							<span className='flex items-center gap-1'>
								<div
									className={`w-3 h-3 rounded-full flex-shrink-0 ${
										story.tone === 'emotional'
											? 'bg-red-400'
											: story.tone === 'hopeful'
												? 'bg-green-400'
												: 'bg-orange-400'
									}`}
								></div>
								Tone: {story.tone}
							</span>
							<span>Est. reading time: {story.estimatedReadTime} min</span>
							<span>
								Suggested goal: ${story.suggestedGoal.toLocaleString()}
							</span>
						</div>

						{/* Story Text */}
						<div className='prose prose-sm sm:prose lg:prose-lg max-w-none mb-6 sm:mb-8'>
							<div className='bg-gray-50 rounded-lg p-6 leading-relaxed text-gray-800 whitespace-pre-line'>
								{story.content}
							</div>
						</div>

						{/* Key Points */}
						<div className='bg-blue-50 rounded-lg p-6 mb-6'>
							<h4 className='font-semibold text-blue-900 mb-3'>
								Key Story Elements
							</h4>
							<ul className='space-y-2'>
								{story.keyPoints.map((point, index) => (
									<li
										key={index}
										className='flex items-start gap-2 text-blue-800'
									>
										<div className='w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0'></div>
										{point}
									</li>
								))}
							</ul>
						</div>
					</div>

					{/* Action Buttons */}
					<div className='flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center border-t pt-4 sm:pt-6'>
						<button
							onClick={handleCopyToClipboard}
							className={`flex items-center justify-center gap-2 px-4 sm:px-6 py-2 sm:py-3 rounded-lg transition-colors text-sm sm:text-base ${
								copiedToClipboard
									? 'bg-green-600 text-white'
									: 'bg-blue-600 text-white hover:bg-blue-700'
							}`}
						>
							<Copy className='w-4 h-4' />
							{copiedToClipboard ? 'Copied!' : 'Copy Text'}
						</button>

						<button
							onClick={handleDownload}
							className='flex items-center justify-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm sm:text-base'
						>
							<Download className='w-4 h-4' />
							Download
						</button>

						<div className='flex flex-col sm:flex-row gap-2'>
							{(['emotional', 'hopeful', 'urgent'] as const).map((tone) => (
								<button
									key={tone}
									onClick={() => onRegenerate(tone)}
									disabled={isRegenerating}
									className={`flex items-center justify-center gap-2 px-3 sm:px-4 py-2 sm:py-3 rounded-lg transition-colors text-xs sm:text-sm ${
										story.tone === tone
											? 'bg-purple-600 text-white'
											: 'bg-purple-100 text-purple-700 hover:bg-purple-200'
									} disabled:opacity-50`}
								>
									{isRegenerating ? (
										<RefreshCw className='w-3 h-3 sm:w-4 sm:h-4 animate-spin' />
									) : (
										<Edit className='w-3 h-3 sm:w-4 sm:h-4' />
									)}
									<span className='hidden sm:inline'>
										{tone.charAt(0).toUpperCase() + tone.slice(1)} tone
									</span>
									<span className='sm:hidden'>
										{tone.charAt(0).toUpperCase() + tone.slice(1)}
									</span>
								</button>
							))}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};
