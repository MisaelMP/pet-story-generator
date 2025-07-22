import React from 'react';
import {
	BarChart,
	Bar,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	ResponsiveContainer,
	PieChart,
	Pie,
	Cell,
} from 'recharts';
import type { Pet } from '@/types/pet.types';

interface PetAnalyticsProps {
	pets: Pet[];
}

export const PetAnalytics: React.FC<PetAnalyticsProps> = ({ pets }) => {
	const ageDistribution = React.useMemo(() => {
		const ranges = { '0-2': 0, '3-7': 0, '8-12': 0, '13+': 0 };
		pets.forEach((pet) => {
			if (pet.age <= 2) ranges['0-2']++;
			else if (pet.age <= 7) ranges['3-7']++;
			else if (pet.age <= 12) ranges['8-12']++;
			else ranges['13+']++;
		});
		return Object.entries(ranges).map(([range, count]) => ({ range, count }));
	}, [pets]);

	const speciesDistribution = React.useMemo(() => {
		const species = pets.reduce(
			(acc, pet) => {
				acc[pet.species] = (acc[pet.species] || 0) + 1;
				return acc;
			},
			{} as Record<string, number>
		);

		const total = pets.length;
		return Object.entries(species)
			.map(([name, value]) => ({
				name: name.charAt(0).toUpperCase() + name.slice(1),
				value,
				percentage: ((value / total) * 100).toFixed(1),
			}))
			.sort((a, b) => b.value - a.value); // Sort by count descending
	}, [pets]);

	const COLORS = ['#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6'];

	return (
		<div className='w-full space-y-6 p-4 sm:p-6'>
			{/* Age Distribution Chart */}
			<div className='bg-white rounded-xl shadow-lg p-4 sm:p-6'>
				<h3 className='text-lg sm:text-xl font-semibold mb-4 sm:mb-6 text-gray-800'>
					Age Distribution
				</h3>
				<div className='w-full overflow-hidden'>
					<ResponsiveContainer width='100%' height={250} minHeight={200}>
						<BarChart
							data={ageDistribution}
							margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
						>
							<CartesianGrid strokeDasharray='3 3' stroke='#E5E7EB' />
							<XAxis
								dataKey='range'
								stroke='#6B7280'
								fontSize={12}
								tick={{ fill: '#6B7280' }}
							/>
							<YAxis
								stroke='#6B7280'
								fontSize={12}
								tick={{ fill: '#6B7280' }}
							/>
							<Tooltip
								contentStyle={{
									backgroundColor: '#F9FAFB',
									border: '1px solid #E5E7EB',
									borderRadius: '8px',
									fontSize: '14px',
								}}
							/>
							<Bar dataKey='count' fill='#3B82F6' radius={[4, 4, 0, 0]} />
						</BarChart>
					</ResponsiveContainer>
				</div>
			</div>

			{/* Species Breakdown Chart */}
			<div className='bg-white rounded-xl shadow-lg p-4 sm:p-6'>
				<h3 className='text-lg sm:text-xl font-semibold mb-4 sm:mb-6 text-gray-800'>
					Species Breakdown
				</h3>
				<div className='flex flex-col xl:flex-row gap-6'>
					{/* Chart Container */}
					<div className='w-full xl:w-3/5 flex justify-center'>
						<div className='w-full max-w-md'>
							<ResponsiveContainer width='100%' height={280} minHeight={250}>
								<PieChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
									<Pie
										data={speciesDistribution}
										cx='50%'
										cy='50%'
										outerRadius={90}
										fill='#8884d8'
										dataKey='value'
										label={({ percentage }) => `${percentage}%`}
										labelLine={false}
									>
										{speciesDistribution.map((_, index) => (
											<Cell
												key={`cell-${index}`}
												fill={COLORS[index % COLORS.length]}
											/>
										))}
									</Pie>
									<Tooltip
										formatter={(value: number, name: string) => [
											`${value} pets (${speciesDistribution.find((s) => s.name === name)?.percentage}%)`,
											name,
										]}
										contentStyle={{
											backgroundColor: '#F9FAFB',
											border: '1px solid #E5E7EB',
											borderRadius: '8px',
											fontSize: '14px',
										}}
									/>
								</PieChart>
							</ResponsiveContainer>
						</div>
					</div>

					{/* Legend Container */}
					<div className='w-full xl:w-2/5 flex flex-col justify-center'>
						<div className='grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-1 gap-3'>
							{speciesDistribution.map((entry, index) => (
								<div
									key={entry.name}
									className='flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors'
								>
									<div
										className='w-4 h-4 rounded-full flex-shrink-0'
										style={{ backgroundColor: COLORS[index % COLORS.length] }}
									/>
									<div className='flex-1 min-w-0'>
										<span className='text-sm font-medium text-gray-700 block truncate'>
											{entry.name}
										</span>
										<span className='text-xs text-gray-500'>
											{entry.value} pets ({entry.percentage}%)
										</span>
									</div>
								</div>
							))}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};
